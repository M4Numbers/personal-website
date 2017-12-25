"use strict";

const gulp = require("gulp");
const npath = require("path");
const spawn = require("child_process").spawn;
const vueify = require("gulp-vueify");

gulp.task("vueify", function () {
    return gulp.src("views/components/**/*.vue")
        .pipe(vueify())
        .pipe(gulp.dest("./public/vues"));
});

gulp.task("run", ["vueify"], () => {
    spawn("node", [npath.resolve(__dirname, "bin/www")], {stdio: "inherit"});
});

gulp.task("default", ["run"], () => {
});
