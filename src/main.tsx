import { area } from "./myUtils";
import debounce from "lodash-es/debounce";
let te = "ffff";
ui.layout(
  <>
    <vertical>
      <button id="one">{{ te }}</button>
      <button id="two">22</button>
      <button id="three">()</button>
    </vertical>
  </>
);

floaty.window(
  <>
    <vertical>
      <button id="one">11</button>
      <button id="two">22</button>
      <button id="three">33</button>
    </vertical>
  </>
);

floaty.rawWindow(
  <>
    <vertical>
      <button id="one">1</button>
      <button id="two">2</button>
      <button id="three">3</button>
    </vertical>
  </>
);

let db = debounce(() => {
  console.log(123);
}, 2000);
// for (let i = 0; i < 3; i++) {
//   ui.layout(
//     <>
//       <linear id="container"></linear>
//     </>
//   );
//   let textView = ui.inflate(
//     <>
//       <text textColor="#000000" textSize="14sp" />
//     </>,
//     ui.container
//   );
//   textView.attr("text", "文本控件" + i);
//   ui.container.addView(textView);
// }

function test4443() {
  ui.layout(
    <>
      <linear id="container"></linear>
    </>
  );

  for (let i = 0; i < 3; i++) {
    let textView = ui.inflate(
      <>
        <text textColor="#000000" textSize="14sp" />
      </>,
      ui.container
    );
    textView.attr("text", "文本控件" + i);
    ui.container.addView(textView);
  }
}

function test99() {
  floaty.window(
    <>
      <vertical>
        <button id="one">11</button>
        <button id="two">22</button>
        <button id="three">33</button>
      </vertical>
    </>
  );

  function name() {
    floaty.rawWindow(
      <>
        <vertical>
          <button id="one">1</button>
          <button id="two">2</button>
          <button id="three">3</button>
        </vertical>
      </>
    );
  }
}

ui.one.click(() => {
  main();
});
ui.three.click(() => {
  toast("ddddd");
});

let getText = (a: string = "默认值") => {
  return "autox " + a;
};
let sss = (a: { user?: { name?: string; age?: number } }) => {
  let b = a.user?.age ?? 0;
  let d = { ...a, path: "123" };
  let c = 2 ** 10;
};

function test1() {
  let name = "ren";
  let age = 12;
  let myself = {
    name,
    age,
    say() {
      console.log(this.name);
    },
  };
  console.log(myself); //{name:'ren',age:12,say:fn}
  myself.say(); //'ren'
}

function test2() {
  let obj = { name: "ren", age: 12 };
  let person = { ...obj };
  console.log(person); //{name:'ren',age:12}
  obj == person; //false
  let another = { sex: "male" };
  let someone = { ...person, ...another }; //合并对象
  console.log(someone); //{name:'ren',age:12,sex:'male'}
}

function test3() {
  function add(a = 1, b = 2) {
    return a + b;
  }
  add(); //3
  add(2); //4
  add(3, 4); //7
  function add2(...num) {
    return num.reduce(function (result, value) {
      return result + value;
    });
  }
  add2(1, 2, 3, 4); //10

  let add3 = (a, b) => {
    return a + b;
  };
  let print = () => {
    console.log("hi");
  };
  let fn = (a) => a * a;
}

function main() {
  toast(area(1));
}

class Ex {
  name: string;
  say: () => void;
  constructor(name: string) {
    this.name = name;
    this.say = () => {
      console.log(this.name);
    };
  }
  methods() {
    console.log("hello " + this.name);
  }
  static a = 123;
  static m = () => {
    console.log(this.a);
  };
}
//let ex = class{}  字面量方式
var example = new Ex("ren");
example.say(); //'ren'
Ex.m(); //123
example.methods(); //'hello ren'

class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  say() {
    console.log(this.name + ":" + this.age);
  }
}
class Student extends Person {
  sex: string;
  constructor(name: string, age: number, sex: string) {
    super(name, age);
    this.sex = sex;
  }
}
var student = new Student("ren", 12, "male");
student.name; //'ren'
student.sex; //'male'
student.say(); //'ren:12'

async function test444() {
  return new Promise((r, re) => {
    r("1231231231eqweqweqe345345345");
  });
}

function main2() {
  async function name() {
    let res = await test444();

    console.log(res);
  }
  name();
}

main2();
test444().then((r) => {
  console.log("then",r);
});

