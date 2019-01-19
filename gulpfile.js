'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const tildeImporter = require('node-sass-tilde-importer');

gulp.task('sass', () => {
    return gulp
        .src('stylesheets/**/*.scss')
        .pipe(sass({
            importer: tildeImporter
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('babel', () => {
    return gulp.src('js/**/*.js')
        .pipe(babel({
            plugins: ['transform-runtime'],
            presets: ['env'],
        }))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('build', gulp.series('sass', 'babel'));

gulp.task('sass:watch', gulp.series('sass', () => {
   gulp.watch('stylesheets/**/*.scss', ['sass']);
}));

gulp.task('default', gulp.series('build'));
