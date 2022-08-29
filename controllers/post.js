const { dbConf, dbQuery } = require('../config/db'); // bertipe async
const fs = require('fs')

module.exports = {
    getPost: async (req, res) => {
        console.log(req.query)
        try {
            if (req.query.id && req.query.limit) {
                let results = await dbQuery(`select p.*,u.username,u.profilepicture from posting p join users u on p.user_id=u.idusers  where idposting=${req.query.id} order by date desc limit ${req.query.limit} ;`)
                res.status(200).send(results);
            } else if (req.query.id) {
                let results = await dbQuery(`select p.* ,u.username,u.profilepicture from posting p join users u on p.user_id=u.idusers where idposting=${req.query.id} order by date desc ;`)
                res.status(200).send(results);
            } else if (req.query.limit) {
                let results = await dbQuery(`select p.* ,u.username,u.profilepicture from posting p join users u on p.user_id=u.idusers order by date desc limit ${req.query.limit} ;`)
                res.status(200).send(results);
            } else {
                let results = await dbQuery(`select p.* ,u.username,u.profilepicture from posting p join users u on p.user_id=u.idusers order by date desc ;`)
                res.status(200).send(results);
            }
        } catch (error) {
            console.log('Error query :', error);
            res.status(500).send(error);
        }
    },
    addPost: (req, res) => {
        let dataInput = JSON.parse(req.body.data);
        console.log(req.files)
        dbConf.query(`insert into posting(user_id,image,caption) 
            values (${dataInput.user_id},"/imgPost/${req.files[0].filename}","${dataInput.caption}");`, // bisa pake .escape untuk mendeteksi tipe data yang dibutuhkan MySQL
            (err, results) => {
                if (err) {
                    console.log('Error query :', err);
                    fs.unlinkSync(`/public/imgPost/${req.files[0].filename}`)
                    res.status(500).send(err);
                } else {
                    console.log('Results SQL', results);
                    res.status(200).send({
                        success: true,
                        message: 'Register Success'
                    });
                }
            })
    },
    editPost: (req, res) => {
        dbConf.query(`update posting set caption="${req.body.caption}", date="${req.body.date}" where idposting=${req.query.id};`,
            (err, results) => {
                if (err) {
                    console.log('Error query :', err);
                    res.status(500).send(err);
                } else {
                    res.status(200).send({
                        success: true,
                        message: 'Edit Success'
                    });
                }
            })
    },
    deletePost: (req, res) => {
        dbConf.query(`delete from posting where idposting=${req.query.id};`,
            (err, results) => {
                if (err) {
                    console.log('Error query :', err);
                    res.status(500).send(err);
                } else {
                    res.status(200).send({
                        success: true,
                        message: 'Delete Success'
                    });
                }
            })
    },
    likePost: (req, res) => {
        dbConf.query(`insert into likes(user_id,post_id) 
        values (${req.body.user_id},${req.body.post_id});`, // bisa pake .escape untuk mendeteksi tipe data yang dibutuhkan MySQL
            (err, results) => {
                if (err) {
                    console.log('Error query :', err);
                    res.status(500).send(err);
                } else {
                    console.log('Results SQL', results);
                    res.status(200).send({
                        success: true,
                        message: 'Like Success'
                    });
                }
            })
    },
    unlikePost: (req, res) => {
        console.log(req.query)
        dbConf.query(`delete from likes where user_id=${req.query.iduser} and post_id=${req.query.idposting};`,
            (err, results) => {
                if (err) {
                    console.log('Error query :', err);
                    res.status(500).send(err);
                } else {
                    res.status(200).send({
                        success: true,
                        message: 'Unlike Success'
                    });
                }
            })
    },
    getLike: (req, res) => {
        dbConf.query(`select post_id,count(*) as totalLike from likes group by post_id ;`,
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
    getComments: (req, res) => {
        dbConf.query(`select c.*,u.username,u.profilepicture from comments c join users u on c.user_id=u.idusers where post_id=${req.query.id} order by idcomments desc ;`,
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
    addComments: (req, res) => {
        dbConf.query(`insert into comments(user_id,post_id,comments) 
        values (${req.body.user_id},${req.body.post_id},"${req.body.coms}");`, // bisa pake .escape untuk mendeteksi tipe data yang dibutuhkan MySQL
            (err, results) => {
                if (err) {
                    console.log('Error query :', err);
                    res.status(500).send(err);
                } else {
                    console.log('Results SQL', results);
                    res.status(200).send({
                        success: true,
                        message: 'Comments Success'
                    });
                }
            })
    },
}