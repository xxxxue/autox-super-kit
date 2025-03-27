import { useEffect, useState } from 'react'
import jpgFile from './assets/head.jpg'
import jsonFile from './assets/test.json'

/**
 * 将 调用 aj 封装为 Promise
 * @param aj_fn_name 函数名
 */
function invokeFn<T = any>(aj_fn_name: string): Promise<T>
/**
 * 将 调用 aj 封装为 Promise
 * @param aj_fn_name 函数名 / 字符串代码
 * @param data 参数 / "[code]"
 */
function invokeFn<T = any>(aj_fn_name: string, data: any): Promise<T>
/**
 * 将 调用 aj 封装为 Promise
 * @param aj_fn_name 函数名
 * @param data 参数数组 (例如：[ 1,"hh",false ])
 */
function invokeFn<T = any>(aj_fn_name: string, data: any[]): Promise<T>
function invokeFn<T = any>(aj_fn_name: string, data: any | any[] = undefined) {
  return new Promise<T>((resolve, reject) => {
    MyAutoxBridge.invoke(aj_fn_name, data, (r: T & { __message: string }) => {
      // 发生错误
      if (r?.__message) {
        // 如果未用 .catch 处理，则会自动显示到 console.error()
        reject(r.__message)
      }
      else {
        resolve(r)
      }
    })
  })
}

/**
 * 执行 aj 支持的代码
 *
 * (底层使用 new Function(),
 * 本质是一个匿名函数，
 * 所以传入的 code 参数是 函数体)
 *
 * 如果需要获取返回值，需要 return , 比如 return 1+1
 * @param code
 */
async function execCode(code: string) {
  return await invokeFn(code, '[code]')
}

function App() {
  const [fn_1, setFn_1] = useState<number>(0)
  const [fn_2, setFn_2] = useState<boolean>(false)
  const [fn_2_1, setFn_2_1] = useState<boolean>(false)
  const [fn_3, setFn_3] = useState<string>('')
  const [fn_4, setFn_4] = useState<{ id: number, name: string }[]>([])
  const [fn_5, setFn_5] = useState<boolean>(false)
  const [exec_code, setExec_code] = useState<string>('')
  const [exec_code_2, setExec_code_2] = useState<string>('')

  useEffect(() => {
    // 将 web 函数挂载到 全局 window 对象上，暴露给 aj, 在 aj_fn_4 中调用
    // @ts-expect-error window 上面的 ts 类型
    window.test_aj_call_web = (a, b, c) => {
      return '我是 web 返回值'
    }
  }, [])

  const show_log_window = () => {
    invokeFn('show_log_window')
  }

  const show_settings_window = () => {
    invokeFn('show_settings_window')
  }

  const aj_fn_0 = () => {
    invokeFn('aj_fn_0')
  }

  const aj_fn_1 = async () => {
    const r = await invokeFn('aj_fn_1')
    setFn_1(r)
  }

  const aj_fn_2 = async () => {
    const r = await invokeFn('aj_fn_2')
    setFn_2(r)
  }

  const aj_fn_2_1 = async () => {
    const r = await invokeFn('aj_fn_2', '小明')
    setFn_2_1(r)
  }

  const aj_fn_3 = async () => {
    const r = await invokeFn('aj_fn_3')
    setFn_3(r)
  }

  const aj_fn_4 = async () => {
    const r = await invokeFn('aj_fn_4', [111, '小明 111', 555])
    setFn_4(r)
  }

  const aj_fn_5 = async () => {
    const r = await invokeFn('aj_fn_5', {
      id: 999,
      name: '小明 999',
    })

    setFn_5(r)
  }

  const exec_code_fn = async () => {
    // 可以执行任何 aj 代码 ,使用 new Function() 实现，
    // 参数为 方法体，获取返回值需要加 return
    const r = await execCode(`
      toast('123');
      let num = random(1, 9)
      return app.autojs.versionName + "--- 随机数:" + num;
      `)

    // let r = await execCode("return files.read('/sdcard/demo.txt')");
    setExec_code(`aj 版本号:${r}`)
  }

  const exec_code_2_fn = async () => {
    const r = await execCode(`
      toast('123');
      let num = random(1, 9)
      // autox 的 Promise 底层为 bluebird, 
      // 没有 await 等关键字，只能通过方法的形式使用 Promise
      return new Promise((resolve, reject) => {
          let r = app.autojs.versionName + "--- 随机数:" + num;
          resolve(r)
      })
      `)

    setExec_code_2(`aj 版本号:${r}`)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >

      <img
        width={40}
        height={40}
        src={jpgFile}
        alt="图片"
      />

      <h4
        style={{
          textAlign: 'center',
        }}
      >
        这里是 React Web 界面
      </h4>

      <pre>{jsonFile.data}</pre>

      <button onClick={show_log_window}>show_log_window</button>

      <button onClick={show_settings_window}>show_settings_window</button>

      <button onClick={aj_fn_0}>aj_fn_0</button>

      <button onClick={aj_fn_1}>
        aj_fn_1 ---
        {fn_1}
      </button>

      <button onClick={aj_fn_2}>
        aj_fn_2 ---
        {fn_2 ? '成功' : 'false'}
      </button>

      <button onClick={aj_fn_2_1}>
        aj_fn_2_1 ---
        {fn_2_1 ? '成功' : 'false'}
      </button>

      <button onClick={aj_fn_3}>
        aj_fn_3 ---
        {fn_3}
      </button>

      <button onClick={aj_fn_4}>
        aj_fn_4 ---
        {fn_4.length}
      </button>

      <button onClick={aj_fn_5}>
        aj_fn_5 ---
        {fn_5 && '成功'}
      </button>

      <button onClick={exec_code_fn}>
        执行 aj 代码 ---
        {exec_code}
      </button>

      <button onClick={exec_code_2_fn}>
        执行 aj 代码 2 ---
        {exec_code_2}
      </button>

      {fn_4?.map((v) => {
        return (
          <p key={v.id}>
            {v.id}
            ---
            {v.name}
          </p>
        )
      })}
    </div>
  )
}
export default App
