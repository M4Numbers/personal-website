"use strict";

const gulp = require("gulp");
const npath = require("path");
const spawn = require("child_process").spawn;
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
    spawn("node", [npath.resolve(__dirname, "bin/www")], {stdio: "inherit"});
});

gulp.task("default", ["run"], () => {
});
