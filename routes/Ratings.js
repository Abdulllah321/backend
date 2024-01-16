const express = require("express");
const { createRating, fetchRatings, deleteRating, updateRating } = require("../controller/Rating");


const router = express.Router();
//  /products is already added in base path
router
  .post("/", createRating)
  .get("/", fetchRatings)
  .delete("/:id", deleteRating)
  .patch("/:id", updateRating);

exports.router = router;
