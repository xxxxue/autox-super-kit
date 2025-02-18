
import * as http from 'node:http';
import { EventEmitter } from 'node:events';
import * as fs from 'node:fs';
import * as path from 'node:path'
import * as cryto from 'node:crypto'
import * as childProcess from 'node:child_process';

import * as ws from 'websocket';
import { readKey } from './readKey';
import chokidar from 'chokidar';
import archiver from 'archiver'
import * as streamBuffers from 'stream-buffers'
import * as qrcode from 'qrcode-terminal';
import { runRollup } from './runRollup';
import { networkInterfaces } from 'os';


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
            console.log("客户端 hello: ", data);
            this.attached = true;
            this.name = data['device_name'];
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
            console.log("return data: ", returnData);

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
        console.log("close");

        let message_id = `${Date.now()}_${Math.random()}`;
        let closeMessage = JSON.stringify({ message_id, data: "close", debug: false, type: 'close' })
        this.connection?.sendUTF(closeMessage);
        this.connection?.close();
        this.connection = null;
    }

    send(type: string, data: any): void {
        console.log("send");

        let message_id = `${Date.now()}_${Math.random()}`;
        console.log(data);
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
            message_id,
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
            return `Device (${this.type}: ${this.id})`;
        }
        return `Device ${this.name}(${this.type}: ${this.id})`;
    }

    private read(connection: ws.connection) {
        connection.on('message', message => {
            if (message.type == 'utf8') {
                try {
                    let json = JSON.parse(message.utf8Data!);
                    // console.log("json: ", json);
                    let igTypeArr = ["ping", "log"]
                    let typeValue = json["type"];
                    if (!igTypeArr.includes(typeValue)) {
                        console.log("message: ", message)
                    }
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

        // 先初始化 httpServer 和  wsServer , 在 listen 方法中会启动
        this.httpServer = http.createServer((request, response) => {
            console.log(new Date() + ' 收到的请求 ' + request.url);

            response.writeHead(200);
            response.end("end")

            // TODO: autox作者自己的 webpack 项目会调用这个exec
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
        console.log(connection.state, "--->status")
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
            const address: any = this.httpServer.address();
            let localAddress = this.getIPAddress();
            console.log(`服务器监听: ${localAddress}:${address.port} / ${address.address}:${address.port}`);
            this.emit("connect");
        });
    }

    sendProjectCommand(command: string) {
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
        archive.directory(_outDirPath, false);
        archive.finalize();
        archive.on('finish', () => {
            let buffer = output.getContents();
            if (buffer == false) {
                return;
            }
            let md5 = cryto.createHash('md5').update(buffer).digest('hex');

            this.devices.forEach(device => {
                if (buffer == false) {
                    return;
                }
                device.sendBytes(buffer);
                device.sendBytesCommand(command, md5, {
                    'id': _outDirPath,
                    'name': _outDirPath
                });
                console.log(`发送项目耗时: ${(new Date().getTime() - startTime) / 1000} 秒`);
            });

        });
    }

    sendCommand(command: string, data: object = {}): void {
        this.devices.forEach(device => {
            device.sendCommand(command, data);
        });
    }

    disconnect(): void {
        this.httpServer.close();
        this.isHttpServerStarted = false
        this.emit("disconnect");

        this.devices.forEach((device) => {
            device.close()
        })
    }

    /** 获取本地IP */
    getIPAddress(): string {
        let interfaces = networkInterfaces();
        for (let devName in interfaces) {
            let iface = interfaces[devName]!;
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                // console.log("---", alias)
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {

                    return alias.address;
                }
            }
        }
        console.log("获取 本机ip 失败");

        return "";
    }

    /** 获取本地IP */
    getIPs(): string[] {
        let ips: any[] = [];
        let interfaces = networkInterfaces();
        for (let devName in interfaces) {
            let iface = interfaces[devName]!;
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                // console.log("---", alias)
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    ips.push(alias.address);
                }
            }
        }
        return ips;
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

enum CmdEnum {
    运行项目 = "run_project",
    保存项目 = "save_project",
    停止所有脚本 = "stopAll"
}

let server = new AutoJsDebugServer(9317);
server
    .on('connect', () => {
        // TODO
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
            console.log('已连接新设备: ' + device);
            messageShown = true;
        };
        setTimeout(showMessage, 1000);
        device.on('data:device_name', showMessage);
    })
    .on('cmd', (cmd: String, url: String) => {
        //  好像是 autox 作者自己写的 webpack工程化项目,会用到这个 cmd 命令.
        console.log("TODO");
    })
class Extension {

    showServerAddress() {
        let servers = server.getIPs().join(":" + server.getPort() + " or ") + ":" + server.getPort();
        console.log(`Autox.js \r\n server running on ${servers}`)
    }

    showQrCode() {
        let ips = server.getIPs()

        for (const item of ips) {
            this.showQrcodeToTerminal(item)
        }
    }
    private showQrcodeToTerminal(ip: string) {
        let wsUrl = `ws://${ip}:${server.getPort()}`


        qrcode.generate(wsUrl, { small: true });
    }
    openDocument() {
        childProcess.exec("start http://doc.autoxjs.com")
    }

    startServer() {
        server.listen();
    }

    stopServer() {
        server.disconnect();
    }

    stopAll() {
        server.sendCommand(CmdEnum.停止所有脚本);
    }
    runProject() {
        this.sendProjectCommand(CmdEnum.运行项目);
    }
    saveProject() {
        this.sendProjectCommand(CmdEnum.保存项目);
    }
    sendProjectCommand(command: string) {
        server.sendProjectCommand(command);
    }
}

let _outDirPath = path.join(process.cwd(), "out");
let _srcDirPath = path.join(process.cwd(), "src");

let msgArr = [
    "[ctrl+c]:结束程序",
    "[0]:显示二维码",
    "[1]:启动服务+监听文件+编译,[q]:关闭服务",
    "[2]:运行项目",
    "[3]:停止所有项目",
    "[4]:保存项目到设备",
    "------",
    "------",
    "[8]:#: 启动服务",
    "[9]:#: 编译代码",
]
console.log(msgArr.join("\n"));
let _outDirWatcherTimer;

let extension = new Extension();
let startTransformCode = (isRunProject = true) => {
    // 防抖
    if (_outDirWatcherTimer !== null) {
        clearTimeout(_outDirWatcherTimer);
    }
    _outDirWatcherTimer = setTimeout(async () => {
        await runRollup()

        if (isRunProject) {
            extension.stopAll()
            // 运行项目
            extension.runProject()
        }
    }, 1000);
}

function main() {

    let _srcDirWatcher = chokidar.watch(_srcDirPath);
    let _outDirWatcher = chokidar.watch(_outDirPath);
    readKey([
        {
            expression: key => key.name == "0",
            fn: () => {
                extension.showQrCode();
            }
        },
        {
            expression: key => key.name == "1",
            fn: () => {

                extension.startServer()

                _srcDirWatcher.removeAllListeners();
                _outDirWatcher.removeAllListeners();

                startTransformCode(false);
                _srcDirWatcher.on("all", (event, changePath) => {
                    console.log("srcDir: ", event, changePath);
                    let stat = fs.statSync(changePath)
                    if (stat.isFile()) {
                        startTransformCode();
                    }
                })
            }
        },
        {
            expression: key => key.name == "q",
            fn: () => {
                extension.stopServer();
                _srcDirWatcher.removeAllListeners();
                _outDirWatcher.removeAllListeners();
            }
        },
        {
            expression: key => key.name == "2",
            fn: () => {
                // 停止所有
                extension.stopAll()
                // 运行项目
                extension.runProject()
            }
        },
        {
            expression: key => key.name == "3",
            fn: () => {
                // 停止所有
                extension.stopAll()
            }
        }, {
            expression: key => key.name == "4",
            fn: () => {
                // 保存项目
                extension.saveProject()
            }
        },
        {
            expression: key => key.name == "8",
            fn: () => {
                extension.startServer()
            }
        },
        {
            expression: key => key.name == "9",
            fn: async () => {
                await runRollup()
            }
        }
    ])
}

main();
