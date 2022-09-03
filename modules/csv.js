const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

headerAry = {
    name: { id: 'name', title: '名前' },
    email: { id: 'email', title: 'メールアドレス' },
    birth: { id: 'birth', title: '誕生日' },
    address: { id: 'address', title: '住所' }
}
exports.writeCsv = async function (path, obj) {
    //dbデータのkeyを配列にする
    const keysAry = Object.keys(obj[0]);
    let header = keysAry.map((key) => {
        if (headerAry[key]) {
            return headerAry[key];
        }
    })
    const csvWriter = createCsvWriter({
        path: path,
        header: header
    });
    csvWriter.writeRecords(obj);
}
exports.resCsv = async function (obj) {
    //dbデータのkeyを配列にする
    const keysAry = Object.keys(obj[0]);

    let header = keysAry.map((key) => {
        if (headerAry[key]) {
            return headerAry[key];
        }
    })
    const csvWriter = createCsvStringifier({
        header: header
    });
    return csvWriter.getHeaderString() + csvWriter.stringifyRecords(obj);
}