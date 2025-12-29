const mongoose = require("mongoose");

function formatDateToIST(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const advisoryMasterSchema = mongoose.Schema({
  advisory_id: { type: Number },
  advisory: { type: String, default: "" },
  disp_order: { type: Number },
  status: { type: Number, default: 1 },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: "" },
});

advisoryMasterSchema.pre("save", async function (next) {
  if (!this.isNew) {
    this.created_date = formatDateToIST(new Date());
    return next();
  }
  try {
    const result = await this.constructor
      .findOne({ advisory_id: { $exists: true } })
      .sort({ advisory_id: -1 });
    console.log(
      "Latest advisory_id fetched:",
      result ? result.advisory_id : "None"
    );
    console.log("result", result);
    let newTrackId = 1; 
    if (result) {
      newTrackId = result.advisory_id + 1;
      console.log("New advisory_id generated:", newTrackId);
    }
    this.advisory_id = newTrackId;
    this.created_date = formatDateToIST(new Date());
    this.updated_date = formatDateToIST(new Date());
    next();
  } catch (err) {
    console.error("Error in generating advisory_id:", err);
    next(err);
  }
});

module.exports = mongoose.model("advisory_master", advisoryMasterSchema);
