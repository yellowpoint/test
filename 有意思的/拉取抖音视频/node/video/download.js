const fs = require('fs');
const http = require('http');
const sourceUrl = "https://aweme.snssdk.com/aweme/v1/play/?video_id=v0200f3b0000boejbo6gnco1nprmfabg&line=0&ratio=540p&media_type=4&vr_type=0&improve_bitrate=0&is_play_url=1&is_support_h265=0&source=PackSourceEnum_PUBLISH";

const config = {
  savePath: './output'
}
let getUrl = require('./getUrl.js');
let getFiltrateData = require('./filtrateData.js');


(async () => {

  let filtrateData = await getFiltrateData()
  for (let i = 0; i < filtrateData.length; i++) {
    let video = await getUrl(filtrateData[i])
    downloadVideo(video)
  }

})()

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


async function downloadVideo(video) {
  // 判断视频文件是否已经下载
  if (!fs.existsSync(`${config.savePath}/${video.title}.mp4`)) {
    await getVideoData(video.url, 'binary').then(fileData => {
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