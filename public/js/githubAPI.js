/**
 * Simple file which uses jQuery's ajax
 * calls to make it easier to get data
 * from the github api.
 *
 * @author Jeffery Russell 2-16-19
 */


const APIROOT = "api";

const API_USER_PATH = "/users/";

const API_ORG_PATH = "/orgs/";

const API_ORG_MEMBERS = "/members";

const API_REPOS = "/repos";

const API_REPOSITORIES = "/repos";

const API_ORGANIZATIONS = "/orgs";


/**
 * Builds a query for the github rest api and
 * allows you to get at the data using a
 * callback which gives you a json object.
 *
 * @param user the username to query
 * @param successCallBack callback to complete when data is returned
 * @param errorCallBack callback which is invoked on error
 */
function queryAPIByUser(apiPath, user, successCallBack, errorCallBack) 
{
    const urlpath = APIROOT + API_USER_PATH + user + apiPath;
    runAjax(urlpath, successCallBack, errorCallBack);
}

/**
 * Makes API calls for orgs on github
 * 
 * @param {*} apiPath 
 * @param {*} org 
 * @param {*} successCallBack 
 * @param {*} errorCallBack 
 */
function queryAPIByOrg(apiPath, org, successCallBack, errorCallBack)
{
    const urlpath = APIROOT + API_ORG_PATH + org + apiPath;
    runAjax(urlpath, successCallBack, errorCallBack);
}


/**
 * Fetches a list of fiends for a user.
 * 
 * @param {*} userName 
 * @param {*} suc 
 * @param {*} err 
 */
function getFriendsAPI(userName, suc, err)
{
    // api/friends/jrtechs
    const urlpath = APIROOT + "/friends/" + userName;
    runAjax(urlpath, suc, err);
}


function getUserRepositories(userName, suc, err)
{
    //ex: http://localhost:7000/api/repositories/jwflory
    const urlpath = APIROOT + "/repositories/" + userName;
    runAjax(urlpath, suc, err);
}


function getOrganizationRepositories(orgName, suc, err)
{
    //ex: http://localhost:7000/api/org/repositories/ComputerScienceHouse
    const urlpath = APIROOT + "/org/repositories/" + orgName;
    console.log("what is even happening rn.");
    console.log(urlpath);
    runAjax(urlpath, suc, err);
}


/**
 * Queries github API end points with the backend
 * proxy server for github graphs.
 * 
 * @param {*} url 
 * @param {*} successCallBack 
 * @param {*} errorCallBack 
 */
function queryUrl(url, successCallBack, errorCallBack)
{
    url = url.split("https://api.github.com/").join("api/");
    runAjax(url, successCallBack, errorCallBack);
}


/**
 * Wrapper for AJAX calls so we can unify
 * all of our settings.
 * 
 * @param {*} url -- url to query
 * @param {*} successCallBack  -- callback with data retrieved
 * @param {*} errorCallBack  -- callback with error message
 */
function runAjax(url, successCallBack, errorCallBack)
{
    console.log(url);
    $.ajax({
        type:'GET',
        url: url,
        crossDomain: true,
        dataType: "json",
        success: successCallBack,
        error:errorCallBack,
        timeout: 3000
    });
}