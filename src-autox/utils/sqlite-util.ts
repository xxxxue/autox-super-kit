/**
 * sqlite
 *
 * 如果封装的无法满足需求，可以在你的代码中获取 db.getDBConnection(), 自己实现
 * @ref https://developer.android.com/reference/android/database/sqlite/SQLiteDatabase
 * @ref https://www.apiref.com/android-zh/android/database/sqlite/SQLiteDatabase.html
 * @example
 * let db = new SQLiteUtil("/sdcard/A_My_DB/sqlite.db");
 * @param {*} filePath 地址
 */
export class SQLiteUtil {
  private _db_file_path: string

  constructor(file_path: string) {
    // 导入必要的 java class
    importClass(android.database.sqlite.SQLiteDatabase)
    importClass(android.content.ContentValues)

    this._db_file_path = file_path
  }

  /**
   * 根据 json 键值 快速建表
   *
   * (简便函数，如果你的需求很复杂，可以自己调用 execSQL)
   * @param {string} tableName 表名
   * @param {object} data json 数据 ,值没有实际意义，只是用来判断类型，示例：{ name: '', age : 0, online : false}
   * @param {string[] | undefined} uniqueArr 唯一，示例：["name"]
   */
  fastCreateTable(tableName: string, data: object, uniqueArr?: string[]) {
    const columnArr: string[] = []
    let itemName = ''

    // 拼接数据类型
    for (const key in data) {
      // this._log((typeof data[key])  + data[key])
      // 如果有其他类型需求，请使用 createTable
      switch (typeof data[key]) {
        case 'number':
          itemName = `${key} INTEGER DEFAULT 0`
          break
        case 'boolean':
          itemName = `${key} INTEGER DEFAULT 0`
          break
        default:
          itemName = `${key} TEXT DEFAULT ''`
          break
      }

      if (uniqueArr !== undefined && uniqueArr.includes(key)) {
        itemName += ' unique'
      }

      columnArr.push(itemName)
    }

    // 创建
    this.createTable(tableName, columnArr)
  }

  /**
   * 创建表
   *
   * (简便函数，如果你的需求很复杂，可以自己调用 execSQL)
   *
   * (默认添加一个 自增的 id 属性)
   * @param {string} tableName 表名
   * @param {string[]} columns 参数列名 数组，源码中会用 逗号拼接
   * @example
   * ("user_table",["name TEXT DEFAULT '' unique","count INTEGER DEFAULT 0"])
   */
  createTable(tableName: string, columns: string[]) {
    this._log('init', columns)
    try {
      // 创建目录
      files.ensureDir(this._db_file_path)
      // 创建表
      this.execSQL(`create table IF NOT EXISTS ${tableName}(id integer primary key autoincrement,${columns.join(',')})`)
    }
    catch (e) {
      this._error(`createTable error: ${e}`)
      throw new Error(e)
    }
  }

  /**
   * 查询
   *
   * (查询一条，请拼接 limit 1)
   * @example
   * db.find("select * from " + tableName + " where name='123'");
   * @param {string} sqlStr sql 字符串
   * @returns {object[]} json 数组
   */
  find(sqlStr: string) {
    this._log('find')
    let res: object[] = []
    let db: any

    try {
      db = this.getDBConnection()
      // 执行 sql ,并通过 游标 取出所有数据 ( 安卓返回值只有游标，不会直接返回数据 )
      res = this._getCursorDataArr(db.rawQuery(sqlStr, null))
    }
    catch (e) {
      this._error(`find error: ${e}`)
      throw new Error(e)
    }
    finally {
      db && db.close()
    }
    return res
  }

  /**
   * 插入
   *
   * @param tableName 表名
   * @param jsonObj json 数据对象，例子：{ name : "123", age : 1 }
   * @param nullColumnHack  可以不传，一般为 null 即可   https://www.iteye.com/blog/mofan-1412262
   * @returns 插入的行 ID，如果发生错误，则返回 -1
   */
  insert(tableName: string, jsonObj: object, nullColumnHack?: string): number {
    this._log('insert')
    let res = -1
    let db: any

    try {
      db = this.getDBConnection()
      db.beginTransaction()

      res = db.insert(tableName, nullColumnHack, this._getContentValues(jsonObj))

      db.setTransactionSuccessful() // 设置事务处理成功，不设置会自动回滚不提交。
    }
    catch (e) {
      this._error(`insert error: ${e}`)
      throw new Error(e)
    }
    finally {
      db && db.endTransaction()
      db && db.close()
    }
    return res
  }

