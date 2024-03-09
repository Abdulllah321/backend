const express = require('express');
const { addToWhishList, fetchWishedByUser, deleteFromWishlist, updateWishlist } = require('../controller/WishList');

const router = express.Router();
//  /products is already added in base path
router.post('/', addToWhishList)
      .get('/', fetchWishedByUser)
      .delete('/:id', deleteFromWishlist)
      .patch('/:id', updateWishlist)


exports.router = router;
