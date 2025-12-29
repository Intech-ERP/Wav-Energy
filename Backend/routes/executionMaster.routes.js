const express = require("express");
const {
  addExecution,
  getExecution,
  updateExecution,
  updateDisplayOrder,
  removeExecution,
} = require("../controllers/executionMaster.controller");
const router = express.Router();

router.post("/execution", addExecution);
router.get("/execution", getExecution);
router.post("/updateexecution", updateExecution);
router.put("/updateexecutiondisp_order/:id", updateDisplayOrder);
router.put("/removeexecution/:id", removeExecution);

module.exports = router;
