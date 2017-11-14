function VerifyVersion() {
    systemVersion = returnCookie("SystemVersion");
    version = returnCookie("Version");

    $("#UpdateSystem").hide();
    if (systemVersion > version) {
        $("#UpdateSystem").show();
        $("#UpdateSystemLink").click(
            function () {
                var message = "Atualizar a versão ira reiniciar o sistema.<br />Deseja fazer isso agora?";
                bootbox.confirm(message, function (response) {
                    $.ajax({
                        url: getGlobalParameters("urlPlataforma") + "/Database/UpdateVersion",
                        success: function (response) {
                            if (response) {
                                location.reload();
                            }
                            else {
                                notification({ messageText: "falha no processamento", messageTitle: "Desculpe!", fix: false, type: "warning", icon: "thumbs-down" });
                            }
                        }
                    });
                })
            });
        $("#UpdateSystemLabel").html("Upgrade to version " + systemVersion);
        $("#UpdateSystemLink i").removeClass().addClass("fa fa-cloud-upload");
    } else {
        $("#UpdateSystem").show();
        $("#UpdateSystemLink").click(
            function () {
                var message = "Alterar a versão ira reiniciar o sistema.<br />Deseja fazer isso agora?";
                bootbox.confirm(message, function (response) {
                    $.ajax({
                        url: getGlobalParameters("urlPlataforma") + "/Database/RestoreVersion",
                        success: function (response) {
                            if (response) {
                                location.reload();
                            }
                            else {
                                notification({ messageText: "falha no processamento", messageTitle: "Desculpe!", fix: false, type: "warning", icon: "thumbs-down" });
                            }
                        }
                    });
                })
            });
        $("#UpdateSystemLabel").html("Downgrade to version " + version);
        $("#UpdateSystemLink i").removeClass().addClass("fa fa-cloud-download");
    }
}




function CreateAba(nameLayout, layoutID, titleMenu, dados, navigation, containerType, forcingTemplate, layoutType, callInstance) {
    //html dos controles
    var nomeTemplate = "";
    var title;
    var tab;
    var formControls;
    var tab2;
    var formControls2;
    var titleAboveControl;
    var formID = "";
    var modal = false;

    var EnterpriseName = returnCookie("EnterpriseName");

    //var random = Math.random().toString().replace(".", "");
    var tabGenID = gerarGUID();

    layoutID = layoutID;



    dados = dados + "&instanceID=" + tabGenID;
    dados = dados + "&userID=" + returnCookie("UserID");
    dados = dados + "&lang=" + returnCookie("Lang");

    if (navigation == false) {
        dados = dados + "&navigation=" + navigation;
    }

    switch (containerType) {
        case "MODAL":
            modal = true;

            $("#alertaModal").html("<div id='alertaModal_panel' class='panel' style='margin-bottom: 0px!important;' callInstance='" + callInstance + "'><div class='panel-body'></div></div>");

            $("#mensagem").html("");

            $('#alertaModalShow').modal();

            //função efetua o close do Modal para que os dados de um modal não carregue em outro.
            $('#alertaModalShow').on('hidden.bs.modal', function (e) { $("#alertaModal_panel").remove(); })

            formID = "alertaModal";

            break;
        default:
            $("#controls-recipient > .active").removeClass("active");
            $("#controls-tabs .active").removeClass("active");
            tab = "<li layoutid='" + layoutID + "_" + tabGenID + "' class='active'><a href='#" + tabGenID + "' data-toggle='tab' title='" + EnterpriseName + "'>" + titleMenu + "&nbsp&nbsp<img src='images/loader.gif' height='15px' /></a></li>";
            $("#controls-tabs").append(tab);
            $("#controls-recipient").append("<div class='tab-pane fade in  controls-recipient active' id='" + tabGenID + "'>");
            break;
    }

    urlRenderLayout = getGlobalParameters("urlPlataforma") + "/api/render/renderform";
    urlRenderLayoutData = nameLayout + dados;

    var sn_html = false;
    if (navigation == false && (dados.includes("Filtro=") == false && dados.includes("filtro=") == false) && modal == false) {
        sn_html = getHTML(tabGenID, layoutID)
    }

    if (sn_html == false) {
        if (nameLayout) {
            if (layoutID != "MVC") {
                getAjaxParameter(urlRenderLayout, urlRenderLayoutData, function () {
                    //getAjaxParameter(getGlobalParameters("urlInterface") + "/renderform", nameLayout + Dados, function () {
                    fillTab(resultadoParametroExterno, formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu)
                }, function () {
                    replaceTabControls(formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData)
                })
            }
            else {
                fillTab(null, formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu)
                $("#" + tabGenID).load("/" + titleMenu);
            }
        }
        else {
            fillTab(null, formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu)
        }

    } else {
        //Tira o load da aba
        $("#controls-tabs li a[href='#" + tabGenID + "'] img").replaceWith(" <span class='tabControls'>&nbsp&nbsp<i class='fa fa-refresh' onClick='atualizaAba(\"" + formID + "\",\"" + layoutID + "\",\"" + tabGenID + "\",\"" + forcingTemplate + "\",\"" + layoutType + "\",\"" + urlRenderLayout + "\",\"" + urlRenderLayoutData + "\",\"" + titleMenu + "\");'></i>&nbsp&nbsp<i class='icon wb-close-mini' onClick='fechaAba(\"" + tabGenID + "\");'></i></span>")
        //$(".form-control").mask($(".form-control").attr("data-mask"));

        //Binda o plugin de data
        $("[data-nativedatatype='Data']").datetimepicker({
            lang: "pt",
            timepicker: false,
            format: 'd/m/Y',
            formatDate: 'Y/m/d',
        });

        //Binda o checkbox
        $(".icheckbox_flat-blue").css("display", "-webkit-inline-box");
        $(".icheckbox_flat-blue").removeClass("icheckbox_flat-blue");
        $(".icheck-grey").iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue',
            increaseArea: '20%' // optional
        });

        //$("table").bootstrapTable();

    }

}

