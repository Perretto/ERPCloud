
//CRIAÇÃO DE ABAS
function createTab(containersCount, titulosContainers, parameters) {
    var recipient = parameters.recipient;
    var title = parameters.title;
    var id = parameters.id;
    var guid;
    var htmlControlsTabs = "";
    var htmlControls = "";
    if (parameters.ableClose != null || parameters.ableClose != undefined) {
        var ableClose = parameters.ableClose;
    } else {
        var ableClose = false;
    }

    var forms = $("#" + recipient + " > .panel > .panel-body > form")

    //alert(forms.length);

    if (containersCount>0) {
        var div = $(div);

        //htmlControlsTabs += AbreDiv({ classe: "col-md-12 panel" })
        //htmlControlsTabs += FechaDiv()
        //cria as abas das tabs
        htmlControlsTabs += "<ul id='' class='profile-tab nav nav-tabs nav-tabs-line'>";
        //cria o conteudo das tabs
        //htmlControls += AbreDiv({ classe: "tab-content" })

        //cria cada aba
        for (var i = 0; i < containersCount; i++) {
            guid = gerarGUID();
            //variavel necessaria para marcar a aba ativa (no caso, a primeira)
            isActive = (i == 0) ? "active" : "";
            htmlControlsTabs += "<li class='" + isActive + "'>";
            htmlControlsTabs += "<a href='#" + guid + "' data-toggle='tab'>";
            htmlControlsTabs += titulosContainers[i];
            htmlControlsTabs += "</a></li>";

            //htmlControls += AbreDiv({ id: guid, classe: "tab-pane fade controls-recipient in " + isActive })
            //htmlControls += forms[i].outerHTML;
            $("#" + forms[i].id).wrap("<div id='" + guid + "' class='tab-pane fade controls-recipient in " + isActive + "' />")
        }
        $("#" + recipient + ">.panel>.panel-body>.tab-pane").wrapAll("<div class='tab-content tab-border' />")
        //htmlControls += FechaDiv();
        htmlControlsTabs = htmlControlsTabs + "</ul>"
        $("#" + recipient + ">.panel>.panel-body>.tab-content").before(htmlControlsTabs);
    }
}

function fechaAba(id) {
    $("#controls-tabs li a[href='#" + id + "']").closest("li").remove();
    $("#controls-recipient #" + id).remove();
}

function atualizaAba(formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu) {
    $("#controls-tabs li a[href='#" + tabGenID + "'] .tabControls").replaceWith("<img src='images/loader.gif' height='15px' />");
    if (urlRenderLayout) {
        getAjaxParameter(urlRenderLayout, urlRenderLayoutData, function () {
            //getAjaxParameter(getGlobalParameters("urlInterface") + "/renderform", nameLayout + Dados, function () {
            fillTab(resultadoParametroExterno, formID, layoutID, tabGenID, false, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu)
            }, function () {
            //    //replaceTabControls(formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData)
                replaceTabControls(formID, layoutID, tabGenID, false, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu) 
            });
    }
    }

