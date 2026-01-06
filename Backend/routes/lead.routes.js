const express = require("express");
const router = express.Router();
const {
  addLeads,
  getLeads,
  updateLead,
  convertToEnquiry,
  getConvertedLeads,
  removeConvertedLead,
} = require("../controllers/lead.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/leads", addLeads);
router.get("/leads", authMiddleware, getLeads);
router.get("/convertedLead", getConvertedLeads);
router.put("/leads/:id", updateLead);
router.put("/convertEnquiry/:id", convertToEnquiry);
router.put("/removeConvertedLead/:id", removeConvertedLead);

module.exports = router;
