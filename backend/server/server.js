'use strict';
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  var server = app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0', function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    var explorerPath = app.get('loopback-component-explorer')?.mountPath;
    if (explorerPath) console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
  });

  // Manejar señales de terminación para Docker
  process.on('SIGTERM', function() {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(function() {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', function() {
    console.log('SIGINT received, shutting down gracefully...');
    server.close(function() {
      console.log('Server closed');
      process.exit(0);
    });
  });

  return server;
};

boot(app, __dirname, function(err) {
  if (err) throw err;
  if (require.main === module) app.start();
});
