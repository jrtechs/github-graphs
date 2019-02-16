const routes = require('express').Router();


const got = require("got");


const GITHUB_API = "https://api.github.com";


const configLoader = require('../configManager');

const authenticate = "?client_id=" + configLoader.getClientID() +
    "&client_secret=" + configLoader.getClientSecret();


function queryGitHubAPI(requestURL)
{
    return new Promise(function(reject, resolve)
    {
        const queryRUL = GITHUB_API + requestURL + authenticate;

        got(queryRUL, { json: true }).then(response =>
        {
            resolve(response.body);
        }).catch(error =>
        {
            resolve(response.body)
        });
    })
}

//https://api.github.com/users/whatever?client_id=xxxx&client_secret=yyyy
// function authenticateWithGitHub()
// {
//     const authURL = GITHUB_API + "/users/" + configLoader.getAPIUser() + "?client_id=" + configLoader.getClientID() +
//         "&client_secret=" + configLoader.getClientSecret();
//
//     return new Promise(function(resolve, reject)
//     {
//         got(authURL, { json: true }).then(response =>
//         {
//             console.log(response);
//             resolve(response);
//         }).catch(error => {
//             reject(error);
//             console.log(error.response.body);
//         });
//     })
//
// }




routes.get('/*', (request, result) =>
{
    const gitHubAPIURL = request.url;

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