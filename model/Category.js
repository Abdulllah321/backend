const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    mainCategory: { type: [Schema.Types.Mixed], required: true },
  },
  { timestamps: true }
);

const SubCategorySchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    parentCategory: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const virtual = categorySchema.virtual("id");
const subVirtual = SubCategorySchema.virtual("id");

virtual.get(function () {
  return this._id;
});

subVirtual.get(function () {
  return this._id;
});

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

SubCategorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Category = mongoose.model("Category", categorySchema);
const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

module.exports = { Category, SubCategory };
