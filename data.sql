INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다.", 20000, "2024-05-25");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("신데렐라들", "종이책", 1, "유리구두..", "투명한 유리구두..", "김구두", 100, "목차입니다.", 20000, "2024-05-26");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("백설공주들", "종이책", 2, "사과..", "빨간 사과..", "김사과", 100, "목차입니다.", 20000, "2023-11-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("흥부와 놀부들", "종이책", 3, "제비..", "까만 제비..", "김제비", 100, "목차입니다.", 20000, "2023-12-08");

SELECT * FROM books LEFT
JOIN category ON books.category_id = category.id;

SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id=1;




INSERT INTO likes (user_id, liked_book_id)
VALUES (1, 1);

DELETE FROM likes WHERE user_id = 1 AND liked_book_id = 3;



INSERT INTO likes (user_id, liked_book_id) VALUES (1, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 4);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 5);


// 좋아요 개수가 포함된 books 테이블 조회
SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes FROM books;

// 개별 도서 조회 시, 사용자가 좋아요를 눌렀는지 여부 조회


// 장바구니에 도서 담기
INSERT INTO cartItems (book_id, quantity, user_id) VALUES (1, 1, 1);

// 장바구니 아이템 목록 조회
SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems LEFT JOIN books ON cartItems.book_id = books.id;

// 장바구니 아이템 삭제
DELETE FROM cartItems WHERE id = ?;


// 장바구니에서 선택한(장바구니 도서 id) 아이템 목록 조회
SELECT * FROM BookShop.cartItems
WHERE user_id = 1
AND id IN (1, 3);





// 주문하기
// 배송 정보 입력
INSERT INTO delivery (address, receiver, contact) VALUES ("서울시", "김철수", "1234");
const delivery_id = SELECT max(id) FROM delivery;

// 주문 정보 입력
INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
VALUES ("어린왕자들", 3, 60000, 1, delivery_id);
const order_id = SELECT max(id) FROM orders;

// 주문 상세 목록 입력
INSERT INTO orderedBook (ordered_id, book_id, quantity)
VALUES (order_id, 1, 1);
INSERT INTO orderedBook (ordered_id, book_id, quantity)
VALUES (order_id, 3, 1);

// 가장 최근 추가된 pk 가져오기
SELECT max(id) FROM Bookshop.orderedBook;
SELECT last_insert_id();