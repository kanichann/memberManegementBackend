
const fs = require('fs');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const { schduleInsert, scheduleData, schduleUpdate } = require('../models/scheudule');

// const member = require('../models/member')


exports.getdata = async (req, res, next) => {
    console.log(req.mail, 'getdata');
    scheduleData(req.userId, (dbres = null, err) => {
        console.log(dbres, 'tesutotesuto');
        if (err) {
            res.status(400).json(JSON.stringify({ err: '通信失敗' }))
            // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
        } else {
            console.log(dbres, "mem25");
            res.status(201).json(dbres);
        }
    });
}
exports.postSet = async (req, res, next) => {
    const { schedule, scheduleDetail, type, startTime, endTime, date, memberOpen } = req.body;

    console.log(req.body);
    console.log(req.userId);
    console.log("memberOpen", memberOpen);
    schduleInsert(schedule, scheduleDetail, type, startTime, endTime, req.userId, memberOpen, date, (dbres, err) => {
        res.status(201).json(dbres)
    })
}
exports.postUpdate = async (req, res, next) => {
    const { schedule, scheduleDetail, type, startTime, endTime, date, id } = req.body;

    schduleUpdate(schedule, scheduleDetail, type, startTime, endTime, req.userId, date, id, (dbres, err) => {
        res.status(201).json(dbres)
    })
}

// exports.postRegister = async (req, res, next) => {
//     const pass = await bcrypt.hash(req.body.pass, 12)
//     memberRegister(req.body.name, req.body.email, pass, (dbres = null, err) => {
//         console.log(dbres, err);
//         if (err) {
//             res.status(400).json(JSON.stringify({ err: '通信失敗' }))
//             // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
//         } else {
//             console.log(dbres, "mem25");
//             const token = jwt.sign({
//                 mail: req.body.email,
//                 userId: dbres.id,
//             }, 'someSupterpass',
//                 { expiresIn: '1h' });
//             // res.status(201).json(JSON.stringify(dbres));
//             res.status(201).json({ token: token, admin: 0 });
//             // res.status(201).json(JSON.stringify({ data: 'いけた' }));
//         }
//     });
// }
// exports.getMember = async (req, res, next) => {
//     console.log(req.mail, 'getMember,Member,57');
//     memberInfo(req.mail, (dbres = null, err) => {

//         if (err) {
//             res.status(400).json(JSON.stringify({ err: '通信失敗' }))
//             // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
//         } else {
//             console.log(dbres, "mem25");
//             res.status(201).json(dbres);
//         }
//     });
// }
