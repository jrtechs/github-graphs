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

        if (item.license === null) {
            item.license = new Object();
            item.license.name = 'None';
        }

        var html = `
            <div class="card shadow" style="font-size: 16px">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-subtitle text-muted">${item.description ? item.description : 'No description'}</p>
                    <div class="row py-3">
                        <div class="col-12 col-md-8">
                            ${item.homepage ? `<p class="mb-0">Homepage: <a href="${item.license.name}">${item.license.name}</a></p>` : ''}
                            <p class="mb-0">Repository URL: <a href="${item.html_url}">${item.html_url}</a></p>
                            <p class="mb-0">Languages: ${item.language ? item.language : 'Not specified'}</p>
                            <p class="mb-0">License: ${item.license.name}</p>
                        </div>
                        <div class="col-12 col-md-4">
                            <p class="mb-0">Fork Count: ${item.forks}</p>
                            <p class="mb-0">Open Issues: ${item.open_issues_count}</p>
                            <p class="mb-0">Watchers: ${item.watchers}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

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
