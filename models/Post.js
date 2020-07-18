const mongoose = require("mongoose");
const Comment = require("./Comment");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please Provide a title"],
  },
  body: {
    type: String,
    required: [true, "Please Provide a body"],
  },
  photo: {
    type: String,
    default: "No Photo",
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Comment",
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
});

PostSchema.post("remove", async function () {
  // comments
  await Comment.deleteMany({ post: this._id });
});


module.exports = mongoose.model("Post", PostSchema);
