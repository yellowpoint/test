var request = require("request"); // request是用来请求数据
var cheerio = require("cheerio"); // cherrio是用jquery的语法来解析html

// var url = "http://got001.com/resource.html?code=1Obv44";
// var url = "http://v27-dy.ixigua.com/33508f36382781e36e03d32d03ce5315/5e1db627/video/tos/cn/tos-cn-ve-15/2c1190f401784b8a9e6ac57fc37c3524/?a=1128&br=1250&bt=625&cr=0&cs=0&dr=0&ds=6&er=&l=2020011419372501001203410114265B9E&lr=&qs=0&rc=amRwczRmanJtcjMzZWkzM0ApN2Q5ZThpOzw6N2UzOTs5NmdfY29rbGszX2JfLS0wLS9zcy0vNDE2YTBgNTMuY2JeY2M6Yw%3D%3D";
var url = 'https://game.51app.cn/index'
request(url, function (error, response, body) {
  if (!error && response.statusCode === 200) {

    var $ = cheerio.load(body);
    // $('[type="ed2k"]').each(function () {

    console.log("TCL: $('.btn-download')", $('.pc-index'))
    // $('.btn-download').each(function () {
    //   var link = $(this).attr('href');
    //   if (typeof (link) != 'undefined') {
    //     console.log(link);
    //   }
    // });
  }

});