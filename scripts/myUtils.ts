
import { parse, traverse } from '@babel/core';

/** 获取 ui 所有双大括号中的代码 */
export function getUiBlockCodeArr(code: string) {

    let pattern = /\{\{\s*([^{}\s]+)\s*\}\}/g; // 提取 {{ xxxx }} 格式的文本

    // Set 去重
    let codeSet = new Set<string>();

    let match;

    while ((match = pattern.exec(code)) !== null) {
        let content: string = match[1]; // 提取匹配项中的第一个
        codeSet.add(content)
    }
    return Array.from(codeSet);
}

/** 使用 babel 获取关键字 */
export function getKeepVarNameArr(code: string) {
    let ast = parse(code, {
    });

    const res: string[] = [];

    traverse(ast!, {
        Identifier(path) {

            if (path.key == "property") return;

            // console.log(path.key);

            const { name } = path.node;
            if (!res.includes(name)) {
                res.push(name);
            }
        },
    });

    return res;
}