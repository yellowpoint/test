// 获取视频实际下载链接
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

const getUrl = async (item) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto(item.url);
  // await page.waitFor(1000);
  // await page.screenshot({
  //   path: 'google.png'
  // });
  const result = await page.evaluate((item) => {
    let url = document.querySelector('source').src;
    return {
      title: item.title,
      url
    }
  }, item);
  await browser.close();
  return result;
}

module.exports = getUrl