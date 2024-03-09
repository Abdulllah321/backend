const { Slide } = require("../model/Slide");

exports.createSlides = async (req, res) => {
  const { images } = req.body;

  try {
    const imagesArray = Array.isArray(images) ? images : [images];

    const savedSlides = [];

    for (const imageUrl of imagesArray) {
      const slide = new Slide({
        image: imageUrl,
      });

      const savedSlide = await slide.save();
      savedSlides.push(savedSlide);
    }

    res.status(201).json(savedSlides);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.fetchSlides = async (req, res) => {
  try {
    const slide = await Slide.find({}).exec();
    res.status(200).json(slide);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateSlidesOrder = async (req, res) => {
  const { newOrder } = req.body;

  try {

    for (let i = 0; i < newOrder.length; i++) {
      const slideId = newOrder[i];
      await Slide.findByIdAndUpdate(slideId, { order: i });
    }

    res.status(200).json({ message: "Slides order updated successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSlide = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Slide.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
