function createToolbarEmpresario(targetID, form, containerID, layoutID, tabGenID, instanceTela) {

    var toolbar = form.toolBar;

    var retorno = "";
    var id;
    var titulo;
    var tooltip;
    var metadataContainerID;

    if (tabGenID) {
        metadataContainerID = containerID.replace("_" + tabGenID, "");
    }


    if (toolbar == null) {
        return;
    }

    retorno = retorno + '<div class="ls-button-group col-md-12">';

    for (var i = 0; i < toolbar.controls.length ; i++) {
        var button = toolbar.controls[i];
        id = toolbar.controls[i].systemName;
        tooltip = "";

        if (button.title != null) {
            if (button.title.length > 0) {
                titulo = button.title[0].text;
                tooltip = button.title[0].toolTip;
            } else {
                titulo = button.systemName;
            }
        } else {
            titulo = button.systemName;
        }

        if (button.icon != null) {
            iconebutton = "<i class=\"fa fa-" + button.icon + "\"></i>";
        } else {
            iconebutton = "";
        }

        if (toolbar.controls[i].visible) {
            switch (button.controlType) {
                case "BUTTONSAVE":
                    retorno = retorno + "<a onclick=onSave(\"" + targetID + "\",\"" + id + "\",\"" + containerID + "\",\"" +

metadataContainerID + "\",\"" + layoutID + "\",\"" + true + "\",\"" + form.onAfterSavingName + "\",\"" + form.onBeforeSavingName + "\") Title='" + tooltip + "' id='" + id +

    "' class='btn btn-icon btn-success btn-round'>  " + iconebutton + "</a>";
                    //retorno = retorno + "<a Title='" + tooltip + "' onclick=\"javascrpt:OnSave('" + targetID + "','" + id + "')\" id='" + id 

                    //+ "' class='btn btn-icon btn-success btn-round'><i class='fa fa-floppy-o'></i></a>";

                    break;
                case "BUTTONINSERT":
                    retorno = retorno + "<a  onclick=onSave(\"" + targetID + "\",\"" + id + "\",\"" + containerID + "\",\"" +

    metadataContainerID + "\",\"" + layoutID + "\",\"" + true + "\",\"" + form.onAfterSavingName + "\") Title='" + tooltip + "' id='" + id +

    "' class='btn btn-icon btn-info btn-round'>  " + iconebutton + "</a>";
                    break;
                case "BUTTONDELETE":
                    retorno = retorno + "<a  onclick=onDelete(\"" + targetID + "\",\"" + id + "\",\"" + metadataContainerID + "\",\"" +

    layoutID + "\",\"" + tabGenID + "\") Title='" + tooltip + "' id='" + id + "' class='btn btn-icon btn-danger btn-round'><i class='fa fa-trash-o'></i></a>";
                    break;
                case "BUTTONNEW":

                    layoutID + "\") Title='" + tooltip + "' id='" + id + "' class='btn btn-icon btn-info btn-round'> " + iconebutton + "</a>";
                    //Alterado para adicionar alguns parametros a mais, pois o botão novo irá perguntar se o cliente deseja gravar.
                    retorno = retorno + "<a  onclick=onNew(\"" + targetID + "\",\"" + id + "\",\"" + containerID + "\",\"" +

    metadataContainerID + "\",\"" + layoutID + "\",\"" + true + "\",\"" + form.onAfterSavingName + "\") Title='" + tooltip + "' id='" + id +

    "' class='btn btn-icon btn-info btn-round'>  " + iconebutton + "</a>";
                    break;
                case "BUTTONNAVIGATE":
                    retorno = retorno + "<a  onclick=OpenFormSearch(\"" + tabGenID + "\") Title='" + tooltip + "' id='" + id + "' class='btn btn-icon btn-info btn-round' ><i class='fa fa-search'></i></a>";
                    break;

                case "BUTTONPRINT":
                    //Relatório
                    retorno = retorno + "<a  onclick=ReportContainer(\"" + button.report + "\",\"" + containerID + "\") Title='Relatório' id='relat' class='btn btn-icon btn-info btn-round' ><i class='fa fa-file-image-o'></i></a>";
                    break;
                default:
                    retorno = retorno + "<a onclick='" + button.onClickName + "()' Title='" + tooltip + "'  id='" + id + "' class='btn btn-icon btn-info btn-round'>  " + iconebutton + "</a>";
                    if (button.onClick) {
                        retorno = retorno + "<script>" + button.onClick + "</script>";
                    }
                    break;
            }

        }
    }



    retorno = retorno + '</div>';

    $("#" + targetID + ">.panel >.panel-body").append(retorno);

    CreateFormSearch(form, targetID, layoutID, tabGenID);
}


