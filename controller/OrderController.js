const {StatusCodes} = require('http-status-codes'); // status code 모듈
const conn = require('../mariadb'); // db 모듈
const { get } = require('../routes/users');
const mariadb = require('mysql2/promise');

// 주문하기
const order = (req, res) => {
    const {items, delivery, totalQuantity, totalPrice, userId, firstBookTitle} = req.body;
    
    let delivery_id;
    let order_id;

    let sql = `IINSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);`
    let values = [delivery.address, delivery.receiver, delivery.contact];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            delivery_id = results.insertId;
        }) 
    
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
            VALUES (?, ?, ?, ?, ?);`
    
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id]

    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            order_id = results.insertId;
        })

    sql = `INSERT INTO orderedBook (ordered_id, book_id, quantity) VALUES ?;`

    // items가 배열로 넘어옴 - 요소들을 하나씩 꺼내서 values 각각 만들어 전달
    values = [];
    items.forEach((item) => {
        values.push([order_id, item.book_id, item.quantity]);
    })
    conn.query(sql, [values],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            order_id = results.insertId;

            return res.status(StatusCodes.OK).json(results);
        })
    
}

// 주문 목록 조회
const getOrders = async (req, res) => {
    const conn = await mariadb.createConnection({
        host : '127.0.0.1',
        user : 'root',
        password : 'sumincho',
        database : "Bookshop",
        dateStrings : true
    });
    let sql = `SELECT orders.id, created_at, address, receiver, book_title, total_quantity, total_price, contact 
                FROM orders LEFT JOIN delivery 
                ON orders.delivery_id = delivery.id;`

    let [rows, fields] = await conn.query(sql);
    return res.status(StatusCodes.OK).json(rows);
}

// 주문 상세 조회
const getOrderDetail = async (req, res) => {
    const {id} = req.params;

    const conn = await mariadb.createConnection({
        host : '127.0.0.1',
        user : 'root',
        password : 'sumincho',
        database : "Bookshop",
        dateStrings : true
    });
    let sql = `SELECT book_id, title, author, price, quantity
                FROM orderedBook LEFT JOIN books 
                ON orderedBook.book_id = books.id
                WHERE ordered_id = ?;`

    let [rows, fields] = await conn.query(sql, [id]);
    return res.status(StatusCodes.OK).json(rows);
}

module.exports = {
    order,
    getOrders,
    getOrderDetail
};