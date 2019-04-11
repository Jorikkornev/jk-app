'use strict';
const smartGrid = require('smart-grid');
const gulp = require('gulp');
global.$ = {
  package: require('./package.json'),
  config: require('./gulp/config'),
  path: {
    task: require('./gulp/paths/tasks.js'),
    jsFoundation: require('./gulp/paths/js.foundation.js'),
    cssFoundation: require('./gulp/paths/css.foundation.js'),
    app: require('./gulp/paths/app.js')
  },
  gulp: require('gulp'),
  rimraf: require('rimraf'),
  //smartGrid : require('smart-grid'),
  browserSync: require('browser-sync').create(),
  gp: require('gulp-load-plugins')()
};

$.path.task.forEach(function(taskPath) {
  require(taskPath)();
});

gulp.task('smartgrid', smartGrid('source/style/common', $.config.smartset));

$.gulp.task('dev', $.gulp.series(
  'clean',

  $.gulp.parallel(
    'sass',
    'pug',
    'js:foundation',
    'js:process',
    'copy:image',
    'css:foundation',
    'sprite:svg',
    'fonts',
  ),
  $.gulp.parallel(
    'watch',
    'serve'
  )
));
