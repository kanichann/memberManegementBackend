const express = require('express');
const auth = require('../middleware/auth')
const scheduleController = require('../controllers/schedule');

const router = express.Router();

router.get('/', auth, scheduleController.getdata);
router.post('/set', auth, scheduleController.postSet);
router.post('/update', auth, scheduleController.postUpdate);






// router.get('/scraping', scrapingController.getscraping);

module.exports = router;