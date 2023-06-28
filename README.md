# 🐵 Autox-Super-Kit
> [Autox](https://github.com/kkevsekk1/AutoX) 超级工具箱 


- [x] 复刻一个服务程序, 用于连接 Autox , 支持 自动编译与运行

- [x] 将所有模块编译为一个文件 ( 由 rollup 支持)

- [x] 支持 TypeScript 编写代码

- [x] 语法支持 ES6+ , 打包会编译为 ES5 ( `编译` 与 `垫片` 由 babel 支持)
  - Rhino 引擎对 ES5 支持还是不错的. 
  - 可以使用 npm 包 (前提是 autox 的环境支持包中的代码)
- [x] 混淆变量名与方法名 ( 由 terser 支持)

  - [x] 自动识别 UI 中使用到的变量, 跳过该变量的混淆. (由 babel 支持)

- [x] 把 js 转为 dex , 并将字符串加密.  [xxxxue/Autojs_Rhino_Dex](https://github.com/xxxxue/Autojs_Rhino_Dex)
  
- [x] 使用 React.js (web) 写界面 [xxxxue/autox-super-kit/tree/web](https://github.com/xxxxue/autox-super-kit/tree/web)

# Git

使用 `degit`

```
npx degit xxxxue/autox-super-kit my-app
```

使用 `git` (会把 git 变更记录都克隆)

```
git clone https://github.com/xxxxue/autox-super-kit.git
```

# 💻 编码环境

> 版本号 随便搞,只要不报错就行 

nodejs v18

包管理器推荐 pnpm 速度飞快,

yarn npm 也可以. 

# 😁 使用方法

克隆项目

在根目录执行 `pnpm install` 安装依赖

执行 `pnpm run dev` 运行程序

> 按 数字键 执行相应功能

## 自动模式

1 自动监听文件改变重新编译运行

## 手动模式

8 启动服务 9 编译代码 2 运行项目

然后 9 2 循环

# 🚲 !! 重要提示 !!

## 编写 UI 的规范

编写 ui 时 , 最外层需要包裹一个 `<> </>`

在编译时, 会将 `<>`和 `</>` 替换成 模版字符串, 

> 示例
```typescript
ui.layout(
  <>
    <linear id="container"></linear>
  </>
);
for (let i = 0; i < 3; i++) {
  let textView = ui.inflate(
    <>
      <text textColor="#000000" textSize="14sp" />
    </>,
    ui.container
  );
  textView.attr("text", "文本控件" + i);
  ui.container.addView(textView);
}
```

输出
```typescript
ui.layout(`<linear id="container"></linear>`);

//其他代码省略
```



## 文件顶部可以不写 ``"ui";``

编译时会加上



## autox.d.ts

由于 autox 太过于灵活, 比如可以调用 原生java类

所以类型很难写全,

如果有 ts 报错就自己手动在 autox.d.ts 中补充
