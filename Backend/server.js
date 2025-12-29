const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const customerRoute = require("./routes/customer.routes.js");
const contactRoute = require("./routes/contact.routes.js");
const enquiryRoute = require("./routes/enquiry.routes.js");
const leadGenerateRoute = require("./routes/leadGenerate.routes.js");
const advisoryMaster = require("./routes/advisoryMaster.routes.js");
const executionMaster = require("./routes/executionMaster.routes.js");
const operationMaster = require("./routes/operationMaster.routes.js");

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//database
connectDB();

//routes
app.use("/api", customerRoute);
app.use("/api", contactRoute);
app.use("/api", enquiryRoute);
app.use("/api", leadGenerateRoute);
app.use("/api", advisoryMaster);
app.use("/api", executionMaster);
app.use("/api", operationMaster);

//server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
