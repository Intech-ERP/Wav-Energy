const contactCollection = require("../models/contact.model");

exports.addContact = async (req, res) => {
  try {
    const data = req.body;
    console.log("Add contact:");
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "data is required" });
    }

    for (const contact of data) {
      const contactData = new contactCollection({
        company_id: contact.company_id,
        title: contact.title,
        contact_name: contact.name,
        designation: contact.designation,
        dept: contact.department,
        mobile: contact.mobile_no2,
        personal_mobile: contact.mobile_no1,
        email: contact.official_mail,
        personal_email: contact.personal_mail,
        birthday: contact.birthday,
        anniversary: contact.anniversary,
        personal_address: contact.personal_address,
      });

      await contactData.save();
    }

    res.status(200).json({
      success: true,
      message: "Contact added successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getContacts = async (req, res) => {
  console.log("Fetching contacts for company ID:", req.params.id);
  try {
    const id = req.params.id;
    const contactsData = await contactCollection
      .find({ status: 1, company_id: id }, { _id: 0 })
      .lean();
    res.status(200).json({
      success: true,
      data: contactsData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contacts = req.body;

    const update = {
      title: contacts.title,
      contact_name: contacts.name,
      dept: contacts.department,
      mobile: String(contacts.mobile_no2 || ""),
      personal_mobile: contacts.mobile_no1,
      email: contacts.official_mail,
      personal_email: contacts.personal_mail,
      personal_address: contacts.personal_address,
    };
    console.log("updateContact", contacts);

    const result = await contactCollection.findOneAndUpdate(
      { contact_id: contactId },
      { $set: update },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact updated successfully!",
      data: result,
    });
  } catch (error) {
    console.error("updateContact error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.removeContact = async (req, res) => {
  try {
    const contactId = req.params.id;

    console.log("remove contact id", contactId);

    const result = await contactCollection.findOneAndUpdate(
      { contact_id: contactId, status: 1 },
      { $set: { status: 0 } },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "contacts not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "contact removed succeddfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
