const mongoose = require("mongoose");

function formatDateToIST(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const executionMasterSchema = new mongoose.Schema({
  execution_id: { type: Number },
  execution: { type: String, default: "" },
  disp_order: { type: Number },
  status: { type: Number, default: 1 },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: "" },
});

executionMasterSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      this.updated_date = formatDateToIST(new Date());
      return next();
    }

    const result = await this.constructor
      .findOne({ execution_id: { $exists: true } })
      .sort({ execution_id: -1 });

    let newExecutionId = 1;
    if (result && result.execution_id) {
      newExecutionId = result.execution_id + 1;
    }

    this.execution_id = newExecutionId;
    this.created_date = formatDateToIST(new Date());
    this.updated_date = formatDateToIST(new Date());

    next();
  } catch (err) {
    console.error("Error in pre-save middleware:", err);
    next(err);
  }
});

module.exports = mongoose.model("execution_master", executionMasterSchema);
