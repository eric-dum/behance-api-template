//REQUIREMENTS

//Utilities
var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var filesize = require('gulp-filesize');

//Scripting
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

//Styling
var less = require('gulp-less');
var sourceMap = require('gulp-sourcemaps');
var lesswatch = require('gulp-watch-less');

var rename = require('gulp-rename');

//Dev Tools
var browserSync = require('browser-sync').create();
var es = require('event-stream');

//On Error
var onError = function (err) {
  gutil.beep();
  console.log(err.toString());
  this.emit('end');
};



//TASKS

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  })
  browserSync.reload();
});


//Compile all less files into main less file and output minified css
gulp.task('less-main', function() {
  return gulp.src([
    'assets/vendor/bootstrap-3.3.6/less/bootstrap.less',

    //ADD VENDOR STYLESHEETS HERE
    'assets/vendor/font-awesome-4.6.3/less/font-awesome.less',

    //MAIN GLOBAL STYLESHEET
    'assets/less/global/theme.less'
  ])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sourceMap.init())
    .pipe(less( {compress : true} ))
    .pipe(concat('theme.min.css'))
    .pipe(sourceMap.write('maps/'))
    .pipe(gulp.dest('assets/less/global/'))
    .pipe(filesize())
    .pipe(browserSync.stream())
    .on('error', gutil.log);
});

gulp.task('less-inner', function() {
  return gulp.src([
    //MAIN GLOBAL STYLESHEET
    'assets/less/**/*.less',

    '!assets/less/global/**/*'
  ])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(less( {compress : true} ))
    .pipe(rename(
      function(file) {
        file.extname = '.min' + file.extname;
      }
    ))
    .pipe(gulp.dest('assets/less/'))
    .pipe(browserSync.stream())
    .on('error', gutil.log);
});


//Compile and concat framework and custom scripts into one file
gulp.task('scripts', function() {
  return gulp.src([
    'assets/vendor/jquery-2.2.3/jquery-2.2.3.min.js',
    'assets/vendor/bootstrap-3.3.6/js/bootstrap.js',

    //ADD VENDOR JAVASCRIPT HERE


    'assets/js/global/*.js'
  ])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(concat('theme.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/compiled/'))
    .pipe(filesize())
    .pipe(browserSync.stream())
    .on('error', gutil.log);
});


// Reload all Browsers
gulp.task('bs-reload', function () {
  browserSync.reload();
});

//Watch Task
//Watches less and js directories for change.
gulp.task('watch', function() {
  gulp.watch('*.html', ['bs-reload']);
  gulp.watch('assets/less/global/**/*.less', ['less-main']);
  gulp.watch('assets/less/**/*.less', ['less-inner']);
  gulp.watch('assets/js/*.js', ['scripts']);
});

//Build Task
gulp.task('build', ['less-main', 'less-inner', 'scripts']);

//Start work with project using the default "gulp" command
gulp.task('default', ['less-main', 'less-inner', 'scripts', 'browser-sync', 'watch']);




