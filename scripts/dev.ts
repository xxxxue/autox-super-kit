import type { IListenKeyFn } from './lib/utils'
import { Extension } from './lib/autox-server'
import { compile_project } from './lib/compile-project'
import { listen_key } from './lib/utils'

const extension = new Extension()

// 内容显示到终端 ↓
const msg_temp_arr = [
  ['[1]:★ 启动 web/aj 服务 + 监听文件 (开发 web ui)'],
  ['[q]:★ 启动 aj 服务 + 监听文件 (开发 native ui)'],
  ['------'],
  ['[2]:★ 运行项目', '[3]:关闭所有项目', '[4]:关闭服务'],
  ['------'],
  ['[w]:启动 web/aj 服务', '[e]:编译代码(web/aj)', '[r]:★ 发送项目到设备'],
  ['[z]:★ 启动 aj 服务', '[x]:编译代码(aj)', '[c]:★ 显示二维码'],
]

const key_fn_arr: any[] = [
  ['1', () => auto_aj_web()], // 开发 web ui
  ['q', () => auto_aj()], // 开发 native ui

  ['2', () => run_project()], // 运行项目
  ['3', () => extension.stopAll()], // 关闭所有项目
  ['4', () => extension.stopServer()], // 关闭服务

  ['w', () => extension.startServer()], // 关闭服务
  ['e', () => compile_aj_web()], // 编译代码 (aj + web)
  ['r', () => extension.saveProject()], // 发送项目到设备

  ['z', () => extension.startAutojsServer()], // 启动 aj 服务
  ['x', () => compile_aj()], // 编译代码 (aj)
  ['c', () => extension.showQrCode()], // 显示二维码
]

const msg_arr: string[] = []

msg_temp_arr.forEach((v) => {
  if (Array.isArray(v)) {
    // 给同一行的 item 添加 \t
    msg_arr.push(v.join('\t'))
  }
  else {
    msg_arr.push(v)
  }
})

console.log(msg_arr.join('\n'))
console.log('-------------')

// 启动 aj/web 服务 + 监听文件 (开发 web ui)
function auto_aj_web() {
  extension.startServer()
  compile_project({
    enable_web: true,
    dev_bundle_end_fn: () => {
      run_project()
    },
  })
}

// 启动 aj 服务 + 监听文件 (开发 native ui)
function auto_aj() {
  extension.startAutojsServer()
  compile_project({
    enable_web: false,
    dev_bundle_end_fn: () => {
      run_project()
    },
  })
}

// 运行项目
function run_project() {
  extension.stopAll()
  extension.runProject()
}

// 编译 web/aj 代码
function compile_aj_web() {
  // 内部根据环境变量 "My_Node_Env" 来切换不同的编译逻辑
  compile_project({ enable_web: true })
}

// 编译 aj 代码
function compile_aj() {
  // 内部根据环境变量 "My_Node_Env" 来切换不同的编译逻辑
  compile_project({ enable_web: false })
}

listen_key(
  key_fn_arr.map((v: any) => {
    return {
      expression(key) {
        return key.name === v[0]
      },
      fn: v[1],
    } satisfies IListenKeyFn
  }),
  () => {
    // ctrl+c 停止前 先与设备断开连接，并关闭各种服务程序
    extension.stopServer()
  },
)
