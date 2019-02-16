const routes = require('express').Router();


const api = require('./api');
routes.use('/api', api);

routes.get("/", (request, result) =>
{
    result.redirect("index.html");
});

routes.get('*', (request, result) =>
{
    result.redirect("404.html");
});

module.exports = routes;