import * as aj from './runtimeAJ';

let { runtimeLog, callJs } = aj;
// 初始化 UI
aj.initUi("TODO",'web-url')


function ajFun0() {
  runtimeLog("ajFun0 被 web 调用");
}

function ajFun1() {
  runtimeLog("ajFun2 被 web 调用");
  return 1;
}
function ajFun2(name) {
  runtimeLog("ajFun2 被 web 调用: name-> %s", name);
  return false; 
}
function ajFun3() {
  return "我是字符串";
}
function ajFun4(index, name, age) {
  runtimeLog("ajFun4 被 web 调用: index-> %s, name-> %s, age-> %s", index, name, age);

  //测试 aj调用web
  callJs("testAJ2Web(['返回值1', '返回值2', '返回值3'])", (data) => {
    runtimeLog(" AJ 接收到 testAJ2Web 的返回值 :", data);
  });


  return [
    { id: 1, name: "小明1", address: "北京1" },
    { id: 2, name: "小明2", address: "北京2" },
    { id: 3, name: "小明3", address: "北京3" },
  ];
}