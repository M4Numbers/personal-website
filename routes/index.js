const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("./pages/index", {
        general: res.additionalData.general,
        top_page: {
            title: "Hello World",
            tagline: "This is a site that contains information about the person on your left.",
            image_src: "images/handle_logo.png",
            image_alt: "Main face of the site"
        },

        head: {
            title: "M4Numbers",
            description: "Home to the wild things"
        }
    });
});

module.exports = router;
