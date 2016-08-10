function loadProject(projectID) {
    behanceAPI.getProjectDetails(projectID, function(loadModules) {

        // console.dir(loadModules);
        var moduleHTML = "";

        var moduleTitle = "";
        moduleTitle += "<h1>" + loadModules.name + "</h1>";
        $("#myModalLabel").html(moduleTitle);

        var moduleDescription = "";
        moduleDescription += "<p>" + loadModules.description + "</p>";
        $(".modal-description").html(moduleDescription);

        var moduleMeta = "";
        moduleMeta += "<ul class='list-unstyled list-inline'><li><i class='fa fa-eye'></i> " + loadModules.stats.views + "</li><li><i class='fa fa-thumbs-up'></i> " + loadModules.stats.appreciations + "</li></ul>";
        $(".modal-meta").html(moduleMeta);

        for(var i=0; i<loadModules.modules.length; i++) {
            if(loadModules.modules[i].src!=undefined) {
                moduleHTML += "<p><img class='img-responsive' src='" + loadModules.modules[i].src + "'>";
                moduleHTML += "</p>";
            }
        }
        $(".modal-work").html(moduleHTML);
        $('#myModal').modal('show');
    });
}

$(document).ready(function() {

    // Set behance api key
    behanceAPI.setKey(behancekey);

    // Get projects
    behanceAPI.getProjects(user, function(projectlist) {

        //console.dir(projectlist);

        var projectHTML = "";

        for(var i=0; i<projectlist.length; i++) {
            var project = projectlist[i];

            if (project.covers[1200] == undefined) {
                imgSrc = project.covers[202];
            }
            else {
                imgSrc = project.covers[1200];
            }

            projectHTML +=
                " <div class='col-lg-3 col-md-4 col-sm-4 col-xs-6 single-projects'>
                    <a class='overlay' href='#'  title='"+ project.name +"' onclick='loadProject(" + project.id + ")'>
                        <span class='overlay-contain'>
                            <h3 class='project-title'> "+ project.name +"</h3>
                            <hr>
                           <h4 class='project-stats'>View Project</h4>
                        </span>
                    </a>
                    <img class='coverimage' src='" + imgSrc + "' alt='" + project.name + "'>
                </div>";
        }

        projectHTML += "<div class='clearfix'></div>";

        $("#projects").html(projectHTML);
    });
}); //document.ready