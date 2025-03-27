import { compile_project } from './lib/compile-project'

// npm run build 只是提供了一个快捷方式
// 也可以使用 npm run dev:prod 去编译

// 如果项目中没有用 web ui, 可以改为 false
compile_project({ enable_web: true })
