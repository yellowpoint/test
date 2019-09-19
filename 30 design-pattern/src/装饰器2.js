import { readonly } from 'core-decorators'

class Person{
  @readonly
  name(){
    return 'zz'
  }
}
let p = new Person
console.log(p.name())