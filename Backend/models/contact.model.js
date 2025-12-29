const mongoose = require("mongoose");

function formatDateToIST(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const contactScheme = new mongoose.Schema({
  contact_id: { type: Number, default: "" },
  company_id: { type: Number, default: "" },
  title: { type: String, trim: true, default: "" },
  contact_name: { type: String, trim: true, default: "" },
  mobile: { type: String, trim: true, default: "" },
  personal_mobile: { type: String, trim: true, default: "" },
  designation: { type: String, trim: true, default: "" },
  email: { type: String, trim: true, default: "" },
  dept: { type: String, trim: true, default: "" },
  personal_email: { type: String, trim: true, default: "" },
  personal_address: { type: String, trim: true, default: "" },
  birthday: { type: String, trim: true, default: "" },
  anniversary: { type: String, trim: true, default: "" },
  status: { type: Number, default: 1 },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
});

contactScheme.pre("save", async function (next) {
  if (!this.isNew) {
    this.updated_date = formatDateToIST(new Date());
    return next();
  }
  try {
    const result = await this.constructor
      .findOne({ contact_id: { $exists: true } })
      .sort({ contact_id: -1 });
    console.log(
      "Latest contact_id fetched:",
      result ? result.contact_id : "None"
    );
    let newTrackId = 1;
    if (result) {
      newTrackId = result.contact_id + 1;
      console.log("New contact_id generated:", newTrackId);
    }
    this.contact_id = newTrackId;
    this.created_date = formatDateToIST(new Date());
    this.updated_date = formatDateToIST(new Date());
    next();
  } catch (err) {
    console.error("Error in generating contact_id:", err);
    next(err);
  }
});

module.exports = mongoose.model("customer_contacts", contactScheme);
