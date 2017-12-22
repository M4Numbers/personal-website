const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    console.log(res.additionalData);
    res.render("./pages/index", {
        general: res.additionalData.general,

        title: "Express",
        description: "Home to the wild things"
    });
});

module.exports = router;
