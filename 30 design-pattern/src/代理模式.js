// 明星
let star = {
  name: '张三',
  age: 22,
  phone: '1111111'
}
// 经纪人
let agent = new Proxy(star, {
  get: (target, key) => {
    if (key === 'phone') {
      // 返回经纪人的号码
      return '222222'
    }
    if (key === 'price') {
      // 明星不报价，经纪人报价
      return 120000
    }
    // 其他的属性可正常返回
    return target[key]
  },
  set: (target, key, val) => {
    if(key === 'customPrice'){
      if(val<100000){
        // return '价格太低，滚'
        throw new Error('价格太低，滚')
        // return true
      }else{
        target[key] = val
        // return true
      }
    }
  }
})

