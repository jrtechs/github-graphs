
var nodes;

var edges;


var options = {
    nodes: {
        shape: 'dot',
        size: 40,
        borderWidth:4,
        color: {
            border: '#222222',
            background: '#666666'
        },
        font:{
            color:'#eeeeee',
            size: 12
        },
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
 * Greedy function which checks to see if a edge is in the graphs
 *
 * @param id1
 * @param id2
 * @returns {boolean}
 */
function edgeInGraph(id1, id2)
{
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
    updateProgress();
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
                updateProgress();
                resolve();
            })
        })
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


function bringUpProfileView(id)
{
    for(var i = 0; i < nodes.length; i++)
    {
        if(nodes[i].id === id) {
            profileGen(nodes[i].name, "profileGen");
        }
    }
}


function addOrgUserToGraph(profileData)
{
    nodes.push(
        {
            id:profileData.id,
            name:profileData.login,
            shape: 'circularImage',
            image:profileData.avatar_url
        });
}


function connectOrgUsers()
{
    return new Promise(function(resolve, reject)
    {
        resolve();
    })
}


function addOrgUsers(orgname, page)
{
    return new Promise(function(resolve, reject)
    {
        queryAPIByOrg(API_ORG_MEMBERS + "?page=" + page, orgname, function(data)
        {
            for(var i = 0;i < data.length; i++)
            {
                addOrgUserToGraph(data[i]);
            }

            if(data.length === 30)
            {
                addOrgUsers(orgname, page + 1).then(function()
                {
                    resolve();
                });
            }
            else
            {
                total = 2*(data.length + (page * 30));
                resolve();
            }

        }, function(error)
        {
            console.log(error);
            resolve();
        })
    })
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


var total = 1;
var indexed = 0;

function updateProgress()
{
    indexed++;

    var percent = parseInt((indexed/total)*100);

    $("#graphLoading").html("<div class=\"progress\">\n" +
        "  <div class=\"progress-bar progress-bar-striped progress-bar-animated\" role=\"progressbar\" style=\"width: " + percent + "%\" aria-valuenow=\"" + percent + "\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>\n" +
        "</div>");
}

/**
 * Creates a graph
 * @param username
 * @param containerName
 * @param graphsTitle
 */
function createOrgRepoGraph(orgname, containerName, graphsTitle)
{
    progressID = graphsTitle;

    nodes = [];
    edges = [];

    addOrgUsers(orgname, 1).then(function()
    {

        createConnections().then( () => {
            var container = document.getElementById(containerName);
            var data = {
                nodes: nodes,
                edges: edges
            };
            var network = new vis.Network(container, data, options);
            network.on("click", function (params) {
                params.event = "[original event]";
                if(Number(this.getNodeAt(params.pointer.DOM)) !== NaN) {
                    bringUpProfileView(Number(this.getNodeAt(params.pointer.DOM)));
                }
            });

            $("#graphLoading").html("");
        });
    }).catch(function(error) {
        alert("Invalid Organization");
    });
}