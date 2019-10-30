function generateHtmlRow(repoData) {
    var html = `
        <tr>
            <td>
                ${repoData.language === 'null'
                    ? '<div class="bg-light d-inline-block" style="height: 14px; width: 14px; border-radius: 7px"></div>'
                    : `<i class="devicon-${repoData.language}-plain colored"></i>`}
                <a class="text-reset ml-1" href="${repoData.url}">${repoData.name}</a>
            </td>
            <td class="text-right">${repoData.forks}</td>
        </tr>
    `;
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

    fetchAllRepositories(orgName, 1).then(function() {
        for (var i=0; i < repos.length; i++) {
            let icon = repos[i].language;
            icon === null
                ? icon = 'null'
                : icon = icon.toLowerCase();

            icon === 'c++'
                ? icon = 'cplusplus'
                : null;

            icon === 'c#'
                ? icon = 'csharp'
                : null;


            repos[i].language = icon;

            html += generateHtmlRow(repos[i]);
        }

        $("#" + tableContainer).html(html);

        setTimeout(function() {
            $('#dataTable').DataTable({
                pageLength: 15,
                pagingType: 'simple',
                bLengthChange : false,
                "bFilter" : false
            });
        }, 1500);
    }).catch(function(error)
    {
        //console.log("Unable to create table");
    });
}
