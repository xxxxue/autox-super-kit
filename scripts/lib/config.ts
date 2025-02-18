import path from "node:path";

export let _autojs_server_port = 9317;
export let _vite_dev_port = 5173
export let _src_autox_dir_path = path.join(process.cwd(), "src-autox");
export let _src_runtime_dir_path = path.join(process.cwd(), "src-runtime");
export let _dist_web_dir_path = path.join(process.cwd(), "dist");
export let _out_aj_dir_path = path.join(process.cwd(), "out");

export let _node_env = process.env.Node_Env;
export let _is_prod = _node_env == 'prod'
export let _is_dev = _node_env == 'dev'