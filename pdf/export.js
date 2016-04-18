var fs = require('fs');
var node_path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var tmp = require('tmp');

var binPath = phantomjs.path;

module.exports = function(url, filename) {
  filename = filename || 'export.pdf';
  return new Promise(function(res, rej) {
    tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
      if (err) {
        return rej(err);
      }
      path = path + '/' + filename;
      var childArgs = [ node_path.join(__dirname, 'phantom_export.js'), url, path ]
      childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        if (err) {
          err.stdout = stdout;
          err.stderr = stderr;
          return rej(err);
        }
        res(fs.createReadStream(path));
      })
    });
  });
};
