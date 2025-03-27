export {}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 由于 vite 使用了 NODE_ENV 这个变量 (好像大小写不敏感) 来判断 production ,
      // 所以这里要避免使用类似的 key 名称, 防止覆盖,
      // 加了个前缀 My_
      My_Node_Env: 'test' | 'dev' | 'prod'
    }
  }
}
