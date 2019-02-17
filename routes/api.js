const routes = require('express').Router();


const got = require("got");


const GITHUB_API = "https://api.github.com";


const configLoader = require('../configManager');

const authenticate = "client_id=" + configLoader.getClientID() +
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
            var queryURL;
            if(requestURL.includes("?page="))
            {
                queryURL = GITHUB_API + requestURL + "&" + authenticate;
            }
            else
            {
                queryURL = GITHUB_API + requestURL + "?" + authenticate;
            }
            console.log(queryURL);

            got(queryURL, { json: true }).then(response =>
            {
                resolve(response.body);
                cache.put(requestURL, response.body);
            }).catch(error =>
            {
                reject(error);
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
    var gitHubAPIURL = request.url;

    result.setHeader('Content-Type', 'application/json');
    queryGitHubAPI(gitHubAPIURL).then(function(data)
    {
        if(data.hasOwnProperty("id"))
        {
            result.write(JSON.stringify(data));
        }
        result.end();
    }).catch(function(error)
    {
        if(error.hasOwnProperty("id"))
        {
            result.write(JSON.stringify(error));
        }
        result.end();
    })
});

module.exports = routes;