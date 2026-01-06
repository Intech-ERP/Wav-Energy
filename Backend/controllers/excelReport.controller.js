const ExcelJS = require("exceljs");
const excelConfig = require("../config/excelConfig");
const leadModel = require("../models/lead.model");
const enquiryGenerateModel = require("../models/enquiryGenerate.model");

const generateExcel = async (menu, data) => {
  const config = excelConfig[menu];
  console.log("data", data);
  if (!config) {
    throw new Error("Invalid menu type");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(config.sheetName);

  worksheet.columns = config.columns;

  worksheet.getRow(1).font = { bold: true };

  // Add rows
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  worksheet.autoFilter = {
    from: "A1",
    to: `${String.fromCharCode(64 + config.columns.length)}1`,
  };

  return { workbook, fileName: config.fileName };
};

exports.generateReport = async (req, res) => {
  try {
    const { from_date, to_date, menu, enquiry_type } = req.body;

    if (!from_date || !to_date) {
      return res.status(400).json({
        success: false,
        message: "fromDate and toDate are required",
      });
    }

    const from = new Date(from_date);
    const to = new Date(to_date);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    from.setUTCHours(0, 0, 0, 0);
    to.setUTCHours(23, 59, 59, 999);

    if (from > to) {
      return res.status(400).json({
        success: false,
        message: "fromDate cannot be greater than toDate",
      });
    }
    if (menu === "Lead") {
      const result = await leadModel.find({
        created_date: {
          $gte: from,
          $lte: to,
        },
      });

      if (result.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Data Not Found!" });
      }

      const { workbook, fileName } = await generateExcel(menu, result);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
      await workbook.xlsx.write(res);
      res.end();
    } else if (menu === "Enquiry") {
      const result = await enquiryGenerateModel.find({
        enquiry_type: enquiry_type,
        created_date: {
          $gte: from,
          $lte: to,
        },
      });
      if (result.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Data Not Found!" });
      }
      const { workbook, fileName } = await generateExcel(menu, result);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
      await workbook.xlsx.write(res);
      res.end();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
