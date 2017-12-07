"use strict";

const gulp = require("gulp");
const npath = require("path");
const spawn = require("child_process").spawn;

gulp.task("run", [], () => {
  spawn("node", [npath.resolve(__dirname, "bin/www")], {stdio: "inherit"});
});

gulp.task("default", ["run"], () => {});
