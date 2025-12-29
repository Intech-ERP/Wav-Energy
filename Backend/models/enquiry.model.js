const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function formatDateToIST(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const enquirySchema = new Schema({
  enquiry_id: { type: Number, default: "" },
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

enquirySchema.pre("save", async function (next) {
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

module.exports = mongoose.model("enquiries", enquirySchema);
