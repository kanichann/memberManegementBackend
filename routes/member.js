const express = require('express');
const auth = require('../middleware/auth')
const memberController = require('../controllers/member');
const { check } = require('express-validator')
const router = express.Router();

// /admin/add-product => GET
router.post('/login', memberController.postLogin);
router.post('/register', [check("name").not().isEmpty(), check("email").normalizeEmail().isEmail(), check("pass").isLength({ min: 6 }), check("birth").not().isEmpty(), check("address").not().isEmpty(),], memberController.postRegister);
router.get('/memberinfo', auth, memberController.getMember);
router.get('/all_member_info', auth, memberController.getAllMember);
router.get('/scheduleSet', auth, memberController.getMember);
router.get('/personal_info', auth, memberController.getPersonalInfo);
router.get('/get_address', auth, memberController.getAddress);
router.post('/add_address', auth, memberController.postAddAddress);
router.post('/change_address', auth, memberController.postChangeAddress);
router.post('/change_email', auth, memberController.postChangeEmail);
router.get('/get_email', auth, memberController.getEmail);

router.get('/get_member_csv', auth, memberController.getMemberCsv)





// router.get('/scraping', scrapingController.getscraping);

module.exports = router;