function ReportContainer(nomeTemplate, containerID) {
    //html dos controles
    var title;
    var tab;
    var formControls;
    var tab2;
    var formControls2;
    var titleAboveControl;
    var formID = "";
    var titleMenu = "Vendas";
    var url = window.location.hostname;

    var id = $($("#" + containerID).find("[name*='_PK']")).val();
    var enterpriseID = returnCookie("EnterpriseID");

    if (id) {
        if (url == "localhost") {
            url = window.location.host;
        }

        var parametersReport = "id=" + id + "&reportName=" + nomeTemplate + "&enterpriseID=" + enterpriseID;
        
        $.ajax({
            url: "http://" + url + "/api/Render/RenderPrintReport?" + parametersReport,
            success: function (result) {
                url = window.location.hostname;
                if (url == "localhost") {
                    url = "54.149.163.193";
                }

                var tabGenID = gerarGUID();

                $("#controls-recipient > .active").removeClass("active");
                $("#controls-tabs .active").removeClass("active");
                tab = "<li class='active'><a href='#" + tabGenID + "' data-toggle='tab'>" + titleMenu + "&nbsp&nbsp<img src='images/loader.gif' height='15px' /></a></li>";
                $("#controls-tabs").append(tab);
                $("#controls-recipient").append("<div class='tab-pane fade in  controls-recipient active' id='" + tabGenID + "'>");

                url = "http://" + url + ":8080/IntelectaReportWeb/principal.do?method=carregaViewer&relatorio=" + nomeTemplate;
                $("#" + tabGenID).html('<object width="100%" height="950px" data=' + url + '/>');

                $(document).ready(function () {
                    $(".mainNav").remove();
                    $("#controls-tabs li a[href='#" + tabGenID + "'] img").replaceWith(" <span class='tabControls'><i class='icon wb-close-mini' onClick='fechaAba(\"" + tabGenID + "\");'></i></span>");

                });
            }
        });

    }
}

