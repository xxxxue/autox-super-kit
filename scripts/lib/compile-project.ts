import type { Buffer } from 'node:buffer'
import type { InputOptions, OutputOptions, Plugin, RollupOptions } from 'rollup'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { cwd, env, platform } from 'node:process'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { rollup } from 'rollup'
import copy from 'rollup-plugin-copy'
import { unplugin_transform_autojs_native_ui } from '../../plugins/unplugin-transform-autojs-native-ui'
import { unplugin_transform_autojs_web_ui } from '../../plugins/unplugin_transform_autojs_web_ui'
import { _is_dev, _is_prod, _out_aj_dir_path, _web_dev_port } from './config'
import { get_one_ip, my_plugin_log } from './utils'
import { watcher } from './watcher'

interface IOptions {
  /** 开启 web 项目的编译 */
  enable_web?: boolean
  /** 开发环境打包后执行的函数 */
  dev_bundle_end_fn?: () => void
}

export async function compile_project(options?: IOptions) {
  const { enable_web = true, dev_bundle_end_fn } = options || {}

  console.log('-------------')
  console.log('环境变量:', JSON.stringify({
    My_Node_Env: env.My_Node_Env, // "./scripts" 中使用, 在 package.json scripts 中赋值
    _is_prod,
    _is_dev,
    enable_web,
  }))
  console.log('-------------')

  my_plugin_log('开始编译代码...')

  // 选择的 ip
  let selected_ip = ''
  if (enable_web && _is_dev) {
    selected_ip = await get_one_ip()
  }

  const rollup_options = {
    input: 'src-autox/main.tsx', // 入口
    watch: {
      buildDelay: 1000,
    },
    // 公共插件, 每个产物都会执行
    // 插件从前到后执行, 顺序调换, 最终会产生差异
    plugins: [
      plugin_node_resolve(),
      plugin_common_js(),
      plugin_ts(),
      plugin_native_ui(),
      enable_web && plugin_web_ui(selected_ip, _web_dev_port),
      plugin_babel(),
      _is_prod && plugin_terser(),
      plugin_top_ui_str(),
      plugin_copy_file(),
      _is_prod && plugin_remove_jsx_comment(),
      _is_prod && plugin_remove_jsx_newline_spaces(),
    ],
    output: {
      file: 'out/main.js',
      format: 'esm', // 编译为 es 模块，可以做到 0 添加，其他模块类型都会注入一些模块代码
      strict: false,
      plugins: [], // 每个产物单独的插件
    },
  } satisfies RollupOptions

  if (_is_dev) {
    // 监听 autojs 代码 并 重新编译
    watcher(rollup_options, dev_bundle_end_fn)
  }
  else if (_is_prod) {
    const timeLabel = '编译时间：'
    console.time(timeLabel)

    if (enable_web) {
      // vite 打包到 out 会自动清理目录
      my_plugin_log('编译 Web')
      await build_web()
    }

    my_plugin_log('编译 Auto.js')
    await build_autojs(rollup_options, rollup_options.output)

    my_plugin_log('代码编译完成...')
    console.timeEnd(timeLabel) // 耗时
  }
}

async function build_autojs(input_options: InputOptions, output_options: OutputOptions) {
  const bundle = await rollup(input_options)
  await bundle.write(output_options)
  await bundle.close()
}

async function build_web() {
  await exec_web_build_async()

  const html_path = path.join(_out_aj_dir_path, 'index.html')
  transform_assets_path_in_html(html_path)
}

/** 执行 vite 命令，打包 web 项目 */
function exec_web_build_async() {
  return new Promise<boolean>((resolve, reject) => {
    // 打包并输出到 out 目录 ( 会自动清空 out 目录 )
    const exec = spawn('npx', ['vite', 'build', '--outDir', 'out'], {
      cwd: cwd(),
      shell: platform === 'win32', // 兼容 ".cmd" 文件
    })

    exec.stdout.on('data', (chunk: Buffer) => {
      const str = chunk.toString().trim()// 排除空行
      if (str) {
        console.log(str)// 输出内容
      }
    })

    exec.on('close', () => {
      resolve(true)// 结束
    })

    exec.on('error', (err) => {
      reject(err)
    })
  })
}

/** 处理 assets 的路径格式 */
function transform_assets_path_in_html(p_file_path: string) {
  // 读取 html 内容
  let html_code = fs.readFileSync(p_file_path, { encoding: 'utf-8' })
  // 替换路径
  html_code = html_code.replace(/"\/assets\//g, '"assets/')

  fs.writeFileSync(p_file_path, html_code)
}

/** 处理 web 地址 */
function plugin_web_ui(ip: string, port: number) {
  return unplugin_transform_autojs_web_ui.rollup({
    web_dev_ip: ip,
    web_dev_port: port,
  })
}

/** 处理 原生 ui */
function plugin_native_ui() {
  return unplugin_transform_autojs_native_ui.rollup()
}

/** 顶部添加 "ui;" */
function plugin_top_ui_str() {
  return {
    name: 'top_ui_str',
    renderChunk(code) {
      return `"ui";${code}`
    },
  } as Plugin
}

/** 移除 jsx 中的注释 */
function plugin_remove_jsx_comment() {
  return {
    name: 'remove_jsx_comment',
    renderChunk(code) {
      // eg: {/* 我是 jsx 中的注释 */}
      const regex = /\{\/\*[\s\S]*?\*\/\}/g
      return code.replace(regex, '')
    },
  } as Plugin
}

/** 移除 字符串 (jsx) 中过多的 换行符空格 */
function plugin_remove_jsx_newline_spaces() {
  return {
    name: 'remove_jsx_newline_spaces',
    renderChunk(code) {
      // eg: \n 后面大于 3 个空格
      const regex = /\\n\s{3,}/g
      return code.replace(regex, '')
    },
  } as Plugin
}

/** 复制文件 */
function plugin_copy_file() {
  return copy({
    targets: [
      { src: 'src-autox/project.json', dest: 'out' },
    ],
  })
}

/** 压缩/混淆 */
function plugin_terser() {
  return terser({
    format: {
      comments: false, // 删除所有注释
    },
    mangle: true,
    compress: {
      unused: true, // true: 删除未使用的变量与函数, false: 保留未使用的变量与函数
    },
    // 混淆全局作用域中的名称 (想要保留指定的函数名，需要 mangle.reserved)
    // 如果 js 代码中有 eval, 则 toplevel:true 无效，不会混淆全局作用域的名称，
    toplevel: true,
  })
}

/** ES6 转 ES5 */
function plugin_babel() {
  return getBabelOutputPlugin({
    presets: ['@babel/preset-env'], // 使用 babel 把 es6+ 编译为 es5
    // 此处不配置 "自动导入 core-js", 只做语法转换
    // babel 自动导入 core-js 会冗余，有太多 Rhino 支持的语法，
    // 代码中如果有编译后还不支持的语法，
    // 可以到 core-js 中找一下有没有实现，手动使用 import 导入
  })
}

/**  ts 编译为 js */
function plugin_ts() {
  return typescript({
    tsconfig: './tsconfig.autox.json',
  })
}

/** common.js 转 ES 模块 */
function plugin_common_js() {
  return commonjs()
}

/** 支持解析 node_modules */
function plugin_node_resolve() {
  return resolve({
    extensions: [
      '.js',
      '.mjs',
      '.cjs',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.node',
    ],
  })
}
