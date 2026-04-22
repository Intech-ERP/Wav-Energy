const express = require("express");
const { addLeadType, getLeadTypes, updateDisplayOrder, updateLeadType, removeLeadType } = require("../controllers/leadTypeMaster.controller");

const router = express.Router();

router.post("/lead_type", addLeadType);
router.get("/lead_type", getLeadTypes);
router.put("/updatelead_typedisp_order/:id", updateDisplayOrder);
router.post("/updatelead_type", updateLeadType);
router.put("/removelead_type/:id", removeLeadType);
module.exports = router;