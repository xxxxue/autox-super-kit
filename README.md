# 🐵 Autox-Super-Kit + Web

[Autox-Super-Kit](https://github.com/xxxxue/autox-super-kit) + [autojs_web](https://github.com/xxxxue/autojs_web) + React.js

# Git

使用 `degit`

```
npx degit xxxxue/autox-super-kit#web my-app
```

使用 `git` (会把 git 变更记录都克隆)

```
git clone -b web https://github.com/xxxxue/autox-super-kit.git
```

# 原理

都是全自动的, 不需要手动改东西. 

只是介绍原理
> 开发环境

启动 Autox-Super-Kit 和 Vite,

Webview 中访问 vite 的地址,

享受 Web 开发的一切功能

> 打包环境

build 打包时,

把 js css 等代码 合并到 index.html 中,

资源文件都打包到 assets 文件夹中,

并处理代码中一些 Web 资源路径问题.

最后把所有 web 的文件复制到 autox 输出目录,

将 autox webview 的加载地址 改为 index.html

# 相关命令
```
dev : 开发时使用, 更多介绍请看 Autox-Super-Kit README
build: 打包整个项目
```
