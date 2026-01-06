const express = require("express");
const { generateReport } = require("../controllers/excelReport.controller");
const router = express.Router();

router.post("/generateExcel", generateReport);

module.exports = router;
