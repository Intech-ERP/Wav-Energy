// const customerModel = require("../models/customer.model");
const customers = require("../models/customer.model");

exports.addCustomer = async (req, res) => {
  try {
    const payload = req.body;

    console.log("data", payload);

    const isExistingCustomer = await customers.findOne({ company_id: payload.company_id }, { status: 1 }).lean();

    if (isExistingCustomer) {
      return res.status(200).json({ success: true, message:'Lead Generate For Existing Customer'});
    }

    let phoneNumbers;

    if (Array.isArray(payload.phone_no)) {
      phoneNumbers = payload.phone_no.map((item) => item.value);
    }

    if (!payload || payload.length === 0) {
      return res.status(404).json({ message: "data is required" });
    }

    const result = await new customers({
      vendor_code: payload.vendor_code,
      company_name: payload.company_name,
      group_name: payload.group_name,
      alias_name: payload.alias_name,
      add_group: payload.add_group,
      branch_div: payload.branch_div,
      gst_number: payload.gst_number,
      nature_of_biz: payload.nature_of_biz,
      phone_no: phoneNumbers ? phoneNumbers : payload.mobile_no,
      email: payload.email,
      website: payload.website,
      address_line_1: payload.address_line_1,
      address_line_2: payload.address_line_2,
      address_line_3: payload.address_line_3,
      address_line_4: payload.address_line_4,
      country: payload.country,
      state: payload.state,
      pincode: payload.pincode,
      company_details: payload.company_details,
    }).save();
    res.status(200).json({
      success: true,
      message: "Customer created successfully",
      company_id: result.company_id,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customersData = await customers
      .find({ status: 1 }, { _id: 0 })
      .lean();

    res.status(200).json({
      success: true,
      data: customersData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCompanyId = async (req, res) => {
  try {
    const companyIds = await customers.countDocuments();

    let totalCount;

    if (companyIds === 0) {
      totalCount = 1;
    } else {
      totalCount = companyIds + 1;
    }

    res.status(200).json({
      success: true,
      count: totalCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("Updating customer with ID:", typeof Number(id), id);
    console.log("update customer", req.body);
    if (!id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const phoneNumbers = Array.isArray(req.body.phone_no)
      ? req.body.phone_no.map((item) => item.value)
      : [];

    const updatedCustomer = await customers.findOneAndUpdate(
      { company_id: Number(id) },
      {
        $set: {
          ...req.body,
          phone_no: phoneNumbers ? phoneNumbers : [req.body.mobile_no],
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update customer",
      error: error.message,
    });
  }
};

exports.removeCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Removing customer with ID:", typeof Number(id), id);
    if (!id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }
    const removedCustomer = await customers.findOneAndUpdate(
      { company_id: Number(id) },
      { $set: { status: 0 } },
      { new: true }
    );
    if (!removedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({
      success: true,
      message: "Customer removed successfully",
      data: removedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove customer",
      error: error.message,
    });
  }
};
