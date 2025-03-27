declare let ui: {
  /** 界面 */
  layout: (jsx: any) => void
  /** 在 ui 线程上执行代码 */
  run: (fn: () => void) => void
  [x: string]: any
  __widgets__: any
  __defineGetter__: any
  layoutFile: any
  inflate: any
  __inflate__: any
  registerWidget: any
  setContentView: any
  findById: any
  findView: any
  isUiThread: any
  post: any
  statusBarColor: any
  finish: any
  findByStringId: any
  Widget: any
}
declare function require<T = any>(name: string): T

// 允许指定固定字符串 与 其他字符串, 智能提示可以给出类型
type _string = (string & { _?: never })

interface baseJsxProps {
  id: string
  w: string
  h: 'auto' | '*' | _string
  [x: string]: any
}
// 定义 jsx 组件 (小写开头)
declare namespace JSX {
  interface IntrinsicElements {
    /** 文本 */
    text: Partial<{ text: string } & baseJsxProps>
    /** 按钮 */
    button: Partial<{
      text: string
      style: 'Widget.AppCompat.Button.Colored' | 'Widget.AppCompat.Button.Borderless' | 'Widget.AppCompat.Button.Borderless.Colored'
    } & baseJsxProps>
    /** 输入框 */
    input: Partial<{ text: string } & baseJsxProps>
    /** 图片 */
    img: Partial<{
      /**
       * @example
       * // 指定内置的图标
       * src="@drawable/ic_android_black_48dp"
       */
      src: string
    } & baseJsxProps>
    /** 纵向布局 */
    vertical: Partial<{ } & baseJsxProps>
    /** 横向布局 */
    horizontal: Partial<{ } & baseJsxProps>
    /**
     * 线性布局 (默认:横向,通过 orientation 修改)
     *
     * 垂直布局和水平布局都属于线性布局
     */
    linear: Partial<{
      /** 方向 */
      orientation: 'vertical' | 'horizontal'
    } & baseJsxProps>
    /** 帧布局 */
    frame: Partial<{ } & baseJsxProps>
    /** 相对布局 */
    relative: Partial<{ } & baseJsxProps>
    /** 勾选框 */
    checkbox: Partial<{ text: string } & baseJsxProps>
    /** 选择框 */
    radio: Partial<{ text: string } & baseJsxProps>
    /** 选择框布局 */
    radiogroup: Partial<{ } & baseJsxProps>

    /** 进度条 */
    progressbar: Partial<{ } & baseJsxProps>
    /** 拖动条 */
    seekbar: Partial<{ } & baseJsxProps>
    /** 下拉菜单 */
    spinner: Partial<{
      /**
       * 选项 ("选项1|选项2|选项3")
       *
       * @example
       * // 获取
       * getSelectedItemPosition()
       * // 设置
       * setSelection(2)
       */
      entries: string
      spinnerMode: string
    } & baseJsxProps>
    /** 时间选择 */
    timepicker: Partial<{ } & baseJsxProps>
    /** 日期选择 */
    datepicker: Partial<{ } & baseJsxProps>
    /** 浮动按钮 */
    fab: Partial<{ } & baseJsxProps>
    /** 标题栏 */
    toolbar: Partial<{ } & baseJsxProps>
    /** 卡片 */
    card: Partial<{ cardCornerRadius, cardBackgroundColor, cardElevation } & baseJsxProps>
    /** 抽屉 */
    drawer: Partial<{ } & baseJsxProps>
    /** 列表 */
    list: Partial<{ } & baseJsxProps>
    /** Tab */
    tab: Partial<{ } & baseJsxProps>
    /** web */
    webview: Partial<{ } & baseJsxProps>
    // any jsx
    [x: string]: any
  }
}
// 大写开头的 jsx 组件这样定义
declare let View: (props: any) => JSX.IntrinsicElements
declare let TextView: (props: any) => JSX.IntrinsicElements
declare let ScrollView: (props: any) => JSX.IntrinsicElements
declare let TableLayout: (props: any) => JSX.IntrinsicElements
declare let TableRow: (props: any) => JSX.IntrinsicElements
/** 开关 */
declare let Switch: (props: Partial<{ } & baseJsxProps>) => JSX.IntrinsicElements

