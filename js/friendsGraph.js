
var nodes;

var edges;


const options = {
    nodes: {
        borderWidth:4,
        size:30,
        color: {
            border: '#222222',
            background: '#666666'
        },
        font:{color:'#eeeeee'}
    },
    edges: {
        color: 'lightgray'
    }
};

function alreadyInGraph(userID)
{
    for(var i = 0; i < nodes.length; i++)
    {
        if(nodes[i].id === userID)
        {
            return true;
        }
    }
    return false;
}


function addPersonToGraph(profileData)
{
    nodes.push(
        {
            id:profileData.id,
            name:profileData.login,
            shape: 'circularImage',
            image:profileData.avatar_url
        });
}

function addFriends(username, apiPath)
{
    return new Promise(function(resolve, reject)
    {
        queryAPIByUser(apiPath, username, function(data)
        {
            for(var i = 0; i < data.length; i++)
            {
                if(!alreadyInGraph(data[i].id))
                {
                    addPersonToGraph(data[i]);
                }
            }
            resolve();
        },
        function(error)
        {
            reject(error);
        })
    });
}



function addConnection(person1, person2)
{
    edges.push(
        {
            from: person1.id,
            to: person2.id
        });
}


function processUserConnections(userName)
{
    return new Promise(function(resolve, reject)
    {
        queryAPIByUser(API_FOLLOWING, userName,
            function(data)
            {
                for(var i = 0; i < data.length; i++)
                {

                }

                queryAPIByUser(API_FOLLOWERS, userName, function(data2)
                    {
                        for(var i = 0; i < data2.length; i++)
                        {

                        }
                        resolve();
                    },
                    function(error)
                    {
                        reject(error);
                    });
            },
            function(error)
            {
                reject(error);
            })
    });
}

function createConnections()
{
    return new Promise(function(resolve, reject)
    {
        var prom = [];
        for(var i = 0; i < nodes.length; i++)
        {
            prom.push(processUserConnections(nodes[i].name));
        }

        Promise.all(prom).then(function()
        {
            resolve();
        }).catch(function(error)
        {
            reject(error);
        });
    });
}


function addSelfToGraph(username)
{
    return new Promise(function(resolve, reject)
    {
        queryAPIByUser("", username, function(data)
        {
            addPersonToGraph(data);
            resolve();
        },
        function(error)
        {
           reject(error);
        });

    });
}



function createFriendsGraph(username, containerName, graphsTitle)
{
    nodes = [];
    edges = [];
    addSelfToGraph(username).then(function()
    {
        addFriends(username, API_FOLLOWERS).then(function()
        {
            addFriends(username, API_FOLLOWING).then(function()
            {
                createConnections().then(function()
                {
                    var container = document.getElementById(containerName);
                    var data =
                        {
                            nodes: nodes,
                            edges: edges
                        };
                    var network = new vis.Network(container, data, options);
                });
            });
        })
    }).catch(function(error)
    {
        console.log(error);
        $("#" + graphsTitle).html("Error Fetching Data From API");
    });
}