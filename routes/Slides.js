const express = require("express");
const {
  createSlides,
  fetchSlides,
  deleteSlide,
  updateSlidesOrder,
} = require("../controller/Slide");

const router = express.Router();

router
  .post("/", createSlides)
  .get("/", fetchSlides)
  .delete("/:id", deleteSlide)
  .patch("/:id", updateSlidesOrder);

exports.router = router;
