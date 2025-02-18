/**
 * 初始化 Web UI
 *
 * @ref 安卓官方接口说明文档：https://developer.android.google.cn/reference/android/webkit/WebViewClient
 * @ref AJ 调用 java: https://p-bakker.github.io/rhino/tutorials/scripting_java/
 * @param p_data html 文件的地址
 * @param p_data_type p_data 参数的类型
 */
export function init_web_view_ui(p_data: string, p_data_type: "file-path" | "web-url" | "html-string") {
  // 创建 WebView 组件，指定 id 为 web, 其他地方可以用 ui.web 获取到组件
  ui.layout('<webview id="web" h="*" w="*"  />');

  // 初始化 WebView
  init_web_view(ui.web, true);

  // 根据不同的类型，调用不同的函数加载页面
  if (p_data_type === "web-url") {
    // http 网址
    ui.web.loadUrl(p_data);
  } else if (p_data_type === "html-string") {
    // html 字符串
    ui.web.loadData(p_data, "text/html", "UTF-8");
  } else if (p_data_type === "file-path") {
    // 本地文件
    const path = `file:${files.path(p_data)}`; // 相对路径 转 绝对路径
    ui.web.loadUrl(path);
  }
}

/**
 * 执行 js
 *
 * 对应的函数需要挂载到 浏览器的 window 对象上，比如：window.fn_name = (name)=>{ return "abc" + name }
 * @param p_script 脚本
 * @param p_callback_fn 回调函数
 */
export function call_web_js<T = any>(p_script: string, p_callback_fn?: (data: T) => void) {
  try {
    const web_view_widget = ui.web;

    if (web_view_widget === undefined) {
      throw new Error("WebView 组件为空");
    }

    // 执行 js
    web_view_widget.evaluateJavascript(
      `javascript:${p_script}`,
      new JavaAdapter(android.webkit.ValueCallback, {
        onReceiveValue: (val: T) => {
          p_callback_fn?.(val);
        },
      })
    );
  } catch (e) {
    console.error("执行 JavaScript 失败");
    console.trace(e);
  }
}
/**
 * 执行 js
 *
 * 对应的函数需要挂载到 浏览器的 window 对象上，比如：window.fn_name = (name)=>{ return "abc" + name }
 * @param p_script 脚本
 */
