import gulp from 'gulp';
import babel from 'gulp-babel';
import plumber from 'gulp-plumber';
import filter from 'gulp-filter';
import pug from 'gulp-pug';
import concat from 'gulp-concat';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';

const isProduction = false;
const babelOpts = {presets: ['es2015'], compact: isProduction};
const pugOpts = { data: {}, pretty: (!isProduction), compileDebug: true };
const sassOpts = { includePaths: [], outputStyle: isProduction ? 'compressed':'nested' };

gulp.task('project', () => {
    gulp.src('./src/*.es6')
        .pipe(plumber())
        .pipe(babel(babelOpts))
        .pipe(gulp.dest('./'))
});

gulp.task('webHtml', () => {
    gulp.src('./src/html/**/*.pug')
        .pipe(filter(file => !/\/_/.test(file.path) && !/^_/.test(file.relative)))
        .pipe(plumber())
        .pipe(pug(pugOpts))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('webJs', () => {
    gulp.src('./src/js/**/*.es6')
        .pipe(plumber())
        .pipe(concat('main.es6'))
        .pipe(babel(babelOpts))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('webCss', () => {
    gulp.src(`./src/css/main.scss`)
        .pipe(sass(sassOpts).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['ff >= 4', 'Chrome >= 19', 'ie >= 9'], cascade: false}))
        .pipe(gulp.dest('./dist/css/'));
});
gulp.task('build', ['webHtml','webJs','webCss']);

gulp.task('default', () => {
    gulp.watch('./src/*.es6', ['project']);
    gulp.watch('./src/css/**/*.scss', ['webCss']);

    gulp.watch('./src/html/**/*.pug', ['webHtml']);
    gulp.watch('./src/js/**/*.es6', ['webJs']);
});
