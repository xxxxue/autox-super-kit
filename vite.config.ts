import { env } from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { initAutoxBridge } from './plugins/vite-plugin-init-autox-bridge'

console.log({
  NODE_ENV: env.NODE_ENV, // vite 内部会使用, dev: development, build: production
  My_Node_Env: env.My_Node_Env, // "./scripts" 中使用, 在 package.json scripts 中赋值
})

// 其他 web 框架，比如 react vue solid svelte ( 只要 vite 支持就行 ),
// 只需将 initAutoxBridge viteSingleFile 添加上，
// 把 src 目录的前端文件替换掉，
// 其他的和普通的 vite 项目没有区别
export default defineConfig({
  build: {
    minify: 'esbuild',
    sourcemap: false,
  },
  esbuild: {
    legalComments: 'none', // 移除注释
  },
  plugins: [
    react(),
    initAutoxBridge(), // 给 index.html 添加调用 Auto.js 的 Bridge 工具函数
    viteSingleFile(), // 将所有 js 打包到 index.html 中 , 便于 WebView 加载
  ],
})
