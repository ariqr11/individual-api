const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rachmanandaa@gmail.com',
        pass: 'bzgemfukdgslogkx'
    }
})

module.exports = { transport }