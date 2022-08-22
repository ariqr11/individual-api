const Crypto = require('crypto');
const jwt = require('jsonwebtoken')

module.exports = {
    hashPassword: (pass) => {
        return Crypto.createHmac("sha256", "ESHOP123").update(pass).digest("hex");
    },
    createToken: (payload, expiresIn = '24h') => {
        return jwt.sign(payload, 'rampi', {
            expiresIn
        });
    },
    readToken: (req, res, next) => {
        console.log(req.token)
        jwt.verify(req.token, "rampi", (err, decode) => {
            if (err) {
                return res.status(401).send(err)
            }
            console.log('translate token', decode);

            req.dataToken = decode

            next();
        })
    }
}