
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




function createConnections()
{
    return new Promise(function(resolve, reject)
    {
        resolve();
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