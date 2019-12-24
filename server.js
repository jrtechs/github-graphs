const express = require("express");
const session = require('express-session');
const dotenv = require("dotenv").config();
const app = express();

const sessionProperties = {
    secret: process.env.SESSION_SECRET, 
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


app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`));