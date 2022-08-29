const express = require('express');
const { postController } = require('../controllers');
const route = express.Router();
const { uploader } = require('../config/uploader')


const uploadFile = uploader('/imgPost', 'IMGPOST').array('image', 1)
route.get('/', postController.getPost);
route.post('/add', uploadFile, postController.addPost);
route.patch('/edit', postController.editPost);
route.delete('/delete', postController.deletePost);
route.get('/getlike', postController.getLike)
route.post('/like', postController.likePost);
route.delete('/unlike', postController.unlikePost);
route.get('/getComments', postController.getComments);
route.post('/addComments', postController.addComments);

module.exports = route;