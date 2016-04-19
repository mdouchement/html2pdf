var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var tmp = require('tmp');

var binPath = phantomjs.path;

module.exports = function(url) {
  return new Promise(function(res, rej) {
    tmp.dir(function _tempDirCreated(err, tmpDir) {
      if (err) {
        return rej(err);
      }
      tmpFile = tmpDir + '/tmpName.pdf';
      var childArgs = [ path.join(__dirname, 'phantom_export.js'), url, tmpFile ];
      childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        if (err) {
          err.stdout = stdout;
          err.stderr = stderr;
          return rej(err);
        }
        res(fs.createReadStream(tmpFile));
      })
    });
  });
};
