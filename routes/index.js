const express = require("express");
const router = express.Router();
const auth = require("./auth");
const post = require("./post");
const comment = require("./comment")
const user = require("./user")
// router
router.use("/auth", auth);
router.use("/post", post);
router.use("/comment",comment)
router.use("/user",user)
//

module.exports = router;
