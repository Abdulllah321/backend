const { Rating } = require("../model/Rating");

exports.fetchRating = async (req, res) => {
  try {
    const ratings = await Rating.find({}, { rating: 1, productId: 1 }).exec();

    const averageRatings = ratings.reduce((acc, rating) => {
      if (!acc[rating.productId]) {
        acc[rating.productId] = { sum: 0, count: 0 };
      }

      acc[rating.productId].sum += rating.rating;
      acc[rating.productId].count += 1;

      return acc;
    }, {});

    const formattedAverageRatings = Object.keys(averageRatings).map((productId) => ({
      productId,
      averageRating: averageRatings[productId].sum / averageRatings[productId].count,
    }));

    res.status(200).json(formattedAverageRatings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.fetchRatingById = async (req, res) => {
  const { id } = req.params;
  try {
    const ratings = await Rating.find({ productId: id }).exec();
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
    res.status(200).json(rating);
  } catch (err) {
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
