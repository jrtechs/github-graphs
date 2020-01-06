function generateHtmlRow(repoData) {
    var html = `
        <tr>
            <td>
                ${repoData.language === 'null'
                    ? '<div class="bg-light d-inline-block" style="height: 14px; width: 14px; border-radius: 7px"></div>'
                    : `<i class="devicon-${repoData.language}-plain colored"></i>`}
                <a class="text-reset ml-1" href="${repoData.html_url}" target="_blank">${repoData.name}</a>
            </td>
            <td class="text-right">${repoData.forks}</td>
        </tr>
    `;
    return html;
}


var repos = [];

function fetchAllRepositories(orgName)
{
    console.log("Going for it");
    return new Promise((resolve, reject)=>
    {
        getOrganizationRepositories(orgName,
            (data)=>
            {
                console.log("Dam did got it");
                repos.push(...data);
                resolve();
            },
            (error)=>
            {
                console.log("Unable to load table data");
                reject("Error fetching repositories");
            });
    });
}


function createOrgTable(orgName, tableContainer)
{
    var html = "";

    fetchAllRepositories(orgName).then(function() {
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
        console.log("Unable to create table");
    });
}
