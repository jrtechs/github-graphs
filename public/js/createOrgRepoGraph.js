/**
 * Add's all the members of the organization into the graphs
 * node objects
 *
 * @param orgname
 * @param page
 * @returns {Promise<any>}
 */
function addOrgUsers(orgname)
{
    return new Promise(function(resolve, reject)
    {
        getOrganizationMembers(orgname, (data)=>
        {
            for(var i = 0;i < data.length; i++)
            {
                addPersonToGraph(data[i]);
            }
            total = data.length;
            resolve();
        }, (error)=>
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

    addOrgUsers(orgname).then(function()
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