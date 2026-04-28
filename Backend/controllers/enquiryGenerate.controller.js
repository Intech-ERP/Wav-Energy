const enquiries = require("../models/enquiryGenerate.model");

const formatDate = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

exports.generateEnquiry = async (req, res) => {
  try {
    const data = req.body;
    console.log("req body:", data);
    const result = await new enquiries({
      company_name: data.company_name,
      contact_person: data.contact_person,
      mobile: data.mobile_no,
      enquiry_type: data.enquiry_type,
      sub_type: data.sub_type,
      advisory: data?.advisory,
      execution: data?.execution,
      operation_Maintenance: data?.operation_Maintenance,
      action: data.action,
      last_followup_date: data.last_followup_date,
      next_followup_date: data.next_followup_date,
      enquiry_date: new Date().toISOString(),
      lead_source: data.lead_source,
      company_details: data.company_details,
    }).save();

    res
      .status(200)
      .json({ success: true, message: " Enquiry Added Successfully!" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const result = await enquiries.find({ status: 1 }, { _id: 0 }).lean();

    console.log("running enquiry");

    const formattedData = result.map((item) => ({
      ...item,
      last_followup_date: formatDate(item.last_followup_date),
      next_followup_date: formatDate(item.next_followup_date),
      created_date: formatDate(item.created_date),
      updated_date: formatDate(item.updated_date),
      enquiry_date: formatDate(item.enquiry_date),
      enquiryClosedAt: formatDate(item.enquiryClosedAt),
    }));
    console.log("formatted enquiries", formattedData);
    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    res.status(400).json({ success: true, message: error.message });
  }
};

exports.updateEnquiry = async (req, res) => {
  console.log("update enquiry called");
  try {
    const { id } = req.params;
    const data = req.body;
    let mobileNo = data.mobile_no || data.mobile;

    if (Array.isArray(mobileNo)) {
      mobileNo = mobileNo[0];
    }

    const formattedData = {
      ...data,
      mobile: mobileNo ? String(mobileNo) : undefined,
      enquiryClosedAt: new Date().toISOString(),
    };
    
    console.log("formattedData from enquiries", formattedData);
    const result = await enquiries.findOneAndUpdate(
      { enquiry_id: id, status: 1 },
      { $set: { ...formattedData } },
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
    console.error("Update Enquiry Error:", error)
    res
      .status(400)
      .json({ success: false, message: "Error Updating Lead data" });
  }
};

exports.removeEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("lead id", id);
    const result = await enquiries.findOneAndUpdate(
      { enquiry_id: Number(id), status: 1 },
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
      .json({ success: true, message: "Enquiry data remove successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
