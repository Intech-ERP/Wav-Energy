const express = require("express");
const {
  addOperation,
  getOperation,
  updateDisplayOrder,
  updateOperation,
  removeOperation,
} = require("../controllers/operationMaster.controller");
const router = express.Router();

router.post("/operation", addOperation);
router.get("/operation", getOperation);
router.put("/updateoperationdisp_order/:id", updateDisplayOrder);
router.post("/updateoperation", updateOperation);
router.put("/removeoperation/:id", removeOperation);

module.exports = router;
