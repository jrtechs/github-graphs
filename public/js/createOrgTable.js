function generateHtmlRow(repoData)
{
    var html = "<tr class=\"table_row\">";
    html+="<td><a href='" + repoData.url + "'>" + repoData.name +  "</a></td>";
    html+="<td>" + repoData.forks +  "</td>";
    html+="<td>" + repoData.language +  "</td>";
    html +="</tr>";
    return html;
}


var repos = [];

function fetchAllRepositories(orgName, page)
{
    return new Promise(function(resolve, reject)
    {
        queryAPIByOrg(API_REPOSITORIES + "?page=" + page, orgName,
            function(data)
            {
                repos.push(...data);

                if (data.length === 30)
                {
                    fetchAllRepositories(orgName, page + 1).then(function ()
                    {
                        resolve();
                    })
                }
                else {
                    resolve();
                }
            },
            function(error)
            {
                //console.log("Unable to load table data");
            });
    });
}


function createOrgTable(orgName, tableContainer)
{
    var html = "";


    fetchAllRepositories(orgName, 1).then(function()
    {
        for(var i=0; i < repos.length; i++)
        {
            html += generateHtmlRow(repos[i]);
        }

        $("#" + tableContainer).html(html);

        $(document).ready(function() {
            $('#dataTable').DataTable();
        } );
    }).catch(function(error)
    {
        //console.log("Unable to create table");
    });
}