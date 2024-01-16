const express = require('express');
const { fetchCategories, createCategory, deleteCategory, updateCategory } = require('../controller/Category');

const router = express.Router();
//  /categories is already added in base path
router
  .get("/", fetchCategories)
  .post("/", createCategory)
  .delete("/:id", deleteCategory)
  .patch("/:id", updateCategory);

exports.router = router;
