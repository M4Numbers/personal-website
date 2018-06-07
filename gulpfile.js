"use strict";

const gulp = require("gulp");
const exec = require("child_process").exec;
const babel = require("gulp-babel");
const compass = require("gulp-compass");
const sass = require("gulp-sass");
const tildeImporter = require("node-sass-tilde-importer");

gulp.task("sass", function () {
    return gulp
        .src("stylesheets/**/*.scss")
        .pipe(sass({
            importer: tildeImporter
        }))
        .pipe(gulp.dest("public/css"));
});

gulp.task("babel", [], () => {
    return gulp.src("js/**/*.js")
        .pipe(babel({
            plugins: ["transform-runtime"],
            presets: ["env"],
        }))
        .pipe(gulp.dest("./public/js"));
});

gulp.task("sass:watch", ["sass"], () => {
   gulp.watch("stylesheets/**/*.scss", ["sass"]);
});

gulp.task("run", ["babel", "sass:watch"], () => {
    exec("npm run start", function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
});

gulp.task("test:eslint", [], () => {
    exec("npm run quality:eslint", function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
});

gulp.task("default", ["run"], () => {
});
