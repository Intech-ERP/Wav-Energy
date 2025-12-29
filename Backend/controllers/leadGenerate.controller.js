const leads = require("../models/leadGenerate.model");

exports.generateLead = async (req, res) => {
  try {
    const data = req.body;
    const result = await new leads({
      company_name: data.company_name,
      contact_person: data.contact_person,
      mobile: data.mobile_no,
      enquiry_type: data.enquiry_type,
      sub_type: data.sub_type,
      action: data.action,
      last_followup_date: data.last_followup_date,
      next_followup_date: data.next_followup_date,
      lead_source: data.lead_source,
      company_details: data.company_details,
    }).save();

    res
      .status(200)
      .json({ success: true, message: "Lead Generate Successfully!" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const result = await leads.find({ status: 1 }, { _id: 0 }).lean();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: true, message: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("lead id", id);
    const data = req.body;
    console.log("update Lead", data);
    const result = await leads.findOneAndUpdate(
      { lead_id: id, status: 1 },
      { $set: { ...data } },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log("result", result);
    if (!result) {
      return res.status(404).json({ message: "data not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Lead data updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error Updating Lead data" });
  }
};

exports.removeLeads = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("lead id", id);
    const result = await leads.findOneAndUpdate(
      { lead_id: Number(id), status: 1 },
      { $set: { status: 0 } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!result) {
      return res.status(404).json({ message: "data not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Lead data remove successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
