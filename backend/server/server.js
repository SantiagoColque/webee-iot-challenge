'use strict';
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  return app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0', function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    var explorerPath = app.get('loopback-component-explorer')?.mountPath;
    if (explorerPath) console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
  });
};

boot(app, __dirname, function(err) {
  if (err) throw err;
  if (require.main === module) app.start();
});
