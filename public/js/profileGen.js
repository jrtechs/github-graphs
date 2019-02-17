function profileGen(username, container)
{
    queryAPIByUser("", username, (user) =>
    {
        if(!user.hasOwnProperty("id"))
        {
            alert("User Does Not Exist");
            window.location.href = "./GraphGenerator.html";
        }
        parseOrgs(user.login).then( (orgsReturn) => {
            let html = 
            "<div class=\"card\" style=\"w-100\"> \
                <img class=\"card-img-top\" src=\""+user.avatar_url+"\"></img> \
                <div class=\"row\"> \
                    <div class=\"col-8\"> \
                        <div class=\"card-body\"> \
                            <h5 class=\"card-title\">"+user.name+"</h1> \
                            <h6 class=\"card-subtitle\">"+user.login+"</h2> \
                        </div> \
                    </div> \
                    <div class=\"col-4\"> \
                        <button type=\"button\" class=\"btn btn-link pt-3\"> \
                            <a href=\""+makeUrl(user.login)+"\"> \
                                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"> \
                                    <path d=\"M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z\"/> \
                                    <path fill=\"none\" d=\"M0 0h24v24H0z\"/> \
                                </svg> \
                            </a> \
                        </button> \
                    </div> \
                </div> \
                <div class=\"card border-secondary mb-3 mx-auto text-left\" style=\"width:90%\"> \
                    <div class=\"card-body\"> \
                        <p class=\"card-text\"><a href=\""+user.html_url+"\" class=\"card-link\">"+user.html_url+"</a></p> \ " +
                        (user.blog != null ? "<p class=\"card-text \"><a href="+user.blog+" class=\"card-link\">"+user.blog+"</a></p>" : "")+" \
                    </div> \
                </div> \
                    <ul class=\"list-group list-group-flush\"> \
                        <li class=\"list-group-item\">Followers: "+user.followers+"</li> \
                        <li class=\"list-group-item\">Following: "+user.following+"</li> \
                        <li class=\"list-group-item\">Repositories: "+user.public_repos+"</li>" +
                        (user.bio != null ? "<li class=\"list-group-item\">Bio: "+user.bio+"</li>" : "")+
                        (user.location != null ? "<li class=\"list-group-item\">Location: "+user.location+"</li>" : "")+
                        (user.email != null ? "<li class=\"list-group-item\">Email: "+user.email+"</li>" : "")+
                        (user.company != null ? "<li class=\"list-group-item\">Company: "+user.company+"</li>" : "")+
                        (orgsReturn != [] ? "<li class=\"list-group-item\">"+orgsReturn+"</li>" : "")+ " \
                    </ul> \
            </div>"
            $("#"+container).html(html);
        })
    }, () => {
        console.error("error getting user info");
    });
}

function parseOrgs(name) {
    return new Promise( (resolve, reject) => {
        let urlpath = `api/users/${name}/orgs`;
        let orgs_final = [];
    
        queryUrl(urlpath, (orgs) => {
            var prom= [];

            for(var i = 0;i < orgs.length; i++) {
                prom.push( new Promise( (res, rej) => {
                        url = orgs[i].url;
                        queryUrl(url, (orgData) => {
                            orgs_final.push("<a href=\""+orgData.html_url+"\"><img src=\""+orgData.avatar_url+"\" class=\"img-fluid\" style=\"max-width:49%\"></img></a>");
                            res();
                        }, (error) => {
                            console.log(error);
                            rej(error);
                            console.error("error getting org info");
                        });
                    })
                )
            }
            Promise.all(prom).then(function() {
                resolve(orgs_final.join(" "));
            })
        }, (error) => {
            console.error("error getting orgs");
            reject(error);
        });
    })
}

function queryUrl(url, successCallBack, errorCallBack) {
    url = url.split("https://api.github.com/").join("api/");
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

function makeUrl(user) {
    return "/FriendsGraph.html?name="+user;
}