function fillTab(resultadoParametroExterno, formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu) {
    var nomeTemplate;
    $("#" + tabGenID).html("");

    //guarda id da tag <form>
    formID = (formID) ? formID : layoutID + "_" + tabGenID;

    if (resultadoParametroExterno) {
        htmlControls = AbreForm({ id: formID, layoutID: layoutID, classe: "containerForm", finish: resultadoParametroExterno[0].onFinishName, onFinishCode: resultadoParametroExterno[0].onFinishCode });
    } else {
        htmlControls = AbreForm({ id: formID, layoutID: layoutID, classe: "containerForm" });
    }

    htmlControls += AbreDiv({ classe: "panel" });
    htmlControls += AbreDiv({ classe: "panel-body" });
    htmlControls += FechaDiv();
    htmlControls += FechaDiv();
    htmlControls += FechaForm();
    $("#" + tabGenID).append(htmlControls);

    if (resultadoParametroExterno) {
        if (resultadoParametroExterno[0].title) {
            if (resultadoParametroExterno[0].title.length > 0) {
                title = resultadoParametroExterno[0].title[0].text;
            } else {
                title = resultadoParametroExterno[0].systemName;
            }
        } else {
            title = resultadoParametroExterno[0].systemName;
        }

        nomeTemplate = resultadoParametroExterno[0].template.systemName
        //cria o layout master

    }

    if (nomeTemplate) {

        titleAboveControl = resultadoParametroExterno[0].titleAboveControl;


        if (nomeTemplate == "NAVIGATION") {
            $("a[href=#" + tabGenID + "]").prepend("");
            //Abre a tela de navegação
            CreateNavigation({ result: resultadoParametroExterno[0], tabGenID: tabGenID });
        } else {
            $("#" + tabGenID + " > form").attr("principalDataTypeID", resultadoParametroExterno[0].layout.principalDataTypeID);
            CreateControls({ layout: nomeTemplate, title: title, ID: formID, tabGenID: tabGenID, titleAboveControl: titleAboveControl, resultado: resultadoParametroExterno, forcingTemplate: forcingTemplate, layoutID: layoutID, instanceTela: tabGenID, urlRenderLayoutData: urlRenderLayoutData });
        }

        if (formID == "alertaModal") {
            $("#myModalLabelInfo").html(title);
        }

        $("#" + tabGenID + " .title").html(title);

    }

    if (layoutType == "SEARCH") {
        var searchExists = $(document).find("#searchInput")
        if (!searchExists.length) {
            $("#" + tabGenID + ">form").attr("action", "javascript:return false;");
            $("#" + tabGenID + " .panel-body").load("localizador.html",
                function () {
                    $("a[href=#" + tabGenID + "]").prepend("<span class=\"icon wb-search\"></span> Search");
                    ListenerObjects('#searchInput', 'INPUT');
                }
            );
        }
        else {
            $("#" + tabGenID).remove();
            $("a[href=#" + tabGenID + "]").remove();
        }

    } else {
        //$("#" + tabGenID).load("dashboard.html",
        //    function () {
        //        $.getScript("script/flot/jquery.flot.js");
        //        $.getScript("script/flot/jquery.flot.resize.js");
        //        $.getScript("script/common.js");
        //    }
        //);
    }

    $.getScript('Script/jquery.remodal.min.js');


    replaceTabControls(formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu);

    CreateJavaScript();
    if (resultadoParametroExterno) {

        createToolbarEmpresario(tabGenID, resultadoParametroExterno[0]);
    }
    idfk = [];
    idDerived = [];
    valfk = [];
    var abaFK = $("#" + tabGenID).find("form");
    var IDField = $(abaFK[0]).find("input[data-field='id']")
    if (abaFK.length > 0 && IDField.length > 0) {
        table = $(IDField).attr("data-table");
        idfk[0] = "id_" + table;
        idDerived[0] = table;
        valfk[0] = IDField.val();
        for (var p = 0; p < abaFK.length; p++) {

            var abaFKID = abaFK[p].id;
            //if (abaFKID) {
            for (var j = 0; j < idfk.length; j++) {
                if (abaFKID) {
                    var controlFK = $("#" + abaFKID + " [data-field='" + idfk[j] + "']");
                    var controlDerived = $("#" + abaFKID + " [data-derivedFrom='" + idDerived[j] + "']");

                    controlFK.val(valfk[0]);

                    for (var i = 0; i < controlDerived.length; i++) {
                        if ($(controlDerived[i]).attr("data-field") == "id") {
                            controlDerived[i].value = valfk[0];
                        }
                    }
                }
            }
            //}

        }
    }

    if (nomeTemplate != "NAVIGATION" && layoutID != "MVC" && formID != "alertaModal") {
        recordHTML(tabGenID, layoutID);
    }

}


