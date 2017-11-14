function CreateMenu(enterpriseID, userID) {

    var menu = "";
    var subMenu = "";
    var parameters = new Object();
    parameters.type = "get";
    parameters.url = getGlobalParameters("urlPlataforma") + "/api/render/renderMenu";
    parameters.dados = "enterpriseID=" + enterpriseID + "&userID=" + userID + "&lang=" + returnCookie("Lang");
    parameters.async = false;

    AjaxParameter(parameters);
    resultado = resultadoParametroExterno;

    for (var i = 0; i < resultado.length ; i++) {
        resultado[i].icon = (resultado[i].icon) ? resultado[i].icon : "circle-o";
        if (resultado[i].layouts == null) {
            if (resultado[i].menus != null) {
                menu = menu + "<li>";
                menu = menu + "     <a href='#'>";

                if (resultado[i].title != null) {
                    menu = menu + "         <i class=\"fa fa-" + resultado[i].icon + "\"></i><span>" + resultado[i].title[0].text + "</span>";
                } else {
                    menu = menu + "         <i class=\"fa fa-" + resultado[i].icon + "\"></i><span>" + resultado[i].systemName + "</span>";
                }
                menu = menu + "     </a>";
                menu = menu + "     <ul >";
                menu = menu + f_retornaSubMenu(resultado[i].menus, enterpriseID);
                menu = menu + " </ul>";
                menu = menu + " </li>";
            }
            else {
                if (resultado[i].layouts != null) {
                    menu = menu + "<li>";
                    menu = menu + "     <a href=\"javascript:f_aba('" + resultado[i].layouts.systemName + "','" + resultado[i].layouts.ID + "','" + resultado[i].title[0].text + "','" + resultado[i].layouts.loadData + "','" + enterpriseID + "')\">";
                    if (resultado[i].title != null) {
                        menu = menu + "         <i class=\"fa fa-" + resultado[i].icon + "\"></i><span>" + resultado[i].title[0].text + "</span>";
                    } else {
                        menu = menu + "         <i class=\"fa fa-" + resultado[i].icon + "\"></i><span>" + resultado[i].systemName + "</span>";
                    }
                    menu = menu + "     </a>";
                    menu = menu + "</li>";
                }
            }
        }
    }
    menu = menu + "<li><a  href=\"javascript:CreateReportAba('','MVC','Relatórios','','" + enterpriseID + "')\"><i class=\"fa fa-bar-chart-o\"></i><span>Relatórios</span></a></li>"


    menu = menu + "<li>";
    menu = menu + "<a  href='#'>";
    menu = menu + "<i class=\"fa fa-phone\"></i><span>CRM</span>";
    menu = menu + "</a>";
    menu = menu + "<ul>";
    menu = menu + "<li>";
    menu = menu + "<a  href=\"javascript:CreateCRM('http://intelecta.crm.netsac.com.br/roadmap/index.php?module=Calendar&view=List','','Agenda','','" + enterpriseID + "')\">";
    menu = menu + "<i class=\"fa fa-calendar\"></i><span>Agenda</span>";
    menu = menu + "</a>";
    menu = menu + "</li>";

    menu = menu + "<li>";
    menu = menu + "<a  href=\"javascript:CreateCRM('http://intelecta.crm.netsac.com.br/roadmap/index.php?module=Leads&view=List','','Leads','','" + enterpriseID + "')\">";
    menu = menu + "<i class=\"fa fa-circle-o\"></i><span>Leads</span>";
    menu = menu + "</a>";
    menu = menu + "</li>";

    menu = menu + "<li>";
    menu = menu + "<a  href=\"javascript:CreateCRM('http://intelecta.crm.netsac.com.br/roadmap/index.php?module=Accounts&view=List','','Organizações','','" + enterpriseID + "')\">";
    menu = menu + "<i class=\"fa fa-circle-o\"></i><span>Organizações</span>";
    menu = menu + "</a>";
    menu = menu + "</li>";

    menu = menu + "<li>";
    menu = menu + "<a  href=\"javascript:CreateCRM('http://intelecta.crm.netsac.com.br/roadmap/index.php?module=Contacts&view=List','','Contatos','','" + enterpriseID + "')\">";
    menu = menu + "<i class=\"fa fa-circle-o\"></i><span>Contatos</span>";
    menu = menu + "</a>";
    menu = menu + "</li>";

    menu = menu + "<li>";
    menu = menu + "<a  href=\"javascript:CreateCRM('http://intelecta.crm.netsac.com.br/roadmap/index.php?module=Potentials&view=List','','Oportunidades ','','" + enterpriseID + "')\">";
    menu = menu + "<i class=\"fa fa-circle-o\"></i><span>Oportunidades</span>";
    menu = menu + "</a>";
    menu = menu + "</li>";

    menu = menu + "<li>";
    menu = menu + "<a  href=\"javascript:CreateCRM('http://intelecta.crm.netsac.com.br/roadmap/index.php?module=HelpDesk&view=List','','Chamados','','" + enterpriseID + "')\">";
    menu = menu + "<i class=\"fa fa-circle-o\"></i><span>Chamados</span>";
    menu = menu + "</a>";
    menu = menu + "</li>";

    menu = menu + "</ul>";
    menu = menu + "</li>";



    //Desenvolvimento
    var urllocal = window.location.host;
	
    if (urllocal == "54.149.163.193") {
        menu = menu + "<li>";
        menu = menu + "<a  href='#'>";
        menu = menu + "<i class=\"fa fa-code\"></i><span>Desenvolvimento</span>";
        menu = menu + "</a>";
        menu = menu + "<ul>";

        menu = menu + "<li>";
        menu = menu + "<a  href=\"javascript:CreateDevelopersAba('/Menu','','Menu','','" + enterpriseID + "')\">";
        menu = menu + "<i class=\"fa fa-list-ul\"></i><span>Menu</span>";
        menu = menu + "</a>";
        menu = menu + "</li>";

        menu = menu + "<li>";
        menu = menu + "<a  href=\"javascript:CreateDevelopersAba('/DataType','','DataType','','" + enterpriseID + "')\">";
        menu = menu + "<i class=\"fa fa-database\"></i><span>Tipo de dados</span>";
        menu = menu + "</a>";
        menu = menu + "</li>";

        menu = menu + "<li>";
        menu = menu + "<a  href=\"javascript:CreateDevelopersAba('http://desenv.empresariocloud.com.br/layout','','Layout','','" + enterpriseID + "')\">";
        menu = menu + "<i class=\"fa fa-file-o\"></i><span>Tela</span>";
        menu = menu + "</a>";
        menu = menu + "</li>";

        menu = menu + "<li>";
        menu = menu + "<a  href=\"javascript:CreateDevelopersAba('http://desenv.empresariocloud.com.br/Class','','Class','','" + enterpriseID + "')\">";
        menu = menu + "<i class=\"fa fa-file-code-o\"></i><span>Código</span>";
        menu = menu + "</a>";
        menu = menu + "</li>";

        menu = menu + "<li>";
        menu = menu + "<a  href=\"javascript:CreateDevelopersAba('http://desenv.empresariocloud.com.br/Toolbar','','Toolbar','','" + enterpriseID + "')\">";
        menu = menu + "<i class=\"fa fa-wrench\"></i><span>Toolbar</span>";
        menu = menu + "</a>";
        menu = menu + "</li>";

        menu = menu + "<li>";
        menu = menu + "<a  href=\"javascript:CreateDevelopersAba('http://desenv.empresariocloud.com.br/Message','','Message','','" + enterpriseID + "')\">";
        menu = menu + "<i class=\"fa fa-envelope-o\"></i><span>Message</span>";
        menu = menu + "</a>";
        menu = menu + "</li>";

        menu = menu + "<li>";
        menu = menu + "<a  href=\"javascript:CreateDevelopersAba('http://desenv.empresariocloud.com.br/SysEvent','','Eventos de sistema','','" + enterpriseID + "')\">";
        menu = menu + "<i class=\"fa fa-bolt\"></i><span>Eventos de sistema</span>";
        menu = menu + "</a>";
        menu = menu + "</li>";

        menu = menu + "<li>";
        menu = menu + "<a  href=\"javascript:CreateDevelopersAba('http://desenv.empresariocloud.com.br/SysProcess','','Agendamento de tarefas','','" + enterpriseID + "')\">";
        menu = menu + "<i class=\"fa fa-calendar\"></i><span>Agendamento de tarefas</span>";
        menu = menu + "</a>";
        menu = menu + "</li>";

        menu = menu + "<li>";
        menu = menu + "<a  href=\"javascript:CreateDevelopersAba('http://desenv.empresariocloud.com.br/Publish','','Publicação','','" + enterpriseID + "')\">";
        menu = menu + "<i class=\"fa fa-check-square-o\"></i><span>Publicação</span>";
        menu = menu + "</a>";
        menu = menu + "</li>";




        menu = menu + "</ul>";
        menu = menu + "</li>";

    }

    //menu = menu + "<li><a  href=\"javascript:CreateFinancialAba('','Financeiro','Módulo Financeiro','','" + enterpriseID + "')\"><i class=\"fa fa-money\"></i><span>Módulo Financeiro</span></a></li>"
    //menu = menu + "<li><a  href=\"javascript: f_aba('financeiro/painel', 'MVC', 'financeiro/painel', '', 'f1495bcf-9258-4245-8edf-d0fac225412d')\"><i class=\"fa fa-money\"></i><span>Módulo Financeiro</span></a></li>"
    //financeiro/painel
    $("#menu1").replaceWith(menu);

    call_navigation();
}

