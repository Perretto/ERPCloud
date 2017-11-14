var cellSelected;
var cellSelectedData;
var buttonCellSelectedData;
var gridButtons = new Object();
var $vl_qt_itens = $('[data-field="vl_qt_itens"]');

function reinicalizaContadores(containerID) {
    //var containerID = "857a1f6d-887b-4a08-b5b3-646ea4457c04_7ff26a14-7a3f-7fdc-4d53-37afbd65bbfa";

    if (containerID.indexOf("857a1f6d-887b-4a08-b5b3-646ea4457c04") != -1) {
        var element = $("#" + containerID + "_table table");
        var dataRows = element.find('tbody tr');

        for (var i = 0; i < (dataRows.length) ; i++) {
            var rows = dataRows[i].children[4];
            rows.innerText = i + 1;
        }
    }


};

function createGrid(parameters) {

    var titulo = parameters.titulo;
    var containerID = parameters.containerID;
    var controls = parameters.controls;

    var navigation = parameters.navigation;

    //var dadosGrid = parameters.dadosGrid;
    //var container = parameters.container;
    var isVisible = "";
    var indexIdControl;
    //var VisibleGrid = parameters.visibleGrid;
    var valueID;
    var buttons = [];

    var template = parameters.template;
    var cardGrid = parameters.cardGrid;
    var numberpage = 10;

    if (parameters.linePerPage) {
        numberpage = parameters.linePerPage;
    }
    retorno = ""
    retorno += "<div data-numberpage=\"" + numberpage + "\" data-template=\"" + template + "\"  id=\"" + containerID + "_table\" class=\"table-responsive ls-table tableContainer\">";
    //retorno += "<table data-toggle=\"table\" class=\"table table-hover table-bordered table-striped table-bottomless ls-animated-table\">";

    retorno += "<table  data-pagination=\"true\" data-query-params=\"queryParams\" data-toggle=\"table\" class=\"table table-hover table-bordered table-striped table-bottomless ls-animated-table sortable\">";

    retorno += "<thead>";
    retorno += "<tr>";

    var checkboxHead = false;

    //se for checkboxgrid
    for (var i = 0; i < controls.length; i++) {
        if (controls[i].controlType == "CHECKBOXGRID") {
            retorno = retorno + "<div>"
            retorno += "<div class style=\"white-space: nowrap;\">"
            retorno += "<th tabindex=\"0\" data-field=\"configuracao\" class=\"jsgrid-align-center\" id=\"SelecionaTodos\" style=\"width: 40px;\"><div class=\"icheckbox_flat-blue\" style=\"position:relative;\"><input class='icheck-grey' type='checkbox' onclick=\"selecionaTodos('" + containerID + "')\" style=\"position: absolute; top: -20%; left: -20%;display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);\"/></input></div></th></div>";
            retorno = retorno + "</div>"
            checkboxHead = true;
        }
        if (controls[i].controlType == "BUTTONGRID") {
            checkboxHead = false;
        }
    }

    if (checkboxHead == false) {
        retorno += "<th class=\"gridButtons\" data-field=\"configuracao\" ><i class=\"fa fa-cog\"></i></th>";
    }

    var controlcount = 0;
    var data = [];

    for (var i = 0; i < controls.length; i++) {


        isVisible = "";
        if (controls[i].visibleGrid == false) {
            isVisible = " style='display:none' ";
        } else if (navigation && (controls[i].controlType == "DROPDOWN" || controls[i].controlType == "DROPDOWNDSG")) {
            isVisible = " style='display:none' ";
        }

        if (controls[i].field == "id") {
            indexIdControl = i;
        }

        if (controls[i].controlType == "CHECKBOXGRID" || controls[i].controlType == "BUTTONGRID") {
            buttons.push(controls[i]);
        }


        retorno += "<th "

        if (controls[i].visibleGrid) {
            controlcount += 1;
            retorno += "data-visible='true' "
        } else {
            retorno += "data-visible='false' "
        }

        retorno += "tabindex='" + controlcount + "' "
        retorno += "data-field='" + controls[i].controlID + "' "
        retorno += "data-FieldData='" + controls[i].field + "' "

        retorno += "data-Table='" + controls[i].table + "' "
        retorno += "data-DerivedFrom='" + controls[i].derivedFrom + "' "
        retorno += "data-NativeDataType='" + controls[i].nativeDataType + "' "
        retorno += "data-controlID='" + controls[i].controlID + "' "
        retorno += "data-SequenceRecording='" + controls[i].sequenceRecording + "' "
        retorno += "data-propertyID='" + controls[i].propertyID + "' "
        retorno += "placeholder='" + controls[i].titulo + "' "
        retorno += "data-propertyID='" + controls[i].propertyID + "' "
        retorno += "data-visibleGrid='" + controls[i].visibleGrid + "' "
        retorno += "data-id='" + controls[i].id + "' "
        retorno += isVisible + ">"
        retorno += "" + controls[i].titulo + ""
        retorno += "</th>";

    }

    if (titulo == "Lista") {
        retorno += "<th data-field=\"acao\"  style=\"width: 100px;\">Ação</th>"
    }
    gridButtons[containerID + "_table"] = buttons;

    if (containerID.indexOf("857a1f6d-887b-4a08-b5b3-646ea4457c04") != -1 || containerID.indexOf("828810bd-5e6f-4dd9-a66c-b7e9be94fdd8") != -1) {
        retorno += "</tr>";
        retorno += "</thead>";
        retorno += "<tbody>";
        retorno += "</tbody>";
        retorno += "<tfoot>";
        retorno += "<tr>";
        retorno += "<th>";
        retorno += "<strong><font size = 2>Total</font></strong>";
        retorno += "</th>";
        retorno += "<th></th>";
        retorno += "<th></th>";
        retorno += "<th></th>";

        retorno += "<th id=\"vlunitario1\">0,00</th>";
        retorno += "<th id=\"vldesconto1\">0,00</th>";
        if (containerID.indexOf("857a1f6d-887b-4a08-b5b3-646ea4457c04") != -1) {
            retorno += "<th></th>";
        }

        retorno += "<th id=\"vltotal1\">0,00</th>";
        retorno += "<tr><td colspan=\"1000\" style=\"text-align:center\"><i class=\"fa fa-ellipsis-h\"></i></td></tr>";
        retorno += "</tr>";
        retorno += "</tfoot>"
        retorno += "</table>";
        retorno += "</div>";


    }
    else {
        retorno += "</tr>";
        retorno += "</thead>";
        retorno += "<tbody>";
        retorno += "</tbody>";
        retorno += "<tfoot>";
        retorno += "<tr><td colspan=\"1000\" style=\"text-align:center\"><i class=\"fa fa-ellipsis-h\"></i></td></tr>";
        retorno += "</tfoot>"
        retorno += "</table>";
        retorno += "</div>";

    }


    recipient = "#" + containerID + " .panel-body";
    $(recipient).prepend(retorno);
    sharpGrid(containerID);

    if (cardGrid == true) {
        addRowCard(containerID, controls, navigation);
    } else {
        addRowGrid(containerID, controls, navigation);
    }

}




function mudaTotalGrid(containerID, parameters) {
    var element = $("#" + containerID + "_table");
    var dataRows = element.find('tbody tr');
    var footer = element.find('tfoot th');

    var valorunitario = 0;
    var valordesconto = 0;
    var valortotal = 0;

    if (containerID.indexOf("828810bd-5e6f-4dd9-a66c-b7e9be94fdd8") != -1) //compra
    {
        for (var j = 0; j < (dataRows.length) ; j++) {
            for (var k = 0; k < (dataRows[j].children.length) ; k++) {
                if (dataRows[j].children[k].getAttribute("data-controlid") == "ae387a75-5177-49ab-9ab1-97fb9139d912") {
                    valorunitario = valorunitario + parseFloat(dataRows[j].children[k].innerText.replace(".", "").replace(",", "."));
                }
                if (dataRows[j].children[k].getAttribute("data-controlid") == "0d04e614-776d-45a4-886e-a329bb824fe8") {
                    valordesconto = valordesconto + parseFloat(dataRows[j].children[k].innerText.replace(".", "").replace(",", "."));
                }

                if (dataRows[j].children[k].getAttribute("data-controlid") == "6dc640ac-3f36-45da-85b3-6401ed6ae54a") {
                    valortotal = valortotal + parseFloat(dataRows[j].children[k].innerText.replace(".", "").replace(",", "."));
                }
            }
        }

        footer[4].innerText = valorunitario.toFixed(2);
        footer[5].innerText = valordesconto.toFixed(2);
        footer[6].innerText = valortotal.toFixed(2);

    } else if (containerID.indexOf("857a1f6d-887b-4a08-b5b3-646ea4457c04") != -1) //venda
    {


        for (var j = 0; j < (dataRows.length) ; j++) {
            for (var k = 0; k < (dataRows[j].children.length) ; k++) {
                if (dataRows[j].children[k].getAttribute("data-controlid") == "99ed2216-1c35-4f9d-a4a6-b4ea9ecf8de6") {
                    valorunitario = valorunitario + parseFloat(dataRows[j].children[k].innerText.replace(".", "").replace(",", "."));
                }
                if (dataRows[j].children[k].getAttribute("data-controlid") == "72dec1e4-0381-44ca-ae24-9e766b2ac9c3") {
                    valordesconto = valordesconto + parseFloat(dataRows[j].children[k].innerText.replace(".", "").replace(",", "."));
                }

                if (dataRows[j].children[k].getAttribute("data-controlid") == "3df9831f-ccc7-4c03-be17-50018436ee8e") {
                    valortotal = valortotal + parseFloat(dataRows[j].children[k].innerText.replace(".", "").replace(",", "."));
                }
            }
        }

        footer[4].innerText = valorunitario.toFixed(2);
        footer[5].innerText = valordesconto.toFixed(2);
        footer[7].innerText = valortotal.toFixed(2);
    }
    else
        return;

};

function editGridLine(button, containerID, ID) {

    //ID = id do registro.
    //containerID = id do container.

    //e.preventDefault();


    $("#" + containerID + "_table tr.selected").removeClass('selected');

    var gridLine = $(button).parents('tr');


    if (gridLine.hasClass('selected')) {
        gridLine.removeClass('selected');

    }
    else {

        gridLine.addClass('selected');


    }

    loaderImage(containerID + "_panel", true);

    var url = getGlobalParameters("urlPlataforma") + "/api/database/DataSearch";
    var layoutID = $("#" + containerID).attr("layoutID");

    if (!layoutID) {
        var forms = $("#" + containerID).parents("form");

        for (var i = 0; i < forms.length; i++) {

            if ($(forms[i]).attr("layoutid")) {
                layoutID = $(forms[i]).attr("layoutid");
                break;
            }
        }
    }
    var propertyID = $("#" + containerID + " input[data-field='id']").attr("data-propertyID");
    var EnterpriseID = returnCookie("EnterpriseID");

    getAjaxData(url, { FormID: layoutID, Filtro: ID, ReferenceID: propertyID, EnterpriseID: EnterpriseID }, function (result) {
        //alert(result);
        fillForm(result, containerID);
        loaderImage(containerID + "_panel", false);

        triggerChangeAutoComplete(containerID);
    });
}

function triggerChangeAutoComplete(containerID) {
    $('.autocomplete[data-containerid="' + containerID + '"]').each(function () {
        var control_name = $(this)[0].id;

        /* Inverte a String para procurar o nome do controle sem o _autocomplete */
        control_name = control_name.split("").reverse().join("");

        /* Corta a string sem o _autocomplete */
        control_name = control_name.substring(control_name.indexOf('_') + 1);

        /* Desinverte a string */
        control_name = control_name.split("").reverse().join("");

        $("#" + control_name).trigger("change");
    });
}

