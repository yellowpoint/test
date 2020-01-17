const express = require('express')
const getVideo = require('./index.js')

var app = express();

app.use(express.static(__dirname + '/public')); // exposes index.html, per below

app.get('/getVideo', function (req, res) {
  let inputUrl = req.query.inputUrl
  console.log("TCL: inputUrl", inputUrl)
  res.send(getVideo(inputUrl));

});

app.listen(3000);