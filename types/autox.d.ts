
declare let ui: {
    /** 界面 */
    layout: (jsx: any) => void
    /** 在 ui 线程上执行代码 */
    run: (fn: () => void) => void
    [x: string]: any;
    __widgets__: any;
    __defineGetter__: any;
    layoutFile: any;
    inflate: any;
    __inflate__: any;
    registerWidget: any;
    setContentView: any;
    findById: any;
    findView: any;
    isUiThread: any;
    post: any;
    statusBarColor: any;
    finish: any;
    findByStringId: any;
    Widget: any;
}
declare function require<T = any>(name: string): T

declare namespace JSX {
    interface IntrinsicElements {
        text: Partial<
            {
                [x: string]: any
            }>;
        button: Partial<
            {
                id: string
                /** 按钮文字 */
                text: string
                [x: string]: any
            }>;
        input: Partial<
            {
                [x: string]: any
            }>;
        img: Partial<
            {
                [x: string]: any
            }>;
        vertical: Partial<
            {
                [x: string]: any
            }>;
        horizontal: Partial<
            {
                [x: string]: any
            }>;

        linear: Partial<
            {
                [x: string]: any
            }>;
        frame: Partial<
            {
                [x: string]: any
            }>;
        relative: Partial<
            {
                [x: string]: any
            }>;
        checkbox: Partial<
            {
                [x: string]: any
            }>;
        radio: Partial<
            {
                [x: string]: any
            }>;
        radiogroup: Partial<
            {
                [x: string]: any
            }>;
        switch: Partial<
            {
                [x: string]: any
            }>;
        progressbar: Partial<
            {
                [x: string]: any
            }>;
        seekbar: Partial<
            {
                [x: string]: any
            }>;
        spinner: Partial<
            {
                [x: string]: any
            }>;
        timepicker: Partial<
            {
                [x: string]: any
            }>;
        datepicker: Partial<
            {
                [x: string]: any
            }>;
        fab: Partial<
            {
                [x: string]: any
            }>;
        toolbar: Partial<
            {
                [x: string]: any
            }>;
        card: Partial<
            {
                [x: string]: any
            }>;
        drawer: Partial<
            {
                [x: string]: any
            }>;
        list: Partial<
            {
                [x: string]: any
            }>;
        tab: Partial<
            {
                [x: string]: any
            }>;

        // any jsx
        [x: string]: any;
    }
}
declare let View: (props: any) => JSX.IntrinsicElements
declare let TextView: (props: any) => JSX.IntrinsicElements
declare let ScrollView: (props: any) => JSX.IntrinsicElements
declare let TableLayout: (props: any) => JSX.IntrinsicElements
declare let TableRow: (props: any) => JSX.IntrinsicElements


/** 导入 android 类 */
declare function importClass(name: any)
declare let importPackage
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
    versionCode
    versionName
    autojs: {
        versionCode
        versionName
    }
    launchApp(appName)
    launch(packageName)
    launchPackage(packageName)
    getPackageName(appName)
    getAppName(packageName)
    openAppSetting(packageName)
    viewFile(path)
    editFile(path)
    uninstall(packageName)
    openUrl(url)
    sendEmail(options)
    startActivity(name)

    // 进阶
    intent(options)
    startActivity(options)
    sendBroadcast(options)
    startService(options)
    sendBroadcast(name)
    intentToShell(options)
    parseUri(uri)
    getUriForFile(path)
}

// 设备 - Device
declare let device: {
    width
    height
    buildId
    broad
    brand
    device
    model
    product
    bootloader
    hardware
    fingerprint
    serial
    sdkInt
    incremental
    release
    baseOS
    securityPatch
    codename
    getIMEI()
    getAndroidId()
    getMacAddress()
    getBrightness()
    getBrightnessMode()
    setBrightness(b)
    setBrightnessMode(mode)
    getMusicVolume()
    getNotificationVolume()
    getAlarmVolume()
    getMusicMaxVolume()
    getNotificationMaxVolume()
    getAlarmMaxVolume()
    setMusicVolume(volume)
    setNotificationVolume(volume)
    setAlarmVolume(volume)
    getBattery()
    isCharging()
    getTotalMem()
    getAvailMem()
    isScreenOn()
    wakeUp()
    wakeUpIfNeeded()
    keepScreenOn(timeout?)
    keepScreenDim(timeout?)
    cancelKeepingAwake()
    vibrate(millis)
    cancelVibration()
}