function deleteRowGrid(button, containerID, ID) {
    var EnterpriseID = returnCookie("EnterpriseID");
    var UserID = returnCookie("UserID");
    var msg = [];
    var myJson = {};
    var valNovo = [];


    loaderImage(containerID, true);

    var gridLine = $(button).parents('tr');

    if (gridLine.hasClass('selected')) {
        gridLine.removeClass('selected');
    }
    else {
        gridLine.addClass('selected');
    }

    valNovo = $.makeArray(ID);

    if (gridLine[0].cells[1].getAttribute("data-table") != "") {
        myJson["table"] = gridLine[0].cells[1].getAttribute("data-table");
    }
    else {
        myJson["table"] = button.dataset.table;
    }

    myJson["field"] = "id";
    myJson["nativeDataType"] = "id";
    myJson["newValue"] = valNovo;
    myJson["oldValue"] = valNovo;
    myJson["EnterpriseID"] = EnterpriseID;
    myJson["UserID"] = UserID;
    myJson["LayoutID"] = $("#" + containerID).attr("layoutid");
    msg[0] = myJson;

    msg = JSON.stringify(msg);

    var url = getGlobalParameters("urlPlataforma") + "/api/database/DeleteData";
    var message = "Ter certeza que quer excluir esse registro";
    bootbox.confirm(message, function (response) {
        if (response) {

            postAjaxParameter(EnterpriseID, url, msg,
                function (result) {
                    var success = result[0].message[0].success;
                    if (success) {

                        gridLine.remove();
                        reinicalizaContadores(containerID);
                        //Chama a função que verifica se está na tela de produtos e recalcula os totais.
                        mudaTotalGrid(containerID);

                    }
                },
                function () {

                },
                function () {
                    loaderImage(containerID, false);
                    gridLine.removeClass("selected");
                }
            )
        }
    });
    $vl_qt_itens.val(($('[data-field="vl_qt_itens"]').length) - 2);
    mudaTotalGrid(containerID);
    reinicalizaContadores(containerID);
    //sharpGridPager(containerID)
}

