const express = require("express");
const {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  createSubCategory,
  fetchSubCategories,
  updateSubCategory,
  deleteSubCategory,
} = require("../controller/Category");

const router = express.Router();
//  /categories is already added in base path
router
  .get("/", fetchCategories)
  .get("/sub", fetchSubCategories)
  .post("/", createCategory)
  .post("/sub", createSubCategory)
  .delete("/:id", deleteCategory)
  .delete("/sub/:id", deleteSubCategory)
  .patch("/:id", updateCategory)
  .patch("/sub/:id", updateSubCategory);

exports.router = router;
