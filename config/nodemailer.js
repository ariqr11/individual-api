const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER1,
        pass: process.env.PASSWORD1
    }
})

module.exports = { transport }