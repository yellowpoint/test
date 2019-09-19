class Circle {
  constructor() {

  }
  draw(){
    console.log('画一个圆形')
  }
}
class Decorator{
  constructor(circle){
    this.circle = circle
  }
  draw(){
    this.circle.draw()
    this.draw2()
  }
  draw2(){
    console.log('画两个圆形')
  }
}

// 测试
let circle = new Circle()
circle.draw()

let dec = new Decorator(circle)
dec.draw()