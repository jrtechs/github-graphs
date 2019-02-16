const routes = require('express').Router();


const got = require("got");


const GITHUB_API = "https://api.github.com";


const configLoader = require('../configManager');

const authenticate = "?client_id=" + configLoader.getClientID() +
    "&client_secret=" + configLoader.getClientSecret();


//caching program to make the application run faster
const cache = require('memory-cache');


function queryGitHubAPI(requestURL)
{
    const apiData = cache.get(requestURL);

    return new Promise(function(reject, resolve)
    {
        if(apiData == null)
        {
            const queryRUL = GITHUB_API + requestURL + authenticate;

            got(queryRUL, { json: true }).then(response =>
            {
                resolve(response.body);
                cache.put(requestURL, response.body);
            }).catch(error =>
            {
                resolve(response.body);
                cache.put(requestURL, response.body);
            });

        }
        else
        {
            resolve(apiData);
        }
    })
}


routes.get('/*', (request, result) =>
{
    const gitHubAPIURL = request.url;

    result.setHeader('Content-Type', 'application/json');
    queryGitHubAPI(gitHubAPIURL).then(function(data)
    {
        result.write(JSON.stringify(data));
        result.end();
    }).catch(function(error)
    {
        result.write(JSON.stringify(error));
        result.end();
    })
});

module.exports = routes;