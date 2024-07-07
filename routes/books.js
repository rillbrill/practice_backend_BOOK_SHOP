const express = require('express');
const router = express.Router();
const {
    allBooks,
    bookDetail,
} = require('../controller/BookController');

// POST 메소드로 res의 body에 json을 받을 것이므로
router.use(express.json());

// router.get('/', booksByCategory); // 카테고리별 도서 목록 조회 - 쿼리 스트링 사용
router.get('/', allBooks); // 전체 도서 조회
router.get('/:id', bookDetail); // 개별 도서 조회

module.exports = router