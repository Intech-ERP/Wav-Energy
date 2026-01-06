const express = require("express");
const {
  addUser,
  getUsers,
  userLogin,
  updateUser,
  removeUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/login", userLogin);
router.post("/user", addUser);
router.get("/user", getUsers);
router.put("/updateUser/:id", updateUser);
router.put("/removeUser/:id", removeUser);

module.exports = router;
