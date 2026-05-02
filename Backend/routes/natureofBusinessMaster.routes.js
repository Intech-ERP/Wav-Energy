const express = require('express')
const { addNatureofBusiness, getNatureofBusiness, updateDisplayOrder, updateNatureofBusiness, removeNatureofBusiness } = require('../controllers/natureofBusinessMaster.controller')

const router = express.Router()

router.post('/natureofBusiness', addNatureofBusiness)
router.get('/natureofBusiness', getNatureofBusiness)
router.put('/updatenature_of_businessdisp_order/:id', updateDisplayOrder)
router.post('/updateNatureofBusiness', updateNatureofBusiness)
router.put('/removenature_of_business/:id', removeNatureofBusiness)


module.exports = router;