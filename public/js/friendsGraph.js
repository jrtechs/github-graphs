
var nodes;

var edges;


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


/**
 * Checks if a user is a node in the graph
 *
 * @param userID
 * @returns {boolean}
 */
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


/**
 * adds a person to the nodes list
 *
 * @param profileData
 */
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


/**
 * Adds the followers/following of a person
 * to the graph
 *
 * @param username
 * @param apiPath
 * @returns {Promise<any>}
 */
function addFriends(username, apiPath, page)
{
    console.log(username + " page=" + page);
    return new Promise(function(resolve, reject)
    {
        queryAPIByUser(apiPath + "?page=" + page, username, function(data)
        {
            console.log(data);
            console.log(data.length);
            for(var i = 0; i < data.length; i++)
            {
                if(!alreadyInGraph(data[i].id))
                {
                    addPersonToGraph(data[i]);
                }
            }

            if(data.length === 30)
            {
                addFriends(username, apiPath, page+ 1).then(function()
                {
                    resolve();
                })
            }
            else
            {
                resolve();
            }
        },
        function(error)
        {
            reject(error);
        })
    });
}


/**
 * Greedy function which checks to see if a edge is in the graphs
 *
 * @param id1
 * @param id2
 * @returns {boolean}
 */
function edgeInGraph(id1, id2)
{
    console.log("edge check");
    for(var i = 0;i < edges.length; i++)
    {
        if(edges[i].from === id1 && edges[i].to === id2)
        {
            return true;
        }
        if(edges[i].to === id1 && edges[i].from === id2)
        {
            return true;
        }
    }
    return false;
}


/**
 * Adds a connection to the graph
 *
 * @param person1
 * @param person2
 */
function addConnection(person1, person2)
{
    if(person1.id !== person2.id)
    {
        if(alreadyInGraph(person2.id) && !edgeInGraph(person1.id, person2.id))
        {
            edges.push(
                {
                    from: person1.id,
                    to: person2.id
                });
        }
    }
}


function processConnections(user, apiPoint, page)
{
    return new Promise(function(resolve, reject)
    {
        queryAPIByUser(apiPoint + "?page=" + page, user.name,
            function(data)
            {
                for(var i = 0; i < data.length; i++)
                {
                    addConnection(user, data[i])
                }
                if(data.length === 30)
                {
                    processConnections(user, apiPoint, page + 1).then(function()
                    {
                        resolve();
                    });
                }
                else
                {
                    resolve();
                }
            }, function(error)
            {
                console.log(error);
                resolve();
            })
    })
}


/**
 * Processes all the connections of a user and adds them to the graph
 *
 * @param user has .id and .name
 * @returns {Promise<any>}
 */
function processUserConnections(user)
{
    return new Promise(function(resolve, reject)
    {

        processConnections(user, API_FOLLOWING, 1).then(function()
        {
            processConnections(user, API_FOLLOWERS, 1).then(function()
            {
                resolve();
            })
        })
        // queryAPIByUser(API_FOLLOWING, user.name,
        //     function(data)
        //     {
        //         for(var i = 0; i < data.length; i++)
        //         {
        //             addConnection(user, data[i])
        //         }
        //
        //         queryAPIByUser(API_FOLLOWERS, user.name, function(data2)
        //             {
        //                 for(var i = 0; i < data2.length; i++)
        //                 {
        //                     addConnection(user, data2[i]);
        //                 }
        //                 resolve();
        //             },
        //             function(error)
        //             {
        //                 // reject(error);
        //                 resolve();
        //             });
        //     },
        //     function(error)
        //     {
        //         // reject(error);
        //         resolve();
        //     })
    });
}


/**
 * Creates connections between all the nodes in
 * the graph.
 *
 * @returns {Promise<any>}
 */
function createConnections()
{
    return new Promise(function(resolve, reject)
    {
        var prom = [];
        for(var i = 0; i < nodes.length; i++)
        {
            prom.push(processUserConnections(nodes[i]));
        }

        Promise.all(prom).then(function()
        {
            resolve();
        }).catch(function(error)
        {
            console.log(error);
            resolve();
        });
    });
}


/**
 * Adds the base  person to the graph.
 *
 * @param username
 * @returns {Promise<any>}
 */
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


function bringUpProfileView(id)
{
    for(var i = 0; i < nodes.length; i++)
    {
        if(nodes[i].id === id)
        {
            profileGen(nodes[i].name, "profileGen");
        }
    }
}

/**
 * Creates a graph
 * @param username
 * @param containerName
 * @param graphsTitle
 */
function createFriendsGraph(username, containerName, graphsTitle)
{
    nodes = [];
    edges = [];
    addSelfToGraph(username).then(function()
    {
        addFriends(username, API_FOLLOWERS,1).then(function()
        {
            addFriends(username, API_FOLLOWING,1).then(function()
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

                    network.on("click", function (params)
                    {
                        params.event = "[original event]";
                        if(Number(this.getNodeAt(params.pointer.DOM)) !== NaN)
                        {
                            bringUpProfileView(Number(this.getNodeAt(params.pointer.DOM)));
                        }
                    });
                });
            });
        })
    }).catch(function(error)
    {
        $("#" + graphsTitle).html("Error Fetching Data From API");
        alert("Invalid User");
    });
}