/** 导入 android 类 */
declare function importClass(name: any)
declare function importPackage(name: any)
declare let Packages
declare let web
declare let android
declare let log
declare let java
declare let Date
declare let open
declare let rawInput
// App
declare let app: {
  versionCode: any
  versionName: any
  autojs: {
    versionCode: any
    versionName: any
  }
  launchApp: (appName) => any
  launch: (packageName) => any
  launchPackage: (packageName) => any
  getPackageName: (appName) => any
  getAppName: (packageName) => any
  openAppSetting: (packageName) => any
  viewFile: (path) => any
  editFile: (path) => any
  uninstall: (packageName) => any
  openUrl: (url) => any
  sendEmail: (options) => any
  intent: (options) => any
  startActivity: ((name) => any) & ((options) => any)
  startService: (options) => any
  sendBroadcast: ((options) => any) & ((name) => any)
  intentToShell: (options) => any
  parseUri: (uri) => any
  getUriForFile: (path) => any
}
// 设备 - Device
declare let device: {
  width: any
  height: any
  buildId: any
  broad: any
  brand: any
  device: any
  model: any
  product: any
  bootloader: any
  hardware: any
  fingerprint: any
  serial: any
  sdkInt: any
  incremental: any
  release: any
  baseOS: any
  securityPatch: any
  codename: any
  getIMEI: () => any
  getAndroidId: () => any
  getMacAddress: () => any
  getBrightness: () => any
  getBrightnessMode: () => any
  setBrightness: (b) => any
  setBrightnessMode: (mode) => any
  getMusicVolume: () => any
  getNotificationVolume: () => any
  getAlarmVolume: () => any
  getMusicMaxVolume: () => any
  getNotificationMaxVolume: () => any
  getAlarmMaxVolume: () => any
  setMusicVolume: (volume) => any
  setNotificationVolume: (volume) => any
  setAlarmVolume: (volume) => any
  getBattery: () => any
  isCharging: () => any
  getTotalMem: () => any
  getAvailMem: () => any
  isScreenOn: () => any
  wakeUp: () => any
  wakeUpIfNeeded: () => any
  keepScreenOn: (timeout?) => any
  keepScreenDim: (timeout?) => any
  cancelKeepingAwake: () => any
  vibrate: (millis) => any
  cancelVibration: () => any
}
// 全局变量与函数
declare function sleep(n): any
declare function currentPackage(): any
declare function currentActivity(): any
declare function setClip(text): any
declare function getClip(): any
declare function toast(message): any
declare function toastLog(message): any
declare function waitForActivity(activity, period = 200): any
declare function waitForPackage(package, period = 200): any
declare function exit(): any
declare function random(min, max): any
declare function random(): any
declare function requiresApi(api): any
declare function requiresAutojsVersion(version): any
declare let runtime: {
  requestPermissions: (permissions) => any
  loadJar: (path) => any
  loadDex: (path) => any
}
/**
 * 全局变量。一个 android.content.Context 对象。
 * 注意该对象为 ApplicationContext，
 * 因此不能用于界面、对话框等的创建。
 */