function isDirty(containerid) {
    var dirty = false;

    var lstfrm = $("#" + containerid);

    if (lstfrm.length > 0) {
        var frm = lstfrm[0];
        frm = $(frm).find("input");
        var frm2 = $(lstfrm[0]).find("select");

        for (var i = 0; i < frm2.length; i++) {
            frm.push(frm2[i]);
        }

        for (i = 0; i < frm.length; i++) {
            if ($(frm[i]).attr("data-oldvalue") != undefined) {
                if ($(frm[i]).attr("type") == "checkbox") {
                    $(frm[i]).val(frm[i].checked.toString());
                    $(frm[i]).attr("data-oldvalue", $(frm[i]).attr("data-oldvalue").toLowerCase());
                }

                var valor = $(frm[i]).val();

                if (valor == null || valor == "null" || valor == "undefined") {
                    valor = "";
                }

                if ($(frm[i]).attr("data-oldvalue") == null || $(frm[i]).attr("data-oldvalue") == "null" || ($(frm[i]).attr("data-oldvalue") == "00000000-0000-0000-0000-000000000000") && valor == "") {
                    $(frm[i]).attr("data-oldvalue", "")
                }

                if (valor == "" && $(frm[i]).attr("data-oldvalue") == "00000000-0000-0000-0000-000000000000") {
                    valor = "00000000-0000-0000-0000-000000000000";
                }

                if ($(frm[i]).attr("data-nativedatatype")) {
                    if ($(frm[i]).attr("data-nativedatatype").toUpperCase() == "MOEDA" || $(frm[i]).attr("data-nativedatatype").toUpperCase() == "QUANTIDADE" || $(frm[i]).attr("data-nativedatatype").toUpperCase() == "PERCENT") {
                        if (valor == "" || valor == null || valor == undefined) {
                            valor = "0";
                        }


                        if (!$(frm[i]).attr("data-oldvalue")) {
                            $(frm[i]).attr("data-oldvalue", "0");
                        }

                        var valuecurrency = parseFloat(valor);
                        var oldvaluecurrency = parseFloat($(frm[i]).attr("data-oldvalue"));

                        valor = valuecurrency.toString();

                        $(frm[i]).attr("data-oldvalue", oldvaluecurrency.toString())


                    }

                    if ($(frm[i]).attr("data-nativedatatype").toUpperCase() == "SIMNAO") {
                        if (valor == "false" && $(frm[i]).attr("data-oldvalue") == "0") {
                            $(frm[i]).attr("data-oldvalue", "false");
                        }
                        if (valor == "true" && $(frm[i]).attr("data-oldvalue") == "1") {
                            $(frm[i]).attr("data-oldvalue", "true");
                        }
                    }
                }

                if (frm[i].type == "select-one" && $(frm[i]).attr("data-oldvalue") == "0") {
                    $(frm[i]).attr("data-oldvalue", "")
                }

                var isValid = true;

                if (frm[i].type == "hidden" && ($(frm[i]).attr("data-derivedfrom") != null || $(frm[i]).attr("data-derivedfrom") != "" || $(frm[i]).attr("data-derivedfrom") != undefined)) {
                    var autocomplete = $("#" + frm[i].id + "_autocomplete");
                    if (!autocomplete.length > 0) {
                        isValid = false;
                    }
                }

                if (valor != $(frm[i]).attr("data-oldvalue")) {
                    if ($(frm[i]).attr("data-serializable") == "true") {
                        if (isValid) {
                            dirty = true;
                        }
                    }
                }
            }
        }
    }

    return dirty;
}

