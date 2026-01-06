const mongoose = require("mongoose");

function formatDateToIST(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const customerSchema = new mongoose.Schema({
  company_id: { type: Number, default: "" },
  company_name: { type: String, default: "" },
  group_name: { type: String, default: "" },
  alias_name: { type: String, default: "" },
  add_group: { type: String, trim: true, default: "" },
  branch_div: { type: String, trim: true, default: "" },
  gst_number: { type: String, trim: true },
  nature_of_biz: { type: String, trim: true },
  phone_no: [
    {
      type: Number,
      default: "",
    },
  ],
  email: { type: String, trim: true },
  website: { type: String, trim: true },
  address_line_1: { type: String, trim: true, default: "" },
  address_line_2: { type: String, trim: true, default: "" },
  address_line_3: { type: String, trim: true, default: "" },
  address_line_4: { type: String, trim: true, default: "" },
  country: { type: String, trim: true },
  state: { type: String, trim: true },
  pincode: { type: String, default: "" },
  company_details: { type: String, trim: true },
  status: { type: Number, default: 1 },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
});

customerSchema.pre("save", async function (next) {
  if (!this.isNew) {
    this.updated_date = formatDateToIST(new Date());
    return next();
  }
  try {
    const result = await this.constructor
      .findOne({ company_id: { $exists: true } })
      .sort({ company_id: -1 });
    console.log(
      "Latest company_id fetched:",
      result ? result.company_id : "None"
    );
    let newTrackId = 1;
    if (result) {
      newTrackId = result.company_id + 1;
      console.log("New company_id generated:", newTrackId);
    }
    this.company_id = newTrackId;
    this.created_date = formatDateToIST(new Date());
    this.updated_date = formatDateToIST(new Date());
    next();
  } catch (err) {
    console.error("Error in generating company_id:", err);
    next(err);
  }
});

module.exports = mongoose.model("customers", customerSchema);
