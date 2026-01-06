const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function formatDateToIST(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const leadSchema = new Schema({
  lead_id: { type: Number, default: "" },
  company_name: { type: String, default: "" },
  contact_person: { type: String, default: "" },
  mobile: { type: String, default: "" },
  email: { type: String, default: "" },
  address: { type: String, default: "" },
  website: { type: String, default: "" },
  next_followup_date: { type: Date },
  last_followup_date: { type: Date },
  company_details: { type: String, default: "" },
  status: { type: Number, default: 2 },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
});

leadSchema.pre("save", async function (next) {
  if (!this.isNew) {
    this.updated_date = formatDateToIST(new Date());
    return next();
  }
  try {
    const result = await this.constructor
      .findOne({ lead_id: { $exists: true } })
      .sort({ lead_id: -1 });
    console.log("Latest lead_id fetched:", result ? result.lead_id : "None");
    let newTrackId = 1;
    if (result) {
      newTrackId = result.lead_id + 1;
      console.log("New lead_id generated:", newTrackId);
    }
    this.lead_id = newTrackId;
    this.created_date = formatDateToIST(new Date());
    this.updated_date = formatDateToIST(new Date());
    next();
  } catch (err) {
    console.error("Error in generating lead_id:", err);
    next(err);
  }
});

module.exports = mongoose.model("leads", leadSchema);
