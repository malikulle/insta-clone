const express = require("express");
const { getAccessToRoute } = require("../middleware/authorization/auth");
const expressAsyncHandler = require("express-async-handler");
const Comment = require(".././/models/Comment");
const Post = require(".././/models/Post");
const router = express.Router();

router.post(
  "/",
  getAccessToRoute,
  expressAsyncHandler(async (req, res, next) => {
    const { postId, text } = req.body;

    const comment = {
      text: text,
      user: req.user.id,
      post: postId,
    };

    const newComment = await Comment.create(comment);

    const post = await Post.findById(postId);

    post.comments.push(newComment._id);

    post.save();

    res.status(200).json({
      message: "Comment Added Successfully",
      data: newComment,
    });
  })
);

module.exports = router;
