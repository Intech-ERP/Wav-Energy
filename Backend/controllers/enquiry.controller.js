const enquiryModel = require("../models/enquiry.model.js");

const formatDate = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


exports.addEnquiry = async (req, res) => {
  try {
    const data = req.body;
    console.log("req body:", data);
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is required",
      });
    }

    const enquiryData = new enquiryModel({
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
    const savedEnquiry = await enquiryData.save();
    res.status(201).json({
      success: true,
      message: "Enquiry added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiryModel
      .find({ status: 2 }, { _id: 0 })
      .sort({ enquiry_id: -1 })
      .lean();

    const formattedEnquiries = enquiries.map((item) => ({
      ...item,
      last_followup_date: formatDate(item.last_followup_date),
      next_followup_date: formatDate(item.next_followup_date),
    }));
    console.log("Formatted enquiries:", formattedEnquiries);

    res.status(200).json({
      success: true,
      data: formattedEnquiries,
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateEnquiry = async (req, res) => {
  console.log("req.body:", req.body);

  try {
    const enquiryId = req.params.id;
    const updateData = req.body;

    const { email_id, mobile_no, ...rest } = updateData.data;

    const updateFields = {
      ...rest,
      email: email_id,
      mobile: mobile_no,
    };
    delete updateData.data.email_id;
    delete updateData.data.mobile_no;

    const updatedEnquiry = await enquiryModel.findOneAndUpdate(
      { enquiry_id: enquiryId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
exports.convertToLead = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("enquiry id", id);
    const result = await enquiryModel.findOneAndUpdate(
      { enquiry_id: id, status: 2 },
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

exports.getConvertedEnquiry = async (req, res) => {
  try {
    console.log("running converted Enquiry");
    const result = await enquiryModel
      .find({ status: 1 }, { _id: 0 })
      .sort({ enquiry_id: -1 })
      .lean();

    console.log("result", result);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "converted Enquiry not found!" });
    }

    const formattedEnquiries = result.map((item) => ({
      ...item,
      last_followup_date: formatDate(item.last_followup_date),
      next_followup_date: formatDate(item.next_followup_date),
    }));

    res.status(200).json({
      success: true,
      data: formattedEnquiries,
    });
  } catch (error) {
    console.error("Error fetching converted enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
