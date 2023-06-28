export class Autox {
  _callbackStore_: {};
  _callbackCounter_: number;
  constructor() {
    this._callbackStore_ = {};
    this._callbackCounter_ = 0;
  }
  _setCallback_(callback) {
    this._callbackCounter_++;
    this._callbackStore_[this._callbackCounter_] = callback;
    return this._callbackCounter_;
  }
  _getCallback_(callId) {
    let callback = this._callbackStore_[callId];
    if (callback) {
      delete this._callbackStore_[callId];
    }
    return callback;
  }

  invoke(cmd, args, callback: any = undefined) {
    let callId = -1;
    try {
      callId = this._setCallback_(callback);
      let data = JSON.stringify({
        cmd: cmd,
        args: args,
        callId: callId,
      });

      // 传给 aj
      console.log("jsbridge://" + encodeURIComponent(data));
    } catch (e) {
      console.trace(e);
    }
  }
  callback(data) {
    let callId = data.callId;
    let args = data.args;

    let callbackFun = this._getCallback_(callId);
    if (callbackFun) {
      // 调用
      callbackFun(args);
    }
  }
  execAjCode(code, callback) {
    // 利用特殊标识, 让 aj 去判断, 执行特殊的逻辑
    this.invoke(code, "[code]", callback);
  }
}
