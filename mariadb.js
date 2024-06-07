// mysql2 모듈을 사용하여 db를 연결해준다
// mysql 모듈 소환
const mariadb = require('mysql2');

// DB와 연결 통로 생성
const connection = mariadb.createConnection({
    //host : 'localhost',
    host : '127.0.0.1',
    user : 'root',
    password : 'sumincho',
    database : 'BookShop',
    dateStrings : true
});

module.exports = connection;