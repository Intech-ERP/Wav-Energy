const express = require('express');
const { addNextAction, getNextAction, updateDisplayOrder, updateNextAction, removeNextAction } = require('../controllers/nextActionMaster.controller');
const router = express.Router();

router.post('/next_action', addNextAction);
router.get('/next_action', getNextAction);
router.put('/updatenext_actiondisp_order/:id', updateDisplayOrder);
router.post('/updatenext_action', updateNextAction);
router.put('/removenext_action/:id', removeNextAction);

module.exports = router;