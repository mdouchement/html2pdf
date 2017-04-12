var system = require('system');
var args = system.args;

var page = new WebPage();
var url  =  args[1];
var path =  args[2];
var orientation = args[3] || 'portrait';
var format = args[4] || 'A4';

page.paperSize = {
  format: format,
  orientation: orientation
};

function onReady() {
  setTimeout(function() {
    page.render(path, { format: 'pdf' });
    phantom.exit();
  }, 1000);
}

page.onError = function(msg, trace) {
  console.error(msg);
  trace.forEach(function(item) {
    console.error('  ', item.file, ':', item.line);
  });
  phantom.exit(1);
};

page.onResourceError = function(resourceError) {
  console.error('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
  console.error('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
};

page.onResourceTimeout = function(request) {
  console.error('Response (#' + request.id + '): ' + JSON.stringify(request));
  phantom.exit(1);
};

page.onCallback = function(data) {
  if (data.event && data.event === 'loaded') {
    onReady();
  }
};

page.open(url, function (status) {
  if (status !== 'success') {
    console.error('network error', url);
    phantom.exit(1);
  } else {
    var isAsyncApp = page.evaluate(function() {
      return Boolean(window.phantomWaitForCallback);
    });
    if (!isAsyncApp) {
      onReady();
    }
  }
});
