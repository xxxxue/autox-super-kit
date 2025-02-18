// 使用 plugins/vite-plugin-init-autox-bridge.ts 转为 js, 添加到 html 中
class AutoxBridge {
  private _callbackStore_: { [key: number]: Function };
  private _callbackCounter_: number;

  constructor() {
    this._callbackStore_ = {};
    this._callbackCounter_ = 0;
  }

  private _setCallback_(callback: Function) {
    this._callbackCounter_++;
    this._callbackStore_[this._callbackCounter_] = callback;
    return this._callbackCounter_;
  }

  private _getCallback_(callId: number) {
    let callback = this._callbackStore_[callId];
    if (callback) {
      delete this._callbackStore_[callId];
    }
    return callback;
  }

  /**
   * 调用 aj 的函数
   * @param cmd 函数名
   * @param args 参数 / 参数数组 / "[code]"
   * @param callback 回调函数
   */
  public invoke(cmd: string, args: any | any[] | "[code]", callback?: Function) {
    let callId = -1;
    try {
      if (callback != undefined) {
        callId = this._setCallback_(callback);
      }
      let data = JSON.stringify({
        cmd: cmd,
        args: args,
        callId: callId,
      });

      // 通过特殊的前缀,把数据传给 aj
      console.log("jsbridge://" + encodeURIComponent(data));
    } catch (e) {
      console.trace(e);
    }
  }

  /**
   * aj 调用这个函数,来传递返回值
   */
  public callback(data: { callId: number; args: any }) {
    let callId = data.callId;
    let args = data.args;

    // 获取函数指针
    let callbackFn = this._getCallback_(callId);
    if (callbackFn) {
      // 调用
      callbackFn(args);
    }
  }
}

// @ts-ignore
var MyAutoxBridge = new AutoxBridge();