// 全局变量与函数
declare function sleep(n)
declare function currentPackage()
declare function currentActivity()
declare function setClip(text)
declare function getClip()
declare function toast(message)
declare function toastLog(message)
declare function waitForActivity(activity, period = 200)
declare function waitForPackage(package, period = 200)
declare function exit()
declare function random(min, max)
declare function random()
declare function requiresApi(api)
declare function requiresAutojsVersion(version)
declare let runtime: {
    requestPermissions(permissions)
    loadJar(path)
    loadDex(path)
}
/**
 * 全局变量。一个android.content.Context对象。
 * 注意该对象为ApplicationContext，
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

//基于坐标的操作
declare let setScreenMetrics
declare let press
declare let swipe
declare let gesture

declare class JavaAdapter {
    constructor(...p) { }
    tap
    swipe
    press
    longPress
    touchDown
    touchMove
    touchUp
    [x: string]: any
}

declare let Tap
declare let Swipe

// 按键模拟
declare let back
declare let home
declare let powerDialog
declare let notifications
declare let quickSettings
declare let recents
declare let splitScreen
declare let takeScreenshot
declare let lockScreen
declare let dismissNotificationShade
declare let keyCodeHeadsetHook
declare let accessibilityShortcut
declare let accessibilityButtonChooser
declare let accessibilityButton
declare let accessibilityAllApps
declare let Home
declare let Back
declare let Power
declare let Menu
declare let VolumeUp
declare let VolumeDown
declare let Camera
declare let Up
declare let Down
declare let Left
declare let Right
declare let OK
declare let Text
declare let KeyCode

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
    /** 确保 path 所在的文件夹存在, 不存在则创建 */
    ensureDir: (path: string) => void
    read: (path: string, encoding = "utf-8") => string
    readBytes: (path: string) => any[]
    write: (path: string, text: string, encoding = "utf-8") => void
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
    get(url: string, options?: http_request_options, callback?): Response
    post(url: string, data, options?: http_request_options, callback?): Response
    postJson(url: string, data?, options?: http_request_options, callback?): Response
    postMultipart(url: string, files: any, options?: http_request_options, callback?): Response
    request(url: string, options?: http_request_options, callback?): Response
}
type http_request_options = {
    headers?: any
    method?: string
    contentType?: string
    body?: string | Array | Function
}
type Response = {
    statusCode: number
    statusMessage: string
    headers: any
    body: {
        bytes(): Array
        string(): string
        json(): any
        contentType: string
    }
    request: any
    url: any
    /** 当前响应所对应的 HTTP 请求的方法。例如 "GET", "POST", "PUT" 等。 */
    method: string
}

// webSocket

declare class OkHttpClient {
    constructor(...p) { }
    static Builder
    [x: string]: any
}
declare class Request {
    constructor(...p) { }
    static Builder
    [x: string]: any
}

declare class WebSocketListener {
    constructor(...p) { }
    [x: string]: any
}



// 本地存储 Storages
declare let storages: {
    create: (name: string) => Storage
    remove: (name: string) => boolean
}

type Storage = {
    get: (key: string, defaultValue?: any) => any
    put: (key: string, value?: any) => any
    remove: (key: string) => void
    contains: (key: string) => boolean
    clear: () => any
}

