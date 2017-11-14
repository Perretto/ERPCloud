var resultadoParametroExterno;
var resultado;
var globalEnterpriseID;
var globalUserID;
var globalLang;

$(document).ready(function () {
    globalEnterpriseID = returnCookie("EnterpriseID");
    globalUserID = returnCookie("UserID");
    globalLang = returnCookie("Lang");

    window.onbeforeunload = function (event) {
        $.ajax({
            url: getGlobalParameters("urlPlataforma") + "/api/login/logOff?EnterpriseID=" + returnCookie("EnterpriseID"),
            type: "post",
            async: false,
            crossDomain: true
        });
    };

    function logoff() {
        $.ajax({
            url: getGlobalParameters("urlPlataforma") + "/api/login/logOff?EnterpriseID=" + returnCookie("EnterpriseID"),
            type: "post",
            async: false,
            crossDomain: true
        });
    }

    VerifyVersion();
    //CreateMenu(globalEnterpriseID, globalUserID);
    //loadSystemFunctions(true);
    
    if (getUrlVars()["layout"] != null) {
        CreateAba(getUrlVars()["layout"]);
    }

    /***** browser size detect on loading Start ******/
    if ($windowWidth > 1025) {
        //desktop
        onDesktop();
    }
    else if ($windowWidth < 500) {
        //phone
        onPhoneDefault()
    } else if ($windowWidth < 1025) {
        //Pad
        onTabletDefault();
    }
    /***** browser size detect on loading End ******/

    minimize_left_menu_hover_Display();
    right_box_display();
    phone_nav_control();
    plugin_load_for_layout();
    dropdown_top_nav_bar();
    dropDownMenuControl();
    left_bar_minimize();

    //notifications
    //notification_start();
    //GetEnterprises();
    //http://mellyd.empresariocloud.com.br:9080/analytics-reports/index.html
    //loadSearchData();
    var dados = "demo";
    var full = window.location.host;
    var parts = full.split('.');
    if (parts.length > 3) {
        dados = parts[0];
    }

    //$("#main-container").loader();
    $("#min-wrapper").attr("style", "");


    
})