function addRowGrid(containerID, controls, navigation, clearFormIgnore) {
    var grid = false;

    if ($("#" + containerID + "_table").attr("data-template") == "GRID") {
        grid = true;
    }

    var visibleGrid = [];
    var c = "";
    var valueID = "";
    var referenceID = "";
    var lines = "";
    var layoutID = $("#" + containerID).attr("layoutid");
    var buttons = gridButtons[containerID + "_table"];
    var onLostFocusName = "";
    var onClickName = "";
    var onFocusName = "";
    var onChangeName = "";
    var onKeyPressName = "";
    var scriptEvents = "";
    var table = "";

    var data = [];
    var row;

    if (controls.length > 0) {

        //if (controls[0].newValue.length == 1) {
        //    if (controls[0].newValue[0] == "") {
        //        return;
        //    }
        //}



        for (var i = 0; i < controls[0].newValue.length; i++) {
            var status;
            var ActionText;
            var defaultcolumn = "";
            for (var i2 = 0; i2 < controls.length; i2++) {
                if (controls[i2].field == "id") {
                    valueID = controls[i2].newValue[i];
                    referenceID = controls[i2].propertyID;
                    break;
                }
                if (controls[i2].placeholder == "Status") {
                    status = controls[i2];
                }
                if (controls[i2].table != "null") {
                    table = controls[i2].table;
                }
            }




            lines += "<tr id=\"line_" + i + "_" + containerID + "\" class=\"filtered\">"

            if (navigation) {
                lines += " <td class='text-center buttons' data-visibleGrid='true' class='text-center'>";
                lines += " <div class='' style='white-space: nowrap;'>";
                lines += CreateButton({
                    titulo: "", nome: "Edit", tooltip: "editar", onClick: "editLayout(this,\"" + navigation.layoutName + "\", \"" +

    navigation.layoutID + "\", \"" + navigation.title + "\", \"" + navigation.loadData + "\", \"" + referenceID + "\", \"" + valueID + "\");", classe: "btn btn-xs btn-warning", icone: "<i class=\"fa fa-pencil\"></i>", returnString: true
                });
                lines += "</div>";
                lines += "</td>";

            } else {

                lines += " <td class='text-center buttons' data-visibleGrid='true' class='text-center'>";
                lines += " <div class='' style='white-space: nowrap;'>";

                //defaultcolumn += " <td class='text-center buttons' data-visibleGrid='true' class='text-center'>";
                defaultcolumn += " <div class='' style='white-space: nowrap;'>";

                if (!buttons) {
                    buttons = [];
                }

                if (buttons.length > 0) {
                    for (var j = 0; j < buttons.length; j++) {

                        if (buttons[j].onLostFocusName) {
                            onLostFocusName = buttons[j].onLostFocusName;
                        }
                        if (buttons[j].onClickName) {
                            onClickName = buttons[j].onClickName;
                        }
                        if (buttons[j].onFocusName) {
                            onFocusName = buttons[j].onFocusName;
                        }
                        if (buttons[j].onChangeName) {
                            onChangeName = buttons[j].onChangeName;
                        }
                        if (buttons[j].onKeyPressName) {
                            onKeyPressName = buttons[j].onKeyPressName;
                        }
                        if (buttons[j].scriptEvents) {
                            scriptEvents = buttons[j].scriptEvents;
                        }


                        switch (buttons[j].controlType) {
                            case "BUTTONGRID":

                                //disabled
                                var disabled = "";
                                if (controls[0].disabled) {
                                    disabled = controls[0].disabled[i];
                                    if (disabled == "true") {
                                        disabled = "disabled";
                                    }
                                }

                                lines += "<a " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='btn btn-primary' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='button' id='" + buttons[j].id + "_" + gerarGUID();
                                lines += " ' onblur='" + onLostFocusName + "' onclick='" + onClickName + "(this)' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'>" + buttons[j].titulo + " </a>";
                                lines += "<script>" + scriptEvents + " </script>";

                                defaultcolumn += "<a " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='btn btn-primary' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='button' id='" + buttons[j].id + "_" + gerarGUID();
                                defaultcolumn += " ' onblur='" + onLostFocusName + "' onclick='" + onClickName + "(this)' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'>" + buttons[j].titulo + " </a>";
                                defaultcolumn += "<script>" + scriptEvents + " </script>";


                                break;
                            case "CHECKBOXGRID":
                                var check = "unchecked";
                                if (controls[0].texto) {
                                    check = controls[0].texto[i];
                                    if (check == "true") {
                                        check = "checked";
                                    }
                                }
                                //disabled
                                var disabled = "";
                                if (controls[0].disabled) {
                                    disabled = controls[0].disabled[i];
                                    if (disabled == "true") {
                                        disabled = "disabled";
                                    }
                                }
                                //color do checkbox padrão azul.
                                var color = "";
                                if (controls[0].color) {
                                    color = controls[0].color[i];
                                    if (color == "" || color == "null") {
                                        color = "blue";
                                    }
                                }
                                else {
                                    color = "blue";
                                }
                                //
                                if (status != undefined) {
                                    if (status.newValue[i] == "Venda Iniciada" || status.newValue[i] == "Parcialmente entregue" || status.newValue[i] == " Orçamento" || status.newValue[i] == "Faturado" || status.newValue[i] == "Em Entrega" || status.newValue[i] == "Cancelada" || status.newValue[i] == "Entregue" || status.newValue[i] == "Separado para entrega") {
                                        lines += "<input " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='icheck-grey' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='checkbox' id='" + buttons[j].id + "_" + gerarGUID() + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'/>";
                                        lines += "  ";
                                        lines += "<script>" + scriptEvents + " </script>";

                                        defaultcolumn += "<input " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='icheck-grey' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='checkbox' id='" + buttons[j].id + "_" + gerarGUID() + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'/>";
                                        defaultcolumn += "  ";
                                        defaultcolumn += "<script>" + scriptEvents + " </script>";
                                    }
                                    else {
                                        lines += "<input " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='icheck-grey' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='checkbox' id='" + buttons[j].id + "_" + gerarGUID() + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'/>";
                                        lines += "  ";
                                        lines += "<script>" + scriptEvents + " </script>";

                                        defaultcolumn += "<input " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='icheck-grey' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='checkbox' id='" + buttons[j].id + "_" + gerarGUID() + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'/>";
                                        defaultcolumn += "  ";
                                        defaultcolumn += "<script>" + scriptEvents + " </script>";

                                    }
                                }
                                else {
                                    lines += "<input " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='icheck-grey' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='checkbox' id='" + buttons[j].id + "_" + gerarGUID() + "' onblur='" +

                                    onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'/>";
                                    lines += "  ";
                                    lines += "<script>" + scriptEvents + " </script>";


                                    defaultcolumn += "<input " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='icheck-grey' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='checkbox' id='" + buttons[j].id + "_" + gerarGUID() + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'/>";
                                    defaultcolumn += "  ";
                                    defaultcolumn += "<script>" + scriptEvents + " </script>";
                                }
                                break;

                            default:

                        }
                    }
                } else {
                    if (table != "produtos_lancamentos" && table != "venda_produtos_impostos") {
                        lines += CreateButton({
                            titulo: "", nome: "Edit", tooltip: "editar", onClick: "editGridLine(this,\"" + containerID + "\", \"" + valueID + "\")", classe: "btn btn-xs btn-warning", icone: "<i class=\"fa fa-pencil\"></i>", returnString: true
                        });
                        lines += "  ";
                        lines += CreateButton({
                            titulo: "", nome: "Delete", tooltip: "excluir", onClick: "deleteRowGrid(this,\"" + containerID + "\", \"" + valueID + "\")", classe: "btn btn-xs btn-danger", icone: '<i class="fa fa-trash-o"></i>', returnString: true
                        });
                    }
                    if (table == "venda_produtos_impostos") {
                        lines += "<a class=\"btn btn-primary btn-outline popup-modal-ajax\" title=\"Memória de Cálculo\" href=\"http://" + window.location.host + "/WorkFlowVendas/MemoriaCalculo.aspx?id=" + valueID + "\"><i class=\"fa fa-superscript\"></i></a>";
                    }
                }

                defaultcolumn += "</div>";
                //defaultcolumn += "</td>";

                lines += "</div>";
                lines += "</td>";
            }


            row = {};

            row["configuracao"] = defaultcolumn;

            for (var i2 = 0; i2 < controls.length; i2++) {


                isVisible = "";
                isCentered = "";
                if (controls[i2].visibleGrid == "false" || controls[i2].visibleGrid == false || controls[i2].visibleGrid == null) {
                    isVisible = " style='display:none' class=\"no-search\"";
                } else if (navigation && (controls[i2].controlType == "DROPDOWN" || controls[i2].controlType == "DROPDOWNDSG")) {
                    isVisible = " style='display:none' class=\"no-search\"";
                }

                dadoCelula = (controls[i2].newValue[i]) ? controls[i2].newValue[i] : "";
                if (controls[i2].nativeDataType == "SimNao") {
                    if (dadoCelula == true || dadoCelula == "true" || dadoCelula == "True" || dadoCelula == "TRUE") {
                        dadoCelula = '<i class="fa fa-check"></i>';
                        isCentered = "class=\"text-center\"";
                    };
                    if (dadoCelula == false || dadoCelula == "false" || dadoCelula == "False" || dadoCelula == "FALSE") {
                        dadoCelula = '<i class="fa fa-times"></i>';
                        isCentered = "class=\"text-center\"";
                    };
                }
                if (controls[i2].controlType == "DROPDOWN" || controls[i2].controlType == "DROPDOWNDSG") {
                    dadoCelula = controls[i2].textList[controls[i2].valueList.indexOf(dadoCelula)]
                }
                if (controls[i2].controlType == "AUTOCOMPLETE") {
                    dadoCelula = (controls[i2].text[i]) ? controls[i2].text[i] : controls[i2].newValue[i];
                }
                lines += "<td " +
                    "id='" + controls[i2].controlID + "_" + valueID + "' " +
                    "data-controlid='" + controls[i2].controlID + "' " +
                    "data-field='" + controls[i2].field + "' " +
                    "data-table='" + controls[i2].table + "' " +
                    "data-nativeDataType='" + controls[i2].nativeDataType + "' " +
                    "data-derivedFrom='" + controls[i2].derivedFrom + "' " +
                    "data-newValue='" + dadoCelula + "'" + "' " +
                    "data-oldValue='" + dadoCelula + "'" + "' " +
                    "data-registerID='" + valueID + "'" +
                    "data-layoutID='" + layoutID + "'" +
                    isVisible + " " +
                    isCentered + ">" +
                     "<span class=\"cellData\" data-spanid='" + controls[i2].controlID + "_" + valueID + "_span'" + "onClick='showMessage()'" + ">" + dadoCelula + "<span>" +
                    "</td>";

                if (controls[i2].controlID) {
                    row[controls[i2].controlID] = dadoCelula;
                }

            }



            var acao = "";

            if (containerID.split("_")[0] == "b63c19ea-dba3-411f-a5c0-fed30483abac") {
                lines += "<td><a class=\"btn btn-primary btn-outline popup-modal-ajax\" href=\"http://" + window.location.host + "/boletos.aspx?id=" + valueID + "\">Vizualizar Boleto</a></td>";
                lines += "</tr>";

                acao += "<a class=\"btn btn-primary btn-outline popup-modal-ajax\" href=\"http://" + window.location.host + "/boletos.aspx?id=" + valueID + "\">Vizualizar Boleto</a>";

            }



            if (containerID.split("_")[0] == "9ce79fa0-fd8a-4cd1-b1be-3878e455409b") {
                lines += "<td>" + "<a class=\"btn btn-primary btn-outline\"onClick=\"f_aba('cotacoes','5029331a-57ac-43d9-8f7a-65735eff6740','Cotações','true', '" + returnCookie("EnterpriseID") + "')\">Gerar Cotação</a>" +
                                   "</td>";
                lines += "</tr>";

                acao += "<a class=\"btn btn-primary btn-outline\"onClick=\"f_aba('cotacoes','5029331a-57ac-43d9-8f7a-65735eff6740','Cotações','true', '" + returnCookie("EnterpriseID") + "')\">Gerar Cotação</a>"
            }

            //Atendimento de Requisicao de Material
            if (containerID.split("_")[0] == "c8e5e8e2-0875-40fe-99c2-77dda9efaadd") {
                lines += "<td>" + "<a style='font-size: 80%' class=\"btn btn-primary btn-outline\"onClick=\"openModalRejeicao('" + valueID + "')\"><i class='fa fa-ban'></i></a></td>";
                lines += "</tr>";

                acao += "<a style='font-size: 80%' class=\"btn btn-primary btn-outline\"onClick=\"openModalRejeicao('" + valueID + "')\"><i class='fa fa-ban'></i></a>";

            }

            //Container CoListaCompra (Controle de Compras)
            if (containerID.split("_")[0] == "87cc1ae4-a188-498b-83a6-ae137b91c76b") {
                //Verifica em qual status está e qual o próximo step.
                var proximoStatus = verificaStatus(status.newValue[i], "compra");
                var htmlBotaoExcluir = "";

                htmlBotaoExcluir += "<a class='btn btn-primary btn-outline btn-icon btn-danger' href='#'";
                htmlBotaoExcluir += "onclick= ExcluirPedidoCompra('" + valueID + "',this) >";
                htmlBotaoExcluir += "<i class='fa fa-trash-o'></i>";
                htmlBotaoExcluir += "</a>";

                if (proximoStatus == "Pedido") {
                    lines += "<td style=\"width:auto!important\">";
                    lines += htmlBotaoExcluir;
                    lines += "</td>";
                    lines += "</tr>";

                    acao += htmlBotaoExcluir;
                }
                else if (proximoStatus == "Compra Iniciada") {
                    lines += "<td style=\"width:auto!important\">";
                    lines += htmlBotaoExcluir;
                    lines += "</td>";
                    lines += "</tr>";
                    acao += htmlBotaoExcluir;
                }
                else if (proximoStatus == "Compra Aprovada") {
                    lines += "<td style=\"width:auto!important\">";
                    lines += htmlBotaoExcluir;
                    lines += "</td>";
                    lines += "</tr>";
                    acao += htmlBotaoExcluir;
                }
                else if (proximoStatus == "Recebido XML de Compra") {
                    lines += "<td style=\"width:auto!important\">";
                    //function f_aba(systemName, layoutID, titleMenu, loadData, enterpriseID)
                    lines += "<a class=\"btn btn-primary btn-outline\" id=\"btnXML\" onClick=\"f_aba('lyImportarXML','c6bd6c44-6546-4700-954d-e22c61a20979','Importação XML','false', '" + returnCookie("EnterpriseID") + "','" + valueID + "')\">Importação XML</a>";
                    lines += htmlBotaoExcluir;
                    lines += "</td>";
                    lines += "</tr>";
                    acao += htmlBotaoExcluir;
                }
                else if (proximoStatus == "Aguardando Recebimento") {
                    lines += "<td style=\"width:auto!important\">";
                    lines += htmlBotaoExcluir;
                    lines += "<td>" + "</td>";
                    lines += "</tr>";
                    acao += htmlBotaoExcluir;
                }
                else if (proximoStatus == "Pedido Recebido") {
                    lines += "<td style=\"width:auto!important\">";
                    lines += htmlBotaoExcluir;
                    lines += "<td>" + "</td>";
                    lines += "</tr>";
                    acao += htmlBotaoExcluir;
                }

            }

            if (status) {
                if (status.newValue) {
                    if (status.newValue[i] == "Entregue") { //venda
                        lines += "<td style=\"width:auto!important\">";
                        //lines +=  "<a class='btn btn-primary btn-outline' onclick=\"javascrpt:CreateAba('" + nameLayout + "','" + layoutID + "','" + titleMenu + "','" + dados + "'," + false + ",'" + containerType + "','" + forcingTemplate + "')\">Liberar Crédito</a>";
                        var htmlBotao = "";
                        htmlBotao += "<a class='btn btn-primary btn-outline btn-icon btn-danger' href='#'";
                        htmlBotao += "onclick= DevolucaoPedidoVenda('" + valueID + "',this) >";
                        htmlBotao += "<i class='fa fa-ban'></i>";
                        htmlBotao += "</a>";
                        lines += htmlBotao;
                        lines += "</td>";
                        lines += "</tr>";

                        acao += htmlBotao;
                    } else if (status.newValue[i] == "Pedido Recebido") { //compra
                        lines += "<td style=\"width:auto!important\">";
                        var htmlBotao = "";
                        htmlBotao += "<a class='btn btn-primary btn-outline btn-icon btn-danger' href='#'";
                        htmlBotao += "onclick= DevolucaoPedidoCompra('" + valueID + "',this) >";
                        htmlBotao += "<i class='fa fa-ban'></i>";
                        htmlBotao += "</a>";
                        lines += htmlBotao;
                        lines += "</td>";
                        lines += "</tr>";

                        acao += htmlBotao;
                    }
                }
            }

            if (containerID.split("_")[0] == "2d03e5da-ef21-4f65-9dee-de305246c737") {
                lines += "<td>" + "<a class=\"btn btn-primary btn-outline\" id=\"btnDevolucao\" onClick=\"f_aba('devolucao_compra','c0ae32a8-ece8-4f99-8bb5-776ff1592956','Devolução de Compras','false', '" + returnCookie("EnterpriseID") + "','" + valueID + "')\">Devolução</a>" +
                "</td>";
                lines += "</tr>";

                acao += "<a class=\"btn btn-primary btn-outline\" id=\"btnDevolucao\" onClick=\"f_aba('devolucao_compra','c0ae32a8-ece8-4f99-8bb5-776ff1592956','Devolução de Compras','false', '" + returnCookie("EnterpriseID") + "','" + valueID + "')\">Devolução</a>";

            }

            //Container CoListaVendas (Controle de Vendas)
            if (containerID.split("_")[0] == "2e9ecdc9-9d91-4750-958f-d8f530e77e13") {
                //Verifica em qual status está e qual o próximo step.
                var proximoStatus = verificaStatus(status.newValue[i], "venda");
                var htmlBotaoExcluir = "";

                htmlBotaoExcluir += "<a class='btn btn-primary btn-outline btn-icon btn-danger' href='#'";
                htmlBotaoExcluir += "onclick= ExcluirPedidoVenda('" + valueID + "',this) >";
                htmlBotaoExcluir += "<i class='fa fa-trash-o'></i>";
                htmlBotaoExcluir += "</a>";

                if (proximoStatus == "Pedido") {
                    lines += "<td style='width:auto!important'>";
                    lines += "<a id=\"btnEntrega\" onClick=\"OrcamentoGeraVenda('" + valueID + "');\" class=\"btn btn-primary btn-outline\" href=\"#\">Gerar Venda</a>";
                    lines += "</td>";
                    lines += "</tr>";

                    acao += "<a id=\"btnEntrega\" onClick=\"OrcamentoGeraVenda('" + valueID + "');\" class=\"btn btn-primary btn-outline\" href=\"#\">Gerar Venda</a>";

                }
                else if (status.newValue[i] == "Aguardando Liberação") {


                    lines += "<td style=\"width:auto!important\">" +
                       "<a class=\"btn btn-primary btn-outline\" href=\"" + valueID + "\"  onClick=\"LiberaDescontoVenda('" + valueID +

"');\" >Liberar Desconto</a>";

                    lines += htmlBotaoExcluir;

                    lines += "</td>";
                    lines += "</tr>";

                    acao += "<a class=\"btn btn-primary btn-outline\" href=\"" + valueID + "\"  onClick=\"LiberaDescontoVenda('" + valueID

+ "');\" >Liberar Desconto</a>";

                    acao += htmlBotaoExcluir;
                }
                else if (status.newValue[i] == "Aguardando Liberação ") {
                    var id = "bb698842-7062-86ad-f560-53ae3dbc229f_CoCabecalhoVenda_ddltabelaoperacoes";
                    var typeOpeningLayout = "bb698842-7062-86ad-f560-53ae3dbc229f_CoCabecalhoVenda_ddltabelaoperacoes";
                    var nameLayout = "lyAprovacaoLimiteCredito";
                    var layoutID = "123e92e3-0681-4ca3-b029-e1ac1989f31a";
                    var titleMenu = "Aprovação de Limite de Crédito";
                    var forcingTemplate = "VERTICAL";
                    var enterpriseID = "f1495bcf-9258-4245-8edf-d0fac225412d";
                    var containerType = "MODAL";
                    var dados = "&paramReferenceID=8862f239-5eb7-45dd-8f7e-0ad90fc1e9ea&filtro=" + valueID;
                    dados += "&enterpriseID=" + enterpriseID;
                    lines += "<td style=\"width:auto!important\">" + "<a class='btn btn-primary btn-outline' onclick=\"javascrpt:CreateAba('" + nameLayout + "','" + layoutID + "','" + titleMenu + "','" +

                    dados + "'," + false + ",'" + containerType + "','" + forcingTemplate + "')\">Liberar Crédito</a>";
                    lines += htmlBotaoExcluir;
                    lines += "</td>";
                    lines += "</tr>";

                    acao += "<a class='btn btn-primary btn-outline' onclick=\"javascrpt:CreateAba('" + nameLayout + "','" + layoutID + "','" + titleMenu + "','" + dados + "'," + false + ",'" + containerType + "','" + forcingTemplate + "')\">Liberar Crédito</a>";
                    acao += htmlBotaoExcluir;

                }
                else if (proximoStatus == "Picking") {

                    lines += "<td style=\"width:auto!important\">" +
                       "<a class=\"btn btn-primary btn-outline\" href=\"" + valueID + "\" onClick=\"onClickPicking('" + valueID + "')\">Fazer Picking</a>";
                    //"<a class=\"btn btn-primary btn-outline\" href=\"" + valueID + "\" onClick=\"f_aba('romaneio','358188ae-0b11-438f-8a4a-9bebb7943d44','Picking','false', '" + returnCookie("EnterpriseID") + "')\">Fazer Picking</a>";

                    lines += htmlBotaoExcluir;

                    lines += "</td>";
                    lines += "</tr>";

                    //acao += "<a class=\"btn btn-primary btn-outline\" href=\"" + valueID + "\" onClick=\"f_aba('romaneio','358188ae-0b11-438f-8a4a-9bebb7943d44','Picking','false', '" + returnCookie("EnterpriseID") + "')\">Fazer Picking</a>";
                    acao += "<a class=\"btn btn-primary btn-outline\" href=\"" + valueID + "\" onClick=\"onClickPicking('" + valueID + "')\">Fazer Picking</a>";
                    acao += htmlBotaoExcluir;
                }
                else if (proximoStatus == "Expedição") {

                    lines += "<td style=\"width:auto!important\">" +
                       "<a class=\"btn btn-primary btn-outline\" href=\"" + valueID + "\" onClick=\"f_aba('ly_Expedicao','e02eea99-7c78-4bd7-aed4-47d401d3e13b','Expedição','false', '" + returnCookie("EnterpriseID") + "&paramReferenceID=8862f239-5eb7-45dd-8f7e-0ad90fc1e9ea&Filtro=" + valueID + "')\">Expedição</a>";

                    lines += htmlBotaoExcluir;

                    lines += "</td>";
                    lines += "</tr>";

                    acao += "<a class=\"btn btn-primary btn-outline\" href=\"" + valueID + "\" onClick=\"f_aba('ly_Expedicao','e02eea99-7c78-4bd7-aed4-47d401d3e13b','Expedição','false', '" + returnCookie("EnterpriseID") + "&paramReferenceID=8862f239-5eb7-45dd-8f7e-0ad90fc1e9ea&Filtro=" + valueID + "')\">Expedição</a>";

                    acao += htmlBotaoExcluir;


                }
                else if (proximoStatus == "Faturado") {

                    lines += "<td style=\"width:auto!important\">" +
                      "<a id=\"btnEntrega\" onClick=\"Faturar('" + valueID + "');\" class=\"btn btn-primary btn-outline\" href=\"#\">Gerar Nota</a>";
                    lines += htmlBotaoExcluir;

                    lines += "</td>";
                    lines += "</tr>";

                    acao += "<a id=\"btnEntrega\" onClick=\"Faturar('" + valueID + "');\" class=\"btn btn-primary btn-outline\" href=\"#\">Gerar Nota</a>";
                    acao += htmlBotaoExcluir;

                }
                else if (proximoStatus == "Em Entrega") {

                    lines += "<td style=\"width:auto!important\">" +
                       "<a class=\"btn btn-primary btn-outline\" onClick=\"f_aba('expedicao','dfd85e30-8f8e-4038-bed4-2449551f5fa8','Expedição','true', '" +

                    returnCookie("EnterpriseID") + "')\">Expedição</a>";

                    lines += htmlBotaoExcluir;


                    lines += "</td>";
                    lines += "</tr>";

                    acao += "<a class=\"btn btn-primary btn-outline\" onClick=\"f_aba('expedicao','dfd85e30-8f8e-4038-bed4-2449551f5fa8','Expedição','true', '" + returnCookie("EnterpriseID") + "')\">Expedição</a>";

                    acao += htmlBotaoExcluir;

                }
                else if (proximoStatus == "Separado para entrega") {

                    lines += "<td style=\"width:auto!important\">" +
                        "<a id=\"btnEntrega\" onClick=\"ConfirmaEntrega('" + valueID + "');\" class=\"btn btn-primary btn-outline\" href=\"#\">Confirmar Entrega</a>";
                    lines += htmlBotaoExcluir;

                    lines += "</td>";
                    lines += "</tr>";

                    acao += "<a id=\"btnEntrega\" onClick=\"ConfirmaEntrega('" + valueID + "');\" class=\"btn btn-primary btn-outline\" href=\"#\">Confirmar Entrega</a>";
                    acao += htmlBotaoExcluir;
                }
                else if (proximoStatus == "Parcialmente entregue") {
                    lines += "<td style=\"width:auto!important\">" +
                      "<a id=\"btnEntrega\" onClick=\"ConfirmaEnvioEntrega('" + valueID + "');\" class=\"btn btn-primary btn-outline\" href=\"#\">Enviar para Entrega</a>";

                    lines += htmlBotaoExcluir;

                    lines += "</td>";

                    lines += "</tr>";

                    acao += "<a id=\"btnEntrega\" onClick=\"ConfirmaEnvioEntrega('" + valueID + "');\" class=\"btn btn-primary btn-outline\" href=\"#\">Enviar para Entrega</a>";

                    acao += htmlBotaoExcluir;
                }
                else if (proximoStatus == "Venda Iniciada") {
                    lines += "<td style=\"width:auto!important\">";
                    lines += htmlBotaoExcluir;
                    lines += "</td>";
                    lines += "</tr>";

                    acao += htmlBotaoExcluir;
                }
                else {
                    lines += "<td style=\"width:auto!important\">" + "</td>";
                    lines += "</tr>";
                }



            }

            //$("#" + containerID + "_table table tbody").append(lines);
            //lines = "";
            if (grid == true) {
                row["acao"] = acao;

                if (row) {
                    data.push(row);
                }
                lines = "";
            }
        }


    }






    var url = window.location.search.replace("?", "");
    var items = url.split("&");


    //remove a classe selecionada da linha
    var selected = $("#" + containerID + "_table table tbody").find("tr.selected")
    if (selected.length) {
        selected.replaceWith(lines);
    }
    else {
        if (grid == true) {
            $("#" + containerID + "_table table").bootstrapTable('destroy');
            if (data) {
                if (data.length > 0) {
                    var tableGrid = $("#" + containerID + "_table table th");


                    $("#" + containerID + "_table table").bootstrapTable('destroy').bootstrapTable({
                        data: data
                    });

                    for (var i = 0; i < tableGrid.length; i++) {
                        //var x = document.getElementById(tableGrid[i].id).attributes;
                        var x = tableGrid[i].attributes;

                        if (x) {
                            if (x.length > 0) {
                                for (var j = 0; j < x.length; j++) {
                                    //document.getElementById("demo").innerHTML += "  -  " + x[i].value;
                                    //if (x[j].name != "id") {
                                    //document.getElementById(tableGrid[i].id).setAttribute(x[0].attributes[j].name, x[0].attributes[j].value);
                                    $("[data-field='" + $(tableGrid[i]).attr("data-field") + "']").attr(x[j].name, x[j].value);
                                    //}
                                }
                            }
                        }

                    }
                }
            }
        } else {
            $("#" + containerID + "_table table tbody").append(lines);
        }

        var contador = 0;
        var teste = $("#" + containerID + "_table table tbody input.icheck-grey");
        $("#" + containerID + "_table table tbody input.icheck-grey").each(function () {
            var idcheckbox = this.id;
            var cor = $("#" + idcheckbox).attr("data-color");
            contador = contador + 1;
            carregaIcheckCheckBoxColor(idcheckbox, cor);
            var eventClick = $("#" + idcheckbox).attr("onclick");
            //var namespaces = eventClick.split("(");
            var funcName = eventClick; //namespaces[0].replace("(", "");

            $("#" + idcheckbox).on('ifClicked', function () {
                var args = this;
                if (funcName != "" && funcName != undefined && funcName != null) {

                    executeFunctionByName(funcName, window, args);
                    //funcName = funcName + "(line)";
                    //window[funcName](args);
                    //executeFunctionByName(onClickName + ".");
                }
            });
        });

    }
    //sharpGridPager(containerID)
    if (clearFormIgnore == true) {

    } else {
        ClearForm(containerID, false);
    }

    if (containerID.split("_")[0] == "474181e6-f8d3-4a8e-9bdb-a12528941aff" || containerID.split("_")[0] == "2e9ecdc9-9d91-4750-958f-d8f530e77e13" || containerID.split("_")[0] == "b63c19ea-dba3-411f-a5c0-fed30483abac" || containerID.split("_")[0] == "87cc1ae4-a188-498b-83a6-ae137b91c76b" || containerID.split("_")[0] == "9ce79fa0-fd8a-4cd1-b1be-3878e455409b" || containerID.split("_")[0] == "2d03e5da-ef21-4f65-9dee-de305246c737") {
        (function (document, window, $) {
            'use strict';

            $('.popup-modal-ajax').magnificPopup({
                type: 'ajax',
                alignTop: true,
                overflowY: 'scroll',
                closeOnContentClick: false,
                closeBtnInside: false,
                modal: true
            });

            $(document).on('click', '.popup-modal-ajax-close', function (e) {
                e.preventDefault();
                $.magnificPopup.close();
            });
        })(document, window, jQuery);
    }

    $vl_qt_itens.val(($('[data-field="vl_qt_itens"]').length));
    mudaTotalGrid(containerID);
    //reinicalizaContadores(containerID);

    $(".dropdown-toggle").dropdown();
}

