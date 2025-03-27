
import { createUnplugin } from 'unplugin'

export const unplugin_transform_autojs_native_ui = createUnplugin<undefined>(() => ({
  name: 'autox-native-ui',
  transformInclude(id) {
    return !id.includes('node_modules') // 只处理自己的项目代码
  },
  transform(code) {
    // 把 jsx 标志 (<></>) 改为 模版字符串 (``),
    //  autojs 支持字符串中写界面
    code = code.replace(/<>/g, '`').replace(/<\/>/g, '`')
    return code
  },
}))