function CreateDevelopersAba(url, layoutID, titleMenu, dados, navigation, containerType, forcingTemplate, layoutType) {
    //html dos controles
    var nomeTemplate = "";
    var title;
    var tab;
    var formControls;
    var tab2;
    var formControls2;
    var titleAboveControl;
    var formID = "";

    var tabGenID = gerarGUID();
    url = getGlobalParameters("urlDesenvolvimento") + url;

    $("#controls-recipient > .active").removeClass("active");
    $("#controls-tabs .active").removeClass("active");
    tab = "<li class='active'><a href='#" + tabGenID + "' data-toggle='tab'>" + titleMenu + "&nbsp&nbsp<img src='images/loader.gif' height='15px' /></a></li>";
    $("#controls-tabs").append(tab);
    $("#controls-recipient").append("<div class='tab-pane fade in  controls-recipient active' id='" + tabGenID + "'>");

    fillTab(null, formID, layoutID, tabGenID, forcingTemplate, layoutType)
    $("#" + tabGenID).html('<object width="100%" height="950px" data="' + url + '"/>');

}

function CreateCRM(url, layoutID, titleMenu, dados, navigation, containerType, forcingTemplate, layoutType) {
    //html dos controles
    var nomeTemplate = "";
    var title;
    var tab;
    var formControls;
    var tab2;
    var formControls2;
    var titleAboveControl;
    var formID = "";

    var tabGenID = gerarGUID();

    $("#controls-recipient > .active").removeClass("active");
    $("#controls-tabs .active").removeClass("active");
    tab = "<li class='active'><a href='#" + tabGenID + "' data-toggle='tab'>" + titleMenu + "&nbsp&nbsp<img src='images/loader.gif' height='15px' /></a></li>";
    $("#controls-tabs").append(tab);
    $("#controls-recipient").append("<div class='tab-pane fade in  controls-recipient active' id='" + tabGenID + "'>");

    fillTab(null, formID, layoutID, tabGenID, forcingTemplate, layoutType)
    //$("#" + tabGenID).html('<object sandbox="allow-forms allow-scripts" width="100%" height="950px" data="http://teste.crm.netsac.com.br/vtigerCRM/index.php?module=Potentials&view=List"/>');
    $("#" + tabGenID).html('<iframe sandbox="allow-forms allow-scripts" width="100%" height="950px" style="border:0" src=' + url + '></iframe>');
}

