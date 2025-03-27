import antfu, { combine, GLOB_SRC, react } from '@antfu/eslint-config'

const antfuConfig = antfu({
  // 自动判断 IDE 环境, 提升开发体验, 保存时不修复 "转换 const" 和 "未使用的 import", https://github.com/antfu/eslint-config/blob/5af1d9bf96609ab1d0a820cee0f83cd6948a0c5d/src/factory.ts#L329
  // isInEditor: false,
  // vue: true,
  // solid: true,

  react: false, // 关闭 react,在下面单独配置
  formatters: true,
  typescript: {
    overrides: {
      'ts/no-unsafe-function-type': 'off',
    },
  },

}, {
  files: [
    GLOB_SRC,
  ],
  rules: {
    'no-alert': 'off',
    'no-console': 'off',
    'no-new-func': 'off',
    'unused-imports/no-unused-vars': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    // 只允许最多空一行
    'style/no-multiple-empty-lines': ['error', { max: 1 }],
  },
})

// @antfu/eslint-config 源码中会合并 antfu.typescript 中的配置项,
// 由于我上面啥也没配置.所以就忽略这个功能
// https://github.com/antfu/eslint-config/blob/5af1d9bf96609ab1d0a820cee0f83cd6948a0c5d/src/factory.ts#L211
const reactConfig = react({
  files: [
    'src/**/*.?([cm])[jt]s?(x)', // 默认是所有目录,src-autox目录也会被影响, 这里改为只在 src 目录生效
  ],
  overrides: {
    'react-dom/no-missing-button-type': 'off',
  },
})

// vscode 插件:
// https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
// https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens
export default combine(
  antfuConfig,
  reactConfig,
)
