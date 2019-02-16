
var nodes;

var edges;



function addFollowers(username)
{
    return new Promise(function(resolve, reject)
    {
        queryAPIByUser(API_FOLLOWERS, username, function(data)
        {
            for(var i = 0; i < data.length; i++)
            {
                nodes.push(
                    {
                        id:data[i].id,
                        shape: 'circularImage',
                        image:data[i].avatar_url
                    });

            }
            resolve();
        },
        function(error)
        {
            reject(error);
        })
    });
}

function addFollowing(username)
{
    return new Promise(function(resolve, reject)
    {

    });
}


function createFriendsGraph(username, containerName, graphsTitle)
{
    nodes = [];
    edges = [];
    var network = null;

    addFollowers(username).then(function()
    {
        var container = document.getElementById(containerName);
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
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
        network = new vis.Network(container, data, options);
    });

    // // create connections between people
    // // value corresponds with the amount of contact between two people
    // edges = [
    //     {from: 1, to: 2},
    //     {from: 2, to: 3},
    //     {from: 2, to: 4},
    //     {from: 4, to: 5},
    //     {from: 4, to: 10},
    //     {from: 4, to: 6},
    //     {from: 6, to: 7},
    //     {from: 7, to: 8},
    //     {from: 8, to: 9},
    //     {from: 8, to: 10},
    //     {from: 10, to: 11},
    //     {from: 11, to: 12},
    //     {from: 12, to: 13},
    //     {from: 13, to: 14},
    //     {from: 9, to: 16}
    // ];

}