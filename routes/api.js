const routes = require('express').Router();
const got = require("got");
const cache = require('memory-cache');
const dotenv = require("dotenv").config();
const GITHUB_API = "https://api.github.com";
const authenticate = `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;


function queryGithubAPIRaw(requestURL)
{
    return new Promise((resolve, reject)=>
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
    });
}

function queryGitHubAPI(requestURL)
{
    const apiData = cache.get(requestURL);

    return new Promise(function(resolve, reject)
    {
        if(apiData == null)
        {
            queryGithubAPIRaw(requestURL).then((dd)=>
            {
                resolve(dd);
            }).catch((err)=>
            {
                resolve(err);
            })
        }
        else
        {
            console.log("Fetched From Cache");
            resolve(apiData);
        }
    })
}



const API_FOLLOWING = "/following";
const API_FOLLOWERS = "/followers";
const API_USER_PATH = "/users/";

function fetchAllUsers(username, apiPath, page, lst)
{
    return new Promise((resolve, reject)=>
    {
        queryGitHubAPI(API_USER_PATH + username + apiPath + "?page=" + page).then((data)=>
        {
            if(data.hasOwnProperty("length"))
            {
                lst = lst.concat(data)
                if(page < 5 && data.length === 30)
                {
                    fetchAllUsers(username, apiPath, page + 1, lst).then((l)=>
                    {
                        resolve(l);
                    });
                }
                else
                {
                    resolve(lst);
                }
            }
            else
            {
                reject("Malformed data");
            }
        }).catch((err)=>
        {
            reject("error with api request");
        });
    },
    (error)=>
    {
        if(error.hasOwnProperty("length"))
        {
            lst.concat(data);
            resolve(lst);
        }
    });
}

function queryFriends(user)
{
    return new Promise((resolve, reject)=>
    {
        fetchAllUsers(user, API_FOLLOWERS, 1, []).then((followers)=>
        {
            fetchAllUsers(user, API_FOLLOWING, 1, []).then((following)=>
            {
                resolve(following.concat(followers));
            }).catch((err)=>
            {
                console.log(err);  
            })
        }).catch((error)=>
        {
            console.log(error);
        })
    });
}


routes.get("/friends", (request, result)=>
{
    if(request.query.hasOwnProperty("name"))
    {
        result.setHeader('Content-Type', 'application/json');
        queryFriends(request.query.name).then(friends=>
        {
            result.write(JSON.stringify(friends));
            result.end();
        }).catch(error=>
        {
            result.status(500);
            result.write("API error fetching friends.")
            result.end();
        });
    }
    else
    {
        result.status(400);
        result.write("Must provide the name get parameter");
        result.end();
    }
})


routes.get('/*', (request, result) =>
{
    var gitHubAPIURL = request.url;

    result.setHeader('Content-Type', 'application/json');
    queryGitHubAPI(gitHubAPIURL).then((data)=>
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
    }).catch((error)=>
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
        catch(error) 
        {
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