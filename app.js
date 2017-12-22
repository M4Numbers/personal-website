"use strict"

const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compass = require("node-compass");

let index = require("./routes/index");
let users = require("./routes/users");

let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "nunjucks");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "public", "images", "icons", "favicon.ico")));

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(compass({mode: "expanded"}));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist")));
app.use(express.static(path.join(__dirname, "node_modules/font-awesome")));

const generateGenerics = function (req, res, next) {
    res.additionalData = {
        general: {
            title: "Somewhere",
            description: "Somewhere that hosts a site",
            page: "index"
        }
    };
    next();
};

app.use("/", [generateGenerics, index]);
app.use("/users", [generateGenerics, users]);

// Static pages to be served
// app.use("/map", null);
// app.use("/about", null);
// app.use("/contact", null);
// app.use("/stats", null);

// Content pages
// app.use("/blog", null);
// app.use("/development", null);
// app.use("/creative", null);
// app.use("/media", null);

nunjucks.configure("views", {
    autoescape: true,
    express: app,
    watch: true,
    tags: {
        blockStart: "[%",
        blockEnd: "%]",
        variableStart: "[[",
        variableEnd: "]]",
        commentStart: "[#",
        commentEnd: "#]"
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("./pages/error");
});

module.exports = app;