function CreateReportAba(url, layoutID, titleMenu, dados, navigation, containerType, forcingTemplate, layoutType) {
    //html dos controles
    var nomeTemplate = "";
    var title;
    var tab;
    var formControls;
    var tab2;
    var formControls2;
    var titleAboveControl;
    var formID = "";

    var tabGenID = gerarGUID();

    $("#controls-recipient > .active").removeClass("active");
    $("#controls-tabs .active").removeClass("active");
    tab = "<li class='active'><a href='#" + tabGenID + "' data-toggle='tab'>" + titleMenu + "&nbsp&nbsp<img src='images/loader.gif' height='15px' /></a></li>";
    $("#controls-tabs").append(tab);
    $("#controls-recipient").append("<div class='tab-pane fade in  controls-recipient active' id='" + tabGenID + "'>");

    fillTab(null, formID, layoutID, tabGenID, forcingTemplate, layoutType)
    $("#" + tabGenID).html('<object width="100%" height="950px" data="http://' + window.location.hostname + ':8080/IntelectaReportWeb/principal.do?method=carregaTela"/>');

}

function CreateFinancialAba(url, layoutID, titleMenu, dados, navigation, containerType, forcingTemplate, layoutType) {
    //html dos controles
    var nomeTemplate = "";
    var title;
    var tab;
    var formControls;
    var tab2;
    var formControls2;
    var titleAboveControl;
    var formID = "";

    var tabGenID = gerarGUID();

    $("#controls-recipient > .active").removeClass("active");
    $("#controls-tabs .active").removeClass("active");
    tab = "<li class='active'><a href='#" + tabGenID + "' data-toggle='tab'>" + titleMenu + "&nbsp&nbsp<img src='images/loader.gif' height='15px' /></a></li>";
    $("#controls-tabs").append(tab);
    $("#controls-recipient").append("<div class='tab-pane fade in  controls-recipient active' id='" + tabGenID + "'>");

    fillTab(null, formID, layoutID, tabGenID, forcingTemplate, layoutType)
    $("#" + tabGenID).html('<object width="100%" height="950px" data="http://' + window.location.host + '/GestorFinanceiro/'); //'/financeiro/painel"/>');

}


