const express = require('express');
const { usersController } = require('../controllers');
const route = express.Router();
const { uploader } = require('../config/uploader')
const { readToken } = require('../config/encript');
const passport = require('passport')



const uploadFile = uploader('/imgProfile', 'IMGPRF').array('profilepicture', 1)
route.get('/', usersController.getData);
route.post('/regis', usersController.register);
route.post('/login', usersController.login);
route.get('/verif', readToken, usersController.verif);
route.get('/resend', readToken, usersController.resend);
route.get('/keep', readToken, usersController.keepLogin);
route.patch('/edit', uploadFile, usersController.editData);

route.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
route.get('/google/callback', passport.authenticate('google', {
    successRedirect: process.env.FE_URL,
    failureRedirect: process.env.FE_URL + `?message=401_auth_failure`,
}))

module.exports = route;