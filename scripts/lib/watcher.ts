import type { RollupOptions } from 'rollup'
import { watch } from 'rollup'

// 使用 rollup 的 watch 去监听 auto.js 代码
export function watcher(options: RollupOptions, bundle_end_fn?: () => void) {
  const rollup_watcher = watch(options)

  rollup_watcher.on('event', (event) => {
    if (event.code === 'BUNDLE_END') {
      console.log(`耗时:${event.duration / 1000}s`)
      event.result.close() // 触发内部事件 closeBundle, 清理资源
      // 执行一些额外操作
      bundle_end_fn?.()
    }

    if (event.code === 'ERROR') {
      console.log('错误')
      console.error(event.error)
      event.result?.close()
    }
  })

  rollup_watcher.on('change', (id, { event }) => {
    console.log(`📄 ${event}: ${id} `)
  })
}
