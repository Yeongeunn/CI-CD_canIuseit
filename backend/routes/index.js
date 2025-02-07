// 모든 라우트 관리

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const productRoutes = require('./productRoutes');
const lookRoutes = require('./lookRoutes');
const calendarRoutes = require('./calendarRoutes');

router.use('/auth', authRoutes);
router.use('/api/products', productRoutes);
router.use('/look', lookRoutes);
router.use('/calendar', calendarRoutes);

router.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

router.get('/calendar', (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    res.render('calendar', { user: req.user });
});

module.exports = router;