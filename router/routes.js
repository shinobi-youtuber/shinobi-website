const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.render("./website/index")
  })
router.get("/post", (req, res) => {
    res.render("./website/post")
  })




module.exports = router