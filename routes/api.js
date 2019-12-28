const routes = require('express').Router();
const got = require("got");
const cache = require('memory-cache');
const dotenv = require("dotenv").config();
const GITHUB_API = "https://api.github.com";
const authenticate = `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`;

const API_FOLLOWING = "/following";
const API_FOLLOWERS = "/followers";
const API_USER_PATH = "/users/";
const API_ORGS_PATH = "/orgs/";
const API_PAGINATION_SIZE = 100; // 100 is the max, 30 is the default
// if this is too large, it would be infeasible to make graphs for people following popular people
const API_MAX_PAGES = 2;
const API_PAGINATION = "&per_page=" + API_PAGINATION_SIZE;

const REPOS_PATH = "/repos";


/**
 * Queries data from the github APi server and returns it as
 * a json object in a promise.
 * 
 * This makes no attempt to cache
 * 
 * @param {*} requestURL endpoint on githubapi: ex: /users/jrtechs/following
 */
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


/**
 * Queries data from the github api server
 * and caches the results locally.
 * 
 * @param {*} requestURL 
 */
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


/**
 * Fetches all content from a particular github api endpoint
 * using their pagination schema.
 * 
 * @param {*} username username of github client
 * @param {*} apiPath following or followers
 * @param {*} page current pagination page
 * @param {*} lst list we are building on
 */
function fetchAllWithPagination(apiPath, page, lst)
{
    return new Promise((resolve, reject)=>
    {
        queryGithubAPIRaw(apiPath + "?page=" + page + API_PAGINATION).then((data)=>
        {
            if(data.hasOwnProperty("length"))
            {
                lst = lst.concat(data)
                if(page < API_MAX_PAGES && data.length === API_PAGINATION_SIZE)
                {
                    fetchAllWithPagination(apiPath, page + 1, lst).then((l)=>
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
                console.log(data);
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


/**
 * Makes a copy of a JS object with certain properties
 * 
 * @param {*} props 
 * @param {*} obj 
 */
function copyWithProperties(props, obj)
{
    var newO = new Object();
    for(var i =0; i < props.length; i++)
    {
        newO[props[i]] = obj[props[i]];
    }
    return newO;
}


/**
 * Combines the list of friends and followers ignoring duplicates
 * that are already in the list. (person is both following and followed by someone)
 * 
 * This also removes any unused properties like events_url and organizations_url
 * 
 * @param {*} followingAndFollowers 
 */
function minimizeFriends(people)
{
    var friendLst = [];

    var ids = new Set();

    for(var i = 0; i < people.length; i++)
    {
        if(!ids.has(people[i].id))
        {
            ids.add(people[i].id);
            friendLst.push({
                login: people[i].login, 
                avatar_url: people[i].avatar_url
            });
        }
    }
    return friendLst;
}


/**
 * Fetches all the people that are either following or is followed
 * by a person on github. This will cache the results to make simultaneous
 * connections easier and less demanding on the github API.
 * 
 * @param {*} user 
 */
function queryFriends(user)
{
    const cacheHit = cache.get("/friends/" + user);
    return new Promise((resolve, reject)=>
    {
        if(cacheHit == null)
        {
            fetchAllWithPagination(API_USER_PATH + user + API_FOLLOWERS, 1, []).then((followers)=>
            {
                fetchAllWithPagination(API_USER_PATH + user + API_FOLLOWING, 1, []).then((following)=>
                {
                    var fList = minimizeFriends(following.concat(followers));
                    resolve(fList);
                    cache.put("/friends/" + user, fList);
                }).catch((err)=>
                {
                    console.log(err);  
                    reject("API ERROR");
                })
            }).catch((error)=>
            {
                console.log(error);
                resolve("API Error");
            })
        }
        else
        {
            console.log("Friends cache hit");
            resolve(cacheHit);
        }
    });
}


/**
 * Minimizes the JSON for a list of repositories
 * 
 * @param {*} repositories 
 */
function minimizeRepositories(repositories)
{
    var rList = [];

    for(var i = 0; i < repositories.length; i++)
    {
        rList.push(copyWithProperties(["name", "created_at", "homepage", 
            "description", "language", "forks", "watchers",
             "open_issues_count", "license", "html_url"],
            repositories[i]));
    }
    return rList;
}


/**
 * Fetches all repositories from the API
 * 
 * @param {*} user name of org/user
 * @param {*} orgsOrUsers  either /users/ or /orgs/
 */
function queryRepositories(user, orgsOrUsers)
{
    const cacheHit = cache.get(user + REPOS_PATH);
    return new Promise((resolve, reject)=>
    {
        if(cacheHit == null)
        {
            fetchAllWithPagination(orgsOrUsers + user + REPOS_PATH, 1, []).then((repos)=>
            {
                var minimized = minimizeRepositories(repos);
                resolve(minimized);
                cache.put(user + REPOS_PATH, minimized);
            }).catch((err)=>
            {
                console.log(err)
                console.log("bad things went down");
            })
        }
        else
        {
            console.log("Repositories cache hit");
            resolve(cacheHit);
        }
    });
}


routes.get("/friends/:name", (request, result)=>
{
    queryFriends(request.params.name).then(friends=>
    {
        result.json(friends)
            .end();
    }).catch(error=>
    {
        result.status(500)
            .json({error: 'API error fetching friends'})
            .end();
    });
});


routes.get("/repositories/:name", (request, result)=>
{
    queryRepositories(request.params.name, API_USER_PATH).then(repos=>
        {
            result.json(repos)
                .end();
        }).catch(error=>
        {
            result.status(500)
                .json({error: 'API error fetching friends'})
                .end();
        });
});


routes.get("/org/repositories/:name", (request, result)=>
{
    queryRepositories(request.params.name, API_ORGS_PATH).then(repos=>
        {
            result.json(repos)
                .end();
        }).catch(error=>
        {
            result.status(500)
                .json({error: 'API error fetching friends'})
                .end();
        });
});


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