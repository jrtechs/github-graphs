const routes = require('express').Router();
const got = require("got");
const cache = require('memory-cache');
const dotenv = require("dotenv").config();
const GITHUB_API = "https://api.github.com";
const authenticate = `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;


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
                resolve(error);
                cache.put(requestURL, error);
            });
        }
        else
        {
            console.log("Fetched From Cahce");
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
        if(data.hasOwnProperty("id") || data[0].hasOwnProperty("id"))
        {
            result.write(JSON.stringify(data));
        }
        else
        {
            result.write("[]");
        }
        result.end();
    }).catch(function(error)
    {
        try
        {
            if(error.hasOwnProperty("id") || error[0].hasOwnProperty("id"))
            {
                result.write(JSON.stringify(error));
            }
            else
            {
                result.write("[]");
            }

        }
        catch(error) {
            result.write("[]");
        };
        result.end();
    });

    if(cache.size() > 50000)
    {
        cache.clear();
    }
});

module.exports = routes;