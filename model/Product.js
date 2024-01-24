const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      min: [1, "wrong min price"],
      max: [10000, "wrong max price"],
    },
    discountPercentage: {
      type: Number,
      min: [1, "wrong min discount"],
      max: [99, "wrong max discount"],
    },
    // rating: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Rating",
    //   required: true,
    //   default: 0,
    // },
    stock: { type: Number, min: [0, "wrong min stock"], default: 0 },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: false },
    images: { type: [String], required: true },
    colors: { type: [Schema.Types.Mixed] },
    subCategory: { type: [Schema.Types.Mixed] },
    subTitle: { type: String },
    highlights: { type: [String] },
    keywords: { type: [String] },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const virtual = productSchema.virtual("id");

virtual.get(function () {
  return this._id;
});
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
