var events = [];

//        {id: 0, group: 0, start: new Date(2013,7,1), end: new Date(2017,5,15), content: 'High School'},
function addRepositories(userName, groupID)
{
    return new Promise(function(resolve, reject)
    {

    })
}


function addOrgs(userName, groupID)
{
    return new Promise(function(resolve, reject)
    {

    })
}


function createProfileTimeLine(username, containerName)
{
    var container = document.getElementById(containerName);


    var prom = [addRepositories(username, 1), addOrgs(username, 1)];

    var groups = new vis.DataSet([
        {id: 0, content: 'Organizations', value: 1},
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
    });
}