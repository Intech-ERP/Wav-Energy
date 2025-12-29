const express = require("express");
const router = express.Router();
const {
  addContact,
  getContacts,
  updateContact,
  removeContact,
} = require("../controllers/contact.controller");

router.post("/contacts", addContact);
router.get("/getContacts/:id", getContacts);
router.put("/updateContact/:id", updateContact);
router.put("/removeContact/:id", removeContact);

module.exports = router;