function onSave(form, id, instanceID, containerID, layoutID, async, onAfterSaving, onBeforeSaving) {
    loaderImage(form + "_panel", true);
    var url = getGlobalParameters("urlPlataforma") + "/api/database/WriteData";
    var retorno;
    if (async != false) {
        async = true;
    };
    var isvalid = false;
    var dirty = isDirty(instanceID);
    if (dirty) {
        var formv = $("#" + form);
        var fv = formv.data('formValidation');
        isvalid = fv.validate();

        if (isvalid.$invalidFields) {
            if (isvalid.$invalidFields.length > 0) {
                isvalid = false;
            } else {
                isvalid = true;
            }
        } else {
            isvalid = true;
        }

    }

    if (isvalid) {

        //if (fv.isValid()) {

        //if (onBeforeSaving) {
        //    if (onBeforeSaving != "null") {
        //        var result_before = executeFunctionByName(onBeforeSaving.substring(0, onBeforeSaving.indexOf("(")), window, result);
        //        if (!result_before) {
        //            loaderImage(form + "_panel", false);
        //            return;
        //        }
        //    }
        //}

        //}

        //if (RequiredFields(form, id)) {
        try {
            retorno = SerializeFields({
                formID: form,
                containerID: containerID,
                layoutID: layoutID,
                returnString: false
            });

            /* Valida os ID's para ver se está na mesma empresa que a tela foi aberta */
            let Enterprise = $.grep(retorno, function (e) { return e.field == 'id_empresa'; });
            //Alteração
            if (Enterprise.length > 0 && Enterprise[0].newValue.length && Enterprise[0].newValue[0]) {
                let EnterpriseIDCookie = returnCookie("EnterpriseID");
                if (EnterpriseIDCookie != Enterprise[0].newValue[0]) {
                    notification({ messageText: "A empresa selecionada é diferente da empresa que a tela foi aberta. Não será possível continuar com a gravação.", messageTitle: "Ops!", fix: false, type: "warning", icon: "exclamation" });
                    loaderImage(form + "_panel", false);
                    return;
                }
            }

            if (onBeforeSaving) {
                if (onBeforeSaving != "null") {
                    //var result_before = executeFunctionByName(onBeforeSaving.substring(0, onBeforeSaving.indexOf("(")), window, result);
                    var result_before = executeFunctionByName(onBeforeSaving.substring(0, onBeforeSaving.indexOf("(")), window);
                    if (!result_before) {
                        loaderImage(form + "_panel", false);
                        return;
                    }
                }
            }

            var parameters = new Object();
            if (async != false) {
                parameters.async = true;
            };
            parameters.type = "POST";
            parameters.url = url;
            parameters.dados = JSON.stringify(retorno);
            parameters.async = async;
            parameters.callbackSuccess = function (result) {
                if (result.length > 0) {
                    if (result[0].message != null) {
                        if (result[0].message[0].success) {



                            notification({
                                messageText: result[0].message[0].title[0].toolTip, messageTitle: result[0].message[0].title[0].text, fix: false, type: "ok", icon: "thumbs-up"
                            });



                            DeserializeFields(result, form, instanceID);

                            if (onAfterSaving) {
                                if (onAfterSaving != "null") {
                                    executeFunctionByName(onAfterSaving.substring(0, onAfterSaving.indexOf("(")), window, result);
                                }
                            }
                            var formObject = $("#" + form);;
                            formObject.data('original_serialized_form', formObject.serialize());

                            //Gravar os controles de TEXTCURRENCY
                            onSaveTextCurrency(form);

                            retorno = true;

                        }
                        else {
                            retorno = false;
                            notification({
                                messageText: result[0].message[0].title[0].toolTip, messageTitle: result[0].message[0].title[0].text, fix: false, type: "warning", icon: "thumbs-down"
                            });
                        }
                    }
                }
            };
            parameters.callbackError = function (result) {
                notification({
                    messageText: result, messageTitle: "Ops!", fix: false, type: "warning", icon: "exclamation"
                });
            };
            parameters.callbackComplete = function (result) {
                loaderImage(form + "_panel", false);
            };
            AjaxQuery(parameters);


            //Função BeforeSave - ERP
            //Função que Serializa a Tela para a Gravacao        
            //Função de salvar com o Ajax dentro
            //Função que DesSerializa a Tela para a Gravacao
            //Função que atualiza a tela
            //Função do AfterSave-ERP

        }
        catch (e) {
            notification({
                messageText: e, messageTitle: "Ops!", fix: false, type: "warning", icon: "exclamation"
            });
            loaderImage(form + "_panel", false);
        }
    }
    else {
        loaderImage(form + "_panel", false);
    }
    //}
    //else {
    //loaderImage(form + "_panel", false);
    //}

    return retorno;
}

