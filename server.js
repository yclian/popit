"use strict";

/**
 * Module dependencies.
 */

var connect        = require('connect'),
    config         = require('config'),
    winston        = require('./lib/popit_winston'),
    hosting_app    = require('./hosting-app/app'),
    utils          = require('./lib/utils'),
    format         = require('util').format,
    instance_app   = require('./instance-app/app');

connect(
  // match the hosting app host...
  connect.vhost(config.hosting_server.host, hosting_app),

  // ...or fall through to the instance app
  instance_app
)
.listen(config.server.port);

winston.info( 'started at: ' + new Date() );
winston.info(
  format(
    "PopIt hosting and instance apps started: http://%s:%s",
    config.hosting_server.host,
    config.server.port
  )
);

utils.checkDatabaseConnection();
