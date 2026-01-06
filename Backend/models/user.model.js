const mongoose = require("mongoose");

function formatDateToIST(date) {
  return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  access: {
    type: String,
    // enum: ["full", "show", "none"],
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  user_id: { type: Number },
  user: { type: String, default: "" },
  emp_id: { type: String },
  password: { type: String },
  menu: [menuSchema],
  status: { type: Number, default: 1 },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date },
});

userSchema.pre("save", async function (next) {
  if (!this.isNew) {
    this.updated_date = formatDateToIST(new Date());
    return next();
  }
  try {
    const result = await this.constructor
      .findOne({ user_id: { $exists: true } })
      .sort({ user_id: -1 });
    console.log("Latest user_id fetched:", result ? result.user_id : "None");
    let newTrackId = 1;
    if (result) {
      newTrackId = result.user_id + 1;
      console.log("New user_id generated:", newTrackId);
    }
    this.user_id = newTrackId;
    this.created_date = formatDateToIST(new Date());
    this.updated_date = formatDateToIST(new Date());
    next();
  } catch (err) {
    console.error("Error in generating company_id:", err);
    next(err);
  }
});

module.exports = mongoose.model("user", userSchema);
