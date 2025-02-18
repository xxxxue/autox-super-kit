import { getKeepVarNameArr, getUiBlockCodeArr  } from "../scripts/myUtils";
import { describe, it } from 'vitest';
describe('提取ui中的关键字', () => {

  it("测试", ({ expect }) => {


    let code = `
    import { area } from "./myUtils";
    import debounce from "lodash-es/debounce";
    let te = "34we4r";
    ui.layout(
      <>
        <vertical>
          <button id="one">{{ABB.cdk.length>0?NickName:this.UserName.length>0?(ttt.qqPushMsg_DeviceNickName||'小可爱'):'-----'}}</button>
          <button id="three">{{te}}</button>
          <button id="three">()</button>
          <button id="three" textColor="{{MyColor}}">{{}}</button>
          <button id="two">{{LoginState!='平台已授权'?'#FF0000':'#00CD66'}}</button>
          <button id="two">{{Cfg.autoOpenTask_Hour||this.NickName}}</button>
          <button id="two">{{this.NickName||Cfg.autoOpenTask_Hour}}</button>
        </vertical>
      </>
    );
    `

    let resArr = getUiBlockCodeArr(code)
    // console.log("提取出的代码:", resArr);

    let exArr = [
      ['ABB', 'NickName', 'ttt'],
      ['te'],
      ['MyColor'],
      ['LoginState'],
      ['Cfg'],
      ['Cfg'],
    ]

    for (let i = 0; i < resArr.length; i++) {
      let item = resArr[i];
      let data = getKeepVarNameArr(item)
      // console.log("ast结果:", data);
      expect(data).toEqual(exArr[i])
    }
  })
});