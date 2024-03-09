const { Wishlist } = require("../model/WishList");

exports.fetchWishedByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const wishedItems = await Wishlist.find({ user: id }).populate("product");
    res.status(200).json(wishedItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToWhishList = async (req, res) => {
  const { id } = req.user;
  const wishlist = new Wishlist({ ...req.body, user: id });
  try {
    const doc = await wishlist.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromWishlist = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Wishlist.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateWishlist = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Wishlist.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate("product");

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