function f_retornaSubMenu(lstMenu, enterpriseID) {
    var subMenu = "";
    for (var i = 0; i < lstMenu.length; i++) {


        if (lstMenu[i].menus != null) {

            subMenu = subMenu + f_createUL(lstMenu[i], enterpriseID);
            subMenu = subMenu + f_retornaSubMenu(lstMenu[i].menus, enterpriseID);
            subMenu = subMenu + " </ul>";
            subMenu = subMenu + " </li>";
        }
        else {
            subMenu = subMenu + f_createLI(lstMenu[i], enterpriseID);
        }
    }

    return subMenu;

}

function f_createLI(menu, enterpriseID) {
    var subMenu = "";
    subMenu = subMenu + "<li>";
    if (menu.layoutID != "00000000-0000-0000-0000-000000000000") {


        if (menu.title != null) {
            subMenu = subMenu + "     <a href=\"javascript:f_aba('" + menu.layouts.systemName + "','" + menu.layouts.ID + "','" + menu.title[0].text + "','" + menu.layouts.loadData + "', '" + enterpriseID + "')\">";
        }
        else {
            subMenu = subMenu + "     <a href=\"javascript:f_aba('" + menu.layouts.systemName + "','" + menu.layouts.ID + "','" + menu.layouts.systemName + "','" + menu.layouts.loadData + "','" + enterpriseID + "')\">";
        }


    }
    else {
        subMenu = subMenu + "     <a href=\"javascript:f_aba('" + menu.systemName + "','" + "MVC" + "','" + menu.systemName.replace("mn", "") + "','" + "" + "','" + enterpriseID + "')\">";
    }

    menu.icon = (menu.icon) ? menu.icon : "circle-o";
    if (menu.title != null) {
        subMenu = subMenu + "         <i class=\"fa fa-" + menu.icon + "\"></i><span>" + menu.title[0].text + "</span>";
    } else {
        subMenu = subMenu + "         <i class=\"fa fa-" + menu.icon + "\"></i><span>" + menu.systemName + "</span>";
    }

    subMenu = subMenu + "     </a>";

    subMenu = subMenu + "</li>";

    return subMenu;
}

function f_createUL(menu, enterpriseID) {
    var subMenu = "";
    subMenu = subMenu + "<li>";
    subMenu = subMenu + "     <a href='#'>";

    menu.icon = (menu.icon) ? menu.icon : "circle-o";
    if (menu.title != null) {
        subMenu = subMenu + "         <i class=\"fa fa-" + menu.icon + "\"></i><span>" + menu.title[0].text + "</span>";
    } else {
        subMenu = subMenu + "         <i class=\"fa fa-" + menu.icon + "\"></i><span>" + menu.systemName + "</span>";
    }
    subMenu = subMenu + "     </a>";
    subMenu = subMenu + " <ul style='display: none;'>";
    return subMenu;
}

function f_aba(systemName, layoutID, titleMenu, loadData, enterpriseID) {

    var dados = "&enterpriseID=" + enterpriseID;

    if (loadData == "true") {
        dados = dados + "&paramReferenceID=*&Filtro=*";
    }
    CreateAba(systemName, layoutID, titleMenu, dados);
}