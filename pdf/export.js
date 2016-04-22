var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var tmp = require('tmp');

tmp.setGracefulCleanup();
var binPath = phantomjs.path;

module.exports = function(url) {
  return new Promise(function(res, rej) {
    tmp.file(function _tempFileCreated(err, tmpFile) {
      if (err) {
        return rej(err);
      }
      var childArgs = [ path.join(__dirname, 'phantom_export.js'), url, tmpFile ];
      childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        console.log('stdout', stdout);
        console.log('stderr', stderr);
        if (err) {
          err.stdout = stdout;
          err.stderr = stderr;
          return rej(err);
        }
        fs.access(tmpFile, fs.F_OK, function(err) {
          if (err) {
            return rej(err);
          }
          res(fs.createReadStream(tmpFile));
        });
      });
    });
  });
};
