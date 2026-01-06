const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const customerRoute = require("./routes/customer.routes.js");
const contactRoute = require("./routes/contact.routes.js");
const leadRoute = require("./routes/lead.routes.js");
const enquiryGenerateRoute = require("./routes/enquiryGenerate.routes.js");
const advisoryMaster = require("./routes/advisoryMaster.routes.js");
const executionMaster = require("./routes/executionMaster.routes.js");
const operationMaster = require("./routes/operationMaster.routes.js");
const userRouter = require("./routes/user.routes.js");
const excelReportRouter = require("./routes/excelReportGenerate.routes.js");

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//database
connectDB();

//routes
app.use("/api", customerRoute);
app.use("/api", contactRoute);
app.use("/api", leadRoute);
app.use("/api", enquiryGenerateRoute);
app.use("/api", advisoryMaster);
app.use("/api", executionMaster);
app.use("/api", operationMaster);
app.use("/api", userRouter);
app.use("/api", excelReportRouter);

//server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
