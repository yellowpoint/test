const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const devices = require('puppeteer/DeviceDescriptors')
const iPhone = devices['iPhone 6']
const fs = require('fs');

(async () => {

  const getUrl = async (sourceUrl) => {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto(sourceUrl);
    // await page.waitFor(1000);

    //定义页面内容及Jquery
    var content, $;
    /* 页面滚动方法 */
    async function scrollPage(i) {

      content = await page.content();
      $ = cheerio.load(content);
      /*执行js代码（滚动页面）*/
      
      await page.evaluate(() => {
        console.log('dadsads')
        let i = 10
        // console.log('iii', i)
        /* 这里做的是渐进滚动，如果一次性滚动则不会触发获取新数据的监听 */
        for (let y = 0; y <= 1000 * i; y += 100) {
          window.scrollTo(0, y)
        }
      })
      // 获取数据列表
      const li = $($('#pagelet-worklist').find('ul')[0]).find('li')
      console.log('dddd', li.length)
      return li
    }

    let i = 0
    let li = await scrollPage(++i)
    //如果数据列表 不够30 则一直获取
    while (li.length < 30) {
      li = await scrollPage(++i)
    }
    let data = {
      list: []
    }

    /* 封装返回的数据*/
    li.map(function (index, item) {
      $(item).find('cover').attr('data-src') != undefined ?
        data.list.push({
          src: $(item).find('cover').attr('data-src'),
          like: $($(item).find('.digg-num')).text()
        }) : ''
    })
    //顺手存入本地文件
    fs.writeFileSync('tt.JSON', JSON.stringify(data))
    fs.writeFileSync('tt.html', content)


    await browser.close();
    return data;
  }
  getUrl('https://v.douyin.com/qKYSAt/')
  module.exports = getUrl

})()