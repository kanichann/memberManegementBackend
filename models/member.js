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
    db.serialize(() => {
        // db.get(`select * from memberData where mail = ${String(mail)} AND pass = ${pass}`, (err, res) => {
        db.get("select member_id,email,password,admin from member where email = ?", mail, (err, res) => {
            cb(res, err)
        })
    })
}
exports.memberRegister = async function (name, mail, pass, birth, address, next, cb) {
    try {
        let errState;
        let res;
        let member_id;

        new Promise(resolve => {
            db.serialize(() => {

                db.run("insert into member(name,email,password,birth) values(?,?,?,?);", name, mail, pass, birth, function (err) {
                    if (err) {
                        errState = err;
                        console.log(err, '111111');
                        return
                    }
                });
                db.get("select member_id from member where email = ?", mail, (err, dbres) => {
                    member_id = dbres.member_id;
                    res = dbres;
                    if (err) errState = err;
                    console.log('member222', res);
                    resolve();
                })

            })
        }).then(() => {
            db.serialize(() => {

                console.log(member_id, 'mem555');
                db.run("insert into address(address,id,selected) values(?,?,?);", address, member_id, '1', (err) => {
                    if (err) console.log(err);
                    cb(res, errState);
                });


            })
        })


    } catch (dberr2) {
        console.log(dberr2)
        console.log('catch!!!!!!!');
    }
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
exports.memberAddress = async function (id, cb) {
    db.serialize(() => {
        db.all("select * from address where id = ?", id, (err, res) => {
            console.log(res, 'takotkaootko', id)
            cb(res, err)
        })
    })
}

exports.memberAddAddress = async function (id, address, cb) {
    db.serialize(() => {
        db.run("update address set selected = 0 where selected = 1 and id = ?", id, (err) => {
            if (err) console.log(err);
        })
        db.run("insert into address(address,id,selected) values(?,?,?);", address, id, '1', (err) => {
            if (err) console.log(err);
        })
        db.all("select * from address where id = ?", id, (err, res) => {
            console.log(res, 'memberAddAddress')
            cb(res, err)
        })
    })
}
exports.memberChangeAddress = async function (id, addressId, cb) {
    db.serialize(() => {
        db.run("update address set selected = 0 where selected = 1 and id = ?", id, (err) => {
            if (err) console.log(err);
        })
        db.run("update address set selected = 1 where address_id = ?", addressId, (err) => {
            if (err) console.log(err);
        })
        db.all("select * from address where id = ?", id, (err, res) => {
            console.log(res, 'memberAddAddress')
            cb(res, err)
        })
    })
}
exports.memberChangeEmail = async function (id, email, cb) {
    db.serialize(() => {
        db.run("update member set email = ? where member_id = ?", email, id, (err) => {
            if (err) console.log(err);
            cb(err);
        })

    })
}
exports.memberGetEmail = async function (id, cb) {
    db.serialize(() => {
        db.get("select email from member where member_id = ?", id, (err, res) => {
            if (err) console.log(err);
            cb(res, err);
        })

    })
}
exports.memberGetAll = async function (cb) {
    db.serialize(() => {
        // db.all("select m.email,m.name,m.birth,a.address from member m inner join address a where m.member_id = a.id and a.selected = 1 ", id, (err, res) => {
        db.all("select m.email,m.name,m.birth,a.address from member m join address a on m.member_id = a.id where a.selected = 1;  ", (err, res) => {
            if (err) console.log(err);
            cb(res, err);
        })

    })
}

// WHERE dept = 'sales' AND id = '001'