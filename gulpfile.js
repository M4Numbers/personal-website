"use strict";

const gulp = require("gulp");
// const npath = require("path");
const exec = require("child_process").exec;
const babel = require("gulp-babel");
const compass = require("gulp-compass");

gulp.task("babel", [], () => {
    return gulp.src("babel/**/*.js")
        .pipe(babel({
            plugins: ["transform-runtime"],
            presets: ["env"],
        }))
        .pipe(gulp.dest("./public/compiled"));
});

gulp.task("compass", [], () => {
    gulp.src("stylesheets/**/*.scss")
        .pipe(compass({
            config_file: "config/compass.rb",
            css: "public/stylesheets",
            sass: "stylesheets"
        }))
        .pipe(gulp.dest("public/stylesheets"));
});

gulp.task("compass:watch", ["compass"], () => {
   gulp.watch("stylesheets/**/*.scss", ["compass"]);
});

gulp.task("run", ["babel", "compass:watch"], () => {
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
