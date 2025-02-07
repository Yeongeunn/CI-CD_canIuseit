// Express 앱 설정
 
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const flash = require('connect-flash');
const routes = require('./routes'); // 모든 라우트 중앙 관리
const sequelize = require('./config/database');
require('./config/passport-setup');

const app = express();

// CORS 설정
app.use(cors({
    origin: 'http://localhost:3000',
}));

// 세션 설정
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
    }),
    cookie: { secure: false }  // HTTPS 사용 시 true로 설정
}));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

// 플래시 메시지 설정
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, '..', 'frontend', 'resources')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));

// 라우트 연결
app.use(routes);

module.exports = app;