function replaceTabControls(formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu) {
    $("#controls-tabs li a[href='#" + tabGenID + "'] img").replaceWith(" <span class='tabControls'>&nbsp&nbsp<i id='" + tabGenID + "_atualizaaba' class='fa fa-refresh' onClick='atualizaAba(\"" + formID + "\",\"" + layoutID + "\",\"" + tabGenID + "\",\"" + forcingTemplate + "\",\"" + layoutType + "\",\"" + urlRenderLayout + "\",\"" + urlRenderLayoutData + "\",\"" + titleMenu + "\");'></i>&nbsp&nbsp<i class='icon wb-close-mini' onClick='fechaAba(\"" + tabGenID + "\");'></i></span>")
};

function recordHTML(tabGenID, layoutID) {
    var html = $("#" + tabGenID).html();

    var submit = new Object();
    submit.layoutID = layoutID;
    submit.HTML = html;
    submit.enterpriseID = returnCookie("EnterpriseID");
    submit.userID = returnCookie("UserID");
    submit.tabGenID = tabGenID;

    var json = JSON.stringify(submit);

    $.ajax({
        url: getGlobalParameters("urlPlataforma") + "/api/publish/Post",
        type: "POST",
        data: submit,
        success: function (data) {
        },
        error: function (xhr) {
            //alert(xhr);
        }
    });


}

