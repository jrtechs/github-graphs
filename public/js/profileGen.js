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
            if (user.blog) {
                const rx = new RegExp("^(http|https)://", "i");
                const match = rx.test(user.blog);
                user.blog = match ? user.blog : `http://${user.blog}`;
            }
            let html = `
                <div class="card shadow-sm" style="font-size: 16px;">
                    <div class="card-img-top" style="position: relative;">
                        <img src="${user.avatar_url}" alt="${user.avatar_url}" class="img-fluid"/>
                        <div class="actions">
                            <a href="${graphUrl(user.login)}" class="btns" title="View Friends Graph">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
                                </svg>
                            </a>
                            <a href="${timelineUrl(user.login)}" class="btns" title="View Timeline Graph">
                                <svg viewBox="0 0 24 24">
                                    <path d="M2,2H4V20H22V22H2V2M7,10H17V13H7V10M11,15H21V18H11V15M6,4H22V8H20V6H8V8H6V4Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title mb-1">${user.name}</h5>
                        <a href="${user.html_url}" class="card-subtitle text-muted">${user.login}</a>
                        ${user.bio != null ? `<p class="my-2">${user.bio}</p>` : ""}
                        <ul class="list-unstyled">
                            ${user.blog != null ? `<a href="${user.blog}"><li>${user.blog}</li></a>` : ""}
                            ${user.email != null ? `<li>Email: ${user.email}</li>` : ""}
                            ${user.location != null ? `<li>Location: ${user.location}</li>` : ""}
                            ${user.company != null ? `<li>Company: ${user.company}</li>` : ""}
                        </ul>
                        <hr />
                        <ul class="list-unstyled">
                            <li>Followers: ${user.followers}</li>
                            <li>Following: ${user.following}</li>
                            <li>Repositories: ${user.public_repos}</li>
                        </ul>
                        ${orgsReturn != [] ? `<hr /> <p>Organizations</p> ${orgsReturn}` : ""}
                    </div>
                </div>
            `;
            $("#"+container).html(html);
        })
    }, () =>
    {
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
                            console.log(orgData);
                            orgs_final.push("<a href=\"OrgRepoGraph.html?name="+orgData.login+"\"><img src=\""+orgData.avatar_url+"\" class=\"img-fluid\" style=\"max-width:35px\"></img></a>");
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

function graphUrl(user) {
    return "/FriendsGraph.html?name="+user;
}

function timelineUrl(user) {
    return "/TimeLineGraph.html?name="+user;
}
