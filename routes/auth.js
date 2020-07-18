const express = require("express");
const asyncErrorWrapper = require("express-async-handler");
const router = express.Router();
const CustomError = require("../helpers/error/CustomError");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendJwtToClient } = require("../helpers/authorization/auth");
const { getAccessToRoute } = require("../middleware/authorization/auth");
const ImageUploud = require("../middleware/images/imageUplod");
const sendEmail = require("../helpers/Mail/sendEmail");

router.post(
  "/signup",
  ImageUploud.single("photo"),
  asyncErrorWrapper(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
      email,
      name,
      password,
      profile_image: req.savedImage,
    });

    sendJwtToClient(user, res);
  })
);

router.post(
  "/signin",
  asyncErrorWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!validateUserInput) {
      return next(new CustomError("Empty email or Password", 404));
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return next(new CustomError("User Not Found", 403));
    }
    if (!comparePassword(password, user.password)) {
      return next(new CustomError("UnAuthorization Error", 401));
    }

    sendJwtToClient(user, res);
  })
);

router.post(
  "/logout",
  getAccessToRoute,
  asyncErrorWrapper((req, res, next) => {
    const { NODE_ENV } = process.env;

    // Send To Client With Res

    return res
      .status(200)
      .cookie("access_token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true,
      })
      .json({
        success: true,
        message: "Logout Successfull",
      });
  })
);

router.post(
  "/forgatPassword",
  asyncErrorWrapper(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new CustomError("User Not Found", 400));
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const { PROD_URL } = process.env;

    const resetPassword = `${PROD_URL}resetPassword?token=${resetPasswordToken}`;

    const template = `
      <h3>Reset Your Password</h3>
      <p> This <a href= '${resetPassword}' target='_blank'>link</a> will be expire in one hour</p>
    `;
    try {
      await sendEmail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Reset your password",
        html: template,
      });
      res.status(200).json({
        result: true,
        message: "Email Sended to change password",
      });
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new CustomError("Email Could not be sended", 404));
    }
  })
);

router.put(
  "/resetPassword",
  asyncErrorWrapper(async (req, res, next) => {
    const { token } = req.query;
    const { password } = req.body;

    if (!token) {
      return next(new CustomError("Please provide a valid token", 400));
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      result: true,
      message: "Password chaged.",
    });
  })
);

const validateUserInput = (email, password) => {
  return email && password;
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = router;
