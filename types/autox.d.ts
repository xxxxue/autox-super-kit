
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

declare let floaty

declare let console

declare function toast(v: any): void
declare function toastLog(...p): void
declare function exit(): void
/**
 * 返回一个在[min...max]之间的随机数。
 * @example
 * random(0, 2)
 * 可能产生 0, 1, 2。
 * @param min 
 * @param max 
 */
declare function random(min: number, max: number): number
declare function random(): number

declare function importClass(name: string): void

declare let storages

declare let files


declare let threads

declare let http

declare let dialogs


declare let sleep: (ms: number) => void


declare let device

declare let alert

declare let events 

declare let app 

declare let  android 

declare class StringBuilder {
  
    constructor(...p){

    }
    append
}


declare let web

declare class JavaAdapter {
    constructor(...p){}
}


declare let context

declare let log

declare let java

declare let Date


declare let open

declare let rawInput