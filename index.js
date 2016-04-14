var express = require('express');
var generatePDF = require('./pdf/export');

var app = express();
app.set('port', process.env.PORT || 4005);

app.get('/export', function (req, res) {
  console.log('generating pdf with params :', req.query);
  if (!req.query || !req.query.url) {
    return res.status(404).end('missing url param');
  }
  generatePDF(req.query.url, req.query.filename)
    .then(function(stream) {
      res.attachment(req.query.filename);
      stream.pipe(res);
      console.log('generated pdf with params :');
      console.log(req.query);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).json(err);
    });
});

app.listen(app.get('port'));
console.info('listening on port: ' + app.get('port'));
