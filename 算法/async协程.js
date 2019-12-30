 async function foo() {
   console.log(1)
   let a = await 100
   console.log(a)
   console.log(2)
 }
 console.log(0)
 foo()
 console.log(3)