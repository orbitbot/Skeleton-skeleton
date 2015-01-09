var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require("browser-sync");

var at = require('gulp-asset-transform');
var minifyCss = require('gulp-minify-css');

var paths = {
  distCss: 'dist/css/',
  fonts  : 'src/fonts/*.*',
  images : 'src/images/**',
  index  : 'src/index.html',
  less   : 'src/less/**'
};

gulp.task('at-build', function() {
  return gulp.src(paths.index)
    .pipe(at({
      css: {
        tasks: ['concat', plugins.size({ title: 'css', showFiles: true })]
      },
      less: {
        tasks: ['concat', plugins.less(), plugins.size({ title: 'less', showFiles: true})]
      }
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('copy-images', function() {
  return gulp.src(paths.images)
    .pipe(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(plugins.size({ title: 'images', showFiles: true }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(plugins.size({ title: 'fonts' }))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    port: '8080',
    logConnections: true,
    open: false
  });
});

gulp.task('watch', function() {
  gulp.watch([paths.less, paths.index], ['at-build']);
});

gulp.task('copy-assets', ['copy-images', 'copy-fonts']);
gulp.task('build', ['at-build', 'copy-assets']);
gulp.task('default', ['build', 'server', 'watch']);

gulp.task('minify', function() {
  gulp.src(paths.distCss + '*.css')
    .pipe(minifyCss())
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(plugins.size({ title: 'minified css', showFiles: true }))
    .pipe(gulp.dest(paths.distCss));
});