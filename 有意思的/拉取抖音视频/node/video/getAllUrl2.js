const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const devices = require('puppeteer/DeviceDescriptors')
const iPhone = devices['iPhone 6']
const fs = require('fs');

async function getAllUrl() {

  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.emulate(iPhone);
  // await page.goto('https://v.douyin.com/qKYSAt/');
  await page.goto('https://v.douyin.com/qKDN9n/');
  console.log('getAllUrl start')
  let aweme_list = []
  // 这个事件监听要放在下面那些await前面
  page.on('requestfinished', request => {
    // 查看所有请求地址
    if (request.resourceType() == "xhr") {
      // console.log("TCL: request", request.url())
      // 匹配所需数据的请求地址
      if (request.url().indexOf('v2/aweme/post') != -1) {
        (async () => {
          try {
            // 获取数据并转为json格式
            let res = await request.response();
            let result = await res.json();

            // 接口数据中找到需要的数据      
            aweme_list.push(...result.aweme_list)
            console.log("TCL: aweme_list", aweme_list.length)
          } catch (err) {
            console.log(err)
          }
        })()
      }
    }
  });
  await page.evaluate(async () => {
    // 这里面的作用域很奇怪，拿不到外面的变量
    function sleep(second) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(' enough sleep~');
        }, second);
      })
    }
    for (let y = 0; y <= 12693; y += 100) {
      await sleep(20);
      window.scrollTo(0, y)
    }
  })
  console.log('aweme_list', aweme_list.length)
  fs.writeFileSync('aweme_list.json', JSON.stringify(aweme_list))
  await browser.close();
  return aweme_list

}


module.exports = getAllUrl