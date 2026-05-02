const express = require("express");
const { generateReport } = require("../controllers/excelReport.controller");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/generateExcel", authMiddleware, generateReport);

module.exports = router;
