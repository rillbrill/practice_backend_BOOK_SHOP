const {StatusCodes} = require('http-status-codes'); // status code 모듈
const conn = require('../mariadb'); // db 모듈
const jwt = require('jsonwebtoken'); // jwt 모듈
const crypto = require('crypto'); // crypto 모듈 - 암호화
const dotenv = require('dotenv'); // dotenv 모듈
dotenv.config();


const join = (req, res) => {
    const {email, password} = req.body;

    let sql = 'INSERT INTO users (email, password, salt) VALUES (?, ?, ?)';

    // 암호화된 비번, salt 값을 DB에 저장
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let values = [email, hashPassword, salt];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.CREATED).json(results);
        })
};

const login = (req, res) => {
    const {email, password} = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?'
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0]; // [0] - 한 이메일당 유저는 한 명 뿐이긴 함

            // salt값 꺼내서 날것으로 들어온 비번 암호화 해보기
            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');


            // 디비 비번과 비교하기
            // 로그인 유저가 있고, 그의 비번이 body에서 받은 비번과 같다면
            if (loginUser && loginUser.password == hashPassword) {
                // 토큰 발행
                const token = jwt.sign({
                    email : loginUser.email
                }, process.env.PRIVATE_KEY, {
                    expiresIn : '5m',
                    issuer : "me"
                });

                // 토큰 쿠키에 담기
                res.cookie("token", token, {
                    httpOnly : true
                });

                console.log(token);

                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end(); // 401 : 비인증 상태
            }
        })
};

const passwordResetRequest = (req, res) => {
    const {email, password} = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?'
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            // 이메일로 유저가 있는지 찾아보기
            const user = results[0];
            if (user) {
                return res.status(StatusCodes.OK).json({
                    email : email
                }); 
                // 이렇게 프론트에게 이메일 날리면, 프론트엔드가 이메일을 받아서 passwordReset에게 넘겨줄 것임
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
};

const passwordReset = (req, res) => {
    const {email, password} = req.body;

    // salt 값도 UPDATE 해준다
    let sql = 'UPDATE users SET password=?, salt=? WHERE email=?';

    // 암호화된 비번, salt 값을 DB에 저장
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let values = [hashPassword, salt, email];
    conn.query(sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows == 0) { //이미 프론트에서 이메일을 검증하긴 했지만 혹시 모르니
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        }
    )
};

// 모듈이 여러개이므로 json에 담아서 보냄
module.exports = {
    join, 
    login, 
    passwordResetRequest, 
    passwordReset
};