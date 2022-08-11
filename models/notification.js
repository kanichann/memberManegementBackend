const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('data/member.sqlite3');


// exports.memberAll = async function (cb) {
//     db.serialize(() => {
//         db.all("select * from member", (err, res) => {
//             if (!err) {
//                 cb(res)
//             }
//         })
//     })
// }

// exports.scheduleData = async function (Id, cb) {
//     console.log(Id, 'takodd');
//     db.serialize(() => {
//         db.all("select * from schedule_detail where schedule_id = ? or memberopen = ?", Id, 1, (err, res) => {
//             if (!err) {

//                 cb(res)
//             }
//         })
//     })
// }
exports.notificationData = async function (cb) {
    db.serialize(() => {
        db.all("select * from notification order by date desc limit 3", (err, res) => {
            console.log('取得結果notifi', res);
            cb(res, err)
        })
    })
}
exports.notificationDataAll = async function (cb) {
    db.serialize(() => {
        db.all("select * from notification order by date desc", (err, res) => {
            console.log('取得結果notiAll', res);
            cb(res, err)
        })
    })
}
exports.notificationInsert = async function (title, contents, type, pdffile, pdfname, cb) {

    db.serialize(() => {
        db.run("insert into notification (title, contents, type,pdffile,pdfname) values(?,?,?,?,?); ", title, contents, type, pdffile, pdfname);
        db.all("select * from notification ", (err, res) => {
            console.log('取得結果のちふぃ', res);
            cb(res, err)
        })
    })
}
exports.readSet = async function (userId, notificationId) {
    db.serialize(() => {
        db.all("insert into notificationRead (read,user_id, notification_id) values (1,?,?); ", userId, notificationId);
    })
}
exports.readGet = async function (userId, cb) {
    console.log(userId, 'readGet')
    db.serialize(() => {
        db.all("select n.* from notification n WHERE NOT exists ( SELECT * FROM notificationRead nr WHERE nr.notification_id = n.id AND nr.user_id = ?) ; ", userId, (err, res) => {
            cb(res, err)
        });
        // n.id,n.date,n.pdfname,pdf.type,n.pdftitle,n.contents,n.pdffile
    })
}
exports.notreadGet = async function (userId, cb) {
    console.log(userId, 'readGet')
    db.serialize(() => {
        db.all("select n.* from notification n WHERE exists ( SELECT * FROM notificationRead nr WHERE nr.notification_id = n.id AND nr.user_id = ?) ; ", userId, (err, res) => {
            cb(res, err)
        });
        // n.id,n.date,n.pdfname,pdf.type,n.pdftitle,n.contents,n.pdffile
    })
}

// exports.schduleUpdate = async function (schedule, scheduleDetail, type, startTime, endTime, schedule_id, date, id, cb) {
//     console.log(schedule, 'kekkkkkkkka');
//     console.log(schedule);
//     db.serialize(() => {
//         db.run("UPDATE schedule_detail set schedule = ?,schedule_detail = ?,schedule_type = ?,schedule_start = ?,schedule_end = ?,schedule_id = ?,schedule_date = ? where id=?;", schedule, scheduleDetail, type, startTime, endTime, schedule_id, date, id);
//         db.all("select * from schedule_detail where schedule_id = ?", schedule_id, (err, res) => {
//             console.log('取得結果', res);
//             cb(res, err)
//         })
//     })
// }

