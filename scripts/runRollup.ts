import { rollup } from 'rollup';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import fs from "node:fs";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { format } from 'prettier';
import path from 'node:path';
import { minify } from 'terser';
import { getKeepVarNameArr, getUiBlockCodeArr } from './myUtils';
export let runRollup = async () => {
    console.log("开始编译代码...");  

    let timeLabel = "runRollup:编译时间:";
    console.time(timeLabel)

    let ro = await rollup({
        input: "src/main.tsx",
        output: {
            file: "out/main.js",
            format: "esm",
            strict: false,
        },
        treeshake: false,
        plugins: [
            {
                name: "autox-ui",
                transform(code, id) {
                    // 只处理自己的代码, 把 jsx 标志(<></>)改为 模版字符串(``), 
                    // (aj 支持界面代码被字符串包裹)
                    // 如果不处理,则 babel ast 无法识别 , 因为 jsx 不是 js,
                    if (!id.includes("node_modules")) {
                        code = code.replace(/<>/g, "`").replace(/<\/>/g, "`");
                    }
                    //console.log("处理:", id);

                    return code;
                },
            },
            typescript(), // ts 编译为 js
            commonjs(), // commonjs 转为 es 模块
            resolve(), // 解析 node_modules 中的 npm 包
            getBabelOutputPlugin({
                // 使用 babel 把 es6 的代码, 编译为 es5,,并注入标准库垫片
                presets: ["@babel/preset-env"],
            }),
        ],
    })

    // rollup 开始编译代码
    let out = await ro.generate({
        file: "out/main.js",
        format: "esm", // 编译为 es 模块, 可以做到 0 添加,其他模块类型都会注入一些模块代码, 最终通过 babel 编译为 es5 
        strict: false,
    })

    let code = out.output[0].code;

    // 提取 ui 中绑定的变量名
    let keepVarNameArr: string[] = []
    let uiBlockCodeArr = getUiBlockCodeArr(code)
    for (const item of uiBlockCodeArr) {

        // 使用 babel 提取关键字
        let nameArr = getKeepVarNameArr(item)
        for (const name of nameArr) {
            if (!keepVarNameArr.includes(name)) {
                keepVarNameArr.push(name)
            }
        }
    }

    console.log("保留的变量名:", keepVarNameArr);

    // 使用 terser 进行 混淆/压缩
    let t = await minify(code, {
        // 混淆
        mangle: {
            // 保留变量名
            reserved: keepVarNameArr
        },
        compress: {
            // false 不要删除未使用的变量与方法
            unused: false
        },
        toplevel: true, // false:只修改局部代码, true: 修改 全局+局部 代码
    });

    // 拿到 混淆后的代码
    code = t.code!;

    //使用 prettier 格式化一下
    code = format(code, { parser: 'babel' })

    // 在顶部添加上  autox 的 "ui" 标志 (有界面的脚本)
    code = '"ui";\n' + code;

    if (!fs.existsSync("out")) {
        console.log("创建 out 目录");        
        fs.mkdirSync("out")
    }

    // 写入文件
    fs.writeFileSync(path.join(process.cwd(), "out", out.output[0].fileName), code)

    // 写入 project.json
    fs.copyFileSync(path.join(process.cwd(), "project.json"), path.join(process.cwd(), "out", "project.json"))

    await ro.close();

    console.timeEnd(timeLabel); // 耗时
    console.log("代码编译完成...");
}