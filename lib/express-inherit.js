"use strict";

// this is a supersimple module that lets us workaround the change in
// inheritance behaviour ticketed in
// https://github.com/visionmedia/express/pull/1394

var express = require('express');

module.exports = function () {
  var app = express();
  
  app.on('mount', function(parent){

    // inherit the views
    app.set('views', parent.get('views'));

    // inherit the locals
    app.locals( parent.locals );
  });

  return app;
};
