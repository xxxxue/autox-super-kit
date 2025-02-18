
import * as http from 'node:http';
import { EventEmitter } from 'node:events';
import * as cryto from 'node:crypto'
import * as childProcess from 'node:child_process';
import * as ws from 'websocket';
import archiver from 'archiver'
import * as streamBuffers from 'stream-buffers'
import qrcode from 'qrcode-terminal';
import { createServer } from 'vite';
import { AddressInfo } from 'node:net';
import { get_ip_arr } from './utils';
import { _autojs_server_port, _out_aj_dir_path, } from './config';
import projectJson from '../../project.json';
// autox vscode 插件源码  ↓  (用于给 app 发送数据)
export class Device extends EventEmitter {
    public name: string;
    public type: string;
    public id: string;
    private connection: ws.connection | null;
    public attached: boolean = false;

    constructor(connection: ws.connection, type: string, id: string) {
        super();
        this.type = type
        this.id = id
        this.connection = connection;
        this.read(this.connection);
        this.on('data:hello', data => {
            this.attached = true;
            this.name = data['device_name'];
            // console.log(`${this.name} device hello: ${JSON.stringify(data)}` );
            let message_id = `${Date.now()}_${Math.random()}`;
            let appVersionCode = data['app_version_code']
            let extensionVersion = "1.109.0";
            let returnData: string = "";
            const DEBUG = false;
            if (appVersionCode >= 629) {
                returnData = JSON.stringify({ message_id, data: "ok", version: extensionVersion, debug: DEBUG, type: 'hello' })
            } else {
                returnData = JSON.stringify({ message_id, data: "连接成功", debug: DEBUG, type: 'hello' })
            }
            // console.log("return data: ", returnData);

            connection.sendUTF(returnData);
            this.emit("attach", this);
        });
        this.on('data:ping', data => {
            // console.log("客户端 ping: ", data);
            let returnData = JSON.stringify({ type: 'pong', data: data })
            // console.log("pong: ", returnData)
            this.connection?.sendUTF(returnData);
        })
        setTimeout(() => {
            if (!this.attached) {
                console.log("握手超时");
                this.connection?.close();
                this.connection = null;
            }
        }, 10 * 1000);
    }

    close() {
        console.log(`${this.name} device close`);
        let message_id = `${Date.now()}_${Math.random()}`;
        let closeMessage = JSON.stringify({ message_id, data: "close", debug: false, type: 'close' })
        this.connection?.sendUTF(closeMessage);
        this.connection?.close();
        this.connection = null;
    }

    send(type: string, data: any): void {
        console.log(`${this.name} device send: ${JSON.stringify(data)}`);

        let message_id = `${Date.now()}_${Math.random()}`;
        this.connection?.sendUTF(JSON.stringify({
            type: type,
            message_id,
            data: data
        }));
    }

    sendBytes(bytes: Buffer): void {
        this.connection?.sendBytes(bytes);
    }

    sendBytesCommand(command: string, md5: string, data: object = {}): void {
        data = Object(data);
        data['command'] = command;
        let message_id = `${Date.now()}_${Math.random()}`;
        this.connection?.sendUTF(JSON.stringify({
            type: 'bytes_command',
            message_id: message_id,
            md5: md5,
            data: data
        }));
    }

    sendCommand(command: string, data: object): void {
        data = Object(data);
        data['command'] = command;
        this.send('command', data);
    }

    public toString = (): string => {
        if (!this.name) {
            return `device (${this.type}: ${this.id})`;
        }
        return `device ${this.name}(${this.type}: ${this.id})`;
    }