export function call_web_js_async<T = any>(p_script: string) {
  return new Promise<T>((resolve, reject) => {
    try {
      call_web_js<T>(p_script, (r) => {
        resolve(r);
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * 调用 Auto.js 的函数
 * @param p_function_name 函数名
 * @param p_args 参数 / 参数数组
 * @returns 函数执行后的返回值
 */
export async function call_autojs_fn(p_function_name: string, p_args: any | any[]) {
  let ret: any;

  // 获取调用的函数 ( 所有的全局作用域 变量 与 函数 都会保存在 globalThis 中，可以使用 output_aj_obj_keys_to_file() 查看)
  const fn: Function = globalThis[p_function_name];

  if (!fn) {
    throw new Error(`call_auto_js: ${p_function_name} 没有定义实现`);
  }
  // 判断是否为 async 函数
  const is_async_fn = typeof fn === "function" && Object.prototype.toString.call(fn) === "[object AsyncFunction]";

  // 判断参数类型
  if (Array.isArray(p_args)) {
    if (is_async_fn) {
      ret = await fn.apply(globalThis, p_args);
    } else {
      // 将 普通调用 包装为 Promise
      ret = await new Promise<any>((resolve, reject) => {
        try {
          const r = fn.apply(globalThis, p_args);
          resolve(r);
        } catch (error) {
          reject(error);
        }
      });
    }
  } else {
    if (is_async_fn) {
      ret = await fn.call(globalThis, p_args);
    } else {
      // 将 普通调用 包装为 Promise
      ret = await new Promise<any>((resolve, reject) => {
        try {
          const r = fn.call(globalThis, p_args);
          resolve(r);
        } catch (error) {
          reject(error);
        }
      });
    }
  }
  return ret;
}
/**
 * 执行 aj 代码
 * @param code
 * @param tag
 * @returns
 */
export async function exec_autojs_code(code: string, tag: "[code]" | any) {
  let ret: any;

  if (tag === "[code]") {
    ret = await new Promise<any>((resolve, reject) => {
      // 执行 js 代码
      try {
        // 构造一个函数 (参数为函数体),并执行，
        // 获取返回值需要写 return, 比如："return 1+1"
        // eval 不用写 return
        const r = new Function(code)();
        // let r = eval(code);
        resolve(r);
      } catch (error) {
        reject(error);
      }
    });
  }
  // 虽然可以创建一个 async 方法，但目前 aj 还不支持 await
  // 没有 await 也就不需要 async, 直接使用 [code] 即可
  // autox 运行时使用 bluebird, 只提供了方法形式的 Promise
  // 编写的代码 支持 await, 是通过 babel 编译为 _asyncToGenerator,
  // 但 传入的字符串代码，不会在编译时处理，所以字符串代码不能用 await, 只能用 bluebird 提供的函数
  // else if (tag == "[code_async]") {
  //   const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  //   ret = await new AsyncFunction(code)();
  // }
  return ret;
}
/**
 * web 传来的数据格式
 */
interface IWebBridge {
  cmd: string;
  callId: number;
  args: any;
}
/**
 * 初始化 WebView 的配置
 * @param p_web_view_widget WebView 组件
 * @param p_support_zoom 开启页面自由缩放
 */
function init_web_view(p_web_view_widget, p_support_zoom = false) {
  const settings = p_web_view_widget.getSettings();

  settings.setAllowFileAccess(true);
  settings.setAllowFileAccessFromFileURLs(true);
  settings.setAllowUniversalAccessFromFileURLs(true);
  settings.setSupportZoom(p_support_zoom);
  settings.setJavaScriptEnabled(true);
  // 禁用本地缓存
  // importClass(android.webkit.WebSettings);
  // settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
  // 监听返回键，如果有上个页面，则后退，而不是退出
  // p_web_view_widget.setOnKeyListener(
  //   new JavaAdapter(android.view.View.OnKeyListener, {
  //     onKey: (view, keyCode, keyEvent) => {
  //       // console.log(keyCode, keyEvent);
  //       if (keyEvent.getAction() == android.view.KeyEvent.ACTION_DOWN) {
  //         if (keyCode == android.view.KeyEvent.KEYCODE_BACK && p_web_view_widget.canGoBack()) {
  //           // 触发浏览器的后退
  //           p_web_view_widget.goBack();
  //           return true;
  //         }
  //       }
  //       return false;
  //     },
  //   })
  // );
  p_web_view_widget.webViewClient = new JavaAdapter(android.webkit.WebViewClient, {
    /** 页面开始加载，此时还没有加载 index.html 中的代码 */
    // "onPageStarted": (webView, url, favicon) => {},
    /** 页面加载完成，在 window.onload 之后触发 */
    // "onPageFinished": (webView, curUrl) => {},
    onReceivedError: (webView, webResourceRequest, webResourceError) => {
      const url = webResourceRequest.getUrl();
      const errorCode = webResourceError.getErrorCode();
      const description = webResourceError.getDescription();
      console.trace(`${errorCode} ${description} ${url}`);
    },
  });

  p_web_view_widget.webChromeClient = new JavaAdapter(android.webkit.WebChromeClient, {
    /** 拦截 web console 消息 */
    onConsoleMessage: async (consoleMessage) => {
      const msg: string = consoleMessage.message();
      const sourceId = consoleMessage.sourceId().split("/");
      const sourceIdStr = sourceId[sourceId.length - 1];
      const lineNumber = consoleMessage.lineNumber();
      const msgLevel = consoleMessage.messageLevel();

      if (msg.indexOf("jsbridge://") === 0) {
        const uris = msg.split("/");
        const data: IWebBridge = JSON.parse(java.net.URLDecoder.decode(uris[2], "UTF-8"));
        const cmd = data.cmd;
        const callId = data.callId;
        const args = data.args;
        // runtime_log("⭐ AJ 收到调用请求:", JSON.stringify(data));

        let result: any;

        try {
          // 判断 执行代码 / 执行方法
          if (typeof args === "string" && args.startsWith("[code")) {
            result = await exec_autojs_code(cmd, args);
          } else {
            result = await call_autojs_fn(cmd, args);
          }
        } catch (e) {
          console.trace(e);

          // 返回错误信息，用于 Promise
          result = {
            __message: e.message,
          };
        }
        // 回调参数
        if (callId !== -1) {
          const callback_args = {
            callId,
            args: result,
          };

          // 调用 web, 完成回调
          call_web_js(`MyAutoxBridge.callback(${JSON.stringify(callback_args)})`);
        }
      } else {
        runtime_log(`📖 浏览器日志：${msgLevel} [${sourceIdStr}:${lineNumber}] ${msg} `);
      }
    },
  });
}
/**
 * 框架 log
 * @description 注释函数中的代码就可以关闭所有的框架日志了.
 */
function runtime_log(...msg) {
  console.log(msg);
}
