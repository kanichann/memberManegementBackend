const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('data/member.sqlite3');


exports.memberAll = async function (cb) {
    db.serialize(() => {
        db.all("select * from member", (err, res) => {
            if (!err) {
                cb(res)
            }
        })
    })

}

exports.memberLogin = async function (mail, cb) {
    await db.serialize(() => {
        // db.get(`select * from memberData where mail = ${String(mail)} AND pass = ${pass}`, (err, res) => {
        db.get("select member_id,email,password,admin from member where email = ?", mail, (err, res) => {
            cb(res, err)
        })
    })
}
exports.memberRegister = async function (name, mail, pass, birth, address, cb) {
    db.serialize(() => {
        // db.get(`select * from memberData where mail = ${String(mail)} AND pass = ${pass}`, (err, res) => {
        db.run("insert into member(name,email,password,birth,address) values(?,?,?,?,?);", name, mail, pass, birth, address,);
        db.get("select member_id from member where email = ?", mail, (err, res) => {
            cb(res, err)
        })
    })
}
exports.memberInfo = async function (mail, cb) {
    console.log(mail, "member37");
    db.serialize(() => {
        db.get("select * from member where email = ?", mail, (err, res) => {
            console.log(res, 'member40');
            cb(res, err)
        })
    })
}
exports.memberPersonalInfo = async function (mail, cb) {
    db.serialize(() => {
        db.get("select address,birth from member where email = ?", mail, (err, res) => {
            cb(res, err)
        })
    })
}

// WHERE dept = 'sales' AND id = '001'