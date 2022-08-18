const express = require('express');
const auth = require('../middleware/auth')
const memberController = require('../controllers/member');
const { check } = require('express-validator')
const router = express.Router();

// /admin/add-product => GET
router.post('/login', memberController.postLogin);
router.post('/register', [check("name").not().isEmpty(), check("email").normalizeEmail().isEmail(), check("pass").isLength({ min: 6 }), check("birth").not().isEmpty(), check("address").not().isEmpty(),], memberController.postRegister);
router.get('/memberinfo', auth, memberController.getMember);
router.get('/scheduleSet', auth, memberController.getMember);
router.get('/personal_info', auth, memberController.getPersonalInfo);





// router.get('/scraping', scrapingController.getscraping);

module.exports = router;