    private read(connection: ws.connection) {
        connection.on('message', message => {
            if (message.type == 'utf8') {
                try {
                    let json = JSON.parse(message.utf8Data!);
                    // console.log("json: ", json);
                    // let igTypeArr = ["ping", "log"]
                    // let typeValue = json["type"];
                    // if (!igTypeArr.includes(typeValue)) {
                    //     console.log("message: ", message)
                    // }
                    this.emit('message', json);

                    /**
                     {  
                        type: 'utf8',
                        utf8Data: '{"data":{"log":"16:54:09.877/D: ren:12"},"type":"log"}'
                     }
                     */
                    // eg: 发射 data:ping  data:log 等等
                    this.emit('data:' + json['type'], json['data']);
                } catch (e) {
                    console.error(e);
                }
            }
        });
        connection.on('close', (reasonCode, description) => {
            console.log(`close: device = ${this}, reason = ${reasonCode}, desc = ${description}`);
            this.connection = null;
            this.emit('disconnect');
        });
    }

}

export class AutoJsDebugServer extends EventEmitter {
    public isHttpServerStarted = false
    private httpServer: http.Server;
    private port: number;
    public devices: Array<Device> = [];

    constructor(port: number) {
        super();
        this.port = port;

        // 先初始化 httpServer 和  wsServer , 在 listen 函数中会启动
        this.httpServer = http.createServer((request, response) => {
            console.log(new Date() + ' 收到的请求 ' + request.url);

            response.writeHead(200);
            response.end("end")

            // NOTE: autox 作者自己的 webpack 项目会调用这个 exec
            // let urlObj = new URL(request.url!)

            // if (urlObj.pathname == "/exec") { 
            //     response.writeHead(200);
            //     let cmd = urlObj.searchParams.get("cmd");
            //     let path = urlObj.searchParams.get("path");
            //      response.end("this commond is:" + cmd + "-->" + path);
            //     this.emit('cmd', cmd, path);
            // } else {
            //     response.writeHead(404);
            //     response.end();
            // }
        });
        let wsServer = new ws.server({ httpServer: this.httpServer, keepalive: true, keepaliveInterval: 10000 });
        wsServer.on('request', request => {
            let connection = request.accept();
            if (!connection) {
                return;
            }
            this.newDevice(connection, "tcp", connection.socket.remoteAddress + ":" + connection.socket.remotePort)
        })
    }

    private newDevice(connection: ws.connection, type: string, id: string) {
        let device = new Device(connection, type, id);
        // console.log(connection.state, "---> status")
        device
            .on("attach", (device) => {
                this.attachDevice(device);
                this.emit('new_device', device);
                console.log(`设备连接: ${device}`);
            })
    }

    listen(): void {
        if (this.isHttpServerStarted) {
            this.emit("connected");
            return
        }
        this.httpServer.on('error', (e) => {
            this.isHttpServerStarted = false
            console.error('server error: ', e);
        });
        this.httpServer.listen(this.port, '0.0.0.0', () => {
            this.isHttpServerStarted = true
            let address = this.httpServer.address() as AddressInfo;
            let localAddress = get_ip_arr();
            let log_arr: string[] = [
                "------ Autox 服务器监听:",
                `------ ${localAddress.map(v => `${v}:${address.port}`).join("\n")}`,
                `------ ${address.address}:${address.port}`
            ]
            console.log(log_arr.join("\n"));
            this.emit("connect");
        });
    }

    sendProjectCommand(command: string, randomName = false) {
        if (this.devices.length == 0) {
            console.log("请先连接设备再进行操作");
            return;
        }
        let startTime = new Date().getTime();
        let output = new streamBuffers.WritableStreamBuffer();
        // 创建 压缩对象
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(output);
        // 压缩 文件夹
        archive.directory(_out_aj_dir_path, false);
        archive.finalize();
        archive.on('finish', () => {
            let buffer = output.getContents();
            if (buffer == false) {
                return;
            }
            let md5 = cryto.createHash('md5').update(buffer).digest('hex');

            let id = projectJson.name
            if (randomName) {
                id = id + this.getNowTime()
            }
            this.devices.forEach(device => {
                if (buffer == undefined) {
                    return;
                }
                device.sendBytes(buffer);
                device.sendBytesCommand(command, md5, {
                    'id': id,
                    'name': id
                });
                console.log(`${device.name} 发送项目 [${id}] 耗时: ${(new Date().getTime() - startTime) / 1000} 秒`);
            });

        });
    }
    getNowTime() {
        let date = new Date();
        let year = date.getFullYear().toString().slice(2, 4);
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        let hour = date.getHours().toString().padStart(2, '0');
        let minute = date.getMinutes().toString().padStart(2, '0');
        let second = date.getSeconds().toString().padStart(2, '0');
        return year + '_' + month + '' + day + '_' + hour + '' + minute + '' + second
    }

