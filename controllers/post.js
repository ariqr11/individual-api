const { dbConf, dbQuery } = require('../config/db'); // bertipe async
const fs = require('fs')

module.exports = {
    getPost: async (req, res) => {
        console.log(req.query)
        try {
            if (req.query.id) {
                let results = await dbQuery(`select p.* from posting p where idposting=${req.query.id} order by idposting desc ;`)
                res.status(200).send(results);
            } else {
                let results = await dbQuery(`select p.* from posting p order by idposting desc ;`)
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

        dbConf.query(`insert into posting(user_id,username_post,image,caption) 
            values (${dataInput.user_id},"${dataInput.username_post}","/imgPost/${req.files[0].filename}","${dataInput.caption}");`, // bisa pake .escape untuk mendeteksi tipe data yang dibutuhkan MySQL
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
        dbConf.query(`update posting set caption="${req.body.caption}" where idposting=${req.query.id};`,
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
    }
}