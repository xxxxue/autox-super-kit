import path from "node:path";
import process from "node:process";

export const _autojs_server_port = 9317;
export const _vite_dev_port = 5173;
export const _src_autox_dir_path = path.join(process.cwd(), "src-autox");
export const _src_runtime_dir_path = path.join(process.cwd(), "src-runtime");
export const _dist_web_dir_path = path.join(process.cwd(), "dist");
export const _out_aj_dir_path = path.join(process.cwd(), "out");
export const _node_env = process.env.Node_Env;
export const _is_prod = _node_env === "prod";
export const _is_dev = _node_env === "dev";
