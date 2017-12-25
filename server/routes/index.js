const express = require("express");
const router = express.Router();
const Vue = require("vue");
const Home = require("../views/components/home");

/* GET home page. */
router.get("/", function (req, res, next) {
    new Vue({
        render: (h) => h(Home)
    })
    res.render("./pages/index", {
        general: res.additionalData.general,

        title: "Express",
        description: "Home to the wild things"
    }, (err, html) => {
        if (err) {
            throw err;
        }

        new Vue({
            el: "#home",
            template: "<home />",
            components: { Home }
        });
    });
});

module.exports = router;
