define(['marionette'], function(Marionette) {
  'use strict';

  var App = new Marionette.Application();

  App.addRegions({

  });

  App.on('initialize:after', function() {
    console.log('Application has started');
  });

  return App;
});
