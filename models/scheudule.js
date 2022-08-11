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

exports.scheduleData = async function (Id, cb) {
    console.log(Id, 'takodd');
    db.serialize(() => {
        db.all("select * from schedule_detail where schedule_id = ? or memberopen = ?", Id, 1, (err, res) => {
            if (!err) {

                cb(res)
            }
        })
    })
}

exports.schduleInsert = async function (schedule, scheduleDetail, type, startTime, endTime, id, memberOpen, date, cb) {
    console.log(schedule, scheduleDetail, type, startTime, endTime, id);
    console.log(memberOpen)
    memberOpen = memberOpen === "true" ? 1 : 0;
    console.log(memberOpen, 'fdaj;kadf;jk');
    db.serialize(() => {
        db.run("insert into schedule_detail (schedule,schedule_detail,schedule_type,schedule_start,schedule_end,schedule_id,schedule_date,memberopen) values(?,?,?,?,?,?,?,?); ", schedule, scheduleDetail, type, startTime, endTime, id, date, memberOpen);
        db.all("select * from schedule_detail where schedule_id = ?", id, (err, res) => {
            console.log('取得結果', res);
            cb(res, err)
        })
    })
}

exports.schduleUpdate = async function (schedule, scheduleDetail, type, startTime, endTime, schedule_id, date, id, cb) {
    console.log(schedule, 'kekkkkkkkka');
    console.log(schedule);
    db.serialize(() => {
        db.run("UPDATE schedule_detail set schedule = ?,schedule_detail = ?,schedule_type = ?,schedule_start = ?,schedule_end = ?,schedule_id = ?,schedule_date = ? where id=?;", schedule, scheduleDetail, type, startTime, endTime, schedule_id, date, id);
        db.all("select * from schedule_detail where schedule_id = ?", schedule_id, (err, res) => {
            console.log('取得結果', res);
            cb(res, err)
        })
    })
}

