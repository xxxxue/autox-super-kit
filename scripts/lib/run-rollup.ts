import type { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { rimrafSync } from "rimraf";
import { rollup } from "rollup";
import { minify } from "terser";
import { transform_autojs_ui } from "../../plugins/unplugin-transform-autojs-ui";
import { _dist_web_dir_path, _is_dev, _is_prod, _out_aj_dir_path } from "./config";
import { copy_folder, get_one_ip, my_plugin_log } from "./utils";

// 选择的 ip
let _selected_ip = "";

export async function run_rollup() {
  my_plugin_log("开始编译代码...");

  const timeLabel = "编译时间：";

  console.time(timeLabel);

  if (_is_prod) {
    my_plugin_log("执行 npx vite build , 打包 web 代码");

    await exec_web_build_async();
  }

  // 第一次 需要手动选择一个 ip 保存到全局，下次热更新时，可复用
  if (_is_dev && _selected_ip === "") {
    _selected_ip = await get_one_ip();
  }

  my_plugin_log("使用 rollup 打包 autox 代码");

  // Rollup 插件说明

  // --- InputPlugin:
  // rollup.plugins 是公用的插件，每个产物都会执行，

  // --- OutputPlugin:
  // generate.plugins 是每个产物单独的插件，
  // generate 可以有多个，打包出不同类型，
  // 可以分别使用不同的插件对产物进行单独修改

  const bundle = await rollup({
    input: "src-autox/main.tsx",
    // 关闭 TreeShake, 保留没有使用的函数与变量
    treeshake: false,
    plugins: [
      // 处理 autojs 的 ui
      transform_autojs_ui.rollup({ dev_ip: _selected_ip }),
      // ts 编译为 js
      typescript({
        tsconfig: "./tsconfig.autox.json",
        composite: false,
      }),
      // commonjs 转 es 模块
      commonjs(),
      // 解析 node_modules 中的 npm 包
      resolve({
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
    ],
  });

  const out = await bundle.generate({
    file: "out/main.js",
    format: "esm", // 编译为 es 模块，可以做到 0 添加，其他模块类型都会注入一些模块代码
    strict: false,
    plugins: [
      // 使用 babel 把 es6+ 编译为 es5
      getBabelOutputPlugin({
        presets: ["@babel/preset-env"],
      }),
      // 此处不配置 自动导入 core-js, 只做语法转换
      // babel 自动导入 core-js 会冗余，有太多 Rhino 支持的语法，
      // 代码中如果有编译后还不支持的语法，
      // 可以到 core-js 中找一下有没有实现，使用 import 手动导入
    ],
  });

  await bundle.close();

  // 打包后的代码
  let code = out.output[0].code;

  // 文件名
  const code_file_name = out.output[0].fileName;

  // 混淆代码
  if (_is_prod) {
    my_plugin_log("开始混淆代码");

    code = await minify_code_async(code);
  }

  my_plugin_log('给代码顶部添加上 "ui" 标志');

  code = add_autojs_ui_tag(code);

  // 创建 out 目录
  create_out_dir(_out_aj_dir_path);

  my_plugin_log("写入代码到 out 目录");

  fs.writeFileSync(path.join(_out_aj_dir_path, code_file_name), code);

  // 写入 project.json
  copy_aj_config_to_out();

  if (_is_prod) {
    my_plugin_log("复制 index.html 到 out 目录");

    copy_folder(_dist_web_dir_path, _out_aj_dir_path);

    my_plugin_log("修改 index.html 中的 assets 路径");

    const html_path = path.join(_out_aj_dir_path, "index.html");

    transform_assets_path_in_html(html_path);
  }

  console.timeEnd(timeLabel); // 耗时

  my_plugin_log("代码编译完成...");
}

/** 将 autojs 的 project.json 配置文件复制到最终的目录 */
function copy_aj_config_to_out() {
  const config_file_name = "project.json";
  const file_path = path.join(process.cwd(), config_file_name);
  const target_path = path.join(_out_aj_dir_path, config_file_name);

  fs.copyFileSync(file_path, target_path);
}

/** 执行 vite 命令，打包 web 项目 */
function exec_web_build_async() {
  return new Promise<boolean>((resolve, reject) => {
    const exec = spawn("npx", ["vite", "build"], {
      cwd: process.cwd(),
      shell: process.platform === "win32", // windows .cmd 兼容
    });

    exec.stdout.on("data", (chunk: Buffer) => {
      // 排除空行
      const str = chunk.toString().trim();

      if (str) {
        // 输出内容
        console.log(str);
      }
    });

    exec.on("close", () => {
      // 结束
      resolve(true);
    });

    exec.on("error", (err) => {
      reject(err);
    });
  });
}

/** 顶部添加 autojs 的 "ui;" 标志 */
function add_autojs_ui_tag(p_code: string) {
  // 在顶部添加上  autox 的 "ui" 标志 (有界面的脚本)
  const code = `"ui";\n${p_code}`;
  return code;
}

/** 混淆代码 */
async function minify_code_async(p_code: string) {
  // 默认 toplevel:false，可以保留所有全局作用域的函数与变量
  // 提取 ui 中绑定的变量名
  const keep_name_arr: string[] = [];

  // 用于保留 原生 ui 中 用到的变量名，比如 : {{ name }} 和各种 js 表达式
  // let ui_block_code_arr = get_ui_block_code_arr(code)
  // for (const item of ui_block_code_arr) {
  //     // 使用 babel 提取关键字
  //     let nameArr = get_keep_identifier_name_arr(item)
  //     for (const name of nameArr) {
  //         if (!keep_name_arr.includes(name)) {
  //             keep_name_arr.push(name)
  //         }
  //     }
  // }
  // 用于 保留 web 调用 aj 的目标函数名
  // let fn_name_arr = get_keep_fn_name_arr(code)
  // for (const item of fn_name_arr) {
  //     keep_name_arr.push(item)
  // }
  // console.log("保留的变量名:", keep_name_arr);
  // 使用 terser 进行 混淆/压缩
  const t = await minify(p_code, {
    format: {
      // 删除所有注释
      comments: false,
    },
    // 混淆
    mangle: {
      // 保留变量名
      reserved: keep_name_arr,
    },
    compress: {
      // false : 保留未使用的变量与函数
      unused: false,
    },
    // 混淆 全局作用域中的名称 (想要保留指定的函数名，需要 mangle.reserved)
    // 如果 js 代码中有 eval, 则 toplevel:true 无效，不会混淆全局作用域的名称，
    // toplevel: true,
  });

  // 拿到 混淆后的代码
  const code = t.code!;

  // prettier 格式化
  // code = format(code, { parser: 'babel' })

  return code;
}

/** 确保 out 目录存在 */
function create_out_dir(p_dir) {
  if (_is_prod) {
    my_plugin_log("清空 out 目录");
    rimrafSync(p_dir);
  }

  if (!fs.existsSync(p_dir)) {
    my_plugin_log("创建 out 目录");
    fs.mkdirSync(p_dir);
  }
}

/** 处理 assets 的路径格式 */
function transform_assets_path_in_html(p_file_path) {
  let html_code = fs.readFileSync(p_file_path, { encoding: "utf-8" });
  html_code = html_code.replace(/"\/assets\//g, '"assets/');
  fs.writeFileSync(p_file_path, html_code);
}
