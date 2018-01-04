const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

/*------------  Server  -------------*/
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

/*------------ Pug compile -------------*/
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/templates/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

/*------------ Styles compile -------------*/
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});

/*------------ Delete -------------*/
gulp.task('clean', function del(cb){
    return rimraf('build', cb);
});


/*------------ Copy fonts -------------*/
gulp.task('copy:fonts', function(){
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

/*------------ Copy images -------------*/
gulp.task('copy:images', function(){
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});

/*------------ Copy -------------*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));


/*------------ Watchers -------------*/
gulp.task('watch', function() {
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});

/*------------ Gulp default -------------*/
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'copy'),
    gulp.parallel('watch', 'server')
    )
);


