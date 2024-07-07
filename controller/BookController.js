const {StatusCodes} = require('http-status-codes'); // status code 모듈
const conn = require('../mariadb'); // db 모듈


// 전체 도서 조회 + 카테고리별 도서 조회
const allBooks = (req, res) => {
    let {category_id, news, limit, currentPage} = req.query;

    // limit : page 당 도서 수 ex. 3
    // currentPage : 현재 몇 페이지 ex. 1, 2, 3 ...
    // offset : limit * (currentPage-1) ex. 0, 3, 6 ...
    let offset = limit * (currentPage - 1);

    let sql = `SELECT SQL_CALC_FOUND_ROWS * FROM BookShop.books 
                LIMIT 4 OFFSET 0;`

    //let sql = "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM books";
    let values = [];

    if (category_id && news) {
        sql += " WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        values = [category_id];
    } else if (category_id) {
        sql += " WHERE category_id=?";
        values = [category_id];
    } else if (news) {
        sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    }
    
    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), parseInt(offset));

    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            // result 값이 배열로 날라오므로
            if (results.length) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
    })


    sql += "SELECT found_rows();";
    values.push(parseInt(limit), parseInt(offset));

    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            // result 값이 배열로 날라오므로
            if (results.length) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
    })

};

// 개별 도서 조회
const bookDetail = (req, res) => {
    let {id} = req.params;
    id = parseInt(id);

    let sql = `SELECT * FROM books LEFT JOIN category 
                ON books.category_id = category.id WHERE books.id=?;`;
    conn.query(sql, id, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            if (results[0]) {
                return res.status(StatusCodes.OK).json(results[0]);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        })
};

// 카테고리별 도서 목록 조회 - 쿼리 스트링 사용



module.exports = {
    allBooks,
    bookDetail,
};