var express = require('express');
var generatePDF = require('./pdf/export');

var app = express();

app.get('/export', function (req, res) {
  console.log('generating pdf with params :', req.query);
  if (!req.query || !req.query.url) {
    return res.status(404).end('missing url param');
  }
  generatePDF(req.query.url, req.query.filename)
    .then(function(stream) {
      res.attachment(req.query.filename);
      stream.pipe(res);
      console.log('generated pdf with params :', req.query);
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json(err);
    });
});

app.listen(4005);
console.log('listening on port: ' + 4005);
