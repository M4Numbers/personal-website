const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("./index", {
    general: {
      title: "Somewhere",
      description: "Somewhere that hosts a site"
    },
    title: "Express",
    description: "Home to the wild things",
    page: "index"
  });
});

module.exports = router;
