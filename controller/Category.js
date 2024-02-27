const { Category, SubCategory } = require("../model/Category");

exports.fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchSubCategories = async (req, res) => {
  try {
    const categories = await SubCategory.find({}).exec();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Update controller to handle subcategory creation
exports.createCategory = async (req, res) => {
  const { label, value, image, mainCategory } = req.body;

  try {
    const newCategory = new Category({
      label,
      value,
      image,
      mainCategory,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createSubCategory = async (req, res) => {
  const { label, value, parentCategory } = req.body;

  try {
    const newCategory = new SubCategory({
      label,
      value,
      parentCategory,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateSubCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await SubCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Category.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteSubCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await SubCategory.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
