function GetEnterprises() {

    //var dados = "";
    //var parameters = new Object();
    //dados = dados + "enterpriseID=" + globalEnterpriseID;
    //dados = dados + "&userID=" + globalUserID;
    //parameters.url = getGlobalParameters("urlPlataforma") + "/api/render/RenderEnterprises?EnterpriseID=" + globalEnterpriseID;
    //parameters.dados = dados;
    //parameters.async = false;
    //parameters.type = "GET";

    //var result = AjaxParameter(parameters);

    //CreateEnterprise(result);

    checkEnvironment(true);
}

function CreateEnterprise(result) {
    var html = "";
    html = html + "<h4>Empresas</h4>";

    html = html + "<ul id='ulEnterprises' class='ls-feed'>";

    /* Empresa Principal */
    html = html + "<li class='noteItem read' data-enterpriseid=" + result.ID + " id=" + result.ID + ">";
    html = html + "    <div class='notificationStatus'>";
    html = html + "        <span class='label label-blue'>";
    html = html + "            <i class='fa fa-refresh'></i>";
    html = html + "        </span>";
    html = html + "    </div>";
    html = html + "    <div class='textNotification' onclick='onChangeEnterprise(\"" + result.ID + "\",\"" + result.companyName + "\")'>";
    html = html + "        <span class='noteText1'>   " + result.companyName + "           </span>";
    html = html + "        <span class='noteText2'>   Selecionar empresa          </span>";
    html = html + "    </div>";
    html = html + "</li>";

    /* Filiais */
    for (var i = 0; i < result.linkEnterprise.length; i++) {
        html = html + "<li class='noteItem read' data-enterpriseid=" + result.linkEnterprise[i].ID + " id=" + result.linkEnterprise[i].ID + ">";
        html = html + "    <div class='notificationStatus'>";
        html = html + "        <span class='label label-blue'>";
        html = html + "            <i class='fa fa-refresh'></i>";
        html = html + "        </span>";
        html = html + "    </div>";
        html = html + "    <div class='textNotification' onclick='onChangeEnterprise(\"" + result.linkEnterprise[i].ID + "\",\"" + result.linkEnterprise[i].companyName + "\")'>";
        html = html + "        <span class='noteText1'>   " + result.linkEnterprise[i].companyName + "           </span>";
        html = html + "        <span class='noteText2'>   Selecionar empresa          </span>";
        html = html + "    </div>";
        html = html + "</li>";
    }

    html = html + "</ul>";

    $("#empresa").html(html);
}

function onChangeEnterprise(EnterpriseIDSelected, EnterpriseNameSelected) {
    
    let PreviousEnterprise = returnCookie("EnterpriseID");
    let PreviousEnterpriseName = returnCookie("EnterpriseName");

    try
    {
        globalEnterpriseID = EnterpriseIDSelected;
        createCookie("EnterpriseID", globalEnterpriseID, 1);
        createCookie("EnterpriseName", EnterpriseNameSelected, 1);

        //GetEnterprises();
        
        notification({ messageText: "Empresa selecionada com sucesso.", messageTitle: "Ok!", fix: false, type: "ok", icon: "thumbs-up" });
    }
    catch (e) {
        globalEnterpriseID = PreviousEnterprise;
        createCookie("EnterpriseID", PreviousEnterprise, 1);
        createCookie("EnterpriseName", PreviousEnterpriseName, 1);

        notification({ messageText: "Ocorreu um erro ao selecionar a empresa.", messageTitle: "Ops!", fix: false, type: "error", icon: "thumbs-down" });
    }
}