function verificaStatus(status, tipo) {
    //Verifica o status que a venda está e o próximo status da mesma.
    var Dados = "";
    Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID");
    Dados = Dados + "&Class=ClassConfigurador&Function=verificaStatusC&ValueParameters[0]=" + status.trim() + "&ValueParameters[1]=" + tipo.trim();

    var parameters = new Object();
    parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompiler";
    parameters.dados = Dados;
    parameters.async = false;
    parameters.type = "GET";

    var result = AjaxParameter(parameters);

    return result;
}

function Faturar(idVendas) {
    var Dados = "";
    Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID");
    Dados = Dados + "&Class=ClassVenda&Function=gerarNotaFiscalC&ValueParameters[0]=" + idVendas;

    var parameters = new Object();
    parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompiler";
    parameters.dados = Dados;
    parameters.async = false;
    parameters.type = "GET";

    var result2 = AjaxParameter(parameters);
    var text = "";

    var statusID = "906E49FF-DFBE-4E91-99ED-954EE023764B";
    var Dados = "";
    Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID");
    Dados = Dados + "&Class=ClassVenda&Function=AlterStatusC&ValueParameters[0]=" + idVendas;
    Dados = Dados + "&ValueParameters[1]=" + statusID;

    var parameters = new Object();
    parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompiler";
    parameters.dados = Dados;
    parameters.async = false;
    parameters.type = "GET";

    var result = AjaxParameter(parameters);
    var text = "";

    

    if (result2) {
        for (var i = 0; i < result.length; i++) {
            let mensagem = result2[i];
            if (mensagem.success == true) {
                notification({ messageTitle: mensagem.title[0].text, messageText: mensagem.title[0].toolTip, fix: false, type: "ok", icon: "thumbs-up" });
            } else {
                notification({ messageTitle: mensagem.title[0].text, messageText: mensagem.title[0].toolTip, fix: false, type: "warning", icon: "thumbs-down" });
            }
        }

    }
}

function AutorizarCredito(valueID) {
    var statusID = "18aa54d2-c4b7-4a8b-b39b-d23840298bc5";
    var Dados = "";
    Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID");
    Dados = Dados + "&Class=ClassVenda&Function=AlterStatusC&ValueParameters[0]=" + valueID;
    Dados = Dados + "&ValueParameters[1]=" + statusID;

    var parameters = new Object();
    parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompiler";
    parameters.dados = Dados;
    parameters.async = false;
    parameters.type = "GET";

    var result = AjaxParameter(parameters);
    var text = "";

    if (result) {
        if (result[0].success) {
            notification({ messageTitle: result[0].title[0].text, messageText: result[0].title[0].toolTip, fix: false, type: "ok", icon: "thumbs-up" });
        } else {
            notification({ messageTitle: result[0].title[0].text, messageText: result[0].title[0].toolTip, fix: false, type: "warning", icon: "thumbs-down" });
        }

    }
}

function OrcamentoGeraVenda(valueID) {

    var Dados = "";
    var parameters = new Object();

    Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID") + "&";
    Dados = Dados + "Class=ClassVenda" + "&";
    Dados = Dados + "Function=f_gerarVenda" + "&";
    Dados = Dados + "ValueParameters[0]=" + valueID + "";

    parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompiler";
    parameters.dados = Dados;
    parameters.async = false;
    parameters.type = "GET";

    var result = AjaxParameter(parameters);
    if (result) {
        if (result[0].success) {
            notification({ messageTitle: result[0].title[0].text, messageText: result[0].title[0].toolTip, fix: false, type: "ok", icon: "thumbs-up" });
        } else {
            notification({ messageTitle: result[0].title[0].text, messageText: result[0].title[0].toolTip, fix: false, type: "warning", icon: "thumbs-down" });
        }

    }
}

function ConfirmaEnvioEntrega(valueID) {
    var statusID = "BB9425E1-2593-48B8-852D-73438C5C846C";
    var Dados = "";
    Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID");
    Dados = Dados + "&Class=ClassVenda&Function=AlterStatusC&ValueParameters[0]=" + valueID;
    Dados = Dados + "&ValueParameters[1]=" + statusID;

    var parameters = new Object();
    parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompiler";
    parameters.dados = Dados;
    parameters.async = false;
    parameters.type = "GET";

    var result = AjaxParameter(parameters);
    var text = "";

    if (result) {
        if (result[0].success) {
            notification({ messageTitle: result[0].title[0].text, messageText: result[0].title[0].toolTip, fix: false, type: "ok", icon: "thumbs-up" });
        } else {
            notification({ messageTitle: result[0].title[0].text, messageText: result[0].title[0].toolTip, fix: false, type: "warning", icon: "thumbs-down" });
        }

    }
}

