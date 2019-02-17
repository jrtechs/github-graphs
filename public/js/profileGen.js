function profileGen(username, container) {
    queryAPIByUser("", username, (user) => {
        parseOrgs(user.login).then(function(orgsReturn) {
            let html = 
            "<div> \
                <img src=\""+user.avatar_url+"\"></img> \
                <h1>"+user.name+"</h1> \
                <h2>"+user.login+"</h2> \
                <p>Followers: "+user.followers+"</p> \
                <p>Following: "+user.following+"</p> \
                <p>"+(user.bio != null ? "Bio: "+user.bio : "")+"</p> \
                <p>"+(user.location != null ? "Location: "+user.location : "")+"</p> \
                <p>"+(user.email != null ? "Email: "+user.email : "")+"</p> \
                <p>"+(user.blog != null ? "Site: "+user.blog : "")+"</p> \
                <p>"+(user.company != null ? "Company: "+user.company : "")+"</p> \
                <p>"+(user.organizations_url != null ? "Organizations: "+orgsReturn: "")+"</p> \
                <a href=\""+user.html_url+"\">"+user.html_url+"</h2> \
                <h2></h2> \
            </div>"
            $("#"+container).html(html);
        })
    }, () => {
        console.error("error getting user info");
    });
}

async function parseOrgs(name) {
    const urlpath = `api/users/${name}/orgs`;
    let orgs_final = [];

    await queryUrl(urlpath, async (orgs) => {
        orgs.map(org => {
            return new Promise(function (res, rej) {
                url = org.url;
                queryUrl(url, (orgData) => {
                    orgs_final.push("<a href=\"" + orgData.html_url + "\"><img src=\"" + orgData.avatar_url + "\"></img></a>");
                    //console.log(orgs_final);
                    res();
                }, () => {
                    console.error("error getting org info");
                });
            });
        });
        console.log(orgs);
        await Promise.all(orgs);
    }, () => {
        console.error("error getting orgs");
    });

    console.log(orgs_final);
    console.log(orgs_final.length);
    console.log(orgs_final[0]);
    return orgs_final.join(" ");
}



function queryUrl(url, successCallBack, errorCallBack) {
    console.log(url);
    $.ajax({
        type:'GET',
        url: url,
        crossDomain: true,
        dataType: "json",
        success: successCallBack,
        error:errorCallBack
    });
}