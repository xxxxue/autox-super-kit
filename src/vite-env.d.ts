/// <reference types="vite/client" />
declare let MyAutoxBridge: {
  invoke: (cmd: string, args: any | any[] | '[code]', callback?: Function) => void
}
