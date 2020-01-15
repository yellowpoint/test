const fs = require('fs');
const http = require('http');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors')
const iPhone = devices['iPhone 6']
var url = "https://aweme.snssdk.com/aweme/v1/play/?video_id=v0200f3b0000boejbo6gnco1nprmfabg&line=0&ratio=540p&media_type=4&vr_type=0&improve_bitrate=0&is_play_url=1&is_support_h265=0&source=PackSourceEnum_PUBLISH";

async function getPic() {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(iPhone);
  await page.goto(url);
  await page.waitFor(1000);
  await page.screenshot({
    path: 'google.png'
  });
  const result = await page.evaluate(() => {
    let title = document.querySelector('source').src;
    return title
  });
  await browser.close();
  return result;
}
// getPic().then((value) => {
//   console.log(value);
// });

function getVideoData(url, encoding) {
  return new Promise((resolve, reject) => {
    let req = http.get(url, function (res) {
      let result = ''
      encoding && res.setEncoding(encoding)
      res.on('data', function (d) {
        result += d
      })
      res.on('end', function () {
        resolve(result)
      })
      res.on('error', function (e) {
        reject(e)
      })
    })
    req.end()
  })
}
const config = {
  savePath: './'
}
let video = {
  title: '抖音',
  src: 'http://v26-dy.ixigua.com/c48c60875d62d365e637832ea66d31a2/5e1ec7aa/video/tos/cn/tos-cn-ve-15/2c1190f401784b8a9e6ac57fc37c3524/?a=1128&br=1250&bt=625&cr=0&cs=0&dr=0&ds=6&er=&l=202001151504240100140400290A21C54A&lr=&qs=0&rc=amRwczRmanJtcjMzZWkzM0ApN2Q5ZThpOzw6N2UzOTs5NmdfY29rbGszX2JfLS0wLS9zcy0vNDE2YTBgNTMuY2JeY2M6Yw%3D%3D'
}

async function downloadVideo(video) {
  // 判断视频文件是否已经下载
  if (!fs.existsSync(`${config.savePath}/${video.title}.mp4`)) {
    await getVideoData(video.src, 'binary').then(fileData => {
      console.log('下载视频中：', video.title)
      savefileToPath(video.title, fileData).then(res =>
        console.log(`${res}: ${video.title}`)
      )
    })
  } else {
    console.log(`视频文件已存在：${video.title}`)
  }
}

function savefileToPath(fileName, fileData) {
  let fileFullName = `${config.savePath}/${fileName}.mp4`
  return new Promise((resolve, reject) => {
    fs.writeFile(fileFullName, fileData, 'binary', function (err) {
      if (err) {
        console.log('savefileToPath error:', err)
      }
      resolve('已下载')
    })
  })
}

downloadVideo(video)