  /**
   * 删除
   * @example
   * db.delete(tableName,"name=?",["1 名字"])
   * @param tableName 表名
   * @param whereClause where 条件
   * @param whereArgs where 条件的参数
   * @returns 如果传入 whereClause，则受影响的行数，否则为 0。要删除所有行并获得计数，请将“1”作为 whereClause。
   */
  delete(tableName: string, whereClause: string, whereArgs: any[]): number {
    this._log('delete')
    let res = 0
    let db: any

    try {
      db = this.getDBConnection()
      db.beginTransaction()

      res = db.delete(tableName, whereClause, whereArgs)

      db.setTransactionSuccessful() // 设置事务处理成功，不设置会自动回滚不提交。
    }
    catch (e) {
      this._error(`delete error: ${e}`)
      throw new Error(e)
    }
    finally {
      db && db.endTransaction()
      db && db.close()
    }
    return res
  }

  /**
   * 更新
   * @example
   * db.update(tableName,{"address":"哈哈哈"},"user_name=?",["13235919724"])
   * @param tableName 表名
   * @param jsonObj json 对象
   * @param whereClause where 条件
   * @param whereArgs where 条件的参数
   * @returns 受影响的行数
   */
  update(tableName: string, jsonObj: object, whereClause: string, whereArgs: any[]): number {
    this._log('update')
    let res = 0
    let db: any

    try {
      db = this.getDBConnection()
      res = db.update(tableName, this._getContentValues(jsonObj), whereClause, whereArgs)
    }
    catch (e) {
      this._error(`update error: ${e}`)
      throw new Error(e)
    }
    finally {
      db && db.close()
    }
    return res
  }

  /**
   * 替换数据库中一行的便捷函数。如果行不存在，则插入新行。
   *
   * !!!! 当表有一个 PRIMARY KEY 或 UNIQUE 索引才有意义
   * @example
   * https://blog.csdn.net/wangyanguiyiyang/article/details/51126590
   * @param tableName 表名
   * @param jsonObj json 对象
   * @param nullColumnHack 一般为 null 即可   https://www.iteye.com/blog/mofan-1412262
   * @returns 新插入的行的行 ID；如果发生错误，则返回 -1
   */
  replace(tableName: string, jsonObj: object, nullColumnHack?: string): number {
    let res = -1
    let db: any

    try {
      db = this.getDBConnection()
      res = db.replace(tableName, nullColumnHack, this._getContentValues(jsonObj))
    }
    catch (e) {
      this._error(`replace error: ${e}`)
      throw new Error(e)
    }
    finally {
      db && db.close()
    }
    return res
  }

  /**
   * 删除表
   * @param tableName 表名
   */
  dropTable(tableName: string) {
    try {
      this.execSQL(`drop table if exists ${tableName}`)
    }
    catch (e) {
      this._error(`dropTable error: ${e}`)
      throw new Error(e)
    }
  }

  /**
   * 清空表
   * @param tableName 表名
   */
  clearTable(tableName: string) {
    try {
      this.execSQL(`delete from ${tableName}`)
    }
    catch (e) {
      this._error(`clearTable error: ${e}`)
      throw new Error(e)
    }
  }

  /**
   * 表索引序列归 0
   * @param tableName 表名
   */
  resetTableSequence(tableName: string) {
    try {
      this.execSQL(`UPDATE sqlite_sequence SET seq = 0 WHERE name = '${tableName}'`)
    }
    catch (e) {
      this._error(`resetTableSequence error: ${e}`)
      throw new Error(e)
    }
  }

  /**
   * 执行 sql
   *
   * (无返回值，需要获取 数据、受影响行数、新增数据的 id、等，请使用 find insert update delete )
   * @param sqlStr
   */
  execSQL(sqlStr: string): void {
    let db: any

    try {
      db = this.getDBConnection()
      db.execSQL(sqlStr)
    }
    catch (e) {
      this._error(`execSQL error: ${e}`)
      throw new Error(e)
    }
    finally {
      db && db.close()
    }
  }

