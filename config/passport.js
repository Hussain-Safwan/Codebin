const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, (req, email, password, done) => {
            // Match user

            User.findOne({
                email: req.body.email
            }).then(user => {
                if (!user) {
                    console.log("Email not registered");
                    return done(null, false);
                }
                // Match password
                if (req.body.password == user.password) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};