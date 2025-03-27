import path from 'node:path'
import { createUnplugin } from 'unplugin'
import { _is_dev, _is_prod } from '../scripts/lib/config'
import { my_plugin_log } from '../scripts/lib/utils'

// unplugin 非空参数报错 必须设置 ts 的 "strictNullChecks": true 才有效
// 否则非空的 options 也会认为可以空，ts 不会报错 "必须传入参数"
interface IOptions {
  web_dev_ip: string
  web_dev_port: number
}

export const unplugin_transform_autojs_web_ui = createUnplugin<IOptions>(props => ({
  name: 'autox-web-ui',
  transformInclude(id) {
    // 只处理入口文件
    const ret = !id.includes('node_modules')
      && path.dirname(id).endsWith('src-autox')
      && path.basename(id) === 'main.tsx'
    return ret
  },
  transform(code) {
    if (_is_dev) {
      console.log(props)
      // 开发环境 替换为 ip
      const url = `${props.web_dev_ip}:${props.web_dev_port}`
      code = replace_web_info(code, url, 'web-url')
    }
    else if (_is_prod) {
      // 发布环境 替换为 文件
      code = replace_web_info(code, './index.html', 'file-path')
      if (code.includes('./index.html') && code.includes('file-path')) {
        my_plugin_log('替换地址为 index.html')
      }
    }

    return code
  },
}))

function replace_web_info(code: string, url: string, type: string) {
  return code
    .replace(/autojs-todo-web-url/g, url)
    .replace(/autojs-todo-web-type/g, type)
}
