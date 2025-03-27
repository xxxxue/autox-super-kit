import type { Buffer } from 'node:buffer'
import type { AddressInfo } from 'node:net'
import { exec } from 'node:child_process'
import cryto from 'node:crypto'
import { EventEmitter } from 'node:events'
import { writeFileSync } from 'node:fs'
import http from 'node:http'
import { tmpdir } from 'node:os'
import path from 'node:path'
import archiver from 'archiver'
import streamBuffers from 'stream-buffers'
import { renderSVG } from 'uqr'
import { createServer } from 'vite'
import ws from 'websocket'
import projectJson from '../../src-autox/project.json'
import { _autojs_server_port, _out_aj_dir_path } from './config'
import { get_ip_arr, get_one_ip } from './utils'

// AutoX VSCode 插件源码 (用于给 app 发送数据)

/** 设备相关的操作，连接后会创建这个类 */
export class Device extends EventEmitter {
  public name: string | undefined
  public type: string
  public id: string
  private connection: ws.connection | null
  public attached: boolean = false

  constructor(connection: ws.connection, type: string, id: string) {
    super()

    this.type = type
    this.id = id
    this.connection = connection
    this.read(this.connection)

    this.on('data:hello', (data) => {
      this.attached = true
      this.name = data.device_name
      // console.log(`${this.name} device hello: ${JSON.stringify(data)}` );
      const message_id = `${Date.now()}_${Math.random()}`
      const appVersionCode = data.app_version_code
      const extensionVersion = '1.109.0'
      let returnData: string = ''
      const DEBUG = false

      if (appVersionCode >= 629) {
        returnData = JSON.stringify({ message_id, data: 'ok', version: extensionVersion, debug: DEBUG, type: 'hello' })
      }
      else {
        returnData = JSON.stringify({ message_id, data: '连接成功', debug: DEBUG, type: 'hello' })
      }

      // console.log("return data: ", returnData);
      connection.sendUTF(returnData)

      this.emit('attach', this)
    })

    this.on('data:ping', (data) => {
      // console.log("客户端 ping: ", data);
      const returnData = JSON.stringify({ type: 'pong', data })

      // console.log("pong: ", returnData)
      this.connection?.sendUTF(returnData)
    })

    setTimeout(() => {
      if (!this.attached) {
        console.log('握手超时')

        this.connection?.close()
        this.connection = null
      }
    }, 10 * 1000)
  }

  close() {
    console.log(`${this.name} device close`)

    const message_id = `${Date.now()}_${Math.random()}`

    const closeMessage = JSON.stringify({ message_id, data: 'close', debug: false, type: 'close' })

    this.connection?.sendUTF(closeMessage)
    this.connection?.close()
    this.connection = null
  }

  send(type: string, data: any): void {
    console.log(`${this.name} device send: ${JSON.stringify(data)}`)

    const message_id = `${Date.now()}_${Math.random()}`

    this.connection?.sendUTF(
      JSON.stringify({
        type,
        message_id,
        data,
      }),
    )
  }

  sendBytes(bytes: Buffer): void {
    this.connection?.sendBytes(bytes)
  }

  sendBytesCommand(command: string, md5: string, data: object = {}): void {
    data = new Object(data)
    // @ts-expect-error 禁用 ts, 保持原来的逻辑
    data.command = command

    const message_id = `${Date.now()}_${Math.random()}`

    this.connection?.sendUTF(
      JSON.stringify({
        type: 'bytes_command',
        message_id,
        md5,
        data,
      }),
    )
  }

  sendCommand(command: string, data: object): void {
    data = new Object(data)
    // @ts-expect-error 禁用 ts, 保持原来的逻辑
    data.command = command

    this.send('command', data)
  }

  public toString = (): string => {
    if (!this.name) {
      return `device (${this.type}: ${this.id})`
    }
    return `device ${this.name}(${this.type}: ${this.id})`
  }

