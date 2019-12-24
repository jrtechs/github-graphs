const routes = require('express').Router();
const api = require('./api');
routes.use('/api', api);

routes.get("/", (request, response) => {
    response.redirect("index.html");
});

routes.get('*', (request, response) => {
    response.redirect("404.html");
});

module.exports = routes;