    sendCommand(command: string, data: object = {}): void {
        this.devices.forEach(device => {
            device.sendCommand(command, data);
        });
    }

    disconnect(): void {
        console.log("-------------------------");
        console.log("-------------------------");
        this.httpServer.close();
        this.isHttpServerStarted = false
        this.emit("disconnect");

        this.devices.forEach((device) => {
            device.close()
        })
        console.log("-------------------------");
    }
    /** 获取服务运行端口 */
    getPort(): number {
        return this.port;
    }

    /** 连接设备 */
    private attachDevice(device: Device) {
        this.devices.push(device);
        device.on('data:log', data => {
            console.log(data['log']);
        });
        device.on('disconnect', () => {
            this.devices.splice(this.devices.indexOf(device), 1);
            console.log(`设备断开连接: ${device}`)
        });
    }
}



export class Extension {
    public autojs_server: AutoJsDebugServer
    constructor() {
        this.autojs_server = new AutoJsDebugServer(_autojs_server_port);
        this.autojs_server
            .on('connect', () => {

            })
            .on('connected', () => {
                console.log('AutoX.js Server already running');
            })
            .on('disconnect', () => {
                console.log('AutoX.js Server stopped');
            })
            .on('adb:tracking_start', () => {
                console.log(`ADB: Tracking start`);
            })
            .on('adb:tracking_started', () => {
                console.log(`ADB: Tracking already running`);
            })
            .on('adb:tracking_stop', () => {
                console.log(`ADB: Tracking stop`);
            })
            .on('adb:tracking_error', () => {
                console.log(`ADB: Tracking error`);
            })
            .on('new_device', (device: Device) => {
                let messageShown = false;
                let showMessage = () => {
                    if (messageShown) {
                        return;
                    }
                    console.log('已连接新设备: ' + device.toString());
                    messageShown = true;
                };
                setTimeout(showMessage, 1000);
                device.on('data:device_name', showMessage);
            })
            .on('cmd', (cmd: String, url: String) => {
                //  好像是 autox 作者自己写的 webpack工程化项目,会用到这个 cmd 命令.
            })

    }
    /** 显示二维码 */
    showQrCode() {
        let ip_arr = get_ip_arr()

        for (const item of ip_arr) {
            this.showQrcodeToTerminal(item)
        }
    }
    private showQrcodeToTerminal(ip: string) {
        let wsUrl = `ws://${ip}:${_autojs_server_port}`
        console.log(wsUrl);
        qrcode.generate(wsUrl, { small: true });
    }
    openDocument() {
        childProcess.exec("start http://doc.autoxjs.com")
    }
    /** 启动 aj 服务 与 web 服务 */
    startServer() {
        this.startWebServer()
        this.startAutojsServer()
    }
    /** 运行 auto.js vscode 插件 */
    startAutojsServer() {
        this.autojs_server.listen();
    }
    /** 运行 web 前端项目 */
    startWebServer() {
        async function run_vite() {
            let vite_server = await createServer({
                server: { host: true }
            })
            await vite_server.listen()
            vite_server.printUrls();
        }

        run_vite().catch(e => {
            console.log(e);
        })
    }
    stopServer() {
        this.autojs_server.disconnect();
    }
    /** 关闭所有设备正在执行的所有项目 */
    stopAll() {
        this.autojs_server.sendCommand("stopAll");
    }
    runProject() {
        this.sendProjectCommand("run_project");
    }
    saveProject() {
        this.sendProjectCommand("save_project", true);
    }
    sendProjectCommand(command: string, randomName?: boolean) {
        this.autojs_server.sendProjectCommand(command, randomName);
    }
}


