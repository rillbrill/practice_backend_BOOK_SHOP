const express = require('express');
const router = express.Router();
const {addToCart, getCartItems, removeCartItem} = require('../controller/CartController');

// POST 메소드로 res의 body에 json을 받을 것이므로
router.use(express.json());

router.post('/', addToCart); // 장바구니 담기
router.get('/', getCartItems); // 장바구니 아이템 목록 조회 + 선택한 장바구니 아이템만 목록 조회
router.delete('/:id',removeCartItem); // 장바구니 도서 삭제
//router.get('/carts', ); // 장바구니에서 선택한 주문 예상 상품 목록 조회



module.exports = router