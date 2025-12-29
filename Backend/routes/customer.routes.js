const express = require("express");
const router = express.Router();
const {
  addCustomer,
  getCustomer,
  getCompanyId,
  updateCustomer,
  removeCustomer,
} = require("../controllers/customer.controller");

router.post("/customers", addCustomer);
router.get("/customers", getCustomer);
router.get("/getCompanyId", getCompanyId);
router.put("/customers/:id", updateCustomer);
router.put("/removeCustomer/:id", removeCustomer);

module.exports = router;
