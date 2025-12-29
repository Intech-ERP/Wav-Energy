const mongoose = require("mongoose");

function formatDateToIST(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const operationMasterSchema = mongoose.Schema({
  operation_id: { type: Number },
  operation: { type: String, default: "" },
  disp_order: { type: Number },
  status: { type: Number, default: 1 },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: "" },
});

operationMasterSchema.pre("save", async function (next) {
  if (!this.isNew) {
    this.created_date = formatDateToIST(new Date());
    return next();
  }
  try {
    const result = await this.constructor
      .findOne({ operation_id: { $exists: true } })
      .sort({ operation_id: -1 });
    console.log(
      "Latest operation fetched:",
      result ? result.operation_id : "None"
    );
    console.log("result", result);
    let newTrackId = 1;
    if (result) {
      newTrackId = result.operation_id + 1;
      console.log("New operation_id generated:", newTrackId);
    }
    this.operation_id = newTrackId;
    this.created_date = formatDateToIST(new Date());
    this.updated_date = formatDateToIST(new Date());
    next();
  } catch (err) {
    console.error("Error in generating operation_id:", err);
    next(err);
  }
});

module.exports = mongoose.model("operation_master", operationMasterSchema);
