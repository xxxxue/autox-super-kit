import type { PluginOption } from 'vite'
import { readFileSync } from 'node:fs'
import { minify } from 'terser'
import ts from 'typescript'

export async function initAutoxBridge() {
  // 读取 ts 代码
  const ts_str = readFileSync('src-runtime/runtime-web.ts', 'utf-8')

  const output_obj = ts.transpileModule(ts_str, {
    compilerOptions: {
      removeComments: true, // 删除注释
      target: ts.ScriptTarget.ES5, // es6 是 ScriptTarget.ES2015
    },
  })
  // js 代码
  let js_str = output_obj.outputText

  // 混淆与压缩
  const t = await minify(js_str, {
    format: {
      comments: false, // 删除所有注释
    },
    // 混淆
    mangle: {
      reserved: ['MyAutoxBridge'], // 保留变量名
    },
    compress: {
      unused: false, // false : 保留未使用的变量与函数
    },
    toplevel: true, // 混淆全局作用域的 函数 和 变量 名称
  })

  if (t.code) {
    js_str = t.code
  }

  // 开发环境 注入 vConsole
  const vConsoleScript = ''
  // if (_is_dev) {
  //   vConsoleScript = `
  //   <script src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"></script>
  //   <script>
  //     // VConsole will be exported to "window.VConsole" by default.
  //     var vConsole = new window.VConsole();
  //   </script>
  // `
  // }

  return {
    name: 'init-autox-bridge',
    transformIndexHtml(html) {
      return html.replace('</title>', `</title><script>${js_str}</script>${vConsoleScript}`)
    },
  } satisfies PluginOption
}
