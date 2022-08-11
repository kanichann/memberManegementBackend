
const fs = require('fs');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const { memberLogin, memberRegister, memberInfo, memberPersonalInfo } = require('../models/member')
// const member = require('../models/member')

exports.postLogin = async (req, res, next) => {
    console.log(req.body.email, 'email')
    memberLogin(req.body.email, async (dbres, err) => {
        console.log(req.body.pass, dbres, 'dbresspostLogin')
        if (!dbres) {
            console.log('adressみす');
            const error = new Error(err);
            error.msg = 'メールアドレスもしくはパスワードに誤りがあります。'
            return next(error);
        }
        const judge = await bcrypt.compare(req.body.pass, dbres.password);
        console.log(judge)
        if (!judge) {
            console.log('adressみす');
            const error = new Error(err);
            error.msg = 'メールアドレスもしくはパスワードに誤りがあります。'
            next(error);
            // res.status(400).json({ msg: 'メールアドレスもしくはパスワードに誤りがあります。' })
            // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
        } else {
            // res.setHeader('Set-Cookie',  'loggedIn=true');
            // res.cookie('loggedIn', 'true', {
            //     maxAge: 60000,
            //     samesite: 'none'
            // }
            // )
            const token = jwt.sign({
                mail: dbres.email,
                userId: dbres.member_id,
                admin: dbres.admin
            }, 'someSupterpass',
                { expiresIn: '1h' });
            // res.status(201).json(JSON.stringify(dbres));
            console.log(token, 'token')
            res.status(201).json({ token: token, admin: dbres.admin });
        }
    });
}

exports.postRegister = async (req, res, next) => {
    const pass = await bcrypt.hash(req.body.pass, 12)
    memberRegister(req.body.name, req.body.email, pass, req.body.birth, req.body.address, (dbres = null, err) => {
        console.log(dbres, err);
        if (err) {
            res.status(400).json(JSON.stringify({ err: '通信失敗' }))
            // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
        } else {
            console.log(dbres, "mem25");
            const token = jwt.sign({
                mail: req.body.email,
                userId: dbres.member_id,
            }, 'someSupterpass',
                { expiresIn: '1h' });
            // res.status(201).json(JSON.stringify(dbres));
            res.status(201).json({ token: token, admin: 0 });
            // res.status(201).json(JSON.stringify({ data: 'いけた' }));
        }
    });
}
exports.getMember = async (req, res, next) => {
    console.log(req.mail, 'getMember,Member,57');
    memberInfo(req.mail, (dbres = null, err) => {

        if (err) {
            res.status(400).json(JSON.stringify({ err: '通信失敗' }))
            // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
        } else {
            console.log(dbres, "mem25");
            res.status(201).json(dbres);
        }
    });
}
exports.getPersonalInfo = async (req, res, next) => {
    memberPersonalInfo(req.mail, (dbres = null, err) => {

        if (err) {
            res.status(400).json(JSON.stringify({ err: '通信失敗' }))
            // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
        } else {
            console.log(dbres, 'getPI');
            res.status(201).json(dbres);
        }
    });
}