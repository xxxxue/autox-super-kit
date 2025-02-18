import * as ts from 'typescript';
import { readFileSync } from 'node:fs';
import { minify } from 'terser';
import { _is_dev } from '../scripts/lib/config';

export let initAutoxBridge = async () => {
  // 将 ts 代码转为 js
  let ts_str = readFileSync("src-runtime/runtimeWeb.tsx", "utf-8")
  let output_obj = ts.transpileModule(ts_str, {
    compilerOptions: {
      // 删除注释
      removeComments: true,
      // module: ts.ModuleKind.ES2015, // 这个 runtimeWeb 不是一个模块,没有 export 所以不需要 module
      target: ts.ScriptTarget.ES5 // es6 是 ScriptTarget.ES2015
    }
  })
  let js_str = output_obj.outputText;

  // 混淆与压缩
  let t = await minify(js_str, {
    format: {
      // 删除所有注释
      comments: false
    },
    // 混淆
    mangle: {
      // 保留变量名
      reserved: ["MyAutoxBridge"]
    },
    compress: {
      // false : 保留未使用的变量与函数
      unused: false
    },
    // 混淆全局作用域的 函数 和 变量 名称
    toplevel: true,
  });

  // 拿到 混淆后的代码
  js_str = t.code!;

  // 开发环境 注入 vConsole
  let vConsoleScript = "";
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
      return html.replace(
        `</title>`,
        `</title><script>${js_str}</script>${vConsoleScript}`,
      )
    },
  }
}
