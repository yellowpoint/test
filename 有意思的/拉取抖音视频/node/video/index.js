const getUrl = require('./getUrl.js');
const getFiltrateData = require('./filtrateData.js');
const downloadVideo = require('./download.js');
const config = require('./config');

(async () => {

  let filtrateData = await getFiltrateData()
  for (let i = 0; i < filtrateData.length; i++) {
    // 获取实际视频下载地址
    let video = await getUrl(filtrateData[i])
    if (config.isDownload) {
      downloadVideo(video)
    }
  }

})()