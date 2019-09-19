// Adaptee 被适配者
class Adaptee{
  specificRequest(){
    return '德国标准接头'
  }
}
class Target{
  constructor(){
    this.adaptee = new Adaptee()
  }
  request(){
    let info = this.adaptee.specificRequest()
    return `${info} - 转换器 - 中国标准插头`
  }
}

// 测试
let target = new Target()
console.log(target.request())
// hello world
// split
// slice 
// splice