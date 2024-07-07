const express = require('express'); // expres ahebf
const router = express.Router();
const conn = require('../mariadb'); // db 모듈
//const {StatusCodes} = require('http-status-codes'); // status code 모듈

// 모듈 여러개를 받아오므로 비구조화 사용
const {
    join, 
    login, 
    passwordResetRequest, 
    passwordReset
} = require('../controller/UserController');

// POST 메소드로 res의 body에 json을 받을 것이므로
router.use(express.json());

router.post('/join', join); // 회원가입
router.post('/login', login); // 로그인
router.post('/reset', passwordResetRequest); // 비밀번호 초기화 요청
router.put('/reset', passwordReset); // 비밀번호 초기화


module.exports = router