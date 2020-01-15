const fs = require('fs');
var Bagpipe = require('bagpipe');
let files = ['https://aweme.snssdk.com/aweme/v1/play/?video_id=v0200f3b0000boejbo6gnco1nprmfabg&line=0&ratio=540p&media_type=4&vr_type=0&improve_bitrate=0&is_play_url=1&is_support_h265=0&source=PackSourceEnum_PUBLISH', 'https://aweme.snssdk.com/aweme/v1/play/?video_id=v0200f6b0000bod8u39evctq96kl9jgg&line=0&ratio=540p&media_type=4&vr_type=0&improve_bitrate=0&is_play_url=1&is_support_h265=0&source=PackSourceEnum_PUBLISH']
var bagpipe = new Bagpipe(10);
for (var i = 0; i < files.length; i++) {
  bagpipe.push(fs.readFile, files[i], 'utf-8', function (err, data) {

  });
}