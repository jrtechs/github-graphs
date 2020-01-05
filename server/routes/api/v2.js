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
const queryGithubAPIRaw = async requestURL => {
    let queryURL = requestURL.includes("?page=") ? `${GITHUB_API}${requestURL}&${authenticate}` :`${GITHUB_API}${requestURL}?${authenticate}`;
    console.log(queryURL);
    try {
        const req = await got(queryURL, { json: true });
        cache.put(requestURL, req);
        return req;
    } catch (error) {
        console.log(error);
        cache.put(requestURL, `${error.statusCode} - ${error.statusMessage}`);
    }
}


/**
 * Queries data from the github api server
 * and caches the results locally.
 * 
 * @param {*} requestURL 
 */
const queryGitHubAPI = async requestURL => {
    const apiData = cache.get(requestURL);
    if (apiData) {
        console.log("Fetched From Cache");
        return apiData
    }

    try {
        return await queryGithubAPIRaw(requestURL);
    } catch (error) {
        console.log(error);
    }
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
const fetchAllWithPagination = async (apiPath, page, lst) => {
    try {
        const req = await queryGithubAPIRaw(`${apiPath}?page=${page}${API_PAGINATION}`);
        if (req.body.hasOwnProperty("length")) {
            const list = lst.concat(req.body);
            if(page < API_MAX_PAGES && req.length === API_PAGINATION_SIZE) {
                const redo = await fetchAllWithPagination(apiPath, page + 1, list);
                return redo;
            }
            return list;
        }
    } catch (error) {
        console.log("Error with api request");
    }
}


/**
 * Makes a copy of a JS object with certain properties
 * 
 * @param {*} props 
 * @param {*} obj 
 */
const copyWithProperties = (props, obj) => {
    let newO = new Object();
    props.forEach(prop => {
        newO[prop] = obj[prop];
    })
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
const minimizeFriends = people => {
    let friendLst = [];
    let ids = new Set();
    people.forEach(person => {
        if(!ids.has(person.id)) {
            ids.add(person.id);
            friendLst.push({
                login: person.login, 
                avatar_url: person.avatar_url
            });
        }
    });
    return friendLst;
}


/**
 * Fetches all the people that are either following or is followed
 * by a person on github. This will cache the results to make simultaneous
 * connections easier and less demanding on the github API.
 * 
 * @param {*} user 
 */
const queryFriends = async user => {
    const cacheHit = cache.get("/friends/" + user);
    if (cacheHit){
        console.log("Friends cache hit");
        return cacheHit;
    }

    try {
        const followers = await fetchAllWithPagination(API_USER_PATH + user + API_FOLLOWERS, 1, []);
        const following = await fetchAllWithPagination(API_USER_PATH + user + API_FOLLOWING, 1, []);
        const fList = minimizeFriends(following.concat(followers));
        cache.put(`/friends/${user}`, fList);
        return fList;
    } catch (error) {
        console.log("API Error", err); 
    }
}


/**
 * 
 * Fetches all of the members of an organization from the
 * API or cache
 *
 * /orgs/RITlug/members?page=1
 *
 * @param {*} orgName 
 */
const getOrganizationMembers = async orgName => {
    const cacheHit = cache.get("/org/users/" + orgName);
    if (cacheHit){
        console.log("Org members cache hit");
        return cacheHit;
    }

    try {
        const members = await fetchAllWithPagination(API_ORGS_PATH + orgName + "/members", 1, []);
        const membersMin = minimizeFriends(members);
        cache.put("/org/users/" + orgName, membersMin);
        return membersMin;
    } catch (error) {
        console.log(error);
    }
}


/**
 * Minimizes the JSON for a list of repositories
 * 
 * @param {*} repositories 
 */
const minimizeRepositories = repositories => {
    let rList = [];
    repositories.forEach(repo => {
        rList.push(copyWithProperties(["name", "created_at", "homepage", 
            "description", "language", "forks", "watchers",
            "open_issues_count", "license", "html_url"],
            repo));
    })

    return rList;
}


/**
 * Fetches all repositories from the API
 * 
 * @param {*} user name of org/user
 * @param {*} orgsOrUsers  either /users/ or /orgs/
 */
const queryRepositories = async (user, orgsOrUsers) => {
    const cacheHit = cache.get(user + REPOS_PATH);
    if (cacheHit) {
        console.log("Repositories cache hit");
        return cacheHit;
    }

    try {
        const repos = await fetchAllWithPagination(orgsOrUsers + user + REPOS_PATH, 1, []);
        const minRepos = minimizeRepositories(repos);
        cache.put(`${user}${REPOS_PATH}`, minRepos);
        return minRepos;
    } catch (error) {
        console.log(error)
        console.log("bad things went down");
    }
}


/**
 * /users/name/following/followers
 */
routes.get("/friends/:name", async (req, res)=> {
    try {
        const query = await queryFriends(req.params.name);
        res.json(query);
    } catch (error) {
        res.status(500).json({error: 'API error fetching friends'});
    }
});


routes.get("/org/users/:name", async (request, res) => {
    try {
        const orgMembers = await getOrganizationMembers(request.params.name);
        res.json(orgMembers).end();
    } catch (error) {
        res.status(500).json({error: 'API error fetching friends'}).end();
    }
});


routes.get("/repositories/:name", async (req, res) => {
    try {
        const repos = await queryRepositories(req.params.name, API_USER_PATH);
        res.json(repos).end();
    } catch (error) {
        res.status(500).json({error: 'API error fetching friends'}).end();
    }
});


routes.get("/org/repositories/:name", async (req, res) => {
    try {
        const repos = await queryRepositories(req.params.name, API_ORGS_PATH);
        res.json(repos).end();
    } catch (error) {
        res.status(500).json({error: 'API error fetching friends'}).end();
    }
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