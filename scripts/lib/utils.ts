import fs from "node:fs";
import { networkInterfaces } from "node:os";
import path from "node:path";
import process from "node:process";
import { emitKeypressEvents } from "node:readline";
import { parse, traverse } from "@babel/core";
import t from "@babel/types";
import { select } from "@inquirer/prompts";

/**
 * 获取 ui 中所有双大括号包裹的代码
 * @param code
 * @returns
 */
export function get_ui_block_code_arr(code: string) {
  const pattern = /\{\{\s*([^{}\s]+)\s*\}\}/g; // 提取 {{ xxxx }} 格式的文本

  // Set 去重
  const codeSet = new Set<string>();

  let match = pattern.exec(code);
  while (match !== null) {
    const content = match[1];

    codeSet.add(content);

    match = pattern.exec(code);
  }
  return Array.from(codeSet);
}

/** 使用 babel 获取关键字 */
export function get_keep_identifier_name_arr(code: string) {
  const ast = parse(code, {});

  const ret: string[] = [];

  traverse(ast!, {
    Identifier(path) {
      if (path.key === "property") return;

      const { name } = path.node;

      if (!ret.includes(name)) {
        ret.push(name);
      }
    },
  });
  return ret;
}

export function get_keep_fn_name_arr(code: string) {
  const ast = parse(code, {});

  const ret: string[] = [];

  traverse(ast!, {
    FunctionDeclaration(path) {
      // 顶级作用域
      if (t.isProgram(path.parent)) {
        const name = path.node.id?.name;

        // 需要保留的方法名需要用 'aj_' 开头
        if (name?.startsWith("aj_")) {
          if (!ret.includes(name)) {
            ret.push(name);
          }
        }
      }
    },
  });
  return ret;
}

/**
 * 获取 本地 ip
 */
export function get_ip_arr(ignore_starts_with_name_arr = ["VMware"]) {
  const name_arr = ignore_starts_with_name_arr;

  const interfaces = networkInterfaces();

  const ret_arr: string[] = [];

  // 数组，检查字符串是否以某些字符开头
  const myStartsWith = (str: string) => {
    if (name_arr !== undefined && name_arr.length > 0) {
      for (const startsWithName of name_arr) {
        if (str.startsWith(startsWithName)) {
          return true;
        }
      }
    }
    return false;
  };

  for (const name in interfaces) {
    if (myStartsWith(name)) {
      continue;
    }

    const iface = interfaces[name]!;
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];

      if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
        ret_arr.push(alias.address);
      }
    }
  }
  return ret_arr;
}

export interface IReadKey {
  sequence: string;
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
}

export interface IFnArr {
  expression: (key: IReadKey) => boolean;
  fn: () => void;
}

/** 获取终端输入的按键，并执行相关函数 */
export async function read_key(fnArr: IFnArr[], beforeExitFn?: () => void) {
  emitKeypressEvents(process.stdin);

  process.stdin.setRawMode(true);

  process.stdin.resume();

  process.stdin.on("keypress", (_: string, key: IReadKey) => {
    if (key.ctrl && key.name === "c") {
      beforeExitFn?.();

      console.log("ctrl+c 退出了");

      process.exit(0);
      return;
    }
    for (const item of fnArr) {
      if (item.expression(key)) {
        item.fn();
      }
    }
  });
}

export function my_plugin_log(msg: any) {
  console.log(`---------------------------- ${msg}`);
}

/** 复制文件夹中所有文件 到另一个文件夹 */
export function copy_folder(sourceDir: string, targetDir: string) {
  fs.mkdirSync(targetDir, { recursive: true });

  const files = fs.readdirSync(sourceDir);

  files.forEach((file) => {
    const sourcePath = path.join(sourceDir, file);

    const targetPath = path.join(targetDir, file);

    if (fs.statSync(sourcePath).isDirectory()) {
      // 如果是文件夹，则递归调用 copyFolder()
      copy_folder(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

/** 获取一个 ip , 如果存在多个，需要手动选择一个 */
export async function get_one_ip() {
  const ip_arr = get_ip_arr();

  let ret = "";

  if (ip_arr.length > 1) {
    ret = await select({
      message: "选择一个 ip",
      choices: ip_arr.map((v) => ({ name: v, value: v })),
    });

    // inquirer 执行后
    // 必须重新设置 setRawMode 和 resume 才能重新接管输入
    // https://github.com/SBoudrias/Inquirer.js/issues/662
    process.stdin.setRawMode(true);

    process.stdin.resume();
  } else if (ip_arr.length === 1) {
    ret = ip_arr[0];
  }

  if (ret.trim().length === 0) {
    throw new Error("获取 ip 异常");
  }
  return ret;
}
