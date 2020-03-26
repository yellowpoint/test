
// var re = /:\s*url\(([\S]*)\)/;
var re = /:\s*url\((?!'#)(\S*)\)/
var str = "background: url('../static/index/icon-save.png') no - repeat;"
// /static
var newstr = str.replace(re, ":url('#{$imgPrefix}$1')");
console.log(newstr);
var result = re.exec(str)
console.log('result', result)