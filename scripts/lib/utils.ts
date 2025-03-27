import fs from 'node:fs'
import { networkInterfaces } from 'node:os'
import path from 'node:path'
import { exit, stdin } from 'node:process'

import { emitKeypressEvents } from 'node:readline'
import { select } from '@inquirer/prompts'

/**
 * 获取 本地 ip
 */
export function get_ip_arr(ignore_starts_with_name_arr = ['VMware']) {
  const name_arr = ignore_starts_with_name_arr

  const interfaces = networkInterfaces()

  const ret_arr: string[] = []

  // 数组，检查字符串是否以某些字符开头
  const myStartsWith = (str: string) => {
    if (name_arr !== undefined && name_arr.length > 0) {
      for (const startsWithName of name_arr) {
        if (str.startsWith(startsWithName)) {
          return true
        }
      }
    }
    return false
  }

  for (const name in interfaces) {
    if (myStartsWith(name)) {
      continue
    }

    const iface = interfaces[name]!
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]

      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        ret_arr.push(alias.address)
      }
    }
  }
  return ret_arr
}

export interface IListenKey {
  sequence: string
  name: string
  ctrl: boolean
  meta: boolean
  shift: boolean
}

export interface IListenKeyFn {
  expression: (key: IListenKey) => boolean
  fn: () => void
}

/**
 * 获取终端输入的按键，并执行相关函数
 * @param fnArr 按键 与 回调
 * @param beforeExitFn 按下 ctrl c 后, exit 之前 执行的函数
 */
export async function listen_key(fnArr: IListenKeyFn[], beforeExitFn?: () => void) {
  emitKeypressEvents(stdin)
  stdin.setRawMode(true)
  stdin.resume()

  stdin.on('keypress', (_: string, key: IListenKey) => {
    if (key.ctrl && key.name === 'c') {
      beforeExitFn?.()
      console.log('ctrl+c 退出')
      exit(0)
      return
    }
    for (const item of fnArr) {
      if (item.expression(key)) {
        item.fn()
      }
    }
  })
}

export function my_plugin_log(msg: any) {
  console.log(`---------------------------- ${msg}`)
}

/** 复制文件夹中所有文件 到另一个文件夹 */
export function copy_folder(sourceDir: string, targetDir: string) {
  fs.mkdirSync(targetDir, { recursive: true })

  const files = fs.readdirSync(sourceDir)

  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file)

    const targetPath = path.join(targetDir, file)

    if (fs.statSync(sourcePath).isDirectory()) {
      // 如果是文件夹，则递归调用 copyFolder()
      copy_folder(sourcePath, targetPath)
    }
    else {
      fs.copyFileSync(sourcePath, targetPath)
    }
  })
}

/** 获取一个 ip , 如果存在多个，需要手动选择一个 */
export async function get_one_ip() {
  const ip_arr = get_ip_arr()

  let ret = ''

  if (ip_arr.length > 1) {
    ret = await select({
      message: '选择一个 ip',
      choices: ip_arr.map(v => ({ name: v, value: v })),
    })

    // inquirer 执行后
    // 必须重新设置 setRawMode 和 resume 才能重新接管输入
    // https://github.com/SBoudrias/Inquirer.js/issues/662
    stdin.setRawMode(true)

    stdin.resume()
  }
  else if (ip_arr.length === 1) {
    ret = ip_arr[0]
  }

  if (ret.trim().length === 0) {
    throw new Error('获取 ip 异常')
  }

  return ret
}
