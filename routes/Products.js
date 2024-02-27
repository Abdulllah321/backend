const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
  searchResults,
} = require("../controller/Product");

const router = express.Router();
router
  .post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/search", searchResults)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct);

exports.router = router;