  private read(connection: ws.connection) {
    connection.on('message', (message) => {
      if (message.type === 'utf8') {
        try {
          const json = JSON.parse(message.utf8Data!)

          // console.log("json: ", json);
          // let igTypeArr = ["ping", "log"]
          // let typeValue = json["type"];
          // if (!igTypeArr.includes(typeValue)) {
          //     console.log("message: ", message)
          // }
          this.emit('message', json)

          // {
          //    type: 'utf8',
          //    utf8Data: '{"data":{"log":"16:54:09.877/D: ren:12"},"type":"log"}'
          // }

          // data:ping  data:log 等
          this.emit(`data:${json.type}`, json.data)
        }
        catch (e) {
          console.error(e)
        }
      }
    })

    connection.on('close', (reasonCode, description) => {
      console.log(`close: device = ${this}, reason = ${reasonCode}, desc = ${description}`)

      this.connection = null
      this.emit('disconnect')
    })
  }
}

/** 核心类，用来启动服务器并监听，管理多个设备 */
export class AutoJsDebugServer extends EventEmitter {
  public isHttpServerStarted = false
  private httpServer: http.Server
  private port: number
  public devices: Array<Device> = []

  constructor(port: number) {
    super()

    this.port = port

    // 先初始化 httpServer 和  wsServer , 在 listen 函数中会启动
    this.httpServer = http.createServer((request, response) => {
      console.log(`${new Date()} 收到的请求 ${request.url}`)

      response.writeHead(200)
      response.end('end')
    })

    // eslint-disable-next-line new-cap
    const wsServer = new ws.server({ httpServer: this.httpServer, keepalive: true, keepaliveInterval: 10000 })

    wsServer.on('request', (request) => {
      const connection = request.accept()

      if (!connection) {
        return
      }

      this.newDevice(connection, 'tcp', `${connection.socket.remoteAddress}:${connection.socket.remotePort}`)
    })
  }

  private newDevice(connection: ws.connection, type: string, id: string) {
    const device = new Device(connection, type, id)

    // console.log(connection.state, "---> status")
    device.on('attach', (device) => {
      this.attachDevice(device)
      this.emit('new_device', device)

      console.log(`设备连接：${device}`)
    })
  }

  listen(): void {
    if (this.isHttpServerStarted) {
      this.emit('connected')
      return
    }

    this.httpServer.on('error', (e) => {
      this.isHttpServerStarted = false

      console.error('server error: ', e)
    })

    this.httpServer.listen(this.port, '0.0.0.0', () => {
      this.isHttpServerStarted = true
      const address = this.httpServer.address() as AddressInfo
      const localAddress = get_ip_arr()

      const log_arr: string[] = [
        '------ Autox 服务器监听：',
        `------ ${localAddress.map(v => `${v}:${address.port}`).join('\n')}`,
        `------ ${address.address}:${address.port}`,
      ]

      console.log(log_arr.join('\n'))

      this.emit('connect')
    })
  }

  sendProjectCommand(command: string, randomName = false) {
    if (this.devices.length === 0) {
      console.log('请先连接设备再进行操作')
      return
    }

    const startTime = new Date().getTime()
    const output = new streamBuffers.WritableStreamBuffer()
    // 创建 压缩对象
    const archive = archiver('zip', { zlib: { level: 9 } })
    archive.pipe(output)
    // 压缩 文件夹
    archive.directory(_out_aj_dir_path, false)
    archive.finalize()

    archive.on('finish', () => {
      const buffer = output.getContents()

      // eslint-disable-next-line eqeqeq
      if (buffer == false) {
        return
      }

      const md5 = cryto.createHash('md5').update(buffer).digest('hex')
      let id = projectJson.name

      if (randomName) {
        id = id + this.getNowTimeStr()
      }

      this.devices.forEach((device) => {
        // eslint-disable-next-line eqeqeq
        if (buffer == undefined) {
          return
        }

        device.sendBytes(buffer)
        device.sendBytesCommand(command, md5, {
          id,
          name: id,
        })

        console.log(`${device.name} 发送项目 [${id}] 耗时：${(new Date().getTime() - startTime) / 1000} 秒`)
      })
    })
  }

