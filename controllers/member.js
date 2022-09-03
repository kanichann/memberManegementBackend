
const fs = require('fs');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { memberLogin, memberRegister, memberInfo, memberPersonalInfo, memberAddress, memberAddAddress, memberChangeAddress, memberChangeEmail, memberGetEmail, memberGetAll } = require('../models/member');
const { writeCsv, resCsv } = require('../modules/csv')


const { validationResult } = require('express-validator');
const path = require('path');
// const member = require('../models/member')

exports.postLogin = async (req, res, next) => {

    memberLogin(req.body.email, async (dbres, err) => {
        if (!dbres) {
            const error = new Error(err);
            error.msg = 'メールアドレスもしくはパスワードに誤りがあります。'
            return next(error);
        }
        const judge = await bcrypt.compare(req.body.pass, dbres.password);
        if (!judge) {
            console.log('adressみす');
            const error = new Error(err);
            error.msg = 'メールアドレスもしくはパスワードに誤りがあります。'
            error.statusCode = 404;
            return next(error)

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

    const errors = validationResult(req);
    console.log(errors, 'validate');
    if (!errors.isEmpty()) {
        const error = new Error();
        error.msg = "無効な入力です。";
        error.statusCode = 422
        return next(error);
    }
    const pass = await bcrypt.hash(req.body.pass, 12)
    try {
        memberRegister(req.body.name, req.body.email, pass, req.body.birth, req.body.address, next, (dbres = null, err) => {
            if (err) {
                const error = new Error(err);
                error.msg = 'メールアドレスは既に登録されています。'
                error.statusCode = 422
                return next(error);
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
    } catch (err) {
        const error = new Error(err);
        console.log('takotakotakokok')
        error.statusCode = 400;
        return next(error);
    }
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
exports.getAddress = async (req, res, next) => {
    console.log('resresre');
    memberAddress(req.userId, (dbres = null, err) => {
        if (err) {
            res.status(400).json(JSON.stringify({ err: '通信失敗' }))
            // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
        } else {
            console.log(dbres, req.userId, 'getPI');
            res.status(201).json(dbres);
        }
    })
}
exports.getAllMember = async (req, res, next) => {
    memberGetAll((dbres = null, err) => {
        if (err) {
            res.status(400).json(JSON.stringify({ err: '通信失敗' }))
            // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
        } else {
            let headerAry = {
                name: '名前',
                email: 'メールアドレス',
                birth: '誕生日',
                address: '住所'
            }
            const keysAry = Object.keys(dbres[0]);
            let header = keysAry.map((key) => {
                if (headerAry[key]) {
                    return headerAry[key];
                }
            })


            res.status(201).json({ titles: header, data: dbres });
        }
    })
}
exports.postAddAddress = async (req, res, next) => {
    console.log('reqresu')
    memberAddAddress(req.userId, req.body.address, (dbres = null, err) => {
        if (err) {
            res.status(400).json(JSON.stringify({ err: '通信失敗' }))
            // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
        } else {
            console.log(dbres);
            res.status(201).json(dbres);
        }
    })
}
exports.postChangeAddress = async (req, res, next) => {
    console.log('reqresu', req.body.addressId)
    memberChangeAddress(req.userId, req.body.addressId, (dbres = null, err) => {

        if (err) {
            res.status(400).json(JSON.stringify({ err: '通信失敗' }))
            // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
        } else {
            console.log(dbres);
            res.status(201).json(dbres);
        }
    })
}
exports.postChangeEmail = async (req, res, next) => {
    memberChangeEmail(req.userId, req.body.email, (err) => {
        if (err) {
            res.status(400).json(JSON.stringify({ err: '通信失敗' }))
        } else {
            res.status(201).json(JSON.stringify({ message: 'メールアドレスを変更しました。' }));
        }
    })
}
exports.getEmail = async (req, res, next) => {
    memberGetEmail(req.userId, (dbres = null, err) => {
        console.log(dbres);
        if (err) {
            res.status(400).json(JSON.stringify({ err: '通信失敗' }))
            // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
        } else {
            res.status(201).json(dbres);
        }
    })
}
exports.getMemberCsv = async (req, res, next) => {
    memberGetAll(async (dbres = null, err) => {
        if (err) {
            res.status(400).json(JSON.stringify({ err: '通信失敗' }))
            // res.status(400).json(JSON.stringify({ message: '通信失敗' }))
        } else {

            let csv = await resCsv(dbres);
            console.log(csv);
            res.setHeader('Content-disposition', 'attachment; filename=data.csv');
            res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
            res.send(csv)

            // await writeCsv('lib/data.csv', dbres);

            // // const options = {
            // //     root: path.join(__dirname, '../lib'),
            // //     dotfiles: 'deny',
            // //     headers: {
            // //         'x-timestamp': Date.now(),
            // //         'x-sent': true,
            // //         'Content-Type': 'application/force-download'
            // //     }
            // // }
            // console.log(path.join(__dirname, '../lib/data.csv'));
            // res.download(path.join(__dirname, '../lib/data'), 'data.csv')
        }
    })
}