function ConfirmaEntrega(valueID) {
    var statusID = "eff69cda-243e-4f1e-8afb-2867376e70bc";
    var Dados = "";
    Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID");
    Dados = Dados + "&Class=ClassVenda&Function=AlterStatusC&ValueParameters[0]=" + valueID;
    Dados = Dados + "&ValueParameters[1]=" + statusID;

    var parameters = new Object();
    parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompiler";
    parameters.dados = Dados;
    parameters.async = false;
    parameters.type = "GET";

    var result = AjaxParameter(parameters);
    var text = "";

    if (result) {
        if (result[0].success) {
            notification({ messageTitle: result[0].title[0].text, messageText: result[0].title[0].toolTip, fix: false, type: "ok", icon: "thumbs-up" });
        } else {
            notification({ messageTitle: result[0].title[0].text, messageText: result[0].title[0].toolTip, fix: false, type: "warning", icon: "thumbs-down" });
        }

    }
}

function AbreRomaneio(systemName, layoutID, titleMenu, loadData, enterpriseID, paramReferenceID, filter) {
    var dados = "&enterpriseID=" + enterpriseID;

    if (loadData == "true") {
        dados = dados + "&paramReferenceID=" + paramReferenceID;
        dados = dados + "&Filtro=" + filter;
    }
    CreateAba(systemName, layoutID, titleMenu, dados);
}

function editLayout(button, layoutName, layoutID, title, loadData, paramReferenceID, filter, tabGenID, navigation) {
    //var button = event.target;
    var idbutton = ""; //$("[data-tabgenlayout=" + idbuttongrid + "]");

    var $tabNav = $(button).parents("form .panel.panel-nav");
    var $formOutNav = $tabNav.parents("form");

    var dados = ""
    dados = dados + "&EnterpriseID=" + returnCookie("EnterpriseID");
    dados = dados + "&UserID=" + returnCookie("UserID");
    dados = dados + "&Lang=" + returnCookie("Lang");
    dados = dados + "&Navigation=" + "false";
    dados = dados + "&InstanceID=" + tabGenID;

    var filtro = ""
    if (paramReferenceID && filter) {
        filtro = filtro + "&ParamReferenceID=" + paramReferenceID;
        filtro = filtro + "&Filtro=" + filter;
    }

    var urlRenderLayout = getGlobalParameters("urlPlataforma") + "/api/render/renderform";
    var urlRenderLayoutData = layoutName + dados + filtro;

    $formOutNav = $($formOutNav[0]);
    if (!tabGenID) {
        tabGenID = gerarGUID();
    }

    $formOutNav.find(".innerTab").remove();
    $formOutNav.append("<div id=\"" + tabGenID + "\" class=\"innerTab\"></div>")


    if (getHTML(tabGenID, layoutID) == false) {
        $tabNav.loader();

        getAjaxParameter(urlRenderLayout, urlRenderLayoutData,
            function () {
                fillTab(resultadoParametroExterno, null, layoutID, tabGenID, null, null, urlRenderLayout, urlRenderLayoutData, "")


                if (navigation) {
                    toogleColapseContainer($tabNav, false)
                    //$("#" + tabGenID).prop("hidden", "hidden");
                    $("#" + tabGenID).hide();
                    $(button).removeClass("disabled");

                    var idbutton = $("." + tabGenID + "_edit");
                    if (button) {
                        if (button.length > 0) {
                            idbutton = button[0].id;
                            idbutton = idbutton.replace("table_", "").replace("_nav_btnnovo", "");
                            $("." + idbutton + "_edit").removeClass("disabled");
                        }
                    }



                } else {
                    toogleColapseContainer($tabNav, true)
                }
                //$tabNav.loader();
            }
        )

    } else {
        //Tira o load da aba
        if (navigation) {

            toogleColapseContainer($tabNav, false)
            //$("#" + tabGenID).prop("hidden", "hidden");
            $("#" + tabGenID).hide();
            $(button).removeClass("disabled");

            //var idbuttongrid = $(button).id.replace("table_", "").replace("_btnnovo", "");

            if (button) {
                if (button.length > 0) {
                    idbutton = button[0].id;
                    idbutton = idbutton.replace("table_", "").replace("_nav_btnnovo", "");
                    $("." + idbutton + "_edit").removeClass("disabled");
                }
            }

        } else {
            toogleColapseContainer($tabNav, true)
        }

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

        //Binda o Wizard


        var defaults = $.components.getDefaults("wizard");
        var options = $.extend(true, {}, defaults, {
            onBeforeShow: function () {

                var layout = $(".profile-tab .active");
                var layoutid = "";
                if (layout) {
                    if (layout.length > 0) {
                        layoutid = $(layout[0]).attr("layoutid");
                    }
                }

                var formObject;
                var containerObject;
                if (layoutid) {
                    formObject = $("#" + layoutid).find(".current");

                    if (formObject.length == 0) {
                        formObject = $("#" + layoutid).find(".done");
                    }

                    if (formObject.length > 0) {
                        var formid = $(formObject[0]).attr("tabgenid");
                        var containerid = $(formObject[0]).attr("containerid");

                        /* Não salva ao mudar de página do Wizard */
                        if (containerid == '9c64ffa0-2156-4dd9-8104-b5be352b4b5e' || containerid == '72cabf04-07b8-4706-aa17-0d2ea8f5e8d8' || containerid == 'c93dad75-a0b9-4c60-aedd-d6e27bf9a616')
                            return;

                        containerObject = $("#" + containerid + "_" + formid);
                    }
                }
                //var formObject = $(".wizard-pane .active").find("form");
                if (containerObject.data('original_serialized_form') !== containerObject.serialize()) {
                    if (containerObject.length > 0) {
                        containerObject = containerObject[0];
                    }
                    $(containerObject).find("#Gravar").click();
                }

                $("html, body").animate({
                    scrollTop: 0
                }, 600);

            },
            onBeforeHide: function () {
                $("html, body").animate({ scrollTop: 0 }, 600);
                //onSave(targetID, id, containerID, metadataContainerID, layoutID, false, form.onAfterSavingName);
            },
            onBack: function () {
                $("html, body").animate({ scrollTop: 0 }, 600);
            },
            onFinish: function () {
                var layout = $(".profile-tab .active");
                var layoutid = "";
                if (layout) {
                    if (layout.length > 0) {
                        layoutid = $(layout[0]).attr("layoutid");
                    }
                }

                var formObject;
                var containerObject;
                if (layoutid) {
                    formObject = $("#" + layoutid).find(".current");
                    if (formObject.length > 0) {
                        var formid = $(formObject[0]).attr("tabgenid");
                        var containerid = $(formObject[0]).attr("containerid");
                        containerObject = $("#" + containerid + "_" + formid);

                    }
                }
                //var formObject = $(".wizard-pane .active").find("form");
                if (containerObject.data('original_serialized_form') !== containerObject.serialize() && layoutid.includes("07ca6db2-a587-4a59-aa82-95f1795bdf68") == false) {
                    if (containerObject.length > 0) {
                        containerObject = containerObject[0];
                    }
                    $(containerObject).find("#Gravar").click();
                }

                //if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Vendas") {
                if (layoutid.includes("ee5b8618-b239-49ca-86a9-6975134c8713")) {
                    bt_gerarVenda();
                }
                    //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Compras") {
                else if (layoutid.includes("cacd9a15-c86d-4014-9a38-8ed7579905bb")) {
                    finalizarCompraJS();
                }
                    //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Itens") {
                else if (layoutid.includes("e02eea99-7c78-4bd7-aed4-47d401d3e13b")) {
                    AlterStatusRomaneioJS();
                    f_aba('romaneio', '358188AE-0B11-438F-8A4A-9BEBB7943D44', 'Picking', 'false', returnCookie("EnterpriseID"));
                }
                    //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Nota Fiscal") {
                //else if (layoutid.includes("07ca6db2-a587-4a59-aa82-95f1795bdf68")) {
                    //LancaEstoqueNota();
                    //f_aba('layNFe', '7df84e2b-376c-4af9-8d16-42ad021b7542', 'Controle de NF-e', 'true', returnCookie("EnterpriseID"));
                //}
                    //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Picking") {
                else if (layoutid.includes("358188ae-0b11-438f-8a4a-9bebb7943d44")) {
                    AlterStatusRomaneioJS();
                }
                    //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Entrada Simples de Material") {
                else if (layoutid.includes("a47ab0f5-98e4-4cde-9bf6-6e7f93ea4390")) {
                    finalizarEntradaSimplesJS();
                }
                    //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Ordem de Produção") {
                else if (layoutid.includes("01b095a1-dd9b-45b5-ab68-8b1f5c4dbffc")) {
                    finalizarOrdemProducaoJS();
                }
                else {
                    //OpenFormSearch(recipient);
                    $("#" + layoutid + " .panel-nav").find("#Filtrar").click();
                    //toogleColapseContainer($(formObject).find("#Gravar").parents(".innerTab"), true)
                }

                var onfinish = $("#" + layoutid);
                if (onfinish) {
                    if (onfinish.length > 0) {
                        for (var i = 0; i < onfinish.length; i++) {
                            var onloadName = $(onfinish[i]).attr("data-finish");
                            eval(onloadName);
                        }
                    }
                }
            }
        });

        $("#" + layoutID + "_" + tabGenID + ">.panel .wizard-buttons").html("");

        var wizard = $("#" + layoutID + "_" + tabGenID + ">.panel").wizard(options).data('wizard');

        $("form").formValidation({
            framework: 'bootstrap'

        })
        .on('success.form.fv', function (e) {
            // Reset the message element when the form is valid
            $('.summary-errors').html('');
            $('.summary-errors').hide();
        })
        .on('err.field.fv', function (e, data) {
            // data.fv     --> The FormValidation instance
            // data.field  --> The field name
            // data.element --> The field element
            $('#' + data.fv.$form[0].id + ' > .summary-errors').show();

            // Get the messages of field
            var messages = data.fv.getMessages(data.element);

            // Remove the field messages if they're already available
            $('#' + data.fv.$form[0].id + ' > .summary-errors').find('li[data-field="' + data.field + '"]').remove();
            if ($('#' + data.fv.$form[0].id + ' > .summary-errors').find('ul').length == 0) {

                var message = getObjMessageJS("7");
                var mess = "";

                if (message) {
                    if (message.title) {
                        if (message.title.length > 0) {
                            mess = message.title[0].text;
                        }
                    }
                }

                $('#' + data.fv.$form[0].id + ' > .summary-errors').append('<p>' + mess + '</p>');
                $('#' + data.fv.$form[0].id + ' > .summary-errors').append('<ul/>');
            }

            // Loop over the messages
            for (var i in messages) {
                // Create new 'li' element to show the message

                var label = $(data.element.parents('div')[1]).find('label').html();
                if (label == undefined) {
                    label = $(data.element.parents('div')[2]).find('label').html();
                }
                if (label == undefined) {
                    label = $(data.element.parents('div')[3]).find('label').html();
                }

                $('<li/>')
                  .attr('data-field', data.field)
                  .wrapInner(
                    $('<a/>')
                    .attr('href', 'javascript: void(0);')
                    // .addClass('alert alert-danger alert-dismissible')

                    .html(messages[i] + " no campo " + label)
                    .on('click', function (e) {
                        // Focus on the invalid field
                        data.element.focus();
                    })
                  ).appendTo('#' + data.fv.$form[0].id + ' > .summary-errors > ul');
            }

            // Hide the default message
            // $field.data('fv.messages') returns the default element containing the messages
            data.element
              .data('fv.messages')
              .find('.help-block[data-fv-for="' + data.field + '"]')
              .hide();
        })
        .on('success.field.fv', function (e, data) {
            // Remove the field messages
            $('#' + data.fv.$form[0].id + ' > .summary-errors > ul').find('li[data-field="' + data.field + '"]').remove();
            var formfv = $(".wizard-pane.active").find("form");

            if (formfv.length == 0) {
                formfv = $(".panel > .panel-body > .tab-content.tab-border > .tab-pane.active > form");
            }

            var fvv = formfv.data('formValidation');

            if (fvv != undefined && fvv != "undefined") {
                if (fvv.isValid()) {
                    $('#' + data.fv.$form[0].id + ' > .summary-errors').hide();
                }
            }

        });

    }

}

