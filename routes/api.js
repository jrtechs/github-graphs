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

            got(queryURL, { json: true }).then(response =>
            {
                resolve(response.body);
                cache.put(requestURL, response.body);
            }).catch(error =>
            {
                // resolve(response.body);
                // cache.put(requestURL, response.body);
                console.log(error);
                reject(error);
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

    // if(request.query.hasOwnProperty("page"))
    // {
    //     gitHubAPIURL += "?page=" + request.query.page;
    // }

    console.log(request.query);

    console.log(gitHubAPIURL);


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