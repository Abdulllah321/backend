const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const virtual = wishSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

wishSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
const Wishlist = mongoose.model("Wishlist", wishSchema);

module.exports = { Wishlist };
