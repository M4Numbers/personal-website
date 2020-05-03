const gulp = require('gulp');
const npath = require('path');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsConfig = ts.createProject('src/tsconfig.json');

const srcDir = './';
const destDir = './public/';

/* -------------------------------------------------------------------- CLEAN */

gulp.task('clean', () => gulp.src(
  [ npath.resolve(destDir) ],
  {
    read:       false,
    allowEmpty: true,
  },
).pipe(clean()));

/* --------------------------------------------------------------------- INFO */

// gulp.task('build-info', (cb) => {
//   info.generate().then((item) => {
//     fs.writeFileSync('build-info.json', JSON.stringify(item), { encoding: 'UTF-8' });
//     cb();
//   });
// });

/* ------------------------------------------------------------------- ASSETS */

gulp.task('typescript', () => gulp
  .src([
    npath.resolve(srcDir, 'src/ts/**/*.ts'),
  ])
  .pipe(tsConfig())
  .js
  .pipe(gulp.dest(npath.resolve(srcDir, 'src/javascript'))));

gulp.task('sass', () => gulp
  .src([
    npath.resolve(srcDir, 'src/stylesheets/**/*.scss'),
    'node_modules/font-awesome/scss/*.scss',
  ])
  .pipe(sass({
    errLogToConsole: true,
    outputStyle:     'compressed',
    indentedSyntax:  false,
    includePaths:    [
      'node_modules/bootstrap/scss/*.scss',
      'node_modules/font-awesome/scss/*.scss',
    ],
  }).on('error', sass.logError))
  .pipe(gulp.dest('./public/stylesheets')));

gulp.task('babel', () => gulp
  .src([ npath.resolve(srcDir, 'src/js/**/*.js') ])
  .pipe(babel({
    presets: [ '@babel/env' ],
  }))
  .pipe(gulp.dest('./public/javascript')));

// Copies javascript files to public folder
gulp.task('copy-scripts', () => gulp
  .src([
    './node_modules/bootstrap/dist/js/*.js',
    './node_modules/jquery/dist/jquery.*.js',
    './node_modules/popper.js/dist/*.js',
    // './src/js/**/*.js',
  ])
  .pipe(gulp.dest('./public/javascript')));

// Copies images to public folder
gulp.task('copy-images', () => gulp
  .src([
    './src/images/**/*.{png,ico,gif,jpg,svg}',
  ])
  .pipe(gulp.dest('./public/images')));

// Copies fonts to public folder
gulp.task('copy-fonts', () => gulp
  .src([
    './src/fonts/*.{woff,woff2}',
    './node_modules/font-awesome/fonts/*.{otf,eot,svg,ttf,woff,woff2}',
  ])
  .pipe(gulp.dest('./public/fonts')));

/* -------------------------------------------------------------------- Tasks */
gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'typescript',
      gulp.series('sass', 'babel'),
    ),
    'copy-scripts',
    'copy-images',
    'copy-fonts',
  ),
);

gulp.task('default', gulp.series('build'));
