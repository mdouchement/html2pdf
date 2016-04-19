var fs = require('fs');
var node_path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var tmp = require('tmp');

var binPath = phantomjs.path;

/**
 * Calling export function with a filename that have no extension fails. 
 * So, we must ensure the file has a valid extension. To do that, we check if :
 * - the filename string contains the extension and this substring 
 * - the extension ends the string 
 *
 * hasExtention('test', '.pdf') 
 *   => false
 *
 * hasExtention('test.pdf.txt', '.pdf') 
 *   => false
 * 
 * hasExtention('.pdf', '.pdf') 
 *   => false
 * 
 * hasExtention(undefined, '.pdf') 
 *   => false
 * 
 * hasExtention('test.pdf', '.pdf') 
 *   => true
 * 
 * @param String filename 
 * @param String extension
 * @returns Boolean
 */
function hasExtention(filename, extension) {
  return filename.length > extension.length
    && filename.lastIndexOf(extension) >= 0 
    && filename.lastIndexOf(extension) + extension.length === filename.length;
}  

module.exports = function(url, filename) {
  filename = filename || 'export.pdf';
  filename = (hasExtention(filename, '.pdf'))
    ? filename
    : filename + '.pdf';

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
