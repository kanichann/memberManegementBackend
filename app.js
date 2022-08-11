const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express');
// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'lib/')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
//     }
// })
// const upload = multer({ storage: storage })

const memberRoute = require('./routes/member.js')
const scheduleRoute = require('./routes/schedule.js')
const notificationRoute = require('./routes/notification.js')

const app = express();

app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3001");
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Control-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

// app.post('/lib', upload.single('file'), function (req, res, next) {
//     console.log('ap')
//     console.log(req.file)
// })


app.use(express.static(path.join(__dirname, 'data')))
app.use('/lib', express.static(path.join(__dirname, 'lib')))


app.use(memberRoute);
app.use('/schedule', scheduleRoute)
app.use('/notification', notificationRoute)

// app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log('エラー！！！！！');
    if (!error.msg) {
        error.msg = 'エラーが発生いたしました。'
    }
    res.status(400).json({ msg: error.msg });
})


app.listen(3002);
