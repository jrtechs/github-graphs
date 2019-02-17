function createOrgInfo(orgName, container) {    
    queryAPIByOrg("", orgName, (orgData) => {
        console.log("called");
        var html = 
        "<div class=\"card\" style=\"w-100;\"> \
            <div class=\"card-body\"> \
                <div class=\"card-header\"><h3 class=\"card-title\">"+orgData.name+"</h3></div> " +
                (orgData.description != null ? "<div class=\"card-text\"><p>"+orgData.description+"</p></div>" : "") + " \
            </div> \
            <ul class=\"list-group list-group-flush\">"+
                (orgData.location !=null ? "<li class=\"list-group-item\">Location: "+orgData.location+"</li>" : "") + " \
            </ul> \
        </div>"

        $("#" + container).html(html);
        $('#dataTable').DataTable();   
    }, function(error) {
        console.log("Unable to load table data");
    });
}