function sharpGrid(containerID) {
    //define a tabela
    var table = $("#" + containerID + "_table table");
    //marcação nas linhas para que a paginação contabilize todas as linhas inicialmente
    $("#" + containerID + "_table table tbody tr").addClass("filtered");
    //funcao que atribui o mecanismo de search nos campos da tabela
    sharpGridSearch(containerID);
    sharpGridPager(containerID);
    //atribuição de evento onde, ao incluir ou excluir itens da tabela, sejam novamente chamadas as funcoes de paginacao e edicao
    if (table) {
        table.bind('DOMNodeInserted DOMNodeRemoved',
            function (event, item) {
                sharpGridPager(containerID);
                sharpGridEditor(containerID);

                if (event.type == "DOMNodeInserted") {
                    if (event) {
                        if (event.target) {
                            if (event.target.cells) {
                                if (event.target.cells.length > 0) {
                                    if (event.target.cells[0].children) {
                                        if (event.target.cells[0].children.length > 0) {
                                            if (event.target.cells[0].children[0].children.length > 0) {
                                                var input = event.target.cells[0].children[0].children[0].id;
                                                if (input) {
                                                    carregaIcheckCheckBox(input);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
    }
}

function sharpGridSearch(containerID) {

    var table = $("#" + containerID + "_table table");
    var classSharpGrid;
    var idSharpGrid;
    var divSharpGrid;
    var inputSearch;

    classSharpGrid = "sharpGrid";
    idSharpGrid = containerID + "_sharpGrid";
    idSearchBox = containerID + "_searchBox";

    if (!$("#" + idSharpGrid).length) {
        divSharpGrid = "<div class=\"fixed-table-body " + classSharpGrid + "\" id=\"" + idSharpGrid + "\" ></div>";

        inputSearch = "<div class=\"searchBox\">"
        inputSearch += "<div class='form-group' style=\"height:35px;\">"
        inputSearch += "<div class='control-group col-md-3' style=\"padding: 0; position: absolute; right: 10px;\">"

        inputSearch += "<input data-serializable='false' placeholder=\"Buscar...\" id=\"" + idSearchBox + "\" type=\"text\" class='form-control'/>"

        inputSearch += "</div>"
        inputSearch += "<label class='col-md' style=\"position:absolute;right: 15px; z-index: 1; top: 15px;\"><i class='fa fa-search'></i></label>"
        inputSearch += "</div>"
        inputSearch += "</div>"




        table.wrap(divSharpGrid);
        $("#" + idSharpGrid).prepend(inputSearch)
        jQuery.expr[':'].contains = function (a, i, m) {
            return jQuery(a).text().toUpperCase()
                .indexOf(m[3].toUpperCase()) >= 0;
        };
        $("#" + idSearchBox).on("keyup", function () {
            var term = $(this).val()
            var listCell = table.find("td:contains(\'" + term + "\')").not(".no-search");
            var ind = [];
            listCell.each(function (i) {
                ind.push($(this).parent("tr"));
            })
            $("#" + containerID + "_table table tbody" + " tr").hide();
            if (ind.length) {
                $("#" + containerID + "_table table tbody" + " tr").removeClass("filtered");
                for (var i = 0; i < ind.length; i++) {
                    $(ind[i]).addClass("filtered");
                }
            }
            else {
                if (term.length > 0) {
                    $("#" + containerID + "_table table tbody" + " tr").removeClass("filtered");

                }
                else {
                    $("#" + containerID + "_table table tbody" + " tr").addClass("filtered");
                }
            }
            $("#" + containerID + "_table table tbody" + " tr.filtered").show();
            sharpGridPager(containerID);
        });
        sharpGridPager(containerID);
    }
}

function sharpGridPager(containerID) {
    var pageactive = $("[activepage='" + containerID + "_true']").html();
    var activeobject = $("[activepage='" + containerID + "_true']");

    $("#" + containerID + "_table").find(".pager").remove();

    var table = $("#" + containerID + "_table table")

    var currentPage = 0;

    if (pageactive) {
        currentPage = parseInt(pageactive)
        currentPage = currentPage - 1;
    }
    var numPerPage = 10;
    var numPage = $("#" + containerID + "_table").attr("data-numberpage");
    if (numPage) {
        numPerPage = numPage;
    }

    var $table = table;

    $table.bind('repaginate', function () {
        $table.find('tbody tr.filtered').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();


    });

    $table.trigger('repaginate');
    var numRows = $table.find('tbody tr.filtered').length;
    var numPages = Math.ceil(numRows / numPerPage);
    var $pager = $('<div class="pager"></div>');

    for (var page = 0; page < numPages; page++) {
        $('<span class="page-number btn btn-default"></span>').text(page + 1).bind('click', {
            newPage: page
        }, function (event) {
            currentPage = event.data['newPage'];
            $table.trigger('repaginate');
            $(this).siblings().attr("activepage", containerID + "_false");
            $(this).siblings().attr("numberpage", currentPage);
            $(this).addClass('active')
                .switchClass("btn-default", "btn-primary", 1000, "easeInOutQuad")
                .siblings()
                .removeClass('active')
                .switchClass("btn-primary", "btn-default", 1000, "easeInOutQuad");

            $(this).attr("activepage", containerID + "_true");
            $(this).attr("numberpage", currentPage);
        }).appendTo($pager).addClass('clickable');
    }

    if (numPages > 0) {
        //$pager.insertAfter($table).find('span.page-number:first').addClass('active')
        //            .switchClass("btn-default", "btn-primary", 1000, "easeInOutQuad");

        $pager.insertAfter($table).find('span.page-number')
                          .switchClass("btn-default", "btn-default", 1000, "easeInOutQuad");

        if ($pager) {
            if ($pager.length > 0) {
                if ($pager[0].children) {
                    if ($pager[0].children.length > 0) {
                        var classList = $pager[0].children;
                        for (i = 0; i < classList.length; i++) {
                            if ($(classList[i]).html() == (currentPage + 1).toString()) {
                                $(classList[i]).attr("activepage", containerID + "_true");
                                $(classList[i]).addClass("active");
                                $(classList[i]).addClass("btn-primary")
                            }
                        }
                    }
                }
            }
        }
    }

    var btnnovodisabled = $("#" + containerID + "_btnnovo").hasClass("disabled");
    if (btnnovodisabled) {
        $("." + containerID.replace("_nav", "").replace("table_", "") + "_edit").addClass("disabled");
    } else {
        $("." + containerID.replace("_nav", "").replace("table_", "") + "_edit").removeClass("disabled");
    }
}

function sharpGridEditor(containerID) {
    var container = $("#" + containerID)
    var table = $("#" + containerID + "_table table tbody")
    var cells = table.find("td:not(.buttons)");
    cells.off();
    for (var i = 0; i < cells.length; i++) {
        $(cells[i]).on("click", function (e) {
            $(document).one('click', function () {
                sharpGridEditorClearCells(table)
            });
            if (!$(this).hasClass("editing")) {
                sharpGridEditorClearCells(table);
                $(this).addClass("editing")
                var cell = $(this)
                var cellData = $(this).find(".cellData")[0];
                controlID = cell.attr("data-controlid");
                var registerid = cell.attr("data-registerid");
                controle = container.find(
                    "input[data-controlid='" + controlID + "']," +
                    "select[data-controlid='" + controlID + "']," +
                    "textarea[data-controlid='" + controlID + "']" +
                    "span[data-controlid='" + controlID + "']"
                    ).not(".inlineEditor");


                if (controle.length) {
                    var newID = controle[0].id + "_inlineEditor";
                    var cellForm = $("<form  class=\"input-group sharpGridEditor\"></form>")
                    var cellFormID = controle[0].id + gerarGUID();
                    var buttonSave = $("<span id= " + controle[0].id + "_button  class=\"input-group-btn\"><a id='" + controlID + "_btngrid' href=\"#\" onclick=\"javascript:sharpGridEditorSave(this);\" class=\"btn btn-primary\"><i class=\"fa fa-save\"></i></a></span>");
                    cellForm.attr("id", cellFormID).addClass("inlineEditor");
                    cell.prepend(cellForm);
                    cellForm = $("#" + cellFormID);
                    switch (controle[0].type) {
                        case "text":
                            var control = controle;
                            controle = $(controle[0]).clone(true);


                            if (controle.length > 0) {
                                controle[0].id = newID;
                                var classe = controle[0].className;
                                controle[0].className = classe.replace("hidden", "");
                                $(controle[0]).attr("data-registerid", registerid);
                                value = $(cellData).text();
                                controle.val(value)
                                controle.keyup();
                                $(cellData).hide()


                                if ($(control[0]).attr("data-controlinputtype") == "TEXTCURRENCY") {
                                    var buttonCurrency = $(control[0]).parent().find("span").clone(true);
                                    if (buttonCurrency) {
                                        if (buttonCurrency.length > 0) {
                                            cellForm.prepend(buttonCurrency[0]);
                                            var panelCurrency = $("#" + $(control[0]).attr("id") + "_panel").clone(true);
                                            if (panelCurrency) {
                                                if (panelCurrency.length > 0) {
                                                    //var div = "<div id='" + $(control[0]).attr("id") + "_div'></div>";
                                                    var div = "<div class='' id='" + $(control[0]).attr("id") + "_div' style='position:absolute;z-index:100000; padding: 8px;'></div>";
                                                    cellForm.prepend(div);
                                                    $("#" + $(control[0]).attr("id") + "_div").prepend(panelCurrency[0]);

                                                }
                                            }
                                        }
                                    }
                                }


                                cellForm.prepend(controle);
                                cellForm.attr("control-type", "text")
                            }


                            break;
                        case "email":
                        case "password":
                            controle = $(controle[0]).clone(true);
                            if (controle.length > 0) {
                                controle[0].id = newID;
                                var classe = controle[0].className;
                                controle[0].className = classe.replace("hidden", "");
                                $(controle[0]).attr("data-registerid", registerid);
                                value = $(cellData).text();
                                controle.val(value)
                                controle.keyup();
                                $(cellData).hide()

                                cellForm.prepend(controle);
                                cellForm.attr("control-type", "text")
                            }

                            break;
                        case "checkbox":
                            controle = $(controle[0]).clone(true);
                            controle[0].id = newID;
                            $(controle[0]).removeClass()
                            controle[0].removeAttribute("style");
                            value = $(cellData).html();
                            value = (value == '<i class="fa fa-check"></i><span></span>') ? true : false;
                            $(cellData).hide()
                            var cellFormBackup = cellForm[0].outerHTML;
                            $(controle).className = "form-control";
                            $(controle).removeClass("hidden");
                            $(controle[0]).attr("data-registerid", registerid);
                            cellForm.prepend("<div></div>").prepend(controle);
                            carregaIcheckCheckBox(newID)

                            if (value) {
                                $("#" + newID).iCheck('check');
                            }
                            $("#" + newID).parent("div").wrap(cellFormBackup);

                            cellForm.attr("control-type", "checkbox")
                            break;
                        case "select-one":
                            controle = $(controle[0]).clone(true);
                            controle[0].id = newID;
                            value = $(cellData).text();
                            controle.find("option").filter(function () {
                                return $(this).text() === value;
                            }).attr("selected", "selected");
                            $(cellData).hide()
                            $(controle).className = "form-control";
                            $(controle).removeClass("hidden");
                            $(controle[0]).attr("data-registerid", registerid);
                            cellForm.prepend(controle);
                            cellForm.attr("control-type", "select")
                            break;
                        default:

                    }
                    $("#" + cellFormID).append(buttonSave);
                }
            }
            else {
                e.stopPropagation();
                return false;
            }
            e.stopPropagation();
            return false;
        })
    }
}

//função para editar o span
function showMessage() {
    var message = jQuery("#textToDisplay").text();
    jQuery("span[data-controlid='67a2a4e3-940b-4216-a296-0a9719319b0b']").text(message);
}

function sharpGridEditorClearCells(table) {
    var cellEditing = table.find("td.editing");
    cellEditing = $(cellEditing[0]);
    cellEditing.find(".cellData").show()
    cellEditing.find(".inlineEditor input[type=checkbox]").iCheck('destroy')
    cellEditing.find(".inlineEditor").remove()
    cellEditing.removeClass("editing")
}

function sharpGridEditorSave(button) {
    var cell = $(button).parents("td");
    var cellControlType = cell.attr("control-type");
    var data = new Array();
    var sendData;
    var controle = cell.find("input,select,textarea");
    var table = cell.parents("table");
    var newValue;
    var newValuePrint;
    var cellData = cell.find(".cellData")[0];
    var url;
    var enterpriseID = returnCookie("EnterpriseID");
    var userId = returnCookie("UserID");

    if (controle[0].type == "checkbox") {
        if ($(controle[0]).is(":checked")) {
            newValue = true;
            newValuePrint = "<i class=\"fa fa-check\"></i>"
        }
        else {
            newValue = false;
            newValuePrint = "<i class=\"fa fa-times\"></i>";
        }
    } else if (controle[0].type == "select-one") {
        newValue = controle.val();
        options = controle.find("option[value='" + newValue + "']");
        newValuePrint = options.html();
    } else {
        newValue = controle.val();
        newValuePrint = newValue;
    }
    data[0] = new Object();
    data[0].field = $(controle[0]).attr("data-field");
    data[0].table = $(controle[0]).attr("data-table");
    data[0].oldValue = new Array()
    data[0].oldValue[0] = newValue;
    data[0].newValue = new Array();
    data[0].newValue[0] = newValue;
    data[0].nativeDataType = $(controle[0]).attr("data-nativeDataType");
    data[0].EnterpriseID = enterpriseID;
    data[0].layoutID = cell.attr("data-layoutID");
    data[0].UserID = userId
    data[1] = new Object();
    data[1].field = "id";
    data[1].table = $(controle[0]).attr("data-table");
    data[1].oldValue = new Array()
    data[1].oldValue[0] = cell.attr("data-registerID");
    data[1].newValue = new Array();
    data[1].newValue[0] = cell.attr("data-registerID");
    data[1].nativeDataType = "ID";
    data[1].layoutID = cell.attr("data-layoutID");
    data[1].EnterpriseID = enterpriseID;
    data[1].UserID = userId

    sendData = JSON.stringify(data);
    url = getGlobalParameters("urlPlataforma") + "/api/database/WriteData";
    postAjaxParameter(enterpriseID, url, sendData,
        function (result) {
            $(cellData).html(newValuePrint);
            var message = result[0].message[0].title[0].text;
            //notification({ messageText: message, messageTitle: "OK", fix: false, type: "ok", icon: "thumbs-up" });
            /////BUG/////
            //Chamando apenas uma vez a função não funciona, por isso a chamada esta duplicada
            sharpGridEditorClearCells(table);
            sharpGridEditorClearCells(table);
        },
        function () {
            //notification({ messageText: "falha no processamento", messageTitle: "Desculpe!", fix: false, type: "warning", icon: "thumbs-down" });
            /////BUG/////
            //Chamando apenas uma vez a função não funciona, por isso a chamada esta duplicada
            sharpGridEditorClearCells(table);
            sharpGridEditorClearCells(table);
        });

}

function selecionaTodos(containerID) {
    if ($('[style="display: table-row;"]').length > 0) {
        if ($('[style="display: table-row;"]')[0].children[0].children[0].children[0].className == "icheckbox_flat-blue selected checked") {

            for (var i = 0; i < $('[style="display: table-row;"]').length; i++) {
                $('[style="display: table-row;"]')[i].children[0].children[0].children[0].className = "icheckbox_flat-blue"
            }
            $('[class="jsgrid-align-center"]')[0].children[0].className = "icheckbox_flat-blue"
            return;
        }
    }

    for (var i = 0; i < $('[style="display: table-row;"]').length; i++) {
        $('[style="display: table-row;"]')[i].children[0].children[0].children[0].className = "icheckbox_flat-blue selected checked"
    }
    $('[class="jsgrid-align-center"]')[0].children[0].className = "icheckbox_flat-blue selected checked"

    var thisTable = $("#" + containerID + "_table")
    if (thisTable.length == 0) {
        thisTable = $("<table></table>");
        thisTable.id = ""
    }

    var table = $(thisTable[0]).find("table");
    var checkbox = table.find("input[type=checkbox]");
    checkbox.each(function () {
        //var checked = $(this).parent('[class*="icheckbox"]').hasClass("checked");
        var checked = $(this).prop("checked");
        if (checked) {
            $(this).iCheck('uncheck');
        } else {
            $(this).iCheck('check');
        }

    });

}

function ExcluirPedidoCompra(idCompra, obj) {

    result = confirm("Deseja excluir este documento?", function () {

        swal({
            title: "Digite um motivo para o cancelamento da compra",
            text: "",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: true,
            animation: "slide-from-top",
            inputPlaceholder: "Motivo do cancelamento"
        },
function (inputValue) {
    if (inputValue === false) return false;

    if (inputValue === "") {
        swal.showInputError("Digite um motivo de cancelamento.");
        return false
    }


    var Dados = "";
    Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID");
    Dados = Dados + "&Class=PedCompra&Function=ExcluirCompraC";
    Dados = Dados + "&ValueParameters[0]=" + inputValue;
    Dados = Dados + "&ValueParameters[1]=" + returnCookie("UserID");
    Dados = Dados + "&ValueParameters[2]=" + idCompra;
    Dados = Dados + "&ValueParameters[3]=" + returnCookie("EnterpriseID");
    var parameters = new Object();
    parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompiler";
    parameters.dados = Dados;
    parameters.async = false;
    parameters.type = "GET";

    var result = AjaxParameter(parameters);

    if (result) {
        if (result.title) {
            if (result.title.length > 0) {
                if (result.success == true) {
                    notification({ messageTitle: result.title[0].text, messageText: result.title[0].toolTip, fix: false, type: "ok", icon: "thumbs-up" });

                    var objTR = obj.parentNode.parentNode;
                    var objTable = objTR.parentNode;
                    var indexTR = objTR.rowIndex;
                    indexTR = indexTR - 1;
                    objTable.deleteRow(indexTR);
                } else {
                    notification({ messageTitle: result.title[0].text, messageText: result.title[0].toolTip, fix: false, type: "warning", icon: "thumbs-down" });
                }
            }
        }
    }
    //swal("Nice!", "You wrote: " + inputValue, "success");
});

    }, function () {

    });
}

function ExcluirPedidoVenda(idVenda, obj) {
    var Dados = "";
    Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID");
    Dados = Dados + "&Class=ClassVenda&Function=EstornaPedidoVendaC";
    Dados = Dados + "&ValueParameters[0]=" + idVenda;

    var parameters = new Object();
    parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompiler";
    parameters.dados = Dados;
    parameters.async = false;
    parameters.type = "GET";

    var result = AjaxParameter(parameters);
    if (result.success) {
        notification({ messageTitle: result.title[0].text, messageText: result.title[0].toolTip, fix: false, type: "ok", icon: "thumbs-up" });

        var objTR = obj.parentNode.parentNode;
        var objTable = objTR.parentNode;
        var indexTR = objTR.rowIndex;
        indexTR = indexTR - 1;
        objTable.deleteRow(indexTR);
        return;
    }
    else {
        notification({ messageTitle: result.title[0].text, messageText: result.title[0].toolTip, fix: false, type: "error", icon: "thumbs-down" });
        return;
    }

    //var existeNotaFiscal = result;

    //swal({
    //    title: "Deseja excluir o documento?",
    //    text: existeNotaFiscal ? "Existe uma nota fiscal vinculada ao pedido. Ela será cancelada e estornaremos todas as operações já efetuada em estoque e financeiro." : "",
    //    type: "warning",
    //    showCancelButton: true,
    //    confirmButtonColor: "#DD6B55",
    //    confirmButtonText: "Sim",
    //    cancelButtonText: "Não",
    //    closeOnConfirm: false
    //},
    //function () {
    //    var motivo = "";
    //    if (existeNotaFiscal) {
    //        swal({
    //            title: "Digite um motivo para o cancelamento da venda",
    //            text: "",
    //            type: "input",
    //            showCancelButton: true,
    //            closeOnConfirm: false,
    //            animation: "slide-from-top",
    //            inputPlaceholder: "Motivo do cancelamento"
    //        },
    //		function (inputValue) {
    //		    if (inputValue === false) return false;

    //		    if (inputValue === "") {
    //		        swal.showInputError("Digite um motivo de cancelamento.");
    //		        return false
    //		    }

    //		    motivo = inputValue;

    //		    var Dados = "";
    //		    Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID");
    //		    Dados = Dados + "&Class=ClassVenda&Function=ExcluirVendaC";
    //		    Dados = Dados + "&ValueParameters[0]=" + returnCookie("EnterpriseID");
    //		    Dados = Dados + "&ValueParameters[1]=" + motivo;
    //		    Dados = Dados + "&ValueParameters[2]=" + returnCookie("UserID");
    //		    Dados = Dados + "&ValueParameters[3]=" + idVenda;

    //		    var parameters = new Object();
    //		    parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompiler";
    //		    parameters.dados = Dados;
    //		    parameters.async = false;
    //		    parameters.type = "GET";

    //		    var result = AjaxParameter(parameters);

    //		    if (result) {
    //		        if (result.title) {
    //		            if (result.title.length > 0) {
    //		                if (result.success == true) {
    //		                    notification({ messageTitle: result.title[0].text, messageText: result.title[0].toolTip, fix: false, type: "ok", icon: "thumbs-up" });

    //		                    var objTR = obj.parentNode.parentNode;
    //		                    var objTable = objTR.parentNode;
    //		                    var indexTR = objTR.rowIndex;
    //		                    indexTR = indexTR - 1;
    //		                    objTable.deleteRow(indexTR);
    //		                } else {
    //		                    notification({ messageTitle: result.title[0].text, messageText: result.title[0].toolTip, fix: false, type: "warning", icon: "thumbs-down" });
    //		                }

    //		                swal(result.title[0].text, result.title[0].toolTip, result.success ? "success" : "error");
    //		            }
    //		        }
    //		    }
    //		});
    //    }
    //    else {
    //        var Dados = "";
    //        Dados = Dados + "EnterpriseID=" + returnCookie("EnterpriseID");
    //        Dados = Dados + "&Class=ClassVenda&Function=ExcluirVendaC";
    //        Dados = Dados + "&ValueParameters[0]=" + returnCookie("EnterpriseID");
    //        Dados = Dados + "&ValueParameters[1]=" + motivo;
    //        Dados = Dados + "&ValueParameters[2]=" + returnCookie("UserID");
    //        Dados = Dados + "&ValueParameters[3]=" + idVenda;

    //        var parameters = new Object();
    //        parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompiler";
    //        parameters.dados = Dados;
    //        parameters.async = false;
    //        parameters.type = "GET";

    //        var result = AjaxParameter(parameters);

    //        if (result) {
    //            if (result.title) {
    //                if (result.title.length > 0) {
    //                    if (result.success == true) {
    //                        notification({ messageTitle: result.title[0].text, messageText: result.title[0].toolTip, fix: false, type: "ok", icon: "thumbs-up" });

    //                      
    //                    } else {
    //                        notification({ messageTitle: result.title[0].text, messageText: result.title[0].toolTip, fix: false, type: "warning", icon: "thumbs-down" });
    //                    }

    //                    swal(result.title[0].text, result.title[0].toolTip, result.success ? "success" : "error");
    //                }
    //            }
    //        }
    //    }
    //});
}


function DevolucaoPedidoCompra(idCompra, obj) {
    var id = "";
    var typeOpeningLayout = "";
    var nameLayout = "lydevolucaocompra";
    var layoutID = "75b2f34b-ef4c-409e-a1a6-60f8c35efcd2";
    var titleMenu = "Devolução de Compra";
    var forcingTemplate = "";
    var enterpriseID = returnCookie("EnterpriseID"); //"f1495bcf-9258-4245-8edf-d0fac225412d";
    var containerType = "";
    var dados = "&paramReferenceID=ba4d4b6e-4d4e-4c12-a258-1dcd46a8c250&filtro=" + idCompra; //b7bf8d30-0305-4f34-96cf-6ce290ed4d51
    dados += "&enterpriseID=" + enterpriseID;

    result = confirm("Será realizada uma devolução de compra. Deseja confirmar?", function () {
        CreateAba(nameLayout, layoutID, titleMenu, dados, false, containerType, forcingTemplate)
    }, function () {

    });
}

function LiberaDescontoVenda(valueID) {

    window.sessionStorage.setItem('__id_venda__' + returnCookie("UserID"), valueID);
    var dados = "&enterpriseID=" + returnCookie("EnterpriseID");
    CreateAba('Libera Desconto Venda', 'c2861107-ccfc-4ea1-a19b-cad9a3772511', 'Liberar Desconto Venda', dados, false, 'MODAL');
    $.magnificPopup.close();





}

function DevolucaoPedidoVenda(idVenda, obj) {
    var id = "";
    var typeOpeningLayout = "";
    var nameLayout = "lydevolucaovenda";
    var layoutID = "cc5cc016-b06c-433e-b2bf-224e561a6208";
    var titleMenu = "Devolução de venda";
    var forcingTemplate = "";
    var enterpriseID = returnCookie("EnterpriseID"); //"f1495bcf-9258-4245-8edf-d0fac225412d";
    var containerType = "";
    var dados = "&paramReferenceID=8862f239-5eb7-45dd-8f7e-0ad90fc1e9ea&filtro=" + idVenda;
    dados += "&enterpriseID=" + enterpriseID;

    result = confirm("Será realizada uma devolução de venda. Deseja confirmar?", function () {
        CreateAba(nameLayout, layoutID, titleMenu, dados, false, containerType, forcingTemplate)
    }, function () {

    });
}



function addRowCard(containerID, controls, navigation, clearFormIgnore) {

    var visibleGrid = [];
    var c = "";
    var valueID = "";
    var referenceID = "";
    var lines = "";
    var layoutID = $("#" + containerID).attr("layoutid");
    var buttons = gridButtons[containerID + "_table"];
    var onLostFocusName = "";
    var onClickName = "";
    var onFocusName = "";
    var onChangeName = "";
    var onKeyPressName = "";
    var scriptEvents = "";

    var tabgencardnew = gerarGUID();
    $("#" + containerID + "_table").hide();

    var tabs = "";
    tabs += "<div id='content_" + containerID + "' class='content'>";
    tabs += "   <ul id='controls-tabs' class='profile-tab nav nav-tabs'>";
    tabs += "       <li class='active'>";
    tabs += "           <a href='#" + containerID + "_card' data-toggle='tab'>Conciliação Bancária";
    tabs += "	        </a>";
    tabs += "	    </li>";

    tabs += "       <li class=''>";
    tabs += "           <a href='#" + tabgencardnew + "' data-toggle='tab'><i class='fa fa-plus-circle'></i>";
    tabs += "	        </a>";
    tabs += "	    </li>";

    tabs += "   </ul>";
    //tabs += "</div>";
    ClearForm(containerID, false);
    var containertab = "<div  class='panel-footer' id='" + tabgencardnew + "_intern'></div>";//$("#" + containerID + "_panel").html();
    //$("#" + containerID + "_panel").remove();
    var tabnew = "<div class='tab-pane fade in controls-recipient panel-footer' id='" + tabgencardnew + "'>" + containertab + "</div>";
    var template = $("#" + containerID + "_table").attr("data-template");
    if (template == "GRID") {
        tabs = "";
        tabnew = "";
    }



    var table = tabs + "<ul class='droptrue'  id='" + containerID + "_card' class='panel-footer ' style='padding:1%;list-style-type:none;'></ul>" + tabnew;
    table += "</div>";

    var buttons = gridButtons[containerID + "_table"];
    var defaultcolumn = "";
    var onLostFocusName = "";
    var onClickName = "";
    var onFocusName = "";
    var onChangeName = "";
    var onKeyPressName = "";

    var scriptEvents = "";

    var data = [];
    var row;
    var card = "";
    var interncard = "";
    var li = "";
    var parameters = "";

    var recipient = "#" + containerID + " .panel-body";
    $(recipient).prepend(table);

    var formtab = $("#" + containerID + "_panel");
    var newtab = $("#" + tabgencardnew);

    if (newtab) {
        if (newtab.length > 0) {
            formtab.clone().appendTo(newtab);

            var elem = $("#content_" + containerID).find("#content_" + containerID);

            if (elem) {
                if (elem.length > 0) {
                    elem[0].remove();
                    var elemcontrol = $("[data-containerid='" + containerID + "']").parent();

                    if (elemcontrol) {
                        if (elemcontrol.length > 0) {
                            var arraycontrol = [];
                            for (var i = 0; i < elemcontrol[0].children.length; i++) {
                                if (elemcontrol[0].children[i].id.indexOf(containerID) == -1) {
                                    arraycontrol.push(elemcontrol[0].children[i]);
                                }
                            }

                            for (var i = 0; i < arraycontrol.length; i++) {
                                arraycontrol[i].remove();
                            }
                            //var elementdiv = $(elemcontrol[0].children).find("div:not([id*='" + containerID + "'])");
                        }
                    }

                }
            }
        }
    }


    var element;

    for (var i2 = 0; i2 < controls.length; i2++) {
        if (controls[i2].controlID) {
            element = $("#" + containerID + "_sharpGrid").find("[data-controlid='" + controls[i2].controlID + "']");

            if (element) {
                if (element.length > 0) {
                    break;
                }
            }
        }
    }

    if (element) {
        if (element.length == 0) {
            controls = null;
        }
    }

    if (controls) {
        if (controls.length > 0) {

            for (var i = 0; i < controls[0].newValue.length; i++) {
                var status;
                var ActionText;
                var defaultcolumn = "";
                for (var i2 = 0; i2 < controls.length; i2++) {
                    if (controls[i2].field == "id") {
                        valueID = controls[i2].newValue[i];
                        referenceID = controls[i2].propertyID;
                        break;
                    }
                    if (controls[i2].placeholder == "Status") {
                        status = controls[i2];
                    }
                    if (controls[i2].table != "null") {
                        table = controls[i2].table;
                    }
                }


                if (buttons.length > 0) {
                    for (var j = 0; j < buttons.length; j++) {

                        if (buttons[j].onLostFocusName) {
                            onLostFocusName = buttons[j].onLostFocusName;
                        }
                        if (buttons[j].onClickName) {
                            onClickName = buttons[j].onClickName;
                        }
                        if (buttons[j].onFocusName) {
                            onFocusName = buttons[j].onFocusName;
                        }
                        if (buttons[j].onChangeName) {
                            onChangeName = buttons[j].onChangeName;
                        }
                        if (buttons[j].onKeyPressName) {
                            onKeyPressName = buttons[j].onKeyPressName;
                        }
                        if (buttons[j].scriptEvents) {
                            scriptEvents = buttons[j].scriptEvents;
                        }


                        switch (buttons[j].controlType) {
                            case "BUTTONGRID":
                                defaultcolumn += "<span class='col-md-2' style='padding:4%;'><a " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='btn btn-primary' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='button' id='" + buttons[j].id + "_" + gerarGUID();
                                defaultcolumn += " ' onblur='" + onLostFocusName + "' onclick='" + onClickName + "(this)' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'>" + buttons[j].titulo + " </a>";
                                defaultcolumn += "<script>" + scriptEvents + " </script></span>";
                                break;
                            case "CHECKBOXGRID":
                                var check = "unchecked";
                                if (controls[0].texto) {
                                    check = controls[0].texto[i];
                                    if (check == "true") {
                                        check = "checked";
                                    }
                                }
                                //disabled
                                var disabled = "";
                                if (controls[0].disabled) {
                                    disabled = controls[0].disabled[i];
                                    if (disabled == "true") {
                                        disabled = "disabled";
                                    }
                                }
                                //color do checkbox padrão azul.
                                var color = "";
                                if (controls[0].color) {
                                    color = controls[0].color[i];
                                    if (color == "" || color == "null") {
                                        color = "blue";
                                    }
                                }
                                else {
                                    color = "blue";
                                }

                                defaultcolumn += "<span class='col-md-1' style='padding:4%;'><input " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='icheck-grey' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='checkbox' id='" + buttons[j].id + "_" + gerarGUID() + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'/>";
                                defaultcolumn += "  ";
                                defaultcolumn += "<script>" + scriptEvents + " </script></span>";

                                break;
                            default:
                        }
                    }
                }


                if (defaultcolumn) {
                    card += defaultcolumn;
                }

                for (var i2 = 0; i2 < controls.length; i2++) {

                    dadoCelula = (controls[i2].newValue[i]) ? controls[i2].newValue[i] : "";

                    if (controls[i2].nativeDataType == "SimNao") {
                        if (dadoCelula == true || dadoCelula == "true" || dadoCelula == "True" || dadoCelula == "TRUE") {
                            dadoCelula = '<i class="fa fa-check"></i>';
                            isCentered = "class=\"text-center\"";
                        };
                        if (dadoCelula == false || dadoCelula == "false" || dadoCelula == "False" || dadoCelula == "FALSE") {
                            dadoCelula = '<i class="fa fa-times"></i>';
                            isCentered = "class=\"text-center\"";
                        };
                    }
                    if (controls[i2].controlType == "DROPDOWN" || controls[i2].controlType == "DROPDOWNDSG") {
                        dadoCelula = controls[i2].textList[controls[i2].valueList.indexOf(dadoCelula)]
                    }
                    if (controls[i2].controlType == "AUTOCOMPLETE") {
                        dadoCelula = (controls[i2].text[i]) ? controls[i2].text[i] : controls[i2].newValue[i];
                    }

                    parameters = "id='" + controls[i2].controlID + "_" + valueID + "' " +
                    "data-controlid='" + controls[i2].controlID + "' " +
                    "data-field='" + controls[i2].field + "' " +
                    "data-table='" + controls[i2].table + "' " +
                    "data-nativeDataType='" + controls[i2].nativeDataType + "' " +
                    "data-derivedFrom='" + controls[i2].derivedFrom + "' " +
                    "data-registerID='" + dadoCelula + "'" +
                    "data-newvalue='" + dadoCelula + "'" +
                    "data-layoutID='" + dadoCelula + "'";

                    var sizespan = 3;

                    if (controls.length) {
                        if (controls.length > 0) {
                            if (controls.length <= 4) {
                                sizespan = 12 / controls.length;
                            } else {
                                sizespan = 3;
                            }
                        }
                    }

                    var style = "";
                    if (controls.length == (i2 + 1) && (controls.length >= 2 && controls.length <= 4)) {
                        style = "text-align: right;";
                    } else if (controls.length < 4 && (i2 + 1) == 4) {
                        style = "text-align: right;";
                    } else if (controls.length > 4 && (i2 + 1) == 4) {
                        style = "text-align: right;";
                        sizespan = 2;
                    }

                    var titulo = "";
                    if (controls[i2].placeholder) {
                        titulo = controls[i2].placeholder;
                    }

                    var totalcol = 5;

                    if (defaultcolumn) {
                        totalcol = 4;
                    }

                    var classe = "";

                    if (controls[i2].visibleGrid == "true") {
                        classe += "child";
                    } else {
                        style += "display:none";
                    }

                    if ((i2) < totalcol) {
                        card += "<span " + parameters + " class='col-md-" + sizespan + "' style='padding:4%;font-size: larger;" + style + "' visibleGrid='" + controls[i2].visibleGrid + "'>" + dadoCelula + "</span>";
                    } else {
                        if (titulo) {
                            titulo = titulo + ": ";
                        }
                        interncard += "<h6 " + parameters + " class='col-md-12 " + classe + "' style='font-size: larger;" + style + "' visibleGrid='" + controls[i2].visibleGrid + "'>" + titulo + dadoCelula + "</h6>";
                    }
                }

                li += "<div id=id" + i + " style='border-radius:0px;border:1px solid #f5f5f5; background-color: rgb(251, 251, 251);' class='panel-body draggable parent" + containerID + " '>" + card + " " + interncard + "</div>";


                card = "";
                interncard = "";
            }
        }
    }

    $("#" + containerID + "_card").html(li);
    $("#" + containerID + "_card").addClass("panel-footer");
    $("#" + containerID + "_card").attr("style", "padding:1%");

    var code = "";

    code += "<script>";

    $('.child').hide();


    $(".parent" + containerID).click(function () {
        $(this).siblings('.parent' + containerID).find('.child').slideUp();
        $(this).find('.child').slideToggle();
    });

    $("ul.droptrue").sortable({
        connectWith: "ul"
    });

    $("ul.dropfalse").sortable({
        connectWith: "ul",
        dropOnEmpty: false
    });



    code += "</script>";



    $("#" + containerID + "_card").append(code);

    $("#" + containerID + "_table").hide();


    var contador = 0;
    //$("input.icheck-grey").each(function () {
    //    var idcheckbox = this.id;
    //    var cor = $("#" + idcheckbox).attr("data-color");
    //    contador = contador + 1;
    //    carregaIcheckCheckBoxColor(idcheckbox, cor);
    //    var eventClick = $("#" + idcheckbox).attr("onclick");
    //    //var namespaces = eventClick.split("(");
    //    var funcName = eventClick; //namespaces[0].replace("(", "");

    //    $("#" + idcheckbox).on('ifClicked', function () {
    //        var args = this;
    //        if (funcName != "" && funcName != undefined && funcName != null) {

    //            executeFunctionByName(funcName, window, args);
    //            //funcName = funcName + "(line)";
    //            //window[funcName](args);
    //            //executeFunctionByName(onClickName + ".");
    //        }
    //    });
    //});

    $("#content_" + containerID).tabs();

    $("ul").removeClass("ui-widget-header");

}
