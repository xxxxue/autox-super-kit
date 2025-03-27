/**
 * 时间格式化
 * @param date
 * @param fmt
 */
export function date_format(date: Date = new Date(), fmt: string = 'yyyy-MM-dd HH:mm:ss.S') {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0')

  return fmt
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('S', milliseconds)
}

/**
 * 获取当前时间 (yyyy-MM-dd_HH_mm_ss_S)
 *
 * 高版本安卓的外部存储中，文件名不允许冒号 ":", 所以此处用下划线 "_" 代替
 */
export function get_date_now() {
  return date_format(new Date(), 'yyyy-MM-dd_HH_mm_ss_S')
}

/**
 * 获取当前时间 (yyyy-MM-dd HH:mm:ss.S)
 *
 * 高版本安卓的外部存储中，文件名不允许冒号 ":", 请使用 get_date_now()
 */
export function get_date_now_2() {
  return date_format(new Date(), 'yyyy-MM-dd HH:mm:ss.S')
}

/**
 * 查看 autojs java 对象中有哪些 key
 *
 * @param obj autojs 对象
 * @param save_to_file false: 输出到 console.log
 * @param file_path
 * @example
 * log_aj_obj_keys(ui.list1.adapter)
 */
export function log_aj_obj_keys(obj: any, save_to_file: boolean = true, file_path: string = '/sdcard/A_test/output_keys.txt') {
  let key_list = Object.keys(obj)

  // 按照 英文字母 重新排序
  key_list = key_list.sort((a, b) => a.localeCompare(b, 'en'))

  const data_array: string[] = []

  // 拼接类型信息
  key_list.forEach((v) => {
    const type = typeof obj[v]
    if (type === 'function') {
      data_array.push(`${v}( )`)
    }
    else {
      data_array.push(`${v} => ${type}`)
    }
  })

  const data_string = JSON.stringify(data_array, null, 2)

  if (save_to_file) {
    files.ensureDir(file_path)
    files.write(file_path, data_string)
    console.log(`对象的 key 已经保存到：${file_path}`)
  }
  else {
    console.log(data_string)
  }
}

