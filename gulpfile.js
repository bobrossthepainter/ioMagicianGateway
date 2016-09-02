var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var del = require('del');
var isparta = require('isparta');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-core/register');

gulp.task('static', function () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
  nsp({
    package: __dirname + '/package.json'
    // stopOnError: false
  }, cb);
});

gulp.task('pre-test', function () {
  return gulp.src('lib/**/*.js')
    .pipe(istanbul({
      includeUntested: true
      , instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', function (cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('babel', ['clean'], function () {
  gulp.src('lib/**/*.json')
    .pipe(gulp.dest('dist'));
  return gulp.src('lib/**/*.js')
    .pipe(babel({
      //plugins: ['transform-regenerator',
      //  'transform-es2015-unicode-regex',
      //  'transform-es2015-typeof-symbol',
      //  'transform-es2015-template-literals',
      //  'transform-es2015-sticky-regex',
      //  'transform-es2015-spread',
      //  'transform-es2015-shorthand-properties',
      //  'transform-es2015-parameters',
      //  'transform-es2015-object-super',
      //  'transform-es2015-modules-commonjs',
      //  'transform-es2015-literals',
      //  'transform-es2015-function-name',
      //  'transform-es2015-for-of',
      //  'transform-es2015-destructuring',
      //  //'transform-es2015-constants',
      //  'transform-es2015-computed-properties',
      //  'transform-es2015-arrow-functions',
      //  'transform-es2015-block-scoped-functions',
      //  'transform-es2015-block-scoping',
      //  'transform-runtime']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return del('dist');
});

gulp.task('prepublish', ['nsp', 'babel']);
gulp.task('default', ['static', 'test']);
