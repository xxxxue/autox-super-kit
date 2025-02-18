
/**
 * 时间格式化
 * @param date 
 * @param fmt 
 * @returns 
 */
export function date_format(date: Date = new Date(), fmt: string = "yyyy-MM-dd HH:mm:ss.S") {
    let o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "H+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return fmt;
};
/**
 * 获取当前时间 (yyyy-MM-dd_HH_mm_ss_S)
 * 
 * 高版本安卓的外部存储中, 文件名不允许冒号 ":", 所以此处用下划线 "_" 代替
 */
export function get_date_now() {
    return date_format(new Date(), "yyyy-MM-dd_HH_mm_ss_S");
}
/**
 * 获取当前时间 (yyyy-MM-dd HH:mm:ss.S)
 */
export function get_date_now_2() {
    return date_format(new Date(), "yyyy-MM-dd HH:mm:ss.S");
}
/** 将 aj java 对象的 keys 输出到文件 */
export function output_aj_obj_keys_to_file(obj: any, p_file_path?: string) {
    let file_path = "/sdcard/A_test/output_keys.txt";
    if (p_file_path) {
        file_path = p_file_path
    }
    files.ensureDir(file_path)
    files.write(file_path, JSON.stringify(Object.keys(obj), null, 2));
    console.log("对象的 key 已经保存到: " + file_path);
}