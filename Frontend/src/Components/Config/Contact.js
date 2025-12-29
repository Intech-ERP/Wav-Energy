export const contactForm = [
  { label: "Name", name: "name", type: "text", required: true },
  { label: "Designation", name: "designation", type: "text", required: true },
  { label: "Department", name: "department", type: "text", required: true },
  { label: "Mailer", name: "mailer", type: "text", required: false },
  {
    label: "Personal Mobile No",
    name: "mobile_no1",
    type: "number",
    required: false,
  },
  { label: "Birthday", name: "birthday", type: "date", required: false },
  {
    label: "Official Mobile No",
    name: "mobile_no2",
    type: "number",
    required: true,
  },
  { label: "Anniversary", name: "anniversary", type: "date", required: false },
  {
    label: "Official Mail",
    name: "official_mail",
    type: "email",
    required: true,
  },
  {
    label: "Personal Mail",
    name: "personal_mail",
    type: "email",
    required: false,
  },
  {
    label: " Personal Address",
    name: "personal_address",
    type: "text",
    required: false,
  },
];
