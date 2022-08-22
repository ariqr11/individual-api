const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 1997;
const bearerToken = require('express-bearer-token');
const session = require('express-session')
const passport = require('passport')

app.use(express.json());
app.use(express.static('public'))
app.use(bearerToken());
app.use(cors());


app.get('/', (req, res) => {
    res.status(200).send('<h1>INDIVIDUAL PROJECT API</h1>')
})

const { usersRouter, postRouter } = require('./routers')
app.use('/users', usersRouter);
app.use('/post', postRouter);

app.listen(PORT, () => console.log('Running', PORT))