// 控制台 Console
declare let console: {
    show()
    hide()
    clear()
    log(data?, ...args?)
    verbose(data?, ...args?)
    info(data?, ...args?)
    warn(data?, ...args?)
    error(data?, ...args?)
    assert(value, message)
    time(label?)
    timeEnd(label)
    trace(data?, ...args?)
    input(data, ...args?)
    rawInput(data, ...args?)
    setSize(w, h)
    setPosition(x, y)
    setGlobalLogConfig(config)
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
    start(fn): Thread
    shutDownAll()
    currentThread(): Thread
    disposable()
    atomic(initialValue?)
    lock()
}
declare let Thread: {
    interrupt()
    join([timeout])
    isAlive()
    waitFor()

    // 区别在于, 该定时器会在该线程执行。如果当前线程仍未开始执行或已经执行结束，则抛出 IllegalStateException。
    setTimeout(callback, delay, ...args?)
    setInterval(callback, delay, ...args?)
    setImmediate(callback, ...args?)
    clearInterval(id)
    clearTimeout(id)
    clearImmediate(id)
}
declare function setTimeout(callback, delay, ...args?)
declare function setInterval(callback, delay, ...args?)
declare function setImmediate(callback, ...args?)
declare function clearInterval(id)
declare function clearTimeout(id)
declare function clearImmediate(id)
/** 给函数 func 加上同步锁并作为一个新函数返回。 */
declare function sync(func)

declare let events: {
    emitter()
    observeKey()
    onKeyDown(keyName, listener)
    onKeyUp(keyName, listener)
    onceKeyDown(keyName, listener)
    onceKeyUp(keyName, listener)
    removeAllKeyDownListeners(keyName)
    removeAllKeyUpListeners(keyName)
    /**
     * 设置按键屏蔽是否启用。
     * 所谓按键屏蔽指的是，屏蔽原有按键的功能，例如使得音量键不再能调节音量，但此时仍然能通过按键事件监听按键。
     * 如果不加参数 key 则会屏蔽所有按键。
     * @param key 
     * @param enabled 
     */
    setKeyInterceptionEnabled(key?, enabled)
    observeTouch()
    setTouchEventTimeout(timeout)
    getTouchEventTimeout()
    onTouch(listener)
    removeAllTouchListeners()
    observeNotification()
    observeToast()
    on(name: event_name, fn: any)
}
type event_name = 'key' | 'key_down' | 'key_up' | 'exit' | 'toast' | 'notification'
// 对话框 Dialogs
declare let dialogs
declare let alert
declare let confirm: (s: string) => boolean
// 悬浮窗 Floaty
declare let floaty

// 脚本引擎 Engines
declare let engines: {
    execScript(name, script, config?)
    execScriptFile(path, config?): ScriptExecution
    /** 执行录制文件 */
    execAutoFile(path, config?): ScriptExecution
    stopAll()
    stopAllAndToast()
    myEngine()
    all()
}

type ScriptExecution = {
    getEngine(): ScriptEngine
    getConfig(): ScriptConfig
}
type ScriptEngine = {
    forceStop()
    cwd()
    getSource()
    emit(eventName, ...args?)
}
type ScriptConfig = {
    delay
    interval
    loopTimes
    getPath()
}
// 画布 Canvas
declare let canvas

declare class Paint {
    constructor(...p) {

    }
    [x: string]: any
}

// 模块 Modules (使用 rollup + babel + es module)


// OCR 文字识别
declare let paddle
declare let gmlkit

declare class TessBaseAPI {
    constructor(...p) { }
    [x: string]: any
}
declare let com
declare let requestScreenCapture
declare let captureScreen


// 图片与颜色 Images
declare let colors
declare let images

// 事件与监听 Events
declare let events

declare let emitter

// Base64
declare let $base64


// 消息处理(加密,摘要) Crypto
declare class $crypto {
    constructor(...p) { }
    static Key
    static encrypt
    static decrypt
    static generateKeyPair
    static digest

    [x: string]: any
}

// 压缩与解压 Zip

declare let zips

// 多媒体 Media

declare let media

// 传感器 Sensors
declare let sensors


// 协程 (TODO)

// WebView 与 HTML (TODO)


//执行命令 Shell
declare let shell
declare class Shell {
    constructor(...p) {

    }
    [x: string]: any
}


// 调用 Java

declare class StringBuilder {
    constructor(...p) {
    }
    [x: string]: any
}


declare class JavaAdapter {
    constructor(...p) { }
    [x: string]: any
}
declare class MutableOkHttp {
    constructor(...p) { }
    [x: string]: any
}
declare let MediaType
declare let RequestBody

declare let WebView
declare let WebSettings
// axios (TODO)

// npm模块 (TODO)