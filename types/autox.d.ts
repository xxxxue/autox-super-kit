
declare let ui: {
    /** 界面 */
    layout: (jsx: any) => void
    /** 在 ui 线程上执行代码 */
    run: (fn: () => void) => void
    [x: string]: any;
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


declare let importClass
declare let importPackage
declare let Packages



declare let app

declare let web

declare let android


declare let log

declare let java

declare let Date


declare let open

declare let rawInput
// App
declare let app

// 设备 - Device
declare let device

// 全局变量与函数
declare let sleep
declare let currentPackage
declare let currentActivity
declare let setClip
declare let getClip
declare let toast
declare let toastLog
declare let waitForActivity
declare let waitForPackage
declare let exit
declare let random
declare let requiresApi
declare let requiresAutojsVersion
declare let runtime
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
declare let files


// HTTP

declare let http

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
declare let storages
declare let Storage

// 控制台 Console
declare let console
declare let print


// 定时器 Timers
declare let setInterval
declare let setTimeout
declare let setImmediate
declare let clearInterval
declare let clearTimeout
declare let clearImmediate



// 多线程 Threads
declare let threads
declare let Thread
declare let sync
declare let events

// 对话框 Dialogs
declare let dialogs
declare let alert

// 悬浮窗 Floaty
declare let floaty

// 脚本引擎 Engines
declare let engines

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
declare class Shell{
    constructor(...p){

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

// axios (TODO)

// npm模块 (TODO)