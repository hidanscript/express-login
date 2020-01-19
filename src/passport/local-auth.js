const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const moment = require('moment');

const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const userValidation = await User.findOne({ email: email });
    if(userValidation) {
        return done(null, false, req.flash('signupMessage', 'The email is already in use'));
    } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.created_at = moment().format();
        await newUser.save();
        done(null, newUser);
    }
    
}));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const user = await User.findOne({email:email});
    if(!user) {
        return done(null, false, req.flash('loginMessage', 'User not found'));
    }
    if(!user.validatePassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Incorrect password'));
    }
    done(null, user);
}));