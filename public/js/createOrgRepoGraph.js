/**
 * Add's all the members of the organization into the graphs
 * node objects
 *
 * @param orgname
 * @param page
 * @returns {Promise<any>}
 */
function addOrgUsers(orgname, page)
{
    return new Promise(function(resolve, reject)
    {
        queryAPIByOrg(API_ORG_MEMBERS + "?page=" + page, orgname, function(data)
        {
            for(var i = 0;i < data.length; i++)
            {
                addPersonToGraph(data[i]);
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
                if(this.getNodeAt(params.pointer.DOM) !== NaN) 
                {
                    bringUpProfileView(this.getNodeAt(params.pointer.DOM));
                }
            });

            $("#graphLoading").html("");
        });
    }).catch(function(error) {
        alert("Invalid Organization");
    });
}