function createGridAccordion(parameters) {

    var titulo = parameters.titulo;
    var containerID = parameters.containerID;
    var controls = parameters.controls;

    var navigation = parameters.navigation;

    var isVisible = "";
    var indexIdControl;
    var valueID;
    var buttons = [];


    retorno = ""
    retorno += "<div id=\"" + containerID + "_table\" class=\"table-responsive ls-table tableContainer\">";
    retorno += "<table data-toggle=\"table\" class=\"table table-hover table-bordered table-striped table-bottomless ls-animated-table\">";
    retorno += "<thead>";
    retorno += "<tr>";
    retorno += "<th class=\"gridButtons\"><i class=\"fa fa-cog\"></i></th>";

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
        retorno += "data-Field='" + controls[i].field + "' "
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
        retorno += "<th>Ação</th>"
    }
    gridButtons[containerID + "_table"] = buttons;

    retorno += "</tr>";
    retorno += "</thead>";
    retorno += "<tbody>";
    retorno += "</tbody>";
    retorno += "<tfoot>";
    retorno += "<tr><td colspan=\"1000\" style=\"text-align:center\"><i class=\"fa fa-ellipsis-h\"></i></td></tr>";
    retorno += "</tfoot>"
    retorno += "</table>";
    retorno += "</div>";


    recipient = "#" + containerID + " .panel-body";
    $(recipient).prepend(retorno);
    sharpGrid(containerID);
    addRowGridAccordion(containerID, controls, navigation);
}




function addRowGridAccordion(containerID, controls, navigation, clearFormIgnore) {

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


    if (controls.length > 0) {

        for (var i = 0; i < controls[0].newValue.length; i++) {
            var status;
            var ActionText;
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

            lines += "<tbody class=\"table-section active\">";
            lines += "<tr id=\"line_" + i + "_" + containerID + "\" class=\"filtered\">";
            lines += " <td class=\"text-center\"><i class=\"table-section-arrow\"></i></td>";
            lines += " <td class='text-center buttons' data-visibleGrid='true' class='text-center'>";
            lines += " <div class='' style='white-space: nowrap;'>";

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
                                if (status.newValue[i] == "Venda Concluída" || status.newValue[i] == "Parcialmente entregue" || status.newValue[i] == " Orçamento" || status.newValue[i] == "Faturado" || status.newValue[i] == "Em Entrega" || status.newValue[i] == "Cancelada" || status.newValue[i] == "Entregue" || status.newValue[i] == "Separado para entrega") {
                                    lines += "<input " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='icheck-grey' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='checkbox' id='" + buttons[j].id + "_" + gerarGUID() + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'/>";
                                    lines += "  ";
                                    lines += "<script>" + scriptEvents + " </script>";
                                }
                                else {
                                    lines += "<input " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='icheck-grey' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='checkbox' id='" + buttons[j].id + "_" + gerarGUID() + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'/>";
                                    lines += "  ";
                                    lines += "<script>" + scriptEvents + " </script>";

                                }
                            }
                            else {
                                lines += "<input " + check + " " + disabled + " data-color='" + color + "' data-referenceID='" + valueID + "' class='icheck-grey' data-controlID='" + buttons[j].id + "' data-propertyID='" + buttons[j].id + "' type='checkbox' id='" + buttons[j].id + "_" + gerarGUID() + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'/>";
                                lines += "  ";
                                lines += "<script>" + scriptEvents + " </script>";
                            }
                            break;

                        default:

                    }
                }
            } else {
                if (table != "produtos_lancamentos" && table != "venda_produtos_impostos") {
                    lines += CreateButton({ titulo: "", nome: "Edit", tooltip: "editar", onClick: "editGridLine(this,\"" + containerID + "\", \"" + valueID + "\")", classe: "btn btn-xs btn-warning", icone: "<i class=\"fa fa-pencil\"></i>", returnString: true });
                    lines += "  ";
                    lines += CreateButton({ titulo: "", nome: "Delete", tooltip: "excluir", onClick: "deleteRowGrid(this,\"" + containerID + "\", \"" + valueID + "\")", classe: "btn btn-xs btn-danger", icone: '<i class="fa fa-trash-o"></i>', returnString: true });
                }
                if (table == "venda_produtos_impostos") {
                    lines += "<a class=\"btn btn-primary btn-outline popup-modal-ajax\" title=\"Memória de Cálculo\" href=\"http://" + window.location.host + "/WorkFlowVendas/MemoriaCalculo.aspx?id=" + valueID + "\"><i class=\"fa fa-superscript\"></i></a>";
                }
            }

            lines += "</div>";
            lines += "</td>";


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
                    "data-registerID='" + valueID + "'" +
                    "data-layoutID='" + layoutID + "'" +
                    isVisible + " " +
                    isCentered + ">" +
                    "<span class=\"cellData\">" + dadoCelula + "<span>" +
                    "</td>";
            }

            lines += "</tr>";
            lines += "</tbody>";
            lines += "<tbody class=\"table-section\">";
            lines += "</tbody>";



        }

    }
    //remove a classe selecionada da linha
    var selected = $("#" + containerID + "_table table tbody").find("tr.selected")
    if (selected.length) {
        selected.replaceWith(lines);
    }
    else {
        $("#" + containerID + "_table table tbody").append(lines);
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


}