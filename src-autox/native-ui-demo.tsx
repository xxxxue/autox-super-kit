import { Color_Black, Color_Black2, Color_Red } from './utils/color'

export function init_native_ui() {
  const g_var = {
    text_size: '12sp',
    text_color: Color_Black,
    btn_text: '添加',
    text_size_big: '15sp',
    text_color_big: Color_Red,
    color_black: Color_Black2,
  }

  // 挂载到全局,防止被 TreeShaking 移除, 同时也会 固定名称,不被混淆
  // 可以写多个, 但会很麻烦, 全放在一个 g_var 中, 更舒服,
  // 在 ui 中一眼就知道是全局的变量
  globalThis.g_var = g_var

  ui.layout(
    <>
      <drawer id="my_id">
        <vertical>
          {/* 顶部 start */}
          <horizontal h="60" w="*" bg="{{g_var.color_black}}" gravity="center_vertical">
            <vertical w="auto" h="44" marginLeft="10">
              <horizontal h="22" gravity="vertical_center">
                <card w="auto" h="auto" margin="5 3 0 0" cardCornerRadius="5dp" cardBackgroundColor="#dbbb88" cardElevation="5dp" gravity="center" foreground="?selectableItemBackground">
                  <horizontal margin="5 0 5 0">
                    <text text="AutoX-Super-Kit" textColor="{{g_var.color_black}}" textStyle="bold" />
                  </horizontal>
                </card>
              </horizontal>
              <horizontal>
                <card w="auto" h="auto" margin="5 3 0 0" cardCornerRadius="5dp" cardBackgroundColor="{{g_var.color_black}}" cardElevation="5dp" gravity="center" foreground="?selectableItemBackground">
                  <horizontal margin="5 0 5 0">
                    <text textColor="#FFF68F" w="auto" marginRight="10" textSize="{{g_var.text_size}}" text="v1.0.0" />
                  </horizontal>
                </card>
              </horizontal>
            </vertical>
            <horizontal h="44" w="*" gravity="right">
              <card w="auto" h="auto" cardCornerRadius="40dp" cardBackgroundColor="#3b3b3b" gravity="center" foreground="?selectableItemBackground">
                <button id="btn_start_task" text="开始任务" textSize="{{g_var.text_size}}" w="auto" h="auto" style="Widget.AppCompat.Button.Colored" />
              </card>
              <button id="btn_more" text="更多" textSize="12sp" w="auto" h="44" style="Widget.AppCompat.Button.Borderless.Colored" />
            </horizontal>
          </horizontal>
          {/* 顶部 end */}
          <viewpager>
            <frame>
              <vertical gravity="top">
                {/* 第一页 start */}
                <vertical id="page_1">
                  <list id="list1" paddingBottom="50">
                    <card w="*" h="auto" margin="10 5" cardCornerRadius="10dp" cardElevation="5dp" gravity="center_vertical" marginTop="10">
                      <text w="*" gravity="center_horizontal">在空白处 点击 / 长按</text>
                      <horizontal padding="20sp">
                        <vertical>
                          <checkbox checked="{{this.id % 2 == 1}}" text="id:{{this.id}}" />
                          <checkbox id="checkbox_open" checked="{{this.panel_open}}" text="显示/隐藏" />
                        </vertical>
                        <vertical visibility="{{this.panel_open? 'visible' : 'gone'}}" padding="30 10 0 0">
                          <text text="{{this.id}}" textSize="{{g_var.text_size}}" />
                          <text bg="{{this.id % 2 == 0 ? '#FFC1C1' : '#FFF68F'}}" text="{{this.name}}" />
                          <text text="{{this.id  + this.name}}" />
                        </vertical>
                      </horizontal>
                      <View bg="{{this.panel_open ?'#00FF00':'#ff5722'}}" h="*" w="10" />
                    </card>
                  </list>
                </vertical>
                {/* 第一页 end */}
                {/* 第二页 start */}
                <vertical id="page_2" visibility="gone">
                  <vertical w="*" h="*">
                    <button id="btn_page_2_back_to_home" text="返回首页" textColor="white" h="auto" w="*" bg="#FF6A6A" textSize="10sp" />
                    <webview id="web" h="*" w="*" />
                  </vertical>
                </vertical>
                {/* 第二页 end */}
                {/* 第三页 start */}
                <vertical id="page_3" visibility="gone" h="*">
                  <linear gravity="center" padding="0 0" w="*">
                    <vertical w="*">
                      <vertical layout="center">
                        <button id="btn_add_top" text="top add" textAllCaps="false" textSize="{{g_var.text_size}}" w="*" h="50" style="Widget.AppCompat.Button.Colored"></button>
                        <button id="btn_add_bottom" text="bottom add" textAllCaps="false" textSize="{{g_var.text_size}}" w="*" h="50" style="Widget.AppCompat.Button.Colored"></button>
                        <text textSize="10sp" textColor="red" text="重要提示: 1234" gravity="center" />
                        <text textSize="10sp" textColor="red" text="1234" gravity="center" />
                        <text textSize="10sp" textColor="red" text="1234567890" gravity="center" />
                        {/* 分割线填充 */}
                        <vertical w="*" h="2" bg="#FF69B4" margin="0 5"></vertical>
                        <text textSize="15sp" textColor="red" text="数量:999999" gravity="center" />
                        {/* 分割线填充 */}
                        <vertical w="*" h="2" bg="#FF69B4" margin="0 5"></vertical>
                      </vertical>
                      <vertical layout="center">
                        <list id="list2">
                          <vertical w="*">
                            <linear bg="?selectableItemBackground" h="*">
                              <horizontal h="auto" margin="10">
                                <text text="{{this.id || ''}}" marginRight="10" />
                                <input text="{{this.name || ''}}" textColor="{{g_var.text_color}}" w="auto" marginRight="10" hint="-----账号-----" textSize="{{g_var.text_size}}" />
                                <input text="{{this.password || ''}}" textColor="{{g_var.text_color}}" w="auto" password="true" marginRight="10" hint="-----密码-----" textSize="{{g_var.text_size}}" />
                              </horizontal>
                            </linear>
                            {/* 分割线填充 */}
                            <vertical w="*" h="2" bg="#FF69B4" margin="0 5"></vertical>
                          </vertical>
                        </list>
                      </vertical>
                    </vertical>
                  </linear>
                </vertical>
                {/* 第三页 end */}
                {/* 第四页 start */}
                <vertical id="page_4" visibility="gone">
                  <linear gravity="center" padding="3 0">
                    <vertical>
                      <TextView id="textview_1" marginLeft="10dp" marginRight="10dp" singleLine="true" ellipsize="marquee" focusable="true" text="    温馨提示：  123456789123456789123456789123456789123456789123456789123456789123456789" textColor="#D65253" />
                      <horizontal gravity="top|center">
                        <vertical padding="8" h="auto" margin="30 30 30 30">
                          <input text="" hint="---在此处输入---" gravity="center" />
                        </vertical>
                      </horizontal>
                      <horizontal gravity="bottom|center">
                        <vertical>
                          <button id="btn_page_4_back_to_home" text="确定" textSize="16sp" h="60" w="150" margin="60 0 60 0" style="Widget.AppCompat.Button.Colored" />
                        </vertical>
                      </horizontal>
                    </vertical>
                  </linear>
                </vertical>
                {/* 第四页 end */}
                {/* 第五页 start */}
                <vertical id="page_5" visibility="gone">
                  <linear gravity="center" padding="0 0" w="*">
                    <vertical w="*">
                      <vertical layout="center">
                        <button id="btn_page_6_back_to_home" layout_weight="1" text="保存" textSize="15sp" w="*" h="60" bg="#FF7256" style="Widget.AppCompat.Button.Colored" />
                        <text textSize="17sp" textColor="red" text="重要提示: 修改完,请点击保存,否则不生效" gravity="center" />
                        {/* 分割线填充 */}
                        <vertical w="*" h="4" bg="#FF69B4" margin="0 5"></vertical>
                      </vertical>
                      <ScrollView w="*">
                        <vertical layout="center">
                          <linear gravity="center" padding="0 0" w="*">
                            <vertical>
                              <button text="测试按钮" visibility="gone" />
                              <checkbox text="checkbox 1" checked="false" textSize="{{g_var.text_size_big}}" textColor="{{g_var.text_color_big}}" />
                              <text textSize="{{g_var.text_size}}" textColor="red" text="--------------------------------------------" />
                              <checkbox text="checkbox 2" checked="true" textSize="{{g_var.text_size_big}}" textColor="{{g_var.text_color_big}}" />
                              <horizontal>
                                <text textSize="{{g_var.text_size}}" textColor="{{g_var.text_color}}" text="name: " />
                                <input text="" hint="--123123--" gravity="center" />
                              </horizontal>
                              <horizontal>
                                <text textSize="{{g_var.text_size}}" textColor="{{g_var.text_color}}" text="address: " />
                                <input text="" hint="--abc--" gravity="center" />
                              </horizontal>
                              <horizontal>
                                <Switch />
                              </horizontal>
                              <text textSize="{{g_var.text_size}}" textColor="red" text="--------------------------------------------" />
                              <horizontal>
                                <text textSize="{{g_var.text_size_big}}" textColor="{{g_var.text_color_big}}" text="☁️坚果云_备份: " />
                                <button text="打开帮助文档" />
                              </horizontal>
                              <horizontal>
                                <text textSize="{{g_var.text_size}}" textColor="{{g_var.text_color}}" text="账号: " />
                                <input text="" hint="--账号--" gravity="center" />
                              </horizontal>
                              <horizontal>
                                <text textSize="{{g_var.text_size}}" textColor="{{g_var.text_color}}" text="密码: " />
                                <input text="" hint="--密码--" gravity="center" />
                              </horizontal>
                              <horizontal>
                                <text textSize="{{g_var.text_size}}" textColor="{{g_var.text_color}}" text="备份名称: " />
                                <input text="" hint="--名称--" gravity="center" />
                              </horizontal>
                              <horizontal>
                                <button text="↑上传" />
                                <button text="↓下载" />
                              </horizontal>
                              <text textSize="{{g_var.text_size}}" textColor="red" text="--------------------------------------------" />
                              <checkbox text="自动打开开关" checked="false" textSize="{{g_var.text_size_big}}" textColor="{{g_var.text_color_big}}" />
                              <horizontal>
                                <text textSize="{{g_var.text_size}}" textColor="{{g_var.text_color}}" text="间隔 " />
                                <input text="24" hint="--小时--" gravity="center" />
                                <text textSize="{{g_var.text_size}}" textColor="{{g_var.text_color}}" text="小时后自动开启" />
                              </horizontal>
                              <horizontal>
                                <checkbox text="checkbox 1" checked="false" textSize="{{g_var.text_size}}" textColor="{{g_var.text_color}}" />
                                <checkbox text="checkbox 1" checked="false" textSize="{{g_var.text_size}}" textColor="{{g_var.text_color}}" />
                              </horizontal>
                              <horizontal>
                                <radio text="单选框" />
                              </horizontal>
                              <text textSize="{{g_var.text_size}}" textColor="red" text="--------------------------------------------" />
                              <checkbox text="允许运行的时间段" checked="false" textSize="{{g_var.text_size_big}}" textColor="{{g_var.text_color_big}}" />
                              <horizontal>
                                <input text="6" hint="--小时--" gravity="center" />
                                <text textSize="{{g_var.text_size}}" textColor="{{g_var.text_color}}" text=" - " />
                                <input text="24" hint="--小时--" gravity="center" />
                              </horizontal>
                              <horizontal>
                                <text textSize="{{g_var.text_size_big}}" textColor="{{g_var.text_color_big}}" text="刷新间隔: " />
                                <input text="30" hint="" gravity="center" />
                                <text textSize="{{g_var.text_size}}" textColor="{{g_var.text_color}}" text="秒" />
                              </horizontal>
                            </vertical>
                          </linear>
                        </vertical>
                      </ScrollView>
                    </vertical>
                  </linear>
                </vertical>
                {/* 第五页 end */}
                {/* 第六页 start */}
                <vertical id="page_6" visibility="gone">
                  <ScrollView>
                    <vertical gravity="bottom">
                      <button id="btn_page_5_back_to_home" layout_weight="1" text="返回首页" textSize="15sp" w="*" h="60" bg="#FF7256" style="Widget.AppCompat.Button.Colored" />
                      <button text="button 1" textAllCaps="false" textSize="{{g_var.text_size}}" w="*" h="60" style="Widget.AppCompat.Button.Colored" />
                      <button text="button 2" textAllCaps="false" textSize="{{g_var.text_size}}" w="*" h="60" style="Widget.AppCompat.Button.Colored" />
                      <button text="button 3" textAllCaps="false" textSize="{{g_var.text_size}}" w="*" h="60" style="Widget.AppCompat.Button.Colored" />
                      <button text="button 4" textAllCaps="false" textSize="{{g_var.text_size}}" w="*" h="60" style="Widget.AppCompat.Button.Colored" />
                      <button text="button 5" textAllCaps="false" textSize="{{g_var.text_size}}" w="*" h="60" style="Widget.AppCompat.Button.Colored" />
                      <button text="button 6" textAllCaps="false" textSize="{{g_var.text_size}}" w="*" h="60" style="Widget.AppCompat.Button.Colored" />
                      <button text="button 7" textAllCaps="false" textSize="{{g_var.text_size}}" w="*" h="60" style="Widget.AppCompat.Button.Colored" />
                    </vertical>
                  </ScrollView>
                </vertical>
                {/* 第六页 end */}
                {/* 第七页 start */}
                <vertical id="page_7" visibility="gone" w="*">
                  <button id="btn_page_7_back_to_home" layout_weight="1" text="返回首页" textSize="15sp" w="*" h="auto" bg="#FF7256" style="Widget.AppCompat.Button.Colored" />
                  <text text="---" textColor="#F75000" w="*" margin="5 0" textSize="15" gravity="center" />
                </vertical>
                {/* 第七页 end */}
              </vertical>
              {/* 右下悬浮按钮 */}
              <vertical gravity="bottom|right" marginTop="10">
                <card w="auto" h="auto" cardCornerRadius="20dp" cardBackgroundColor="#3b3b3b" gravity="center" foreground="?selectableItemBackground">
                  <vertical>
                    <vertical id="open_page_btn_panle" gravity="top|right" visibility="gone">
                      <button id="btn_open_page_1" text="Page 1" textAllCaps="false" h="auto" w="auto" bg="#FFA500" textColor="#ffffff" textStyle="bold" padding="0 5" />
                      <button id="btn_open_page_2" text="Page 2" textAllCaps="false" h="auto" w="auto" bg="#FFA500" textColor="#ffffff" textStyle="bold" padding="0 5" />
                      <button id="btn_open_page_3" text="Page 3" textAllCaps="false" h="auto" w="auto" bg="#FFA500" textColor="#ffffff" textStyle="bold" padding="0 5" />
                      <button id="btn_open_page_4" text="Page 4" textAllCaps="false" h="auto" w="auto" bg="#FFA500" textColor="#ffffff" textStyle="bold" padding="0 5" />
                      <button id="btn_open_page_5" text="Page 5" textAllCaps="false" h="auto" w="auto" bg="#FFA500" textColor="#ffffff" textStyle="bold" padding="0 5" />
                    </vertical>
                    <vertical gravity="bottom|right">
                      <button id="btn_toggle_open_page_btn_panle" text="展开" h="auto" w="auto" bg="#3d3d3f" textColor="#dbbb88" textStyle="bold" padding="0 5" />
                    </vertical>
                  </vertical>
                </card>
              </vertical>
            </frame>
          </viewpager>
        </vertical>
      </drawer>
    </>,
  )

  // 设置选中, 让文字开始滚动
  ui.textview_1.setSelected(true)

  /**
   * 页面名称
   */
  const page_arr = [
    'page_1',
    'page_2',
    'page_3',
    'page_4',
    'page_5',
    'page_6',
    'page_7',
  ]

  /** 切换页面的显示与隐藏 */
  function go_to_page(page_name: string) {
    for (let i = 0; i < page_arr.length; i++) {
      const item = page_arr[i]
      if (item === page_name) {
        ui_post(() => {
          ui[item].setVisibility(android.view.View.VISIBLE)
        })
      }
      else {
        ui_post(() => {
          ui[item].setVisibility(android.view.View.GONE)
        })
      }
    }
  }

  // 右下角 "展开" 按钮点击
  ui.btn_toggle_open_page_btn_panle.click(toggle_open_page_btn_panle)

  /** 切换 按钮文字 与 面板的显示与隐藏 */
  function toggle_open_page_btn_panle() {
    ui_post(() => {
      if (ui.btn_toggle_open_page_btn_panle.getText() === '展开') {
        ui.btn_toggle_open_page_btn_panle.setText('收起')
        ui.open_page_btn_panle.setVisibility(android.view.View.VISIBLE)
      }
      else {
        ui.btn_toggle_open_page_btn_panle.setText('展开')
        ui.open_page_btn_panle.setVisibility(android.view.View.GONE)
      }
    })
  }

  // #region 右下角 跳转 按钮点击

  ui.btn_open_page_1.click(() => {
    go_to_page('page_1')
    toggle_open_page_btn_panle()
  })

  ui.btn_open_page_2.click(() => {
    go_to_page('page_2')
    toggle_open_page_btn_panle()
  })

  ui.btn_open_page_3.click(() => {
    go_to_page('page_3')
    toggle_open_page_btn_panle()
  })

  ui.btn_open_page_4.click(() => {
    go_to_page('page_4')
    toggle_open_page_btn_panle()
  })

  ui.btn_open_page_5.click(() => {
    go_to_page('page_5')
    toggle_open_page_btn_panle()
  })

  // #endregion

  ui.btn_more.click(() => {
    go_to_page('page_6')
  })

  ui.btn_page_2_back_to_home.click(() => {
    go_to_page('page_1')
  })

  ui.btn_page_4_back_to_home.click(() => {
    go_to_page('page_1')
  })

  ui.btn_page_5_back_to_home.click(() => {
    go_to_page('page_1')
  })

  ui.btn_page_7_back_to_home.click(() => {
    go_to_page('page_1')
  })

  // 数据源 2
  const data_list2: { id?: number, name?: string, password?: string }[] = [
    {
      id: random(1, 1000),
      name: '小明',
      password: '123456',
    },
  ]

  ui.list2.setDataSource(data_list2)

  ui.btn_add_top.click(() => {
    data_list2.splice(0, 0, {
      id: random(1, 9999),
    })
  })

  ui.btn_add_bottom.click(() => {
    data_list2.push({
      id: random(1, 9999),
    })
  })

  // 数据源 1
  const data_list: { id?: number, name?: string, panel_open?: boolean }[] = [
    {
      id: random(1, 1000),
      name: '小明',
      panel_open: false,
    },
  ]

  // 绑定 listview 的数据源, 修改后直接通知刷新,界面就会改变
  ui.list1.setDataSource(data_list)

  // 查看 autojs java 对象中有哪些 key
  // log_aj_obj_keys(ui.list1.adapter)

  // ui.list1.adapter.notifyItemChanged(2)
  // ui.list1.adapter.notifyDataSetChanged()
  // ui.list1.adapter.notifyItemRangeChanged(1, 5)

  ui.btn_start_task.click(() => {
    data_list.push({
      id: random(1, 1000),
      name: `小明${random(1, 999)}`,
      panel_open: random(1, 999) % 2 === 0,
    })
  })

  // 监听 返回键
  ui.emitter.on('back_pressed', (e) => {
    e.consumed = true
    dialogs.confirm('确定要退出吗？').then((r) => {
      if (r) {
        events.removeAllListeners()
        threads.shutDownAll()
        ui.finish()
      }
    })
  })

  // 操作 list 中的组件
  ui.list1.on('item_bind', (itemView, itemHolder) => {
  // 给 list item 中的多选框绑定事件
    itemView.checkbox_open.on('click', () => {
      const index = itemHolder.position // 索引
      const item = itemHolder.item // 当前列表中的 item 数据

      const value = itemView.checkbox_open.checked // 多选框实时数据

      data_list[index].name = `小明${random(1, 999)}`
      data_list[index].panel_open = value

      ui.list1.adapter.notifyItemChanged(index) // 通知 list 刷新

      toast(JSON.stringify(item, null, 2))
    })
  })

  // list 空白处点击事件
  ui.list1.on('item_click', (item, index, linearView, ListView) => {
    const checked = linearView.checkbox_open.checked
    toast(`面板点击:index:${index},checkbox_open:${checked}`)
  })

  // list 长按
  ui.list1.on('item_long_click', (e, item, index, linearView, ListView) => {
    ui_run(() => {
      dialogs.select('请选择要执行的功能', [
        '打开 frame 7',
        'funtion 1',
        'funtion 2',
        'funtion 2',
        'funtion 3',
        'funtion 4',
        'funtion 5',
        'funtion 6',
        'funtion 7',
      ]).then((i) => {
        threads.start(() => {
          switch (i) {
            case 0:
              go_to_page('page_7')
              break
              // case 1:
              //   break
            default:
              dialogs
                .build({
                  title: '确认',
                  content: '12345\n确定[ xxxx ]吗?',
                  positive: '确定',
                  neutral: '取消',
                })
                .on('positive', () => {
                  toast('ok')
                })
                .show()
              break
          }
        })
      })
    })
  })

  function ui_post(func) {
    ui.post(func)
  }

  function ui_run(func) {
    return ui.run(func)
  }
}
