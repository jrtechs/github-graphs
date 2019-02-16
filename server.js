/** express app for routing */
const express = require("express");

/**session data for login and storing preferences*/
const session = require('express-session');

const configLoader = require('./configManager.js');


const app = express();

/**Initializes sessions for login */
app.use(session(
    { secret: configLoader.getConfiguration().sessionSecret,
        cookie: { maxAge: 6000000 }}
));


app.use(express.urlencoded()); //for easy retrieval of post and get data
app.use(express.json());

app.use(express.static(__dirname,'css'));
app.use(express.static(__dirname, 'js'));
app.use(express.static(__dirname, 'img'));
app.use(express.static('html'));
app.use(express.static(__dirname, 'fonts'));


const routes = require('./routes');
app.use('/', routes);



app.listen(configLoader.getConfiguration().port, () =>
    console.log(`App listening on port ${configLoader.getConfiguration().port}!`)
);