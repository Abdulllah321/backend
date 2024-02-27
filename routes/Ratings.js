const express = require("express");
const {
  createRating,
  deleteRating,
  updateRating,
  fetchRatingById,
  fetchRating,
} = require("../controller/Rating");


const router = express.Router();
//  /products is already added in base path
router
  .post("/", createRating)
  .get("/", fetchRating)
  .get("/:id", fetchRatingById)
  .delete("/:id", deleteRating)
  .patch("/:id", updateRating);

exports.router = router;
