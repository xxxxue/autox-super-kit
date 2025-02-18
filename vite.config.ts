import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { initAutoxBridge } from './plugins/vite-plugin-init-autox-bridge';
import { viteSingleFile } from "vite-plugin-singlefile"
// 其他 web 框架, 比如 react vue solid svelte ( 只要 vite 支持就行 ),
// 只需将 initAutoxBridge viteSingleFile 添加上,
// 把 src 目录的前端文件替换掉,
// 其他的和普通的 vite 项目没有区别
export default defineConfig({
  build: {
    minify: "esbuild",
  },
  esbuild: {
    legalComments: "none" // 移除注释
  },
  plugins: [
    // React 支持
    react(),
    // 给 index.html 添加调用 Auto.js 的 Bridge 工具函数
    initAutoxBridge(),
    // 将所有 js 打包到 index.html 中 , 便于 WebView 加载
    viteSingleFile(),
  ],
})
