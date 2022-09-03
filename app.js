const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express');
const fs = require('fs');

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


app.use(express.static(path.join(__dirname, 'data')))
app.use('/lib', express.static(path.join(__dirname, 'lib')))


app.use(memberRoute);
app.use('/schedule', scheduleRoute)
app.use('/notification', notificationRoute)

// app.use(errorController.get404);
app.use((req, res, next) => {
    const error = new Error();
    error.statusCode = 404;
    error.msg = 'ページが見つかりません。'
    return next(error)
})
app.use((error, req, res, next) => {
    console.log(error);
    console.log('エラー！！！！！');
    if (req.file) {
        console.log(req.file, 'tkaotkaoktoat', req.file.path);
        fs.unlink(req.file.path, (err) => {
            console.log(err);

        });
    }
    res.status(error.statusCode || 400).json({ msg: error.msg || "エラーが発生いたしました。" });
})


app.listen(3002);
