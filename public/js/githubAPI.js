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

const API_REPOS = "/repos/";

const API_FOLLOWING = "/following";

const API_FOLLOWERS = "/followers";

const API_REPOSITORIES = "/repos";

const API_ORGANIZATIONS = "/orgs";


/**
 * Builds a query for the github rest api and
 * allows you to get at the data using a
 * callback which gives you a json object.
 *
 * @param apiPath the path on the github api ie API_FOLLOWING
 * @param user the username to query
 * @param successCallBack callback to complete when data is returned
 * @param errorCallBack callback which is invoked on error
 */
function queryAPIByUser(apiPath, user, successCallBack, errorCallBack) {
    const urlpath = APIROOT + API_USER_PATH + user + apiPath;
    console.log(urlpath);
    $.ajax({
        type:'GET',
        url: urlpath,
        crossDomain: true,
        dataType: "json",
        success: successCallBack,
        error:errorCallBack,
        timeout: 4000
    });
}

function queryAPIByOrg(apiPath, org, successCallBack, errorCallBack) {
    const urlpath = APIROOT + API_ORG_PATH + org + apiPath;
    $.ajax({
        type:'GET',
        url: urlpath,
        crossDomain: true,
        dataType: "json",
        success: successCallBack,
        error:errorCallBack,
        timeout: 4000
    });
}
/*
function queryAPIByRepo(apiPath, org, successCallBack, errorCallBack) {
    const urlpath = APIROOT + API_ORG_PATH + org + apiPath;
    $.ajax({
        type:'GET',
        url: urlpath,
        crossDomain: true,
        dataType: "json",
        success: successCallBack,
        error:errorCallBack,
        timeout: 4000
    });
}*/