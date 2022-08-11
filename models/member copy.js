const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('data/member.sqlite3');


exports.memberAll = async function (cb) {
    db.serialize(() => {
        db.all("select * from memberData", (err, res) => {
            if (!err) {
                cb(res)
            }
        })
    })

}

exports.memberLogin = async function (mail, cb) {
    await db.serialize(() => {
        // db.get(`select * from memberData where mail = ${String(mail)} AND pass = ${pass}`, (err, res) => {
        db.get("select * from memberData where mail = ?", mail, (err, res) => {
            cb(res, err)
        })
    })
}
exports.memberRegister = async function (name, mail, pass, cb) {
    db.serialize(() => {
        // db.get(`select * from memberData where mail = ${String(mail)} AND pass = ${pass}`, (err, res) => {
        db.run("insert into memberData(name,mail,pass,admin) values(?,?,?,?);select last_insert_id()", name, mail, pass, 0);
        db.get("select id from memberData where mail = ?", mail, (err, res) => {
            cb(res, err)
        })
    })
}
exports.memberInfo = async function (mail, cb) {
    console.log(mail, "member37");
    db.serialize(() => {
        db.get("select * from memberData where mail = ?", mail, (err, res) => {
            console.log(res, 'member40');
            cb(res, err)
        })
    })
}

// WHERE dept = 'sales' AND id = '001'