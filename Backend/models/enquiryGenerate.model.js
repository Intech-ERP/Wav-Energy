const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function formatDateToIST(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const enquiryGenerationSchema = new Schema({
  enquiry_id: { type: Number },
  company_name: { type: String, default: "" },
  contact_person: { type: String, default: "" },
  mobile: { type: String, default: "" },
  enquiry_type: { type: String, default: "" },
  sub_type: { type: String, default: "" },
  advisory: { type: String, default: "" },
  execution: { type: String, default: "" },
  operation_Maintenance: { type: String, default: "" },
  lead_source: { type: String, default: "" },
  action: { type: String, default: "" },
  company_details: { type: String, default: "" },
  last_followup_date: { type: Date, default: new Date() },
  next_followup_date: { type: Date, default: "" },
  status: { type: Number, default: 1 },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
});

enquiryGenerationSchema.pre("save", async function (next) {
  if (!this.isNew) {
    this.updated_date = formatDateToIST(new Date());
    return next();
  }
  try {
    const result = await this.constructor
      .findOne({ enquiry_id: { $exists: true } })
      .sort({ enquiry_id: -1 });
    console.log(
      "Latest enquiry_id fetched:",
      result ? result.enquiry_id : "None"
    );
    let newTrackId = 1;
    if (result) {
      newTrackId = result.enquiry_id + 1;
      console.log("New enquiry_id generated:", newTrackId);
    }
    this.enquiry_id = newTrackId;
    this.created_date = formatDateToIST(new Date());
    this.updated_date = formatDateToIST(new Date());
    next();
  } catch (err) {
    console.error("Error in generating enquiry_id:", err);
    next(err);
  }
});

module.exports = mongoose.model("enquiries", enquiryGenerationSchema);