function getHTML(tabGenID, layoutID) {
    //Somente para teste
    //return false;
    var layfin1 = "bd7c9d03-c5b9-48ad-8c1d-c9a990060ce9";
    layfin1 = layfin1.toUpperCase();
    var layfin2 = "e67c4c2e-7d3d-4403-b643-1f10d44b17c2";
    layfin2 = layfin2.toUpperCase();

    if (layoutID.toUpperCase() == layfin1 || layoutID.toUpperCase() == layfin2) {
        return false;
    }

    var enterpriseID = returnCookie("EnterpriseID");
    var userID = returnCookie("UserID");
    var retorno = false;

    $.ajax({
        url: getGlobalParameters("urlPlataforma") + "/api/publish/Get",
        type: "GET",
        data: { layoutID: layoutID, enterpriseID: enterpriseID, userID: userID, tabGenID: tabGenID },
        async: false,
        success: function (data) {

            if (data) {
                retorno = true;

                $("#" + tabGenID).append(data);
                //var d1 = document.getElementById(tabGenID);
                //d1.insertAdjacentHTML('afterend', data);


                var wizard = $("[data-guidwizard='" + tabGenID + "']");

                for (var i = 0; i < wizard.length; i++) {
                    if ($("#" + wizard[i].id).attr("data-guidwizard")) {
                        if ($("#" + wizard[i].id).html().indexOf("<form") < 0) {
                            var htmlobj = $.parseHTML(data)
                            var idform = $(wizard[i]).attr("data-containeridwizard") + "_" + $(wizard[i]).attr("data-guidwizard");
                            var htmldiv = $(wizard[i]).html();

                            $(wizard[i]).html("<form id='" + idform + "' >" + htmldiv + "</form>");
                            //document.getElementById(wizard[i].id).innerHTML = "<form id='" + idform + "' >" + htmldiv + "</form>";
                            sharpGrid(idform);
                        }
                    }
                }

                var inputs = $("#" + tabGenID + " input");
                for (var i = 0; i < inputs.length; i++) {
                    var input = inputs[i];
                    if ($(input).val() == null || $(input).val() == "null") {
                        $(input).val("");
                        $(input).attr("");
                    }

                    //Mascara
                    var marcara = $(input).attr("data-mask");
                    if (marcara) {
                        var typecontrol = $(input).attr("typecontrol");
                        var reverse = true;

                        if (typecontrol) {
                            switch (typecontrol) {
                                case "text":
                                    reverse = false;
                                    break;
                                default:
                                    break;
                            }
                        }



                        $(input).mask(marcara, {
                            reverse: reverse,
                            translation: {
                                '#': {
                                    pattern: /-|\d/,
                                    recursive: true
                                }
                            },
                            onChange: function (value, e) {
                                var target = e.target,
                                  position = target.selectionStart; // Capture initial position

                                target.value = value.replace(/(?!^)-/g, '').replace(/^,/, '').replace(/^-,/, '-').replace(/^(\.-)|^(-\.)/, '-');

                                target.selectionEnd = position; // Set the cursor back to the initial position.
                                
                            }
                        });
                    }

                    //chave da empresa
                    var fieldName = $(input).attr("data-field");
                    if (fieldName == "id_empresa") {
                        $(input).val(returnCookie("EnterpriseID"));
                    }

                }

                getDropdownHTML(layoutID, tabGenID);


            } else {
                retorno = false;
            }

        },
        error: function (xhr) {
            alert(xhr);
        }
    });

    return retorno;
}

function getDropdownHTML(layoutID, tabGenID) {
    try {
        var parameters = "?LayoutID=" + layoutID + "&EnterpriseID=" + returnCookie("EnterpriseID") + "&UserID=" + returnCookie("UserID") + "&tabGenID=" + tabGenID;

        $.ajax({
            url: getGlobalParameters("urlPlataforma") + "/api/publish/getDropdownHTML" + parameters,
            type: "GET",
            async: false,
            success: function (data) {

                for (var key in data) {
                    var value = data[key];
                    //$("#" + tabGenID + "_" + key).html(value);
                    document.getElementById(tabGenID + "_" + key).innerHTML = value;
                    var id = document.getElementById(tabGenID + "_" + key).id;
                    var controlid = $("#" + id).attr("data-controlid");
                    var propertyid = $("#" + id).attr("data-propertyid");
                    EventHideModal(id, controlid, propertyid);
                }

            },
            error: function (xhr) {
                //alert(xhr);
            }
        });
    } catch (e) {

    }

}

function loadSystemFunctions(systemLoad) {

    if (systemLoad) {
        var Dados = "";
        Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID");
        Dados = Dados + "&Lang=" + returnCookie("Lang");

        var parameters = new Object();
        parameters.url = getGlobalParameters("urlPlataforma") + "/api/render/RenderOnSystemLoadFunction";
        parameters.dados = Dados;
        parameters.async = false;
        parameters.type = "GET";

        var result = AjaxParameter(parameters);

        if (result) {
            var teste = $("#pnlCotacao").append("<script>" + result.code + "</script>");
            eval(result.functionName + "()");
        }
    }
}

function saveActiveUser(globalEnterpriseID) {

    $.ajax({
        url: getGlobalParameters("urlPlataforma") + "/api/login/saveActiveUser?EnterpriseID=" + globalEnterpriseID,
        type: "GET",
        async: false,
        crossDomain: true
    });
}