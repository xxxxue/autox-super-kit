import path from 'node:path'
import { cwd, env } from 'node:process'

export const _autojs_server_port = 9317
export const _web_dev_port = 5173

export const _out_aj_dir_path = getDirPath('out')

export const _node_env = env.My_Node_Env
export const _is_prod = _node_env === 'prod'
export const _is_dev = _node_env === 'dev'

function getDirPath(name: string) {
  return path.join(cwd(), name)
}
