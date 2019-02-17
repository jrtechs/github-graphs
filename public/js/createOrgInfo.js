function createOrgInfo(orgName, container) {    
    queryAPIByOrg("", orgName, (orgData) => {
        console.log("called");
        var html = "<div class=\"card\" style=\"w-100;\"><div class='row m-0'><div class='col-2 col-centered p-auto'>"+
            "<img src='" + orgData.avatar_url + "' width='100%'/>" +
        "</div><div class='col-10'>\
            <div class=\"card-body\"> \
                <center><b><h3 class=\"card-title\">"+orgData.name+"</h3><b><center> " +
                (orgData.description != null ? "<div class=\"card-text\"><p>"+orgData.description+"</p></div>" : "") + " \
            </div> \
            <ul class=\"list-group list-group-flush\">"+
                (orgData.location !=null ? "<li class=\"list-group-item\">Location: "+orgData.location+"</li>" : "") + " \
            </ul> \
        </div></div></div>";

        $("#" + container).html(html);

    }, function(error) {
        alert("Organization Does Not Exist");
        window.location.href = "./GraphGenerator.html";
    });
}