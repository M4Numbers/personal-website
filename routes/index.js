const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
    res.render("./pages/index", {
        top_page: {
            title: "Hello World",
            tagline: "This is a site that contains information about the person on your left.",
            image_src: "images/handle_logo.png",
            image_alt: "Main face of the site"
        },

        head: {
            title: "M4Numbers",
            description: "Home to the wild things",
            current_page: "index"
        }
    });
});

module.exports = router;
