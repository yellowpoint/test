const fs = require('fs');
let getAllUrl = require('./getAllUrl2.js');
async function getFiltrateData() {
  // .replace(/ /g, '')
  let aweme_list = await getAllUrl()
  let filtrateData = []
  aweme_list.forEach((item, index) => {
    filtrateData.push({
      title: `${index}_${item.desc.slice(0,4)}`,
      url: item.video.play_addr.url_list[0]
    })
  })
  console.log("TCL: filtrateData", filtrateData.length)
  fs.writeFileSync('filtrateData.json', JSON.stringify(filtrateData))
  return filtrateData
}
module.exports = getFiltrateData