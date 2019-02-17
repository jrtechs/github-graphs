var events = [];

var repositoryData;


function addEvent(group, date, content)
{
    var dateFormat = new Date(date);
    var dd = new Date(dateFormat.getFullYear(), dateFormat.getMonth(), dateFormat.getDay());
    events.push({id: events.length, group: group, start: dd, content: content});
}

//        {id: 0, group: 0, start: new Date(2013,7,1), end: new Date(2017,5,15), content: 'High School'},
function addRepositories(userName, groupID)
{
    return new Promise(function(resolve, reject)
    {
        queryAPIByUser(API_REPOSITORIES, userName,
            function(data)
            {
                repositoryData = data;
                for(var i = 0; i < data.length; i++)
                {
                    data[i].id = events.length;
                    addEvent(groupID, data[i]['created_at'], data[i]['name'])
                }
                resolve();
            },
            function(error)
            {
                console.log(error);
                reject(error);
            })
    })
}


function timeLineClickEvent(properties)
{
    if(properties.item !== null && typeof repositoryData[properties.item].name !== 'undefined')
    {
        var item = repositoryData[properties.item];

        var html = "<div class=\"card\">\n" +
            "  <div class=\"card-header\">\n" +
            item.name +
            "  </div>\n" +
            "  <div class=\"card-body\">\n";

        html += "<p>" + item.description + "</p>";

        console.log(item.license);
        if(item.license === null)
        {
            item.license = new Object();
            item.license.name = 'none';
        }

        html += "<div class='row'><div class=\"col-6\">\n" +
            "        <ul class=\"list-group\">\n" +
            "            <li class=\"row\">\n" +
            "                <div class=\"col-md-6\"><b>Fork Count</b></div>\n" +
            "                <div class=\"col-md-6\">" +
            item.forks +
            "</div>\n" +
            "            </li>\n" +
            "            <li class=\"row\">\n" +
            "                <div class=\"col-md-6\"><b>Languages</b></div>\n" +
            "                <div class=\"col-md-6\">" +
            item.language+
            "</div>\n" +
            "            </li>\n" +
            "            <li class=\"row\">\n" +
            "                <div class=\"col-md-6\"><b>Liscense</b></div>\n" +
            "                <div class=\"col-md-6\">" +
            item.license.name +
            "</div></li>";
            if(item.homepage !== null)
            {
                html +=
                "            <li class=\"row\">\n" +
                "                <div class=\"col-md-6\"><b>Home Page</b></div>\n" +
                "                <div class=\"col-md-6\">" +
                "<a href='" + item.homepage + "'>" +item.homepage + "</a>" +
                "</div>\n" +
                "            </li>\n" +
                "        </ul>\n";
            }


        html += "</div><div class=\"col-6\">\n" +
            "        <ul class=\"list-group\">\n" +
            "            <li class=\"row\">\n" +
            "                <div class=\"col-md-6\"><b>Repository URL</b></div>\n" +
            "                <div class=\"col-md-6\">" +
            "<a href='" + item.html_url + "'>" +item.html_url + "</a>" +
            "</div>\n" +
            "            </li>\n" +
            "            <li class=\"row\">\n" +
            "                <div class=\"col-md-6\"><b>Open Issues</b></div>\n" +
            "                <div class=\"col-md-6\">" +
            item.open_issues_count +
            "</div>\n" +
            "            </li>\n" +
            "            <li class=\"row\">\n" +
            "                <div class=\"col-md-6\"><b>Watchers</b></div>\n" +
            "                <div class=\"col-md-6\">" +
            item.watchers +
            "</div>\n" +
            "            </li>\n" +
            "        </ul>\n" +
            "    </div></div>";

        html +="  </div>\n" +
            "</div>";

        $("#repositoryInformation").html(html);
    }
}

function createProfileTimeLine(username, containerName)
{
    var container = document.getElementById(containerName);


    var prom = [addRepositories(username, 1)];

    var groups = new vis.DataSet([
        {id: 1, content: 'Repositories', value: 2}
    ]);


    Promise.all(prom).then(function()
    {
        // note that months are zero-based in the JavaScript Date object
        var items = new vis.DataSet(events);
        var options = {
            // option groupOrder can be a property name or a sort function
            // the sort function must compare two groups and return a value
            //     > 0 when a > b
            //     < 0 when a < b
            //       0 when a == b
            groupOrder: function (a, b) {
                return a.value - b.value;
            },
            margin: {
                item: 20,
                axis: 40
            }
        };
        var timeline = new vis.Timeline(container);
        timeline.setOptions(options);
        timeline.setGroups(groups);
        timeline.setItems(items);
        timeline.on('click', timeLineClickEvent);
    });
}