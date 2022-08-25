const express = require('express');
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notification');
const multer = require('multer');
const { check } = require('express-validator')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'lib/')
    },
    filename: function (req, file, cb) {
        const datetime = Date.now();
        req.pdffile = file.fieldname + '-' + datetime + '-' + file.originalname;
        cb(null, file.fieldname + '-' + datetime + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })


const router = express.Router();

// router.get('/', auth, scheduleController.getdata);
router.post('/set', auth, upload.single('file'), function (req, res, next) {
    if (!req.pdfname) {
        req.pdfname = null
    }
    next()
}, [check("title").not().isEmpty(), check("contents").not().isEmpty(), check("type").not().isEmpty(),], notificationController.postSet);

router.get('/', auth, notificationController.get);
router.get('/all', auth, notificationController.getAll);
router.post('/read', auth, notificationController.postread)
router.get('/read', auth, notificationController.getread)
router.get('/notread', auth, notificationController.getnotread)






// router.get('/scraping', scrapingController.getscraping);

module.exports = router;