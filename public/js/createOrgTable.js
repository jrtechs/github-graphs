function generateHtmlRow(repoData)
{
    var html = "<tr class=\"table_row\">";
    html+="<td><a href='" + repoData.url + "'>" + repoData.name +  "</a></td>";
    html+="<td>" + repoData.forks +  "</td>";
    html+="<td>" + repoData.language +  "</td>";
    html +="</tr>";
    return html;
}


function createOrgTable(orgName, tableContainer)
{
    var html = "";

    queryAPIByOrg(API_REPOSITORIES, orgName,
        function(data)
        {
            for(var i=0; i < data.length; i++)
            {
                html += generateHtmlRow(data[i]);
            }

            $("#" + tableContainer).html(html);
        },
        function(error)
        {
            console.log("Unable to load table data");
        });

}