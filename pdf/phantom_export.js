var system = require('system');
var args = system.args;

var page = new WebPage();
var url  =  args[1];
var path =  args[2];

// based on https://github.com/ariya/phantomjs/issues/12685
page.viewportSize = { width: 1238, height: 1763 };
page.paperSize = {width:'1238px', height:'1763px'};
page.settings.dpi = 100;

page.onError = function (msg, trace) {
  console.error(msg);
  trace.forEach(function(item) {
    console.error('  ', item.file, ':', item.line);
  });
  phantom.exit(-1);
};

page.open(url, function (status) {
  if (status === 'success') {
    setTimeout(function() {
      page.render(path);
      phantom.exit();
    }, 1000);
  } else {
    console.error('network error');
    phantom.exit(-1);
  }
});
