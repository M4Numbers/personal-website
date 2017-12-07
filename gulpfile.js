"use strict";

const gulp = require("gulp");
const babel = require("gulp-babel");
const clean = require("gulp-clean");
const sass = require("gulp-sass");

const config = {
    paths: {
        input: {
            root: "./src/**/*.*",
            server: "./src/server/**/*.*",
            common: "./src/common/**/*.*",
            client: "./src/client/**/*.*"
        },
        scripts: {
            scss: "./src/**/*.scss",
            js: "./src/**/*.js",
            ts: "./src/**/*.ts"
        },
        output: {
            root: "./public",
            server: "./public/server",
            common: "./public/common",
            client: "./public/client"
        }
    }
};

gulp.task("clean:all", function () {
    return gulp.src([config.paths.output.root], {read: false})
        .pipe(clean());
});

gulp.task("clean:client", function () {
    return gulp.src([config.paths.output.client], {read: false})
        .pipe(clean());
});

gulp.task("clean:server", function () {
    return gulp.src([config.paths.output.common, config.paths.output.server], {read: false})
        .pipe(clean());
});

gulp.task("move:server", ["clean:server"], function () {
    return gulp.src([config.paths.directories.server, config.paths.directories.common], {base: "."})
        .pipe(gulp.dest(config.paths.dist.root));
});

gulp.task("build:client", ["clean:client"], () => {
    return gulp.src([config.paths.scripts.scss])
        .pipe(sass())
        .pipe(gulp.dest(config.paths.output.root));
});

gulp.task("build:server", ["clean:server", "move:server"], () => {
    return gulp.src([config.paths.script.server])
        .pipe(babel({
            presets: ["latest"],
            plugins: ["transform-async-to-generator"]
        }))
        .pipe(gulp.dest(config.paths.dist.server));
});

gulp.task("build:common", ["clean:server", "move:server"], () => {
    return gulp.src([config.paths.script.common])
        .pipe(babel({
            presets: ["latest"],
            plugins: ["transform-async-to-generator"]
        }))
        .pipe(gulp.dest(config.paths.dist.common));
});

gulp.task("build:all", ["build:server", "build:common", "build:client"]);

gulp.task("default", [], () => {});
