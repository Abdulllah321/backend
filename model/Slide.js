const mongoose = require("mongoose");
const { Schema } = mongoose;

const slidesSchema = new Schema(
  {
    image: { type: String, required: true},
  },
  { timestamps: true }
);

const virtual = slidesSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

slidesSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Slide = mongoose.model("Slides", slidesSchema);
module.exports = { Slide };