declare let context
// 基于控件的操作
declare let auto
declare let click
declare let longClick
declare let scrollUp
declare let scrollDown
declare let setText
declare let input
declare let text
declare let textContains
declare let textStartsWith
declare let textEndsWith
declare let textMatches
declare let desc
declare let descContains
declare let descStartsWith
declare let descEndsWith
declare let descMatches
declare let id
declare let idContains
declare let idStartsWith
declare let idEndsWith
declare let idMatches
declare let className
declare let classNameContains
declare let classNameStartsWith
declare let classNameEndsWith
declare let classNameMatches
declare let packageName
declare let packageNameContains
declare let packageNameStartsWith
declare let packageNameEndsWith
declare let packageNameMatches
declare let bounds
declare let boundsInside
declare let boundsContains
// 基于坐标的操作
declare let setScreenMetrics
declare let press
declare let swipe
declare let gesture
declare class JavaAdapter {
  constructor(...p) {}
  tap
  swipe
  press
  longPress
  touchDown
  touchMove
  touchUp;
  [x: string]: any;
}
declare let Tap
declare let Swipe
// 按键模拟
declare function back(): any
declare function home(): any
declare function powerDialog(): any
declare function notifications(): any
declare function quickSettings(): any
declare function recents(): any
declare function splitScreen(): any
declare function takeScreenshot(): any
declare function lockScreen(): any
declare function dismissNotificationShade(): any
declare function keyCodeHeadsetHook(): any
declare function accessibilityShortcut(): any
declare function accessibilityButtonChooser(): any
declare function accessibilityButton(): any
declare function accessibilityAllApps(): any
declare function Home(): any
declare function Back(): any
declare function Power(): any
declare function Menu(): any
declare function VolumeUp(): any
declare function VolumeDown(): any
declare function Camera(): any
declare function Up(): any
declare function Down(): any
declare function Left(): any
declare function Right(): any
declare function OK(): any
declare function Text(text): any
declare function KeyCode(code): any
// 文件系统 Files
declare let files: {
  isFile: (path: string) => boolean
  isDir: (path: string) => boolean
  isEmptyDir: (path: string) => boolean
  /**
   * 连接两个路径并返回，
   * 例如 files.join("/sdcard/", "1.txt")
   * 返回 "/sdcard/1.txt"。
   */
  join: (parent: string, child: string) => string
  create: (path: string) => boolean
  createWithDirs: (path: string) => boolean
  exists: (path: string) => boolean
  /** 确保 path 所在的文件夹存在，不存在则创建 */
  ensureDir: (path: string) => void
  read: (path: string, encoding = 'utf-8') => string
  readBytes: (path: string) => any[]
  write: (path: string, text: string, encoding = 'utf-8') => void
  writeBytes: (path: string, byte_array) => void
  append: (path: string, text: string, encoding = 'utf-8') => void
  appendBytes: (path: string, byte_array, encoding = 'utf-8') => void
  copy: (fromPath: string, toPath: string) => boolean
  move: (fromPath: string, toPath: string) => boolean
  rename: (path: string, newName: string) => boolean
  renameWithoutExtension: (path: string, newName: string) => boolean
  getName: (path: string) => string
  getNameWithoutExtension: (path: string) => string
  getExtension: (path: string) => string
  remove: (path: string) => boolean
  removeDir: (path: string) => boolean
  getSdcardPath: () => string
  cwd: () => string
  /**
   * 返回相对路径对应的绝对路径。
   * 例如 files.path("./1.png")，
   * 如果运行这个语句的脚本位于文件夹 "/sdcard/脚本/" 中，
   * 则返回 "/sdcard/脚本/1.png"
   */
  path: (relativePath: string) => string
  listDir: (path: string, filter?: (file_name: string) => boolean) => string[]
}
// HTTP
declare let http: {
  get: (url: string, options?: http_request_options, callback?) => Response
  post: (url: string, data, options?: http_request_options, callback?) => Response
  postJson: (url: string, data?, options?: http_request_options, callback?) => Response
  postMultipart: (url: string, files: any, options?: http_request_options, callback?) => Response
  request: (url: string, options?: http_request_options, callback?) => Response
}
interface http_request_options {
  headers?: any
  method?: string
  contentType?: string
  body?: string | Array | Function
}
interface Response {
  statusCode: number
  statusMessage: string
  headers: any
  body: {
    bytes: () => Array
    string: () => string
    json: () => any
    contentType: string
  }
  request: any
  url: any
  /** 当前响应所对应的 HTTP 请求的方法。例如 "GET", "POST", "PUT" 等。 */
  method: string
}
// webSocket
declare class OkHttpClient {
  constructor(...p) {}
  static Builder;
  [x: string]: any;
}
declare class Request {
  constructor(...p) {}
  static Builder;
  [x: string]: any;
}
declare class WebSocketListener {
  constructor(...p) {}
  [x: string]: any;
}
// 本地存储 Storages
declare let storages: {
  create: (name: string) => Storage
  remove: (name: string) => boolean
}
interface Storage {
  get: (key: string, defaultValue?: any) => any
  put: (key: string, value?: any) => any
  remove: (key: string) => void
  contains: (key: string) => boolean
  clear: () => any
}
// 控制台 Console
declare let console: {
  show: () => any
  hide: () => any
  clear: () => any
  log: (data?, ...args) => any
  verbose: (data?, ...args) => any
  info: (data?, ...args) => any
  warn: (data?, ...args) => any
  error: (data?, ...args) => any
  assert: (value, message) => any
  time: (label?) => any
  timeEnd: (label) => any
  trace: (data?, ...args) => any
  input: (data, ...args) => any
  rawInput: (data, ...args) => any
  setSize: (w, h) => any
  setPosition: (x, y) => any
  setGlobalLogConfig: (config) => any
}
declare let print
// 定时器 Timers
declare let setInterval
declare let setTimeout
declare let setImmediate
declare let clearInterval
declare let clearTimeout
declare let clearImmediate
// 多线程 Threads
declare let threads: {
  start: (fn) => Thread
  shutDownAll: () => any
  currentThread: () => Thread
  disposable: () => any
  atomic: (initialValue?) => any
  lock: () => any
}
declare let Thread: {
  interrupt: () => any
  join: ([timeout]) => any
  isAlive: () => any
  waitFor: () => any
  // 区别在于，该定时器会在该线程执行。如果当前线程仍未开始执行或已经执行结束，则抛出 IllegalStateException。
  setTimeout: (callback, delay, ...args) => any
  setInterval: (callback, delay, ...args) => any
  setImmediate: (callback, ...args) => any
  clearInterval: (id) => any
  clearTimeout: (id) => any
  clearImmediate: (id) => any
}
declare function setTimeout(callback, delay, ...args)
declare function setInterval(callback, delay, ...args)
declare function setImmediate(callback, ...args)
declare function clearInterval(id)
declare function clearTimeout(id)
declare function clearImmediate(id)
/** 给函数 func 加上同步锁并作为一个新函数返回。 */
declare function sync(func)
// 事件与监听 Events
declare let events: {
  emitter: () => any
  observeKey: () => any
  onKeyDown: (keyName, listener) => any
  onKeyUp: (keyName, listener) => any
  onceKeyDown: (keyName, listener) => any
  onceKeyUp: (keyName, listener) => any
  removeAllKeyDownListeners: (keyName) => any
  removeAllKeyUpListeners: (keyName) => any
  /**
   * 设置按键屏蔽是否启用。
   * 所谓按键屏蔽指的是，屏蔽原有按键的功能，例如使得音量键不再能调节音量，但此时仍然能通过按键事件监听按键。
   * 如果不加参数 key 则会屏蔽所有按键。
   * @param key
   * @param enabled
   */
  setKeyInterceptionEnabled: (key?, enabled) => any
  observeTouch: () => any
  setTouchEventTimeout: (timeout) => any
  getTouchEventTimeout: () => any
  onTouch: (listener) => any
  removeAllTouchListeners: () => any
  observeNotification: () => any
  observeToast: () => any
  on: (name: event_name, fn: any) => any
  removeAllListeners: (eventName?: string) => any
}
type event_name = 'key' | 'key_down' | 'key_up' | 'exit' | 'toast' | 'notification'
// 对话框 Dialogs
declare let dialogs
declare let alert
declare let confirm: (s: string) => boolean
// 悬浮窗 Floaty
declare let floaty: {
  checkPermission: () => boolean
  requestPermission: () => any
  window: (layout) => floatyWindow
  rawWindow: (layout) => floatyWindow
  closeAll: () => any
}
interface floatyWindow {
  setAdjustEnabled: (enabled) => any
  setPosition: (x, y) => any
  getX: () => any
  getY: () => any
  setSize: (width, height) => any
  getWidht: () => any
  getHeight: () => any
  close: () => any
  exitOnClose: () => any
  setTouchable: (touchable) => any
  setPosition: (x, y) => any
  getX: () => any
  getY: () => any
  setSize: (width, height) => any
  getWidht: () => any
  getHeight: () => any
  close: () => any
  exitOnClose: () => any
}
// 脚本引擎 Engines
declare let engines: {
  execScript: (name, script, config?) => any
  execScriptFile: (path, config?) => ScriptExecution
  /** 执行录制文件 */
  execAutoFile: (path, config?) => ScriptExecution
  stopAll: () => any
  stopAllAndToast: () => any
  myEngine: () => any
  all: () => any
}
interface ScriptExecution {
  getEngine: () => ScriptEngine
  getConfig: () => ScriptConfig
}
interface ScriptEngine {
  forceStop: () => any
  cwd: () => any
  getSource: () => any
  emit: (eventName, ...args) => any
}
interface ScriptConfig {
  delay
  interval
  loopTimes
  getPath: () => any
}
// 画布 Canvas
declare let canvas
declare class Paint {
  constructor(...p) {}
  [x: string]: any;
}
// 模块 Modules (使用 rollup + babel + es module)
// OCR 文字识别
declare let paddle
declare let gmlkit
declare class TessBaseAPI {
  constructor(...p) {}
  [x: string]: any;
}
declare let com
declare let requestScreenCapture
declare let captureScreen
// 图片与颜色 Images
declare let colors
declare let images
// Base64
declare let $base64
// 消息处理 (加密，摘要) Crypto
declare class $crypto {
  constructor(...p) {}
  static Key
  static encrypt
  static decrypt
  static generateKeyPair
  static digest;
  [x: string]: any;
}
// 压缩与解压 Zip
declare let zips: {
  /**
   * 压缩
   *
   * @param type zip 7z bz2 bzip2 tbz2 tbz gz gzip tgz tar wim swm xz txz
   * @returns 状态码, 0 是成功, 其他看文档
   */
  A: (type, filePath, dirPath, password?) => number
  /**
   * 解压
   *
   * 支持的解压缩类型包括：
   *  zip、7z、bz2、bzip2、tbz2、tbz、gz、gzip、tgz、tar、
   *  wim、swm、xz、txz以及rar、chm、iso、msi等众多格式。
   * @returns 状态码, 0 是成功, 其他看文档
   */
  X: (filePath, dirPath, password?) => number
}
// 多媒体 Media
declare let media: {
  scanFile: (path) => any
  playMusic: (path, volume?, looping?) => any
  musicSeekTo: (msec) => any
  pauseMusic: () => any
  resumeMusic: () => any
  stopMusic: () => any
  isMusicPlaying: () => any
  getMusicDuration: () => any
  getMusicCurrentPosition: () => any
}
// 传感器 Sensors
declare let sensors: {
  register: (sensorName, delay?) => any
  delay: {
    /** 正常频率 */
    normal
    /** 适合于用户界面的更新频率 */
    ui
    /** 适合于游戏的更新频率 */
    game
    /** 最快的更新频率 */
    fastest
  }
  unregister: (emitter) => any
  unregisterAll: () => any
  ignoresUnsupportedSensor: boolean
  on: (eventName: 'unsupported_sensor' | 'change' | 'accuracy_change', fn: Function) => any
}
// 协程 (TODO)
// WebView 与 HTML (TODO)
// 执行命令 Shell
declare function shell(cmd: string, root?: boolean): {
  code: number
  result: string
  error: string
}
declare class Shell {
  constructor(...p) {}
  exec: (cmd) => any
  exit: () => any
  exitAndWaitFor: () => any
  setCallback: (callback) => any
  // [x: string]: any;
}
// 调用 Java
declare class StringBuilder {
  constructor(...p) {}
  [x: string]: any;
}
declare class MutableOkHttp {
  constructor(...p) {}
  [x: string]: any;
}
declare let MediaType
declare let RequestBody
declare let WebView
declare let WebSettings
// axios (TODO)
// npm 模块 (TODO)
// Buffer
// cheerio
// event-stream
// events
// Lodash
// rxjs
// stream
