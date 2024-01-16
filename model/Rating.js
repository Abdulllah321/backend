const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    min: [1, "Rating should be at least 1"],
    max: [5, "Rating should not exceed 5"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  images: { type: [String] },

  userImg: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const virtual = ratingSchema.virtual("id");

virtual.get(function () {
  return this._id;
});
ratingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
const Rating = mongoose.model("Ratings", ratingSchema);

module.exports = { Rating };
