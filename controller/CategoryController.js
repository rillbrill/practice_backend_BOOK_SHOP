const {StatusCodes} = require('http-status-codes'); // status code 모듈
const conn = require('../mariadb'); // db 모듈


// 카테고리 전체 목록 리스트
const allCategory = (req, res) => {

    let sql = "SELECT * FROM category";
    conn.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
};

module.exports = {
    allCategory
};