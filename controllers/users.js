// untuk menyimpan controller yang menyimpan data user
const { dbConf, dbQuery } = require('../config/db'); // bertipe async
const { hashPassword } = require('../config/encript')
const { createToken } = require('../config/encript')
const { transport } = require('../config/nodemailer')

module.exports = {
    getData: (req, res) => {
        dbConf.query(`select u.* from users u  ;`,
            (err, results) => {
                if (err) {
                    console.log('Error query :', err);
                    res.status(500).send(err);
                } else {
                    console.log('Results SQL', results);
                    res.status(200).send(results);
                }
            })
    },
    register: async (req, res) => {
        try {
            let sqlInsert = await dbQuery(`insert into users(username,email,password) values ("${req.body.username}","${req.body.email}","${hashPassword(req.body.password)}");`) // bisa pake .escape untuk mendeteksi tipe data yang dibutuhkan MySQL
            console.log(sqlInsert)
            if (sqlInsert.insertId) {
                let sqlGet = await dbQuery(`select idusers,email,status from users where idusers=${sqlInsert.insertId};`)
                // membuat token
                let token = createToken({ ...sqlGet[0] }, '1h');
                // mengirimkan email
                await transport.sendMail({
                    from: 'MYFRIEND OFFICIAL',
                    to: sqlGet[0].email,
                    subject: 'Verification Email Account',
                    html: `<div>
                    <h3>click link below </h3>
                    <a href='${process.env.FE_URL}/verification?verif=${token}'>Verified Account</a>
                    </div>`
                })
                res.status(200).send({
                    success: true,
                    message: 'Register Success'
                });
            }
        } catch (error) {
            console.log('Error query :', error);
            res.status(500).send(error);
        }
    },
    verif: async (req, res) => {
        try {
            await dbQuery(`update users set status="Verified" where idusers=${req.dataToken.idusers}`)
            let resultsUser = await dbQuery(`select * from users u where u.idusers=${req.dataToken.idusers};`)
            if (resultsUser.length > 0) {
                let resultsPost = await dbQuery(`Select p.user_id,u.username, p.idposting,p.image,p.caption,p.date from users u join posting p on u.idusers = p.user_id where p.user_id="${resultsUser[0].idusers}" order by p.idposting desc; `)
                let resultsLike = await dbQuery(`Select p.user_id,p.username_post,p.idposting,p.user_id,p.image,p.caption,p.date,l.idlikes from users u join likes l on u.idusers = l.user_id join posting p on l.post_id = p.idposting where l.user_id="${resultsUser[0].idusers}" order by p.idposting desc;`)
                res.status(200).send({
                    ...resultsUser[0],
                    posts: resultsPost,
                    likes: resultsLike,
                    token: req.token
                })
            }
        } catch (error) {
            console.log('Error query :', error);
            res.status(500).send(error);
        }
    },
    resend: async (req, res) => {
        try {
            let sqlInsert = await dbQuery(`select * from users u where u.idusers=${req.dataToken.idusers};`) // bisa pake .escape untuk mendeteksi tipe data yang dibutuhkan MySQL
            console.log('ini data', sqlInsert)
            if (sqlInsert.length > 0) {
                let sqlGet = await dbQuery(`select idusers,email,status from users where idusers=${sqlInsert[0].idusers};`)
                await transport.sendMail({
                    from: 'MYFRIEND OFFICIAL',
                    to: sqlGet[0].email,
                    subject: 'Verification Email Account',
                    html: `<div>
                    <h3>click link below </h3>
                    <a href='${process.env.FE_URL}/verification?verif=${req.token}'>Verified Account</a>
                    </div>`
                })
                res.status(200).send({
                    success: true,
                    message: 'Register Success'
                });
            }
        } catch (error) {
            console.log('Error query :', error);
            res.status(500).send(error);
        }
    },
    login: async (req, res) => {
        try {
            if (req.body.user.includes('@') && req.body.user.toLocaleLowerCase().includes('.com')) {
                let resultsUser = await dbQuery(`select * from users u where u.email="${req.body.user}" and u.password="${hashPassword(req.body.password)}";`)
                if (resultsUser.length > 0) {
                    let resultsPost = await dbQuery(`Select p.user_id,u.username, p.idposting,p.image,p.caption,p.date from users u join posting p on u.idusers = p.user_id where p.user_id="${resultsUser[0].idusers}" order by p.idposting desc; `)
                    let resultsLike = await dbQuery(`Select p.user_id,p.username_post,p.idposting,p.user_id,p.image,p.caption,p.date,l.idlikes from users u join likes l on u.idusers = l.user_id join posting p on l.post_id = p.idposting where l.user_id="${resultsUser[0].idusers}" order by p.idposting desc;`)
                    let token = createToken({ ...resultsUser[0] });
                    res.status(200).send({
                        ...resultsUser[0],
                        posts: resultsPost,
                        likes: resultsLike,
                        token
                    })
                } else {
                    res.status(200).send({
                        success: false,
                        message: "Login Failed"
                    })
                }
            } else {
                let resultsUser = await dbQuery(`select * from users u where u.username="${req.body.user}" and u.password="${hashPassword(req.body.password)}";`)
                if (resultsUser.length > 0) {
                    let resultsPost = await dbQuery(`Select p.user_id,u.username, p.idposting,p.image,p.caption,p.date from users u join posting p on u.idusers = p.user_id where p.user_id="${resultsUser[0].idusers}" order by p.idposting desc; `)
                    let resultsLike = await dbQuery(`Select p.user_id,p.username_post,p.idposting,p.user_id,p.image,p.caption,p.date,l.idlikes from users u join likes l on u.idusers = l.user_id join posting p on l.post_id = p.idposting where l.user_id="${resultsUser[0].idusers}" order by p.idposting desc;`)
                    let token = createToken({ ...resultsUser[0] });
                    res.status(200).send({
                        ...resultsUser[0],
                        posts: resultsPost,
                        likes: resultsLike,
                        token
                    })
                } else {
                    res.status(200).send({
                        success: false,
                        message: "Login Failed"
                    })
                }
            }
        }
        catch (error) {
            console.log('Error query :', error);
            res.status(500).send(error);
        }
    },
    keepLogin: async (req, res) => {
        try {
            let resultsUser = await dbQuery(`select * from users u where u.idusers=${req.dataToken.idusers};`)
            if (resultsUser.length > 0) {
                let resultsPost = await dbQuery(`Select p.user_id,u.username, p.idposting,p.image,p.caption,p.date from users u join posting p on u.idusers = p.user_id where p.user_id="${resultsUser[0].idusers}" order by p.idposting desc; `)
                let resultsLike = await dbQuery(`Select p.user_id,p.username_post,p.idposting,p.user_id,p.image,p.caption,p.date,l.idlikes from users u join likes l on u.idusers = l.user_id join posting p on l.post_id = p.idposting where l.user_id="${resultsUser[0].idusers}" order by p.idposting desc;`)
                let token = createToken({ ...resultsUser[0] });
                res.status(200).send({
                    ...resultsUser[0],
                    posts: resultsPost,
                    likes: resultsLike,
                    token
                })
            }
        } catch (error) {
            console.log('Error query :', error);
            res.status(500).send(error);
        }
    },
    editData: (req, res) => {
        let dataInput = JSON.parse(req.body.data);
        console.log(dataInput)
        console.log(req.files)
        if (req.files.length > 0) {
            dbConf.query(`update users set bio="${dataInput.bio}", username="${dataInput.username}",fullname="${dataInput.fullname}",profilepicture="/imgProfile/${req.files[0].filename}" where idusers=${req.query.id};`,
                (err, results) => {
                    if (err) {
                        console.log('Error query :', err);
                        res.status(500).send(err);
                    } else {
                        res.status(200).send({
                            success: true,
                            message: 'Edit Profile Success'
                        });
                    }
                })
        } else {
            dbConf.query(`update users set bio="${dataInput.bio}", username="${dataInput.username}",fullname="${dataInput.fullname}" where idusers=${req.query.id};`,
                (err, results) => {
                    if (err) {
                        console.log('Error query :', err);
                        res.status(500).send(err);
                    } else {
                        res.status(200).send({
                            success: true,
                            message: 'Edit Profile Success'
                        });
                    }
                })
        }
    }
}