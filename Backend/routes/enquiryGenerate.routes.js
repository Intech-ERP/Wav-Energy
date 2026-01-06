const express = require("express");
const {
  generateEnquiry,
  getEnquiries,
  updateEnquiry,
  removeEnquiry,
} = require("../controllers/enquiryGenerate.controller");
const router = express.Router();

router.post("/enquiries", generateEnquiry);
router.get("/enquiries", getEnquiries);
router.put("/updateEnquiry/:id", updateEnquiry);
router.put("/removeEnquiry/:id", removeEnquiry);

module.exports = router;
