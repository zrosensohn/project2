const gulp = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const terser = require('gulp-terser');
const browswerSync = require('browser-sync').create();

var sassPaths = [
    'node_modules/foundation-sites/scss',
    'node_modules/motion-ui/src'
  ];

//Compile scss into css
function style() {
    // where is my scss
    return gulp.src('./scss/**/*.scss')
    // pass that file through sass compiler
    .pipe(sass({
        includePaths: sassPaths,
        outputStyle: 'compressed'
    })
    .on("error", sass.logError))
    //autoprefix things
    .pipe(prefix())
    // where do i save the compiled css
    .pipe(gulp.dest('./dist/css'))
    //minifiy css
    .pipe(cssnano())
    //set destination same as above so it overwrites
    .pipe(gulp.dest('./dist/css'))
    // stream changes to all browsers
    .pipe(browswerSync.stream());
}

function js() {
    //where are my js files
    return gulp.src('./js/*.js')
    // concatenate all files into main.js
    // can add an array of js files so that i can retain order if needed
    // concat([file1, file2, file3], outputFile)
    .pipe(concat('main.js'))
    //set destination
    .pipe(gulp.dest('./dist/js'))
    //minify js
    .pipe(terser())
    //set destination same as above is it overwrites
    .pipe(gulp.dest('./dist/js/'));
}

function watch() {
    browswerSync.init({
        server: "./"
    });
    
    gulp.watch("./scss/**/*.scss", style);
    gulp.watch("./*.html").on('change', browswerSync.reload);
    gulp.watch("./js/**/*.js").on("change", gulp.series([js, browswerSync.reload]));
}

exports.style = style;
exports.watch = watch;
exports.js = js;