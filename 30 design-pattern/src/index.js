// class People {
//   constructor(name, age) {
//     this.name = name
//   }
//   getName() {
//     return this.name
//   }
//   eat() {
//     alert(`${this.name}在吃东西`)
//   }
//   speak() {
//     alert(`${this.name}在说话`)
//   }
// }


// class Student extends People {
//   constructor(name, age, number) {
//     super(name, age)
//     this.number = number
//   }
//   study(){
//     alert(`${this.name}的学号是${this.number}`)
//   }
// }

// const xiaoming = new Student('xiaoming',21,'55585')
// xiaoming.study()

// --------------------------

// // 车
// class Car {
//   constructor(num) {
//     this.num = num
//   }
// }

// // 摄像头
// class Camera {
//   shot(car) {
//     return {
//       num: car.num,
//       inTime: Date.now()
//     }
//   }
// }

// // 出口显示屏
// class Screen {
//   show(car, inTime) {
//     console.log('停车时间', Date.now() - inTime)
//     return Date.now() - inTime
//   }
// }

// // 停车场
// class Park {
//   constructor(floors) {
//     this.floors = floors || []
//     this.camera = new Camera()
//     this.screen = new Screen()
//     this.carList = {} //存储摄像头拍摄返回的车辆信息
//   } 
//   in (car) {
//     // 通过摄像头获取信息
//     const info = this.camera.shot(car)
//     // 停到某个车位
//     const i = parseInt(Math.random() * 100 % 100)
//     const place = this.floors[0].places[i]
//     place.in()
//     //此处可以判断每层的数量，给一个数量最少的，
//     // 不对啊，应该是 车停了之后才知道车位的啊
//     info.floor = 0
//     info.place = place
//     // 记录信息
//     this.carList[car.num] = info
//     console.log(`车牌号 ${car.num} 进入停车场`)
//   }
//   out(car) {
//     // 获取信息
//     const info = this.carList[car.num]
//     // 将停车位清空
//     const place = info.place
//     place.out()
//     // 显示时间
//     this.screen.show(car, info.inTime)
//     // 清空记录
//     delete this.carList[car.num]
//     console.log(`车牌号 ${car.num} 离开停车场`)
//   }
//   emptyNum() {
//     let nums = this.floors.map(f => {
//       return `第${f.index}层还有${f.emptyPlaceNum()}个剩余车位`
//     }).join('\n')
//     console.log(nums)
//     return nums
//   }
// }

// // 层
// class Floor {
//   constructor(index, places) {
//     this.index = index
//     this.places = places || []
//   }
//   emptyPlaceNum() {
//     let num = 0;
//     this.places.forEach(p => {
//       if (p.empty) {
//         num++
//       }
//     });
//     return num
//   }
// }

// // 车位
// class Place {
//   constructor() {
//     this.empty = true
//   } 
//   in () {
//     this.empty = false
//   }
//   out() {
//     this.empty = true
//   }
// }



// const floors = []
// for(let i = 0; i < 3; i++){
//   const place = []
//   for(let j = 0; j < 100; j++){
//     place[j] = new Place()
//   }
//   floors[i] = new Floor(i+1, place)
// }
// const park = new Park(floors)

// const car1 = new Car('aaa')
// const car2 = new Car('bbb')
// const car3 = new Car('ccc')

// // 应该还有个检查方法，在in之前，哦就是emptyNum，这就返回能不能停车

// park.emptyNum()
// park.in(car1)

// park.emptyNum()
// park.in(car2)

// park.out(car1)
// park.out(car2)


// park.emptyNum()
// park.in(car3)

// setTimeout(()=>{
//   console.log('第三辆车离开')
//   park.out(car3)
// },1000)


// 装饰器
// @testDec
// class Demo{

// }
// function testDec(target){
//   target.isDec = true
// }
// alert(Demo.isDec)


// 装饰器 用已有的库
// import { readonly,deprecate } from 'core-decorators'

// class Person{
//   @deprecate('即将废用') //废除提示
//   @readonly
//   name(){
//     return 'zz'
//   }
// }
// let p = new Person
// console.log(p.name())
// p.name = function(){

// }


// 状态模式开始

import StateMachine from 'javascript-state-machine'
import $ from 'jquery'

// 初始化状态机模型
let fsm = new StateMachine({
  init: '收藏',
  transitions: [{
      name: 'doStore',
      from: '收藏',
      to: '取消收藏'
    },
    {
      name: 'deleteStore',
      from: '取消收藏',
      to: '收藏'
    }
  ],
  methods: {
    //监听执行收藏
    onDoStore() {
      alert('收藏成功')
      updateText()
    },
    //监听取消收藏
    onDeleteStore() {
      alert('取消收藏成功')
      updateText()
    }
  }
})

let $btn = $('#btn1')
$btn.click(function(){
  if(fsm.is('收藏')){
    fsm.doStore()
  }else{
    fsm.deleteStore()
  }
})

// 更新文案
function updateText(){
  $btn.text(fsm.state)
}
// 初始化文案
updateText()

// 状态模式结束