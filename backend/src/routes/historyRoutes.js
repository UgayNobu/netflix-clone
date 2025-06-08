const express = require('express');
const historyController = require('../controllers/historyController');

const router = express.Router();

router
  .route('/')
  .get(historyController.getAllHistory)
  .post(historyController.addToHistory);

router
  .route('/user/:userId')
  .get(historyController.getUserHistory)
  .delete(historyController.clearUserHistory);

router
  .route('/:id')
  .get(historyController.getHistoryItem)
  .patch(historyController.updateHistory)
  .delete(historyController.deleteHistoryItem);

module.exports = router;