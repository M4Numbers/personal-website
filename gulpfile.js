"use strict";

const gulp = require("gulp");
// const npath = require("path");
const exec = require("child_process").exec;
const babel = require("gulp-babel");

gulp.task("babel", [], () => {
    return gulp.src("babel/**/*.js")
        .pipe(babel({
            plugins: ["transform-runtime"],
            presets: ["env"],
        }))
        .pipe(gulp.dest("./public/compiled"));
});

gulp.task("run", ["babel"], () => {
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
