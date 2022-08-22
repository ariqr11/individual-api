const passport = require('passport');
const { dbQuery } = require('../config/db'); // bertipe async
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { hashPassword } = require('../config/encript')
const { createToken } = require('../config/encript')
const { transport } = require('../config/nodemailer')

const GOOGLE_CLIENT_ID = process.env.GCLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GCLIENT_SECRET;


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("Profile from google", profile);
        // register dari profile
        // 1. memeriksa apakah email sudah terdaftar
        let userCheck = await dbQuery(`select * from users where email="${profile.emails[0].value}"`)

        // 2. Jika belum terdaftar
        if (userCheck.length == 0) {
            let sqlInsert = await dbQuery(`insert into users(username,email,password) values ("${profile.displayName}","${profile.emails[0].value}","${hashPassword(profile.id)}");`) // bisa pake .escape untuk mendeteksi tipe data yang dibutuhkan MySQL
            if (sqlInsert.insertId) {
                let sqlGet = await dbQuery(`select iduser,email,status_id from users where idusers=${sqlInsert.insertId};`)
                // membuat token
                let token = createToken({ ...sqlGet[0] }, '1h');
                // mengirimkan email
                await transport.sendMail({
                    from: 'ESHOP ADMIN CARE',
                    to: sqlGet[0].email,
                    subject: 'Verification Email Account',
                    html: `<div>
                    <h3>click link below </h3>
                    <a href='${process.env.FE_URL}/verification/${token}'>Verified Account</a>
                    </div>`
                })
            }
        }
        return done(null, profile);
    } catch (error) {
        console.log(error)
    }
}))

passport.serializeUser((user, done) => {
    console.log('Serialize User', user)
    done(null, user)
})

passport.deserializeUser((obj, done) => {
    console.log('Deserialize User', obj)
    done(null, obj)
})