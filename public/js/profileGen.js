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
            "<div class=\"card\" style=\"w-100; background-color:rgb(255,255,255);\"> \
                <img class=\"card-img-top\" src=\""+user.avatar_url+"\"></img> \
                <div class=\"row mx-0\" style=\"background-color:rgb(255,255,255);\"> \
                    <div class=\"col-7 p-0\"> \
                        <div class=\"card-body\" style=\"background-color:rgb(255,255,255);\">"+
                            (user.name != null ? "<h5 class=\"card-title\">"+user.name+"</h5>" : "") +" \
                            <h6 class=\"card-subtitle\">"+user.login+"</h5> \
                        </div> \
                    </div> \
                    <div class=\"col-2 p-0\"> \
                        <button type=\"button\" class=\"btn btn-link pt-3\"> \
                            <a href=\""+graphUrl(user.login)+"\"> \
                                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"> \
                                    <path d=\"M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z\"/> \
                                    <path fill=\"none\" d=\"M0 0h24v24H0z\"/> \
                                </svg> \
                            </a> \
                        </button> \
                    </div> \
                    <div class=\"col-2 p-0\"> \
                        <button type=\"button\" class=\"btn btn-link pt-3\"> \
                            <a href=\""+timelineUrl(user.login)+"\"> \
                                <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"> \
                                    <defs> \
                                        <path id=\"a\" d=\"M0 0h24v24H0z\"/> \
                                    </defs> \
                                    <clipPath> \
                                        <use xlink:href=\"#a\" overflow=\"visible\"/> \
                                    </clipPath> \
                                    <defs> \
                                    <path id=\"b\" d=\"M0 0h24v24H0z\"/></defs><clipPath><use xlink:href=\"#b\" overflow=\"visible\"/> \
                                    </clipPath> \
                                    <path d=\"M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z\"/> \
                                </svg> \
                            </a> \
                        </button> \
                    </div> \
                </div> \
                    <div class=\"card-body py-1\" style=\"background-color:rgb(255,255,255);\"> \
                        <p class=\"card-text\"><a href=\""+user.html_url+"\" class=\"card-link\">"+user.html_url+"</a></p> \ " +
                        (user.blog != null ? "<p class=\"card-text \"><a href="+user.blog+" class=\"card-link\">"+user.blog+"</a></p>" : "")+" \
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
            </div>";
            $("#"+container).html(html);
        })
    }, () => {
        alert("User Does Not Exist");
        window.location.href = "./GraphGenerator.html";
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
            resolve([]);
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

function graphUrl(user) {
    return "/FriendsGraph.html?name="+user;
}

function timelineUrl(user) {
    return "/TimeLineGraph.html?name="+user;
}