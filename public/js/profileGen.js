function profileGen(username, container) {
    queryAPIByUser("", username, (user) => {
        parseOrgs(user.login).then( (orgsReturn) => {
            let html = 
            "<div class=\"card\" styl\"w-100\"> \
                <img class=\"card-img-top\" src=\""+user.avatar_url+"\"></img> \
                <div class=\"card-body\"> \
                    <h5 class=\"card-title\">"+user.name+"</h1> \
                    <h6 class=\"card-subtitle\">"+user.login+"</h2> \
                </div> \
                <div class=\"card-body\"> \
                    <li class=\"list-group-item\"> \
                        <p><a href=\""+user.html_url+" class=\"card-link\">"+user.html_url+"</a></p>"+
                        (user.blog != null ? "<p><a href="+user.blog+" class=\"card-link\">"+user.blog+"</a></p>" : "")+" \
                    </li> \
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