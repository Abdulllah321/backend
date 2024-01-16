const { Rating } = require("../model/Rating");

exports.fetchRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({}).exec();
    res.status(200).json(ratings);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createRating = async (req, res) => {
  const { productId, userId, images, userImg, rating, username, message } =
    req.body;

  try {
    const newRating = new Rating({
      productId,
      userId,
      images,
      userImg,
      rating,
      username,
      message,
    });

    const savedRating = await newRating.save();
    res.status(201).json(savedRating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateRating = async (req, res) => {
  const { id } = req.params;
  try {
    const rating = await Rating.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // console.log("updated successful: " + id); // Log the update success
    res.status(200).json(rating);
  } catch (err) {
    // console.log("Update error: ", err); // Log the update error
    res.status(400).json(err);
  }
};

exports.deleteRating = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Rating.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
