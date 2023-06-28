let initAutoxBridge = () => {
  return {
    name: 'init-autox-bridge',
    transformIndexHtml(html) {
      return html.replace(
        `</title>`,
        `</title><script>
        function AutoX() {
          this._callbackStore_ = {};
          this._callbackCounter_ = 0;
        }
  
        AutoX.prototype._setCallback_ = function (callback) {
          this._callbackCounter_++;
          this._callbackStore_[this._callbackCounter_] = callback;
          return this._callbackCounter_;
        };
  
        AutoX.prototype._getCallback_ = function (callId) {
          let callback = this._callbackStore_[callId];
          if (callback) {
            delete this._callbackStore_[callId];
          }
          return callback;
        };
  
        AutoX.prototype.invoke = function (cmd, args, callback) {
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
        };
  
        AutoX.prototype.callback = function (data) {
          let callId = data.callId;
          let args = data.args;
  
          let callbackFun = this._getCallback_(callId);
          if (callbackFun) {
            // 调用
            callbackFun(args);
          }
        };
  
        AutoX.prototype.execAjCode = function (code, callback) {
          // 利用特殊标识, 让 aj 去判断, 执行特殊的逻辑
          this.invoke(code, "[code]", callback);
        };
  
        var myLog = function (...args) {
          let data = args.join(" ");
          console.log(data);
        };
      
        var auto = new AutoX();
        console.log("autox 准备就绪!!");
      </script>
    `,
      )
    },
  }
}

export default initAutoxBridge;