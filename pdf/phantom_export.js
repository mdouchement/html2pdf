var system = require('system');
var args = system.args;

var page = new WebPage();
var url  =  args[1];
var path =  args[2];

// based on https://github.com/ariya/phantomjs/issues/12685
page.viewportSize = { width: 1238, height: 1763 };
page.paperSize = {width:'1238px', height:'1763px'};
page.settings.dpi = 100;

function waitForAjax(cb) {
  var intervalId = setInterval(function() {
    var loaded = page.evaluate(function() {
      return !Boolean(jQuery) || !Boolean(jQuery.active);
    });
    if (loaded) {
      cb();
    }
  }, 2000)
}

page.onError = function (msg, trace) {
  console.error(msg);
  trace.forEach(function(item) {
    console.error('  ', item.file, ':', item.line);
  });
  phantom.exit(1);
};

page.onResourceError = function(resourceError) {
  console.error('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
  console.error('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
  phantom.exit(1);
};

page.onResourceTimeout = function(request) {
  console.error('Response (#' + request.id + '): ' + JSON.stringify(request));
  phantom.exit(1);
};

page.open(url, function (status) {
  if (status === 'success') {
    waitForAjax(function() {
      setTimeout(function() {
        page.render(path, { format: 'pdf' });
        phantom.exit();
      }, 500);
    });
  } else {
    console.error('network error', url);
    phantom.exit(1);
  }
});
