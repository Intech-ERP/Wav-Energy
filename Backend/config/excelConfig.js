module.exports = {
  Enquiry: {
    sheetName: "Enquiry Report",
    fileName: "Enquiry_Report.xlsx",
    columns: [
      { header: "Enquiry ID", key: "enquiry_id", width: 15 },
      { header: "Company Name", key: "company_name", width: 25 },
      { header: "Contact Person", key: "contact_person", width: 25 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Enquiry Type", key: "enquiry_type", width: 30 },
      { header: "Sub type", key: "sub_type", width: 12 },
      { header: "Lead source", key: "lead_source", width: 20 },
      { header: "Action", key: "action", width: 20 },
      { header: "Company details", key: "company_details", width: 20 },
      { header: "Last Followup Date", key: "last_followup_date", width: 20 },
      { header: "Next Followup Date", key: "next_followup_date", width: 20 },
    ],
  },

  Lead: {
    sheetName: "Lead Report",
    fileName: "Lead_Report.xlsx",
    columns: [
      { header: "Lead ID", key: "lead_id", width: 15 },
      { header: "Company Name", key: "company_name", width: 25 },
      { header: "Contact Person", key: "contact_person", width: 25 },
      { header: "Mobile", key: "mobile", width: 20 },
      { header: "Email", key: "email", width: 15 },
      { header: "Address", key: "address", width: 12 },
      { header: "Website", key: "website", width: 20 },
      { header: "Next Followup Date", key: "next_followup_date", width: 20 },
      { header: "Last Followup Date", key: "last_followup_date", width: 20 },
      { header: "company Details", key: "company_details", width: 20 },
    ],
  },
};
