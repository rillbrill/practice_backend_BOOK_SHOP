const express = require('express');
const router = express.Router();
const {
    allCategory
} = require('../controller/CategoryController');

// POST 메소드로 res의 body에 json을 받을 것이므로
router.use(express.json());

router.get('/', allCategory); // 카테고리 전체 목록 조회

module.exports = router