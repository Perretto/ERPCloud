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
        resultado[i].icon = (resultado[i].icon) ? resultado[i].icon : "";
        if (resultado[i].layouts == null) {
            if (resultado[i].menus != null) {
				menu = menu + " <ul class=\"site-menu\">";
			   menu = menu + " <li class=\"site-menu-item has-sub\">";
                if (resultado[i].title != null) {
                    menu = menu + "  <a href=\"javascript:void(0)\"><i class=\"site-menu-icon fa fa-" + resultado[i].icon + "\"></i><span class=\"site-menu-title\">" + resultado[i].title[0].text + "</span><span class=\"site-menu-arrow\"></span>";
                } else {
                    menu = menu + "         <i class=\"site-menu-icon" + resultado[i].icon + "\"></i><span>" + resultado[i].systemName + "</span>";
                }
                menu = menu + "     </a>";
                menu = menu + "     <ul class=\"site-menu-sub\">";
				menu = menu + f_retornaSubMenu(resultado[i].menus, enterpriseID);
                menu = menu + " </ul>";
                menu = menu + " </li>";
				menu = menu + " </ul>";
            }
            else {
                if (resultado[i].layouts != null) {
                    menu = menu + "<li class=\"site-menu-category\">";
                    menu = menu + "     <a href=\"javascript:f_aba('" + resultado[i].layouts.systemName + "','" + resultado[i].layouts.ID + "','" + resultado[i].title[0].text + "','" + resultado[i].layouts.loadData + "','" + enterpriseID + "')\">";
                    if (resultado[i].title != null) {
                        menu = menu + "         <i class=\"site-menu-icon " + resultado[i].icon + "\"></i><span>" + resultado[i].title[0].text + "</span>";
                    } else {
                        menu = menu + "         <i class=\"site-menu-icon " + resultado[i].icon + "\"></i><span>" + resultado[i].systemName + "</span>";
                    }
                    menu = menu + "     </a>";
                    menu = menu + "</li>";
                }
            }
        }
    }
    menu = menu + "<ul class=\"site-menu\"><li class=\"site-menu-item has-su\"><a  href=\"javascript:CreateReportAba('','ReportManager','Relatórios','','" + enterpriseID + "')\"><i class=\"site-menu-icon fa fa-bar-chart-o\"></i><span>Relatórios</span></a></li></ul>"
    menu = menu + "<ul class=\"site-menu\"><li  class=\"site-menu-item has-su\"><a  href=\"javascript:f_aba('GestorFinanceiro', 'MVC', 'financeiro/painel', '', 'f1495bcf-9258-4245-8edf-d0fac225412d')\"><i class=\"fa fa-money\"></i><span>Módulo Financeiro</span></a></li></ul>"

    $("#menu1").replaceWith(menu);

    call_navigation();
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
    $("#" + tabGenID).html('<object width="100%" height="950px" data="http://' + window.location.host + ':8080/IntelectaReportWeb/principal.do?method=carregaTela"/>');
   
}


function f_retornaSubMenu(lstMenu, enterpriseID) {
    var subMenu = "";
    for (var i = 0; i < lstMenu.length; i++) {


        if (lstMenu[i].menus != null) {

            //subMenu = subMenu + f_createUL(lstMenu[i], enterpriseID);
            //subMenu = subMenu + f_retornaSubMenu(lstMenu[i].menus, //enterpriseID);
            //subMenu = subMenu + " </ul>";
            //subMenu = subMenu + " </li>";
        }
        else {
            subMenu = subMenu + f_createLI(lstMenu[i], enterpriseID);
        }
    }

    return subMenu;

}

function f_createLI(menu, enterpriseID) {
    var subMenu = "";
    subMenu = subMenu + "<li class=\"site-menu-item active\">";
    if (menu.layoutID != "00000000-0000-0000-0000-000000000000") {
        if (menu.title != null) {
            subMenu = subMenu + "     <a class=\"animsition-link\" href=\"javascript:f_aba('" + menu.layouts.systemName + "','" + menu.layouts.ID + "','" + menu.title[0].text + "','" + menu.layouts.loadData + "', '" + enterpriseID + "')\">";
        } else {
            subMenu = subMenu + "     <a class=\"animsition-link\" href=\"javascript:f_aba('" + menu.layouts.systemName + "','" + menu.layouts.ID + "','" + menu.layouts.systemName + "','" + menu.layouts.loadData + "','" + enterpriseID + "')\">";
        }
    }
    else
    {
        subMenu = subMenu + "     <a href=\"javascript:f_aba('" + menu.systemName + "','" + "MVC" + "','" + menu.systemName.replace("mn", "") + "','" + "" + "','" + enterpriseID + "')\">";
    }

    
    if (menu.title != null) {
        subMenu = subMenu + "         <i class=\"icon\"></i><span class=\"site-menu-title\">" + menu.title[0].text + "</span>";
    } else {
        subMenu = subMenu + "         <i class=\"icon\"></i><span class=\"site-menu-title\">" + menu.systemName + "</span>";
    }

    subMenu = subMenu + "     </a>";

    subMenu = subMenu + "</li>";

    return subMenu;
}

function f_createUL(menu, enterpriseID) {
    var subMenu = "";
    subMenu = subMenu + "<li>";
    subMenu = subMenu + "     <a href='#'>";

    
    if (menu.title != null) {
        subMenu = subMenu + "         <i class=\"icon\"></i><span>" + menu.title[0].text + "</span>";
    } else {
        subMenu = subMenu + "         <i class=\"icon\"></i><span>" + menu.systemName + "</span>";
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