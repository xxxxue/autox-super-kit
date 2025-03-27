/**
 * 坚果云 文件 上传/下载
 *
 * 常用来备份 SQLite 数据库，多设备共享某个文件
 */
export class JianGuoYunUtil {
  folderName: string
  jgyHost: string
  header: object
  headerWithText: object
  fileName: string = ''
  authorizationStr: string

  /**
   * 初始化
   *
   * 账户和密码到官网创建 https://www.jianguoyun.com/#/safety
   * @param username 账户
   * @param password 应用密码
   * @param folderName 文件夹名称
   */
  constructor(username: string, password: string, folderName: string) {
    this.folderName = folderName

    this.jgyHost = `https://dav.jianguoyun.com/dav/${this.folderName}/`

    this.authorizationStr = `Basic ${this.__getBase64(`${username}:${password}`)}`

    this.header = {
      Authorization: this.authorizationStr,
    }

    this.headerWithText = {
      'Authorization': this.authorizationStr,
      'Content-Type': 'text/plain;charset=UTF-8',
    }

    this.__createFolder()
  }

  /**
   * 设置 操作的 fileName, 之后的方法不再需要传 fileName
   */
  public setThisFileName(fileName: string, fileExtension = 'txt') {
    this.fileName = `${fileName}.${fileExtension}`
  }

  /**
   * 读取文件夹的目录
   */
  public getFolderCatalog() {
    const httpResp = http.request(this.jgyHost, {
      method: 'PROPFIND',
      headers: this.header,
    })

    const retArr: string[] = []
    const xmlData = httpResp.body.string()

    if (xmlData) {
      const dataArr = xmlData.match(/<d:displayname>(.*?)<\/d:displayname>/g)

      for (let item of dataArr ?? []) {
        item = item.replace('<d:displayname>', '').replace('</d:displayname>', '')
        if (item !== this.folderName) {
          retArr.push(item)
        }
      }
    }

    return retArr
  }

  /**
   * 创建文件夹
   */
  private __createFolder() {
    const httpResp = http.request(this.jgyHost, {
      method: 'MKCOL',
      headers: this.header,
    })

    return httpResp.statusCode === 201
  }

  private __getThisFileName(fileName?: string) {
    // 参数有值则直接返回
    // 为空则取类变量
    if (fileName === undefined) {
      // 类变量不为空，则返回类变量，否则抛出异常
      if (this.fileName !== '') {
        fileName = this.fileName
      }
      else {
        throw new Error('当前必须传 fileName, 调用 setThisFileName 后，才可以不传 fileName')
      }
    }

    return fileName
  }

  /**
   * 删除一个文件
   * @param {string?} fileName 可空，需要提前调用 setThisFileName
   */
  public delete(fileName: string) {
    const ret = { isSuccess: false, msg: '删除失败' }

    try {
      fileName = this.__getThisFileName(fileName)

      let fileArr = this.getFolderCatalog()
      if (fileArr.includes(fileName)) {
        http.request(this.jgyHost + fileName, {
          method: 'DELETE',
          headers: this.header,
        })

        fileArr = this.getFolderCatalog()

        if (!fileArr.includes(fileName)) {
          ret.isSuccess = true
          ret.msg = '删除成功'
        }
        else {
          ret.msg = '删除失败，文件依然在目录中'
        }
      }
      else {
        ret.isSuccess = true
        ret.msg = '文件不存在，无需删除'
      }
    }
    catch (error) {
      ret.msg = error
    }
    return ret
  }

  /**
   * 获取 文本内容
   * @param {string?} fileName 可空，需要提前调用 setThisFileName
   */
  public getText(fileName?: string) {
    return this.downLoadFile(false, fileName)
  }

  /**
   * 获取 byte[] 内容
   * @param {string?} fileName 可空，需要提前调用 setThisFileName
   */
  public getFile(fileName?: string) {
    return this.downLoadFile(true, fileName)
  }

  /**
   * 上传文件 ( string )
   * @param {string} data 字符串内容
   * @param {string?} fileName 可空，需要提前调用 setThisFileName
   */
  public putText(data: string, fileName?: string) {
    const ret = { isSuccess: false, msg: '上传失败' }

    try {
      fileName = this.__getThisFileName(fileName)

      const httpResp = http.request(this.jgyHost + fileName, {
        method: 'PUT',
        headers: this.headerWithText,
        body: data,
      })

      if (httpResp.statusCode === 201 || httpResp.statusCode === 204) {
        ret.isSuccess = true
        ret.msg = '本地数据 上传到 坚果云 成功'
      }
    }
    catch (error) {
      ret.msg = error
    }
    return ret
  }

  /**
   * 下载文件
   * @param {boolean} isByteData true 返回 byte[], false 返回 string
   * @param {string?} fileName 可空，需要提前调用 setThisFileName
   */
  public downLoadFile(isByteData?: boolean, fileName?: string) {
    const ret = { isSuccess: false, msg: '获取失败' }

    try {
      fileName = this.__getThisFileName(fileName)

      const httpResp = http.get(this.jgyHost + fileName, {
        headers: this.header,
      })

      if (httpResp.statusCode === 404) {
        const strRes = httpResp.body.string()

        if (strRes.includes('doesn\'t exist') || strRes.includes('The file was deleted')) {
          ret.msg = `没有文件:${fileName}`
        }
      }
      else if (httpResp.statusCode === 200) {
        ret.isSuccess = true

        if (isByteData) {
          ret.msg = httpResp.body.bytes()
        }
        else {
          ret.msg = httpResp.body.string()
        }
      }
      else {
        ret.msg = `未知的状态码:${httpResp.statusCode}`
      }
    }
    catch (error) {
      ret.msg = `异常信息:${JSON.stringify(error)}`
    }
    return ret
  }

  /**
   * 上传文件  ( byte[] )
   *
   * 覆盖文件后，坚果云有 "文件历史", 可以恢复到任意版本
   * @param byteData 字节数组 ( files.readBytes(file_path) )
   * @param fileName  可空，需要提前调用 setThisFileName
   */
  public putFile(byteData: any[], fileName?: string) {
    const ret = { isSuccess: false, msg: '上传失败' }

    try {
      fileName = this.__getThisFileName(fileName)

      importPackage(Packages.okhttp3)
      importClass(com.stardust.autojs.core.http.MutableOkHttp)

      // autojs 封装的 http 有 bug, 会报错 ( 底层也是 okhttp ),
      // 所以这里自己调用 okhttp
      const client = new MutableOkHttp()
      const mediaType = MediaType.parse('application/octet-stream')
      const requestBody = RequestBody.create(mediaType, byteData)
      const request = new Request.Builder()
        .url(this.jgyHost + fileName)
        .put(requestBody)
        .header('Authorization', this.authorizationStr)
        .header('Content-Type', 'application/octet-stream')
        .header('Content-Length', byteData.length) // 设置文件大小
        .build()

      // 发送
      const response = client.newCall(request).execute()

      // console.log(Object.keys(response));
      // console.log(response.code());
      // 201 创建 / 204 覆盖
      if (response.code() === '201' || response.code() === '204') {
        ret.isSuccess = true
        ret.msg = '本地数据 上传到 坚果云 成功'
      }
    }
    catch (error) {
      ret.msg = error
    }
    return ret
  }

  /**
   * 获取 base64 结果
   */
  private __getBase64(str: string) {
    return java.lang.String(android.util.Base64.encode(java.lang.String(str).getBytes(), 2))
  }
}
