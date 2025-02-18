# 🚀 Autox-Super-Kit

> 使用更现代的方式 开发 Auto.js 项目，提升开发效率

> 支持使用 Web 框架开发界面 ( WebView )

你可以用这个项目开发

- `传统 Auto.js 程序` : 使用 无障碍 操作其他 App

- `普通 App` : HTML 表单的增删改查，数据处理与展示，SQLite 存储数据
  - 无需安装复杂的 Android 开发环境，轻松打包出自己的 App

## 介绍

- [x] 复刻一个服务程序，用于连接 AutoX, 支持 自动编译与运行

- [x] 将所有模块编译为一个文件 ( rollup )

- [x] 支持 TypeScript 编写代码

- [x] 语法支持 ES6+ , 打包会编译为 ES5 ( babel )

  - Rhino 对 ES5 支持还是不错的
  - 可以使用 npm 包 ( 比如：lodash-es ) ( 前提是 AutoX 的环境支持包中的代码 )

- [x] 混淆变量名与方法名 ( terser )

  - 自动识别 UI 中使用到的变量，跳过该变量的混淆 ( babel )

- [x] 把 js 转为 dex , 并将字符串加密

  - Github: [Autojs_Rhino_Dex](https://github.com/xxxxue/Autojs_Rhino_Dex)

- [x] 使用 Web 写界面

  - 默认 React.js
  - 你可以很轻松的修改为 vite 支持的其他框架
  - 比如 vanilla vue solid preact svelte lit qwik

- [x] 使用 auto.js 原生 UI 写界面 ( 在另一个分支 `aj-native-ui` )

## 编码环境

> 版本号 随便搞，只要不报错就行

node.js v23.7.0

包管理器推荐 pnpm 性能好，yarn npm 也可以

## 使用方法

克隆项目 并 创建新分支 或 下载压缩包

在根目录执行 `pnpm install` 安装依赖

执行 `pnpm run dev` 运行脚本

> 按 快捷键 执行相应功能

`设备连接` 指的是使用 App 中的 `连接电脑`, 输入服务器地址并点击确定 或 扫描二维码

### 自动模式

- [1] 自动监听文件改变，重新编译，重新运行
- 设备连接
- [2] 运行项目
- 之后的代码修改 会 自动更新到设备上

### 手动模式

- [w] 启动服务
- 设备连接
- [r] 编译代码
- [2] 运行项目
- 修改代码后，再按 r 2

### 将代码打包为 APP

- 执行 `pnpm run build`, 等待打包完成
- 执行 `pnpm run dev`
- [a] 启动 auto.js 服务
- 设备连接
- [e] 保存项目到设备
- 在设备上进入项目，打包应用

## !! 重要提示 !!

### 原生 UI

编写原生 ui 时 , 最外层需要包裹一个 `<> </>`

在编译时，会将 `<>`和 `</>` 替换成 模版字符串

示例

```jsx
ui.layout(
  <>
    <linear id="container"></linear>
  </>
);

for (let i = 0; i < 3; i++) {
  const textView = ui.inflate(
    <>
      <text textColor="#000000" textSize="14sp" />
    </>,
    ui.container
  );
  
  textView.attr("text", `文本控件${i}`);
  ui.container.addView(textView);
}
```

输出

```typescript
ui.layout(`<linear id="container"></linear>`);

// 其他代码省略
```

### 文件顶部不写 `"ui";`

编译时会加上

### TypeScript 自动补全

由于 AutoX 太过于灵活，比如可以调用 Java 类，

所以类型很难写全，

如果有 ts 报错就自己手动在 autox.d.ts 中补充

## 原理介绍

> 开发

启动 Autox-Super-Kit 和 Vite,

WebView 中访问 vite 的地址，

享受 Web 开发的一切功能

> 打包

build 打包时，

把 js css 等代码 合并到 index.html 中，

资源文件都打包到 assets 文件夹中，

并处理代码中一些 Web 资源路径问题，

最后把所有 web 的文件复制到 AutoX 输出目录，

将 AutoX WebView 的加载地址 改为 index.html

## 目录说明

### 常用

- `src` : 前端 web 目录
- `src-autox` : auto.js 目录
- `project.json` : 用于保存打包配置，auto.js 的配置文件

### 不常用

- `src-runtime` : 前后端通讯的代码
- `out` : 编译后的 web 代码 与 auto.js 代码 (发送到设备，然后手动操作打包)
- `dist` : web 项目编译后的输出目录
- `types` : TypeScript 自动补全的定义文件
- `plugins` : vite 插件目录
- `scripts` : nodejs 脚本 ( 开发 与 打包 )

## 更换 Web 框架

可以先用 vite 创建一个项目，然后手动把文件复制到这个项目里

## 一些相关的开源库

| 说明                          | GitHub 地址                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| AutoX v7                      | [aiselp/AutoX](https://github.com/aiselp/AutoX)                                     |
| AutoX 6/7 文档                | [aiselp/AutoxDoc](https://github.com/aiselp/AutoxDoc)                               |
| AutoX v6                      | [ozobiozobi/Autoxjs_v6_ozobi](https://github.com/ozobiozobi/Autoxjs_v6_ozobi)       |
| 在电脑上查看 Android 控件信息 | [codeskyblue/uiautodev](https://github.com/codeskyblue/uiautodev)                   |
| 原版 auto.js 4 fork           | [SuperMonster003/AutoJs6](https://github.com/SuperMonster003/AutoJs6)               |
| 原版 auto.js 4 fork           | [TonyJiangWJ/Auto.js](https://github.com/TonyJiangWJ/Auto.js)                       |
| Auto.js 代码合集              | [aobocodoeo/Autojs_code_collect](https://github.com/aobocodoeo/Autojs_code_collect) |
| 原生 Android 代替 Auto.js     | [Krosxx/Android-Auto-Api](https://github.com/Krosxx/Android-Auto-Api)               |
