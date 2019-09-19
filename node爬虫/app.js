var cheerio = require('cheerio');
var http = require('http');
var https = require('https');
var iconv = require('iconv-lite');

// var url = 'https://www.huxiu.com/article/216326.html';
// https.get(url, function(sres) {
//   var chunks = [];
//   sres.on('data', function(chunk) {
//     chunks.push(chunk);
//   });
//   // chunks里面存储着网页的 html 内容，将它zhuan ma传给 cheerio.load 之后
//   // 就可以得到一个实现了 jQuery 接口的变量，将它命名为 `$`
//   // 剩下就都是 jQuery 的内容了
//   sres.on('end', function() {
//     var titles = [];
//     //由于咱们发现此网页的编码格式为gb2312，所以需要对其进行转码，否则乱码
//     //依据：“<meta http-equiv="Content-Type" content="text/html; charset=gb2312">”
//     var html = iconv.decode(Buffer.concat(chunks), 'UTF-8');
//     var $ = cheerio.load(html, {decodeEntities: false});
//     $('.article-wrap .t-h1').each(function (idx, element) {
//       var $element = $(element);
//       titles.push({
//         title: $element.text()
//       })
//     })
//     console.log(titles);
//   });
// });

var index = 1; //页面数控制
var url = 'https://segmentfault.com/a/1190000005840672';
var data = []; //用于保存title

function getTitle(url, i) {
  console.log("正在获取第" + i + "页的内容");
  // https.get(url + i + '.html', function(sres) {
  https.get(url, function(sres) {
    var chunks = [];
    sres.on('data', function(chunk) {
      chunks.push(chunk);
    });
    sres.on('end', function() {
      var html = iconv.decode(Buffer.concat(chunks), 'UTF-8');
      var $ = cheerio.load(html, {decodeEntities: false});
      setTimeout(function(){
      	$('p').each(function (idx, element) {
        var $element = $(element);
        data.push({
          title: $element.text()
        	})
        })
        if(i < 1) {
        getTitle(url, ++index); //递归执行，页数+1
      } else {
        // console.log(JSON.stringify(data));
        console.log(data);

        console.log("Title获取完毕！");
      }
      },2000)




    });
  });
}

function main() {
  console.log("开始爬取");
  getTitle(url, index);
}

// setTimeout(function(){

// },2000)
main(); //运行主函数
