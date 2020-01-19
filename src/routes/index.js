const { Router } = require('express');
const router = Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    passReqToCallback: true
}));

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.use((req, res, next) => {
    isAuthenticated(req, res, next);
    next();
});

router.get('/profile', (req, res, next) => {
    res.render('profile');
});

router.get('/dashboard', (req, res, next) => {
    res.send('dashboard');
});

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;