import type { PluginOption } from "vite";
import { readFileSync } from "node:fs";
import { minify } from "terser";
import ts from "typescript";

export async function initAutoxBridge() {
  // ts 代码
  const ts_str = readFileSync("src-runtime/runtime-web.ts", "utf-8");

  const output_obj = ts.transpileModule(ts_str, {
    compilerOptions: {
      removeComments: true, // 删除注释
      // module: ts.ModuleKind.ES2015, // 这个 runtimeWeb 不是一个模块，没有 export 所以不需要 module
      target: ts.ScriptTarget.ES5, // es6 是 ScriptTarget.ES2015
    },
  });
  // js 代码
  let js_str = output_obj.outputText;

  // 混淆与压缩
  const t = await minify(js_str, {
    format: {
      // 删除所有注释
      comments: false,
    },
    // 混淆
    mangle: {
      // 保留变量名
      reserved: ["MyAutoxBridge"],
    },
    compress: {
      // false : 保留未使用的变量与函数
      unused: false,
    },
    // 混淆全局作用域的 函数 和 变量 名称
    toplevel: true,
  });
  // 混淆后的代码
  js_str = t.code!;

  // 开发环境 注入 vConsole
  const vConsoleScript = "";
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
    name: "init-autox-bridge",
    transformIndexHtml(html) {
      return html.replace("</title>", `</title><script>${js_str}</script>${vConsoleScript}`);
    },
  } satisfies PluginOption;
}
