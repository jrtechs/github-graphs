function createOrgInfo(orgName, container) {
    queryAPIByOrg("", orgName, (orgData) => {
        var html = `
            <div class="card shadow py-4 px-3">
                <div class="row align-items-center">
                    <div class="col-md-2 text-center">
                        <img src="${orgData.avatar_url}" alt="${orgData.name}" class="img-fluid" style="max-width: 100px"/>
                    </div>
                    <div class="col-md-10">
                        <div class="media-body">
                            <h1 class="h4">${orgData.name}</h1>
                            <p class="text-muted">${orgData.description}</p>
                            <ul class="d-flex list-unstyled mb-0">
                                <li>${orgData.location}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $("#" + container).html(html);

    }, function(error) {
        alert("Organization Does Not Exist");
        window.location.href = "./GraphGenerator.html";
    });
}
