const express = require('express');
const { fetchBrands, createBrand, updateBrand, deleteBrand } = require('../controller/Brand');

const router = express.Router();
//  /brands is already added in base path
router
  .get("/", fetchBrands)
  .post("/", createBrand)
  .delete("/:id", deleteBrand)
  .patch("/:id", updateBrand);

exports.router = router;
