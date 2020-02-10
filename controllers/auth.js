const express = require('express')
const router = express.Router
const passport = require('passport')
const User = require('../models/user')

module.exports.getLogin = (req, res) => {
    res.render('login')
}

module.exports.getRegister = (req, res) => {
    res.render('register')
}

module.exports.postLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/use/register',
        failureFlash: true
    })(req, res, next)
}

module.exports.postRegister = async(req, res) => {
    const {
        name,
        username,
        email,
        password
    } = req.body

    const newUser = await new User({
        name,
        username,
        email,
        password
    }).save()

    res.redirect('/')
}

module.exports.getLogout = async(req, res) => {
    req.logout()
    res.redirect('/use/login')
}