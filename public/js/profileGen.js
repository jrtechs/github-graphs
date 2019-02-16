function profileGen(username, container) {
    queryAPIByUser("", username, (user) => {
        console.log(user);
        html = 
        "<div> \
            <img src=\""+user.avatar_url+"\"></img> \
            <h1>"+user.name+"</h1> \
            <h2>"+user.login+"</h2> \
            <p>Followers: "+user.followers+"</p> \
            <p>Following: "+user.following+"</p> \
            <svg class=\"octicon octicon-star mr-2 text-gray-light\" viewBox=\"0 0 14 16\" version=\"1.1\" width=\"14\" height=\"16\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" d=\"M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z\"></path></svg> \
            <p>"+(user.bio != null ? "Bio: "+user.bio : "")+"</p> \
            <p>"+(user.location != null ? "Location: "+user.location : "")+"</p> \
            <p>"+(user.email != null ? "Email: "+user.email : "")+"</p> \
            <p>"+(user.blog != null ? "Site: "+user.blog : "")+"</p> \
            <p>"+(user.company != null ? "Company: "+user.company : "")+"</p> \
            <p>"+(user.organizations_url != null ? "Organizations: "+parseOrgs(user.organizations_url) : "")+"</p> \
            <a href=\""+user.html_url+"\">"+user.html_url+"</h2> \
            <h2></h2> \
        </div>"
        $("#"+container).html(html);
    }, () => {
        console.error("error getting user info");
    });
}

function parseOrgs(oranization_url) {
    queryOrgUrl(oranization_url, (orgs) => {
        for (org in orgs) {
            console.log(org);
        }
    }, () => {
        console.error("error getting orgs");
    })
}

function queryOrgUrl(url, successCallBack, errorCallBack) {
    console.log(urlpath);
    $.ajax({
        type:'GET',
        url: urlpath,
        crossDomain: true,
        dataType: "json",
        success: successCallBack,
        error:errorCallBack
    });
}