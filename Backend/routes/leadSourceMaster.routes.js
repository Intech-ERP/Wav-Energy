const express = require('express')
const { addLeadSource, getLeadSource, updateDisplayOrder, updateLeadSource, removeLeadSource } = require('../controllers/leadSourceMaster.controller')

const router = express.Router()

router.post('/lead_source', addLeadSource)
router.get('/lead_source', getLeadSource)
router.put("/updatelead_sourcedisp_order/:id", updateDisplayOrder);
router.post("/updatelead_source", updateLeadSource);
router.put("/removelead_source/:id", removeLeadSource);

module.exports = router;