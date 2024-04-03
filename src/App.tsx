import { useState } from "react";
import "./App.css";
import m from "./assets/react.svg";
import j from "./assets/test.json";
import jpg from "./assets/head.jpg";
function App() {
  const [content, setContent] = useState<string>("");
  return (
    <>
      <img src={jpg} alt="" width={50} height={50} />
      <pre>
        {j.data}
        {j.name}
      </pre>
      <img src={m} alt="" />
      <div
        onClick={() => {
          // auto.invoke("ajFun3", "我是react", (a) => {
          //   alert("回调成功" + a);
          // });          
          // auto.execAjCode("files.read('/sdcard/test.txt')", (text: string) => {
          //   setContent(text);
          // });
          auto.invoke("ajFun4", ["我是web", true, 32], (r) => {
            // alert(`ajFun4 的返回值: ${typeof r}, ${JSON.stringify(r)}`);
            setContent(JSON.stringify(r, null, 2));
          });
        }}
      >
        点我asdf
      </div>

      <p>{content}</p>
    </>
  );
}

export default App;
