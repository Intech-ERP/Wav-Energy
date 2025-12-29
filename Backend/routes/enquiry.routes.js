const express = require("express");
const router = express.Router();
const {
  addEnquiry,
  getEnquiries,
  updateEnquiry,
  convertToLead,
  getConvertedEnquiry,
} = require("../controllers/enquiry.controller");

router.post("/enquiries", addEnquiry);
router.get("/enquiries", getEnquiries);
router.get("/convertedEnquiry", getConvertedEnquiry);
router.put("/enquiries/:id", updateEnquiry);
router.put("/convertLead/:id", convertToLead);

module.exports = router;
