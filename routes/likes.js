const express = require('express');
const router = express.Router();
const {addLike, removeLike} = require('../controller/LikeController');

// POST 메소드로 res의 body에 json을 받을 것이므로
router.use(express.json());

router.post('/:id', addLike); // 좋아요 추가
router.delete('/:id', removeLike); // 즇아요 삭제


module.exports = router;