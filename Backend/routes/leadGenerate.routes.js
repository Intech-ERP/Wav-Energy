const express = require("express");
const {
  generateLead,
  getLeads,
  updateLead,
  removeLeads,
} = require("../controllers/leadGenerate.controller");
const router = express.Router();

router.post("/leads", generateLead);
router.get("/leads", getLeads);
router.put("/updateLead/:id", updateLead);
router.put("/removeLead/:id", removeLeads);

module.exports = router;
