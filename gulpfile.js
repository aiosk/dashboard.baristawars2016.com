'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

var _gulpPlumber = require('gulp-plumber');

var _gulpPlumber2 = _interopRequireDefault(_gulpPlumber);

var _gulpFilter = require('gulp-filter');

var _gulpFilter2 = _interopRequireDefault(_gulpFilter);

var _gulpPug = require('gulp-pug');

var _gulpPug2 = _interopRequireDefault(_gulpPug);

var _gulpConcat = require('gulp-concat');

var _gulpConcat2 = _interopRequireDefault(_gulpConcat);

var _gulpSass = require('gulp-sass');

var _gulpSass2 = _interopRequireDefault(_gulpSass);

var _gulpAutoprefixer = require('gulp-autoprefixer');

var _gulpAutoprefixer2 = _interopRequireDefault(_gulpAutoprefixer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isProduction = false;
var babelOpts = { presets: ['es2015'], compact: isProduction };
var pugOpts = { data: {}, pretty: !isProduction, compileDebug: true };
var sassOpts = { includePaths: [], outputStyle: isProduction ? 'compressed' : 'nested' };

_gulp2.default.task('project', function () {
    _gulp2.default.src('./src/*.es6').pipe((0, _gulpPlumber2.default)()).pipe((0, _gulpBabel2.default)(babelOpts)).pipe(_gulp2.default.dest('./'));
});

_gulp2.default.task('webHtml', function () {
    _gulp2.default.src('./src/html/**/*.pug').pipe((0, _gulpFilter2.default)(function (file) {
        return !/\/_/.test(file.path) && !/^_/.test(file.relative);
    })).pipe((0, _gulpPlumber2.default)()).pipe((0, _gulpPug2.default)(pugOpts)).pipe(_gulp2.default.dest('./dist/'));
});

_gulp2.default.task('webJs', function () {
    _gulp2.default.src('./src/js/**/*.es6').pipe((0, _gulpPlumber2.default)()).pipe((0, _gulpConcat2.default)('main.es6')).pipe((0, _gulpBabel2.default)(babelOpts)).pipe(_gulp2.default.dest('./dist/js/'));
});

_gulp2.default.task('webCss', function () {
    _gulp2.default.src('./src/css/main.scss').pipe((0, _gulpSass2.default)(sassOpts).on('error', _gulpSass2.default.logError)).pipe((0, _gulpAutoprefixer2.default)({ browsers: ['ff >= 4', 'Chrome >= 19', 'ie >= 9'], cascade: false })).pipe(_gulp2.default.dest('./dist/css/'));
});
_gulp2.default.task('build', ['webHtml', 'webJs', 'webCss']);

_gulp2.default.task('default', function () {
    _gulp2.default.watch('./src/*.es6', ['project']);
    _gulp2.default.watch('./src/css/**/*.scss', ['webCss']);

    _gulp2.default.watch('./src/html/**/*.pug', ['webHtml']);
    _gulp2.default.watch('./src/js/**/*.es6', ['webJs']);
});