export const EnquiryForm = [
  { label: "Company Name", name: "company_name", type: "text", required: true },
  {
    label: "Contact Person",
    name: "contact_person",
    type: "text",
    required: true,
  },
  { label: "Mobile No", name: "mobile_no", type: "number", required: true },
  { label: "Email ID", name: "email_id", type: "email", required: true },
  { label: "Address", name: "address", type: "multiline", required: true },
  { label: "Website", name: "website", type: "text", required: true },
  {
    label: "Next Followup Date",
    name: "next_followup_date",
    type: "date",
    required: true,
  },
  {
    label: "Company Details",
    name: "company_details",
    type: "multiline",
    required: true,
  },
];
