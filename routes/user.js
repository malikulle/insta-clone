const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const CustomError = require("../helpers/error/CustomError");
const { getAccessToRoute } = require("../middleware/authorization/auth");
const ImageUploud = require("../middleware/images/imageUplod");

router.get(
  "/:id",
  expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (user === null) {
      return next(new CustomError("User is not Found", 403));
    }

    const posts = await Post.find({ postedBy: id });

    res.status(200).json({
      posts,
      user,
    });
  })
);

router.post(
  "/follow",
  getAccessToRoute,
  expressAsyncHandler(async (req, res, next) => {
    const { followId } = req.body;

    const user = await User.findById(followId).select("-password");

    const me = await User.findById(req.user.id);

    if (user.following.includes(req.user.id)) {
      return next(new CustomError("Your already follow this user"), 404);
    }

    if (user._id == req.user.id) {
      return next(new CustomError("You can not follow yourself", 404));
    }

    user.followers.push(req.user.id);
    me.following.push(user._id);

    user.followingCount = user.following.length;
    user.followersCount = user.followers.length;

    me.followingCount = me.following.length;
    me.followersCount = me.followers.length;

    await user.save();
    await me.save();

    res.status(200).json({
      message: "Your started to follow",
      data: user,
    });
  })
);

router.post(
  "/unFollow",
  getAccessToRoute,
  expressAsyncHandler(async (req, res, next) => {
    const { followId } = req.body;

    const user = await User.findById(followId).select("-password");
    const me = await User.findById(req.user.id);

    if (!user.followers.includes(req.user.id)) {
      return next(new CustomError("You dont follow this user"), 404);
    }

    const index = user.followers.findIndex((x) => x == req.user.id);

    user.followers.splice(index, 1);

    const meIndex = me.following.findIndex((x) => x == user._id);

    me.following.splice(meIndex, 1);

    user.followingCount = user.following.length;
    user.followersCount = user.followers.length;

    me.followingCount = me.following.length;
    me.followersCount = me.followers.length;

    await user.save();
    await me.save();

    res.status(200).json({
      message: "You started to unfollow.",
      data: user,
    });
  })
);

router.post(
  "/updatePP",
  [getAccessToRoute, ImageUploud.single("photo")],
  expressAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password");

    user.profile_image = req.savedImage;

    await user.save();

    res.status(200).json({
      user,
    });
  })
);

router.post(
  "/searchUser",
  expressAsyncHandler(async (req, res, next) => {
    let userPattern = new RegExp("^" + req.body.query);
    const users = await User.find({ email: { $regex: userPattern } }).select("_id email");

    res.status(200).json({
      users,
    });
  })
);
module.exports = router;
