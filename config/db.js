const mysql = require('mysql');
const util = require('util');

const dbConf = mysql.createPool({
    host: 'localhost',
    // port:3306 (optional apabila portnya belum pasti 3306)
    user: 'ariqr',
    password: 'Ariq!234',
    database: 'individual_project'
})

const dbQuery = util.promisify(dbConf.query).bind(dbConf)

module.exports = { dbConf, dbQuery }

// create connection = sekali kita jalankan API, maka koneksinya akan ikut terbuka dan itu akan terus terbuka (antara API dan MYSQL) (digunakan di laptop pribadi)
// create pool = koneksi antara API dan MYSQL dibuka ketika ada request ke MYSQL (apabila sudah diakses dengan server)