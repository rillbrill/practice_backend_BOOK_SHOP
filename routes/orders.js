const express = require('express');
const router = express.Router();

// POST 메소드로 res의 body에 json을 받을 것이므로
router.use(express.json());

// 주문하기
router.post('/', (req, res) => {

});

// 주문 목록 조회
router.get('/', (req, res) => {
    
});

// 줌누 상세 상품 조회
router.get('/:id', (req, res) => {
    
});


module.exports = router