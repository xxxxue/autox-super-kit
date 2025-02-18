import * as aj from "../src-runtime/runtime-autojs";
// import { JianGuoYunUtil } from './utils/jian-guo-yun-util';
// import { SQLiteUtil } from './utils/sqlite-util';
// import { get_date_now } from "./utils/util";
// import { cloneDeep } from 'lodash-es';

// 初始化 UI
// ( "aj.init_web_view_ui" 是标志位，请勿修改，
// 编译时会根据环境替换为 正确的地址 和类型 )
aj.init_web_view_ui("TODO", "web-url");

// 打开 aj 自带的日志界面
function show_log_window() {
  app.startActivity("console");
}

// 打开 aj 自带的设置界面
function show_settings_window() {
  app.startActivity("settings");
}

// 无参数，无返回值
function aj_fn_0() {
  console.log("aj_fn_0 被 web 调用");
}

// 返回 number
function aj_fn_1() {
  console.log("aj_fn_1 被 web 调用");
  return 1;
}

// 接收一个参数，并返回 boolean
function aj_fn_2(name) {
  console.log("aj_fn_2 被 web 调用:name-> %s", name);
  return true;
}

// 返回值 string
function aj_fn_3() {
  return "我是字符串";
}

// 接收多个参数 并 调用 web 的一个函数
// 通过 babel 支持 async 和 await
async function aj_fn_4(id: number, name: string, age: number) {

  console.log("aj_fn_4 被 web 调用:id-> %s, name-> %s, age-> %s", id, name, age);

  // 测试 aj 调用 web
  const data = await aj.call_web_js_async("test_aj_call_web(['返回值 1', '返回值 2', '返回值 3'])");

  console.log(" AJ 接收到 test_aj_call_web 的返回值 :", data);

  const ret = [
    { "id": 1, "name": "小明 1" },
    { "id": 2, "name": "小明 2" },
    { "id": 3, "name": "小明 3" },
  ];

  return ret;
}

interface IFn5Props {
  id: number | undefined
  name: string
}

// 接收 js 对象
function aj_fn_5(data: IFn5Props) {
  console.log(`${data.id} --- ${data.name}`);
  return true;
}
