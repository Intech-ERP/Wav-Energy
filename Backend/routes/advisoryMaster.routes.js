const express = require("express");
const {
  addAdvisory,
  getAdvisoryData,
  updateDisplayOrder,
  updateAdvisory,
  removeAdvisory,
} = require("../controllers/advisoryMaster.controller");
const router = express.Router();

router.post("/advisory", addAdvisory);
router.get("/advisory", getAdvisoryData);
router.put("/updateadvisorydisp_order/:id", updateDisplayOrder);
router.post("/updateadvisory", updateAdvisory);
router.put("/removeadvisory/:id", removeAdvisory);

module.exports = router;
