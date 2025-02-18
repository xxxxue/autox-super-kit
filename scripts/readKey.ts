import readline from 'readline';
export interface IReadKey { sequence: string, name: string, ctrl: boolean, meta: boolean, shift: boolean }
export interface IFnArr { expression: (key: IReadKey) => boolean, fn: () => void }

export type ReadKeyProps = IFnArr[]

export let readKey = (fnArr: ReadKeyProps) => {

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on('keypress', (str: string, key: IReadKey) => {
        // console.log(str, key);

        // ctrl + c 退出
        if (key.ctrl && key.name === 'c') {
            console.log("ctrl+c 退出了");

            process.exit(0)
            return;
        }

        for (let item of fnArr) {
            if (item.expression(key)) {
                item.fn()
                return;
            }
        }
    });
}