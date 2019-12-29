const routes = require('express').Router();
const apiV1 = require('./api/v1');
routes.use('/api', apiV1);

routes.get("/", (request, response) => {
    response.redirect("index.html");
});

routes.get('*', (request, response) => {
    response.redirect("404.html");
});

module.exports = routes;