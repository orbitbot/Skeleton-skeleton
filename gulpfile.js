var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require("browser-sync");

var at = require('gulp-asset-transform');
var minifyCss = require('gulp-minify-css');

var paths = {
  fonts  : 'src/fonts/*.*',
  images : 'src/images/**',
  index  : 'src/index.html',
  less   : 'src/less/**'
};

gulp.task('at-build', function() {
  return gulp.src(paths.index)
    .pipe(at({
      css: {
        stream: function(filestream, outputFilename){
            return filestream
                .pipe(plugins.size({ title: 'css', showFiles: true }))
                .pipe(gulp.dest('dist/'))
                .pipe(minifyCss())
                .pipe(plugins.rename({ suffix: '.min' }))
                .pipe(plugins.size({ title: 'minfied css', showFiles: true}))
                .pipe(gulp.dest('dist/'));
        }
      },
      less: {
        stream: function(filestream, outputFilename){
            return filestream
                .pipe(plugins.less())
                .pipe(plugins.size({ title: 'less', showFiles: true }))
                .pipe(gulp.dest('dist/'))
                .pipe(minifyCss())
                .pipe(plugins.rename({ suffix: '.min' }))
                .pipe(plugins.size({ title: 'minfied less', showFiles: true}))
                .pipe(gulp.dest('dist/'));
        }
      }
    }))
    .pipe(gulp.dest('dist/')) // required for index.html file
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