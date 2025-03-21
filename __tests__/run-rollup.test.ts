import { describe, it } from "vitest";
import { get_keep_identifier_name_arr, get_ui_block_code_arr } from "../scripts/lib/utils";

describe("提取 ui 中的关键字", () => {

  it("测试", ({ expect }) => {
    
    const code = `
    import { area } from "./myUtils";
    import debounce from "lodash-es/debounce";
    let te = "34we4r";
    ui.layout(
      <>
        <vertical>
          <button id="one">{{ABB.cdk.length>0?NickName:this.UserName.length>0?(ttt.qqPushMsg_DeviceNickName||'小明'):'-----'}}</button>
          <button id="three">{{te}}</button>
          <button id="three">()</button>
          <button id="three" textColor="{{MyColor}}">{{}}</button>
          <button id="two">{{LoginState!='平台已授权'?'#FF0000':'#00CD66'}}</button>
          <button id="two">{{Cfg.autoOpenTask_Hour||this.NickName}}</button>
          <button id="two">{{this.NickName||Cfg.autoOpenTask_Hour}}</button>
        </vertical>
      </>
    );
    `;

    const resArr = get_ui_block_code_arr(code);

    // console.log("提取出的代码:", resArr);
    const exArr = [
      ["ABB", "NickName", "ttt"],
      ["te"],
      ["MyColor"],
      ["LoginState"],
      ["Cfg"],
      ["Cfg"],
    ];

    for (let i = 0; i < resArr.length; i++) {
      const item = resArr[i];
      const data = get_keep_identifier_name_arr(item);
      // console.log("ast 结果:", data);
      expect(data).toEqual(exArr[i]);
    }

  });

});
