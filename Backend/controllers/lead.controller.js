const leadModel = require("../models/lead.model.js");

const formatDate = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

exports.addLeads = async (req, res) => {
  try {
    const data = req.body;
    console.log("req body:", data);
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is required",
      });
    }

    const leadData = new leadModel({
      company_name: data.company_name,
      contact_person: data.contact_person,
      mobile: data.mobile_no,
      email: data.email_id,
      address: data.address,
      website: data.website,
      next_followup_date: data.next_followup_date,
      company_details: data.company_details,
      last_followup_date: new Date(),
    });
    const savedLead = await leadData.save();
    res.status(201).json({
      success: true,
      message: "Lead added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await leadModel
      .find({ status: 2 }, { _id: 0 })
      .sort({ lead_id: -1 })
      .lean();

    const formattedLeads = leads.map((item) => ({
      ...item,
      last_followup_date: formatDate(item.last_followup_date),
      next_followup_date: formatDate(item.next_followup_date),
    }));
    console.log("Formatted leads:", formattedLeads);

    res.status(200).json({
      success: true,
      data: formattedLeads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateLead = async (req, res) => {
  console.log("req.body:", req.body);

  try {
    const leadId = req.params.id;
    const updateData = req.body;

    const { email_id, mobile_no, ...rest } = updateData.data;

    const updateFields = {
      ...rest,
      email: email_id,
      mobile: mobile_no,
    };
    delete updateData.data.email_id;
    delete updateData.data.mobile_no;

    const updatedLeads = await leadModel.findOneAndUpdate(
      { lead_id: leadId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
exports.convertToEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("enquiry id", id);
    const result = await leadModel.findOneAndUpdate(
      { lead_id: id, status: 2 },
      { $set: { status: 1 } },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Lead Converted Successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error convert to Lead" });
  }
};

exports.getConvertedLeads = async (req, res) => {
  try {
    const result = await leadModel
      .find({ status: 1 }, { _id: 0 })
      .sort({ lead_id: -1 })
      .lean();

    console.log("result", result);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "converted Enquiry not found!" });
    }

    const formattedLeads = result.map((item) => ({
      ...item,
      last_followup_date: formatDate(item.last_followup_date),
      next_followup_date: formatDate(item.next_followup_date),
    }));

    res.status(200).json({
      success: true,
      data: formattedLeads,
    });
  } catch (error) {
    console.error("Error fetching converted leads:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.removeConvertedLead = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("remove converted lead running");
    const result = await leadModel.findOneAndUpdate(
      { lead_id: id, status: 1 },
      { $set: { status: 0 } }
    );

    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Converted Lead not found!" });
    }
    res
      .status(200)
      .json({ success: true, message: "converted data remove successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
