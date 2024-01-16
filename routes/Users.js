const express = require("express");
const {
  fetchUserById,
  updateUser,
  fetchAllUsers,
  deleteUser,
  updateAllUser,
} = require("../controller/User");

const router = express.Router();
//  /users is already added in base path
router
  .get("/own", fetchUserById)
  .patch("/:id", updateUser)
  .get("/all/", fetchAllUsers)
  .delete("/all/:id", deleteUser)
  .patch("/all/:id", updateAllUser);


exports.router = router;
