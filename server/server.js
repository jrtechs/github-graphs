const crypto = require('crypto');
const dotenv = require("dotenv").config();
const express = require("express");
const session = require('express-session');

const app = express();

const sessionProperties = {
    secret: process.env.SESSION_SECRET || crypto.randomBytes(64), 
    cookie: { maxAge: 6000000 },
    resave: false,
    saveUninitialized: false
};
app.use(session(sessionProperties));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const routes = require('./routes');
app.use('/', routes);


app.listen(process.env.PORT || 4002, () => console.log(`App listening on port ${process.env.PORT  || 4002}!`));