import chokidar from 'chokidar';
import { runRollup } from './lib/run_rollup';
import { read_key } from './lib/utils';
import { Extension } from './lib/autox_server';
import { _out_aj_dir_path, _src_autox_dir_path, _src_runtime_dir_path } from './lib/config';
// 终端程序 ↓  (用于监听终端输入的按键)
let msgArr = [
    "[ctrl + c]:结束程序",
    "[1]:★ 启动服务+监听文件,触发编译",
    "[2]:★ 运行项目\t[3]:关闭所有项目\t[4]:关闭服务",
    "------",
    "------",
    "[q]:★ 显示二维码 (每个 ip 都有一个二维码)",
    "[w]:★ 启动 aj/web 服务",
    "[e]:★ 保存项目到设备\t[r]:编译代码",
    "[a]:★ 启动 aj 服务\t[s]:启动 web 服务",
]
console.log(msgArr.join("\n"));

let extension = new Extension();

let _outDirWatcherTimer: NodeJS.Timeout;
let startTransformCode = (isRunProject = true) => {
    // 防抖
    if (_outDirWatcherTimer != null) {
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
let _srcDirWatcher = chokidar.watch([_src_autox_dir_path, _src_runtime_dir_path]);
read_key([
    {
        expression: key => key.name == "1",
        fn: () => {
            // 启动服务 + 监听文件改变,触发编译
            extension.startServer()
            _srcDirWatcher.removeAllListeners();
            // 首次 先编译一下 aj 项目, 
            // 因为 watcher 初始化时不会触发改变,
            // 此时可能没有项目文件可以发送到设备
            startTransformCode(false);
            // 监听, 只有文件改变后才会执行回调函数
            _srcDirWatcher.on("all", (event, changePath) => {
                console.log("📄 changePath: ", event, changePath);
                startTransformCode();
            })
        }
    },
    {
        expression: key => key.name == "4",
        fn: () => {
            // 停止服务
            extension.stopServer();
            _srcDirWatcher.removeAllListeners();
        }
    },
    {
        expression: key => key.name == "2",
        fn: () => {
            // 关闭所有项目
            extension.stopAll()
            // 运行项目
            extension.runProject()
        }
    },
    {
        expression: key => key.name == "3",
        fn: () => {
            // 关闭所有项目
            extension.stopAll()
        }
    },
    {
        expression: key => key.name == "q",
        fn: () => {
            // 显示二维码 (每个 ip 都有一个二维码)
            extension.showQrCode();
        }
    },
    {
        expression: key => key.name == "w",
        fn: () => {
            // 启动服务
            extension.startServer()
        }
    },
    {
        expression: key => key.name == "e",
        fn: () => {
            // 保存项目
            extension.saveProject()
        }
    },
    {
        expression: key => key.name == "r",
        fn: async () => {
            // 编译代码
            await runRollup()
        }
    },
    {
        expression: key => key.name == "a",
        fn: () => {
            // 启动 aj 服务 ( vscode 插件)
            extension.startAutojsServer()
        }
    },
    {
        expression: key => key.name == "s",
        fn: () => {
            // 启动 web 服务
            extension.startWebServer()
        }
    },
], () => {
    // ctrl c 停止前, 先与设备断开连接, 并关闭各种服务程序
    extension.stopServer()
})