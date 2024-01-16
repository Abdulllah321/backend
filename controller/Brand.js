const { Brand } = require('../model/Brand');

exports.fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createBrand = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const doc = await brand.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // console.log("updated successful: " + id); // Log the update success
    res.status(200).json(brand);
  } catch (err) {
    // console.log("Update error: ", err); // Log the update error
    res.status(400).json(err);
  }
};

exports.deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Brand.findByIdAndDelete(id);
    // console.log("deleted successful: " + id); // Log the deletion success
    res.status(200).json(doc);
  } catch (err) {
    // console.log("Deletion error: ", err); // Log the deletion error
    res.status(400).json(err);
  }
};

