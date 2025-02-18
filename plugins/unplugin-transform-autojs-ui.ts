import { createUnplugin } from "unplugin";
import { _is_dev, _is_prod, _vite_dev_port } from "../scripts/lib/config";
import { my_plugin_log } from "../scripts/lib/utils";

interface IOptions {
  dev_ip: string;
}
// unplugin 非空参数报错 必须设置 ts 的 "strictNullChecks": true 才有效
// 否则非空的 options 也会认为可以空，ts 不会报错 "必须传入参数"
export const transform_autojs_ui = createUnplugin<IOptions>((props) => ({
  name: "autox-ui",
  transformInclude(id) {
    // 只处理自己的代码，
    return !id.includes("node_modules");
  },
  transform(code, _) {
    // 把 jsx 标志 (<></>) 改为 模版字符串 (``),
    // (aj 支持界面代码被字符串包裹)
    // 如果不处理，则 babel ast 无法识别 , 因为 jsx 不是 js,
    code = code.replace(/<>/g, "`").replace(/<\/>/g, "`");

    // 根据环境替换为正确的页面地址
    if (_is_dev) {
      code = code.replace(/aj.init_web_view_ui\((.*?)\)/g, `aj.init_web_view_ui("${props.dev_ip}:${_vite_dev_port}","web-url")`);
    } else if (_is_prod) {
      code = code.replace(/aj.init_web_view_ui\((.*?)\)/g, 'aj.init_web_view_ui("./index.html","file-path")');

      if (code.includes('aj.init_web_view_ui("./index.html","file-path")')) {
        my_plugin_log("替换 aj.init_web_view_ui 为 index.html");
      }
    }
    return code;
  },
}));
