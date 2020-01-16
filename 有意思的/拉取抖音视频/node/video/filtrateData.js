// 整理数据,筛选出所需要的数据
const fs = require('fs');
let getAllUrl = require('./getAllUrl.js/index.js');
async function getFiltrateData() {
  // .replace(/ /g, '')
  // 这里需要过滤标题中不能作为文件名保存的关键字
  let aweme_list = await getAllUrl()
  console.log("开始整理数据")
  let filtrateData = []
  aweme_list.forEach((item, index) => {
    filtrateData.push({
      title: `${index}_${item.desc.slice(0,4)}`,
      url: item.video.play_addr.url_list[0]
    })
  })
  console.log("整理数据完成，视频个数为：", filtrateData.length)
  fs.writeFileSync('filtrateData.json', JSON.stringify(filtrateData))
  return filtrateData
}
module.exports = getFiltrateData