function onSaveTextCurrency(form) {
    var controls = $("[data-containerid='" + form + "'][data-controltype='TEXTCURRENCY']");
    var submitObject = {};
    var arraySubmitObject = [];
    var id = "";
    var table = "";
    var field = "";
    var value = [];
    var valueid = [];

    var idPrincipal = $("#" + form + "_panel").find("[data-field='id']");

    if (idPrincipal) {
        if (idPrincipal.length > 0) {
            idPrincipal = idPrincipal[0];
        }
    }


    for (var i = 0; i < controls.length; i++) {
        id = controls[i].id;
        id = id.replace("_formgroup", "");

        table = $("[data-controlID='" + id + "']").attr("data-table");
        field = $("[data-controlID='" + id + "']").attr("data-field");

        var inputs = $(controls[i]).find("input[data-dynamic='true']");

        for (var j = 0; j < inputs.length; j++) {
            submitObject["nativeDataType"] = null;
            submitObject["sequenceRecording"] = 0;
            submitObject["controlID"] = id;
            submitObject["EnterpriseID"] = returnCookie("EnterpriseID");
            submitObject["UserID"] = returnCookie("UserID");
            submitObject["ContainerID"] = null;
            submitObject["LayoutID"] = null;
            submitObject["derivedFrom"] = null;
            submitObject["Texto"] = null;
            submitObject["message"] = null;
            submitObject["title"] = null;
            submitObject["visibleGrid"] = false;


            submitObject["table"] = table;
            submitObject["field"] = field;

            valueid[value.length] = $(inputs[j]).attr("data-referenceid");
            value[value.length] = $(inputs[j]).val();
        }

        submitObject["oldValue"] = $.makeArray(valueid);
        submitObject["newValue"] = $.makeArray(value);
        submitObject["controlID"] = $(idPrincipal).val();

        arraySubmitObject[arraySubmitObject.length] = submitObject;

    }

    if (arraySubmitObject) {
        if (arraySubmitObject.length > 0) {

            var parameters = new Object();
            parameters.type = "POST";
            parameters.url = getGlobalParameters("urlPlataforma") + "/api/database/writeDataCurrency";
            parameters.dados = JSON.stringify(arraySubmitObject);
            parameters.async = false;
            parameters.callbackSuccess = function (result) {

            }
            AjaxQuery(parameters);

        }
    }
}

//function onNew(form, id, metadataContainerID, layoutID) {
function onNew(form, id, instanceID, containerID, layoutID, async, onAfterSaving) {

    //Verifica se deseja gravar antes de limpar a tela.

    var message = getObjMessageJS("4");
    var mess = "";

    if (message) {
        if (message.title) {
            if (message.title.length > 0) {
                mess = message.title[0].text;
            }
        }
    }

    result = confirm(mess, function () {
        onSave(form, id, instanceID, containerID, layoutID, async, onAfterSaving);
    }, function () {
        ClearForm(form, false);
    });

    //ClearForm(form, false);
    //Função BeforeNew - ERP
    //Função que limpa a tela
    //Função do AfterNew-ERP
}

function onDelete(formID, id, metadataContainerID, layoutID, instanceTela) {
    loaderImage(formID + "_panel", true);
    var url = getGlobalParameters("urlPlataforma") + "/api/database/DeleteData";

    try {

        var message = getObjMessageJS("5");
        var mess = "";

        if (message) {
            if (message.title) {
                if (message.title.length > 0) {
                    mess = message.title[0].text;
                }
            }
        }

        result = confirm(mess, function () {
            retorno = SerializeFields({
                formID: formID,
                containerID: metadataContainerID,
                layoutID: layoutID,
                returnString: true
            });

            var parameters = new Object();
            parameters.type = "POST";
            parameters.url = url;
            parameters.dados = retorno;
            parameters.callbackSuccess = function (result) {
                if (result.length > 0) {
                    if (result[0].message != null) {
                        if (result[0].message[0].success) {
                            notification({
                                messageText: result[0].message[0].title[0].toolTip,
                                messageTitle: result[0].message[0].title[0].text,
                                fix: false,
                                type: "ok",
                                icon: "thumbs-up"
                            });
                            var clearTable = false;
                            var $form = $("#" + formID);
                            clearTable = ($form.hasClass("principalContainer") && !$form.hasClass("masterdetail")) ? true : false;
                            $("#" + formID + "_table").find("tr.selected").remove();
                            ClearForm(formID, clearTable);

                            clickSearch(instanceTela + "_nav", "cadastrodeclientes");

                        }
                        else {
                            notification({
                                messageText: result[0].message[0].title[0].toolTip,
                                messageTitle: result[0].message[0].title[0].text,
                                fix: false,
                                type: "warning",
                                icon: "thumbs-down"
                            });
                        }
                    }
                }
            };
            parameters.callbackError = function (result) {
                notification({
                    messageText: result, messageTitle: "Ops!", fix: false, type: "warning", icon: "exclamation"
                });
            };
            parameters.callbackComplete = function (result) {
                loaderImage(formID + "_panel", false);
            };
            parameters.async = true;
            AjaxQuery(parameters);
        }, function () {
            loaderImage(formID + "_panel", false);
        })
    }

    catch (e) {
        notification({
            messageText: e, messageTitle: "Ops!", fix: false, type: "warning", icon: "exclamation"
        });
        loaderImage(formID + "_panel", false);
    }

    //Função BeforeDelete - ERP
    //Função que deleta o registro
    //Função que limpa a tela
    //Função do AfterDelete-ERP

}