  /**
   * 执行 sql 并获取数量
   *
   * @example
   * select count(*) from user_table where id < 5
   * @param sql
   */
  getCount(sql: string) {
    let db: any
    let cursor: any

    try {
      db = this.getDBConnection()
      cursor = db.rawQuery(sql, null)
      cursor.moveToFirst()
      const count = cursor.getLong(0)
      return count
    }
    catch (e) {
      this._error(`getCount error: ${e}`)
      throw new Error(e)
    }
    finally {
      db && db.close()
      cursor && cursor.close()
    }
  }

  /**
   * 需要升级
   * @param newVersion  版本号 数字
   * @returns 如果新版本代码大于当前数据库版本，则返回 true。
   */
  needUpgrade(newVersion: number): boolean {
    let res = false
    let db: any

    try {
      db = this.getDBConnection()
      res = db.needUpgrade(newVersion)
    }
    catch (e) {
      this._error(`needUpgrade error:${e}`)
      throw new Error(e)
    }
    finally {
      db && db.close()
    }
    return res
  }

  /** 删除数据库文件 */
  deleteDbFile() {
    if (files.exists(this._db_file_path)) {
      files.remove(this._db_file_path)
      this._log(`数据库删除成功，地址:${this._db_file_path}`)
    }
  }

  /**
   * 获取 游标里的 数据
   *
   * @param cursor 游标
   * @returns json 数组
   */
  private _getCursorDataArr(cursor: any): object[] {
    const res: object[] = []

    if (cursor) {
      try {
        cursor.moveToFirst()

        this._log(`cursor count: ${cursor.getCount()}`)

        const columnNameArr = cursor.getColumnNames()

        if (cursor.getCount() > 0) {
          do {
            const resItem = {}

            for (let nameIndex = 0; nameIndex < columnNameArr.length; nameIndex++) {
              const nameItem = columnNameArr[nameIndex]
              const columnIndex = cursor.getColumnIndex(nameItem)

              if (columnIndex > -1) {
                let itemValue
                switch (cursor.getType(columnIndex)) {
                  case 0: // FIELD_TYPE_NULL 0
                    itemValue = null
                    break
                  case 1: // FIELD_TYPE_INTEGER 1
                    itemValue = cursor.getInt(columnIndex)
                    break
                  case 2: // FIELD_TYPE_FLOAT 2
                    itemValue = cursor.getFloat(columnIndex)
                    break
                  case 3: // FIELD_TYPE_STRING 3
                    itemValue = cursor.getString(columnIndex)
                    break
                  case 4: // FIELD_TYPE_BLOB 4
                    itemValue = cursor.getBlob(columnIndex)
                    break
                  default:
                    itemValue = cursor.getString(columnIndex)
                    break
                }
                resItem[nameItem] = itemValue
              }
            }

            res.push(resItem)
          } while (cursor.moveToNext())
        }
      }
      catch (e) {
        this._error(`_getCursorDataArr error: ${e}`)
        throw new Error(e)
      }
      finally {
        cursor && cursor.close()
      }
    }
    return res
  }

  /**
   * 获取 contentValues ( json 转 contentValues )
   *
   * @param jsonObj json 对象
   * @returns ContentValues 对象
   */
  private _getContentValues(jsonObj: object) {
    // @ts-expect-error aj java 类型
    const cv = new ContentValues()

    if (jsonObj) {
      for (const key in jsonObj) {
        const item = jsonObj[key]

        switch (typeof item) {
          case 'number':
            cv.put(key, java.lang.Integer(item))
            break
          case 'boolean':
            cv.put(key, java.lang.Boolean(item))
            break
          default:
            cv.put(key, java.lang.String(item))
            break
        }
      }
    }
    /**
            void put(java.lang.String,java.lang.Long)
            void put(java.lang.String,java.lang.Byte)
            void put(java.lang.String,java.lang.Double)
            void put(java.lang.String,java.lang.Float)
            void put(java.lang.String,java.lang.Integer)
            void put(java.lang.String,java.lang.Short)
     */
    return cv
  }

  private _log(...data: any[]) {
    console.log(data.join(' '))
  }

  private _error(msg: any) {
    console.error(msg)
  }

  /**
   * 获取 db 连接对象
   */
  private getDBConnection() {
    // @ts-expect-error aj java 类型
    return SQLiteDatabase.openOrCreateDatabase(this._db_file_path, null)
  }
}