  /** 使用当前的时间拼接出唯一的编号 */
  getNowTimeStr() {
    const date = new Date()
    const year = date.getFullYear().toString().slice(2, 4)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')

    return `${year}_${month}${day}_${hour}${minute}${second}`
  }

  /** 发送命令 */
  sendCommand(command: string, data: object = {}): void {
    this.devices.forEach((device) => {
      device.sendCommand(command, data)
    })
  }

  /** 断开 */
  disconnect(): void {
    console.log('-------------------------')
    console.log('-------------------------')

    this.devices.forEach((device) => {
      device.close()
    })

    this.httpServer.close()
    this.isHttpServerStarted = false
    this.emit('disconnect')

    console.log('-------------------------')
  }

  /** 获取服务运行端口 */
  getPort(): number {
    return this.port
  }

  /** 连接设备 */
  private attachDevice(device: Device) {
    this.devices.push(device)

    device.on('data:log', (data) => {
      console.log(data.log)
    })

    device.on('disconnect', () => {
      this.devices.splice(this.devices.indexOf(device), 1)

      console.log(`设备断开连接：${device}`)
    })
  }
}

/** 包装一层，供外部调用 */
export class Extension {
  public autojs_server: AutoJsDebugServer

  constructor() {
    this.autojs_server = new AutoJsDebugServer(_autojs_server_port)

    this.autojs_server
      .on('connect', () => {})
      .on('connected', () => {
        console.log('AutoX.js Server already running')
      })
      .on('disconnect', () => {
        console.log('AutoX.js Server stopped')
      })
      .on('adb:tracking_start', () => {
        console.log('ADB: Tracking start')
      })
      .on('adb:tracking_started', () => {
        console.log('ADB: Tracking already running')
      })
      .on('adb:tracking_stop', () => {
        console.log('ADB: Tracking stop')
      })
      .on('adb:tracking_error', () => {
        console.log('ADB: Tracking error')
      })
      .on('new_device', (device: Device) => {
        let messageShown = false
        const showMessage = () => {
          if (messageShown) {
            return
          }
          console.log(`已连接新设备：${device.toString()}`)
          messageShown = true
        }
        setTimeout(showMessage, 1000)
        device.on('data:device_name', showMessage)
      })
  }

  /** 显示二维码 */
  showQrCode() {
    get_one_ip().then((ip) => {
      const url = `ws://${ip}:${_autojs_server_port}`
      const svg_path = path.join(tmpdir(), 'autojs_ip.svg')
      // 显示到终端
      // console.log(renderUnicodeCompact(url))
      // 保存到临时目录
      writeFileSync(svg_path, renderSVG(url))

      console.log('-------------')
      console.log('------二维码-------')
      console.log(`【Ctrl + 鼠标左键 ↓】${url}`)
      console.log(svg_path)

      // 使用 vscode 打开图片
      exec(`code ${svg_path}`)
    })
  }

  /** 启动 aj 服务 与 web 服务 */
  startServer() {
    this.startWebServer()
    this.startAutojsServer()
  }

  /** 运行 auto.js vscode 插件 */
  startAutojsServer() {
    this.autojs_server.listen()
  }

  /** 运行 web 前端项目 */
  startWebServer() {
    async function run_vite() {
      const vite_server = await createServer({
        server: { host: true },
      })
      await vite_server.listen()
      vite_server.printUrls()
    }
    run_vite().catch((e) => {
      console.log(e)
    })
  }

  stopServer() {
    this.autojs_server.disconnect()
  }

  /** 关闭所有设备正在执行的所有项目 */
  stopAll() {
    this.autojs_server.sendCommand('stopAll')
  }

  /** 运行项目 */
  runProject() {
    this.__sendProjectCommand('run_project')
  }

  /** 保存项目 */
  saveProject() {
    this.__sendProjectCommand('save_project', true)
  }

  private __sendProjectCommand(command: string, randomName?: boolean) {
    this.autojs_server.sendProjectCommand(command, randomName)
  }
}
