const express = require("express");
const router = express.Router();
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const Post = require("../models/Post");
const User = require("../models/User");
const { getAccessToRoute } = require("../middleware/authorization/auth");
const imageUploud = require("../middleware/images/imageUplod");

router.get("/allPost", async (req, res, next) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate({
      path: "postedBy comments",
      select: "_id name text",
      populate: {
        path: "user",
        select: "_id name",
      },
    });
  return res.status(200).json({
    posts: posts,
  });
});

router.get(
  "/getsubpost",
  getAccessToRoute,
  asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    const posts = await Post.find({ postedBy: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "postedBy comments",
        select: "_id name text",
        populate: {
          path: "user",
          select: "_id name",
        },
      });

    res.status(200).json({
      posts,
    });
  })
);

router.get("/myPost", getAccessToRoute, async (req, res, next) => {
  const posts = await Post.find({ postedBy: req.user.id })
    .sort({ createdAt: -1 })
    .populate("postedBy", "id name");

  return res.status(200).json({
    posts: posts,
  });
});

router.post(
  "/createpost",
  [getAccessToRoute, imageUploud.single("photo")],
  asyncErrorWrapper(async (req, res, next) => {
    const { title, body } = req.body;
    const post = await Post.create({
      title,
      body,
      postedBy: req.user.id,
      photo: req.savedImage,
    });

    return res.status(200).json({
      result: true,
      post: post,
    });
  })
);

router.get("/getPost/:id", getAccessToRoute, async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate("postedBy", "id name");

  return res.status(200).json({
    post: post,
  });
});

router.put(
  "/like",
  getAccessToRoute,
  asyncErrorWrapper(async (req, res, next) => {
    const { postId } = req.body;

    const post = await Post.findById(postId);

    if (post.likes.includes(req.user.id)) {
      return next("You already like this question", 404);
    }

    post.likes.push(req.user.id);
    post.likeCount = post.likes.length;

    await post.save();

    res.status(200).json({
      data: post,
    });
  })
);

router.put(
  "/unlike",
  getAccessToRoute,
  asyncErrorWrapper(async (req, res, next) => {
    const { postId } = req.body;

    const post = await Post.findById(postId);

    const index = post.likes.findIndex((x) => x == req.user.id);

    post.likes.splice(index, 1);
    post.likeCount = post.length;

    await post.save();

    res.status(200).json({
      data: post,
    });
  })
);

router.delete(
  "/:id",
  getAccessToRoute,
  asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const post = await Post.findById(id);

    // is User Post
    if (post && post.postedBy != req.user.id) {
      return res.status(400).json({
        message: "You can not delete another post",
      });
    }

    if (post === null) {
      return res.status(400).json({
        message: "Post Not Found",
      });
    }

    await post.remove();

    res.status(200).json({
      message: "Deleted Successfully",
    });
  })
);

module.exports = router;