function RequiredFields(formId, id) {
    var mensagem = "";
    var count = 0;
    var form = document.getElementById(formId);
    var elements = form.querySelectorAll('input,textarea,table');

    for (var i = 0; i < elements.length; i++) {
        if ($(elements[i]).val() == "") {
            if ($("#" + elements[i].id).hasClass("required") && !$("#" + elements[i].id).hasClass("hidden")) {
                if (elements[i].getAttribute("data-nativeDataType") != "INCREMENT") {
                    if (elements[i].getAttribute("data-serializable") == "true") {
                        count = count + 1;
                        if (count == 1) {
                            mensagem = mensagem + " " + $("#" + elements[i].id).attr("placeholder") + "";
                        }
                        else {
                            mensagem = mensagem + ", " + $("#" + elements[i].id).attr("placeholder") + "";
                        }
                    }
                }
            }
        }
    }
    elements = form.querySelectorAll('input,textarea,table,select');
    if (mensagem == "") {
        var elemntes = 0;
        for (var i = 0; i < elements.length; i++) {
            if ($(elements[i]).val() != "" && $(elements[i]).val() != "0") {
                if (elements[i].type != "checkbox" && !$("#" + elements[i].id).hasClass("hidden") & elements[i].getAttribute("data-nativeDataType") != "INCREMENT") {
                    if (elements[i].type == "select-one" && elements[i].getAttribute("data-table") != "endereco" && elements[i].getAttribute("data-table") != "contato") {
                        if (elements[i].selectedIndex != -1) {
                            if (elements[i].selectedIndex > 0) {
                                if (elements[i].disabled != true) {
                                    elemntes = elemntes + 1;
                                }
                            }
                            else if (elements[i].textContent.trim() != "[Nenhum]") {
                                if (elements[i].disabled != true) {
                                    elemntes = elemntes + 1;
                                }
                            }
                        }
                    }
                    else if (elements[i].getAttribute("data-field") && elements[i].getAttribute("data-field") != "") {
                        if (elements[i].getAttribute("data-field").indexOf("id_") == -1) {
                            if (elements[i].value != "0,00") {
                                elemntes = elemntes + 1;
                            }
                        }
                    }
                    else if (elements[i].getAttribute("data-propertyidhidden") && elements[i].getAttribute("data-propertyidhidden") != "") {
                        elemntes = elemntes + 1;
                    }
                }

            }
        }
        if (elemntes == 0) {
            return false;
        }
    }


    //produtos lançamento
    //var containerID = formId.toString().split("_")[0];
    //if (containerID == "857a1f6d-887b-4a08-b5b3-646ea4457c04") {
    //    var idProduto = $("#" + idTela + "CoItensVenda_txtitensid").val();
    //    if (idProduto == "") {
    //        mensagem = mensagem + ", escolher produtos";
    //    }
    //}

    if (mensagem != "") {
        var message = getObjMessageJS("6");
        var mess = "";

        if (message) {
            if (message.title) {
                if (message.title.length > 0) {
                    mess = message.title[0].text;
                }
            }
        }


        Alerta("ERROMODAL", mess + mensagem + ".");
        return false;
    } else {
        return true;
    }
}