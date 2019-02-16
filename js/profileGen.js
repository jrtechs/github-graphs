function profileGen(username, container) {
    queryAPIByUser("", username, (data) => {
        console.log(data);
        html = 
        "<div> \
            <img src=\""+data.avatar_url+"\"></img> \
            <h1>"+data.name+"</h1> \
            <h2>"+data.login+"</h2> \
            <p>Followers: "+data.followers+"</p> \
            <p>Following: "+data.following+"</p> \
            <p>"+(data.bio != null ? "Bio: "+data.bio : "")+"</p> \
            <p>"+(data.location != null ? "Location: "+data.location : "")+"</p> \
            <p>"+(data.email != null ? "Email: "+data.email : "")+"</p> \
            <p>"+(data.blog != null ? "Site: "+data.blog : "")+"</p> \
            <p>"+(data.company != null ? "Company: "+data.company : "")+"</p> \
            <a href=\""+data.html_url+"\">"+data.html_url+"</h2> \
            <h2></h2> \
        </div>"
        $("#"+container).html(html);
    }, () => {
        console.log("error");
    });
}

function parseOrgs(oranization_url) {
    
}