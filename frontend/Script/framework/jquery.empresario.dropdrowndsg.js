function CreateDropDownDSG(parameters) {
    var retorno = "";
    var readonlybool = "";

    //titulo, classe, tamanho, nome, tooltip, valor, text, controlID, propertyID, containerID, 
    //nameLayout, LayoutID, TitleMenu, TypeOpeningLayout, readOnly
    var titulo = parameters.titulo;
    var classe = parameters.classe;
    var tamanho = parameters.tamanho;
    var nome = parameters.nome;
    var tooltip = parameters.tooltip;
    
    var value;
    if (parameters.newValue.length > 0) {
        value = parameters.newValue[0];
    } else {
        value = parameters.defaultValue;
    }

    var text = parameters.text;
    var valueList = parameters.valueList;
    var textList = parameters.textList;
    var controlID = parameters.controlID;
    var propertyID = parameters.propertyID;
    var containerID = parameters.containerID;
    var nameLayout = parameters.nameLayout;
    var layoutID = parameters.layoutID;
    var titleMenu = parameters.titleMenu;
    var typeOpeningLayout = parameters.typeOpeningLayout;
    var readOnly = parameters.readOnly;
    var id = parameters.id;
    var required = (parameters.required == true) ? "required=\"required\"" : "";


    var nativeDataType = parameters.nativeDataType;
    var table = parameters.table;
    var field = parameters.field;
    var sequenceRecording = parameters.sequenceRecording;
    var derivedFrom = parameters.derivedFrom;
    var serializable = parameters.serializable;


    //CreateEvent
    var onLostFocusName = parameters.onLostFocusName;
    var onFocusName = parameters.onFocusName;
    var onKeyPressName = parameters.onKeyPressName;
    var onClickName = parameters.onClickName;
    var onChangeName = parameters.onChangeName;
    

    if (readOnly == true || readOnly == "true") {
        readonlybool = "disabled"
    }


    //retorno = retorno + "<div class='form-group " + classe + " " + tamanho + "'>";
    //retorno = retorno + "<label>" + titulo + "</label>";
    retorno = retorno + "<div class='selectize-control demo-default single'>";
    retorno = retorno + "<div class='selectize-input items not-full has-options input-group'>";

    //retorno = retorno + "    <select Serializable='" + Serializable + "' NativeDataType='" + NativeDataType + "' Table='" + Table + "' Field='" + Field + "' SequenceRecording='" + SequenceRecording + "' DerivedFrom='" + DerivedFrom + "'  data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' nome='" + nome + "' id='" + id + "' class='demo-default' title='" + tooltip + "' " + readonlybool + " >";
    retorno = retorno + "    <select data-oldvalue='' data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' name='" + nome + "' id='" + id + "' onblur='" + onLostFocusName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'" + required + " class='form-control' title='" + tooltip + "' " + readonlybool + " >";

    
    retorno = retorno + "<option value=''>Selecione...</option>";

    if (valueList) {
        for (var i = 0; i < valueList.length; i++) {
            var selected;
            if (valueList[i] == value) {
                selected = " selected='selected'";
            }
            else {
                selected = "";
            }
            retorno = retorno + "        <option value='" + valueList[i] + "' " + selected + ">" + textList[i] + "</option>";
        }

    }
    

    retorno = retorno + "    </select>";
    retorno = retorno + "    <span class='input-group-btn'>";

    retorno = retorno + "    <a onclick=\"javascrpt:FormOpeningDSG('" + id + "','" + typeOpeningLayout + "','" + nameLayout + "','" + layoutID + "','" + titleMenu + "','VERTICAL', '" + globalEnterpriseID + "')\" class=\"btn btn-default\"><i class=\"fa fa-file-o\"></i></a>";
    //retorno = retorno + "    <a onclick=\"javascrpt:CreateAba('" + nameLayout + "','" + LayoutID + "','" + TitleMenu + "')\" class=\"btn btn-default\"><i class=\"glyphicon glyphicon-edit\"></i></a>";
    retorno = retorno + "    <a onclick=\"javascrpt:OpenAbaDSG('" + nameLayout + "','" + layoutID + "','" + titleMenu + "', '" + globalEnterpriseID + "')\" class=\"btn btn-default\"><i class=\"fa fa-pencil\"></i></a>";
    retorno = retorno + "    </span>";
    retorno = retorno + "</div>";
    retorno = retorno + "</div>";
    //retorno = retorno + "</div>";

    //retorno = retorno + "    <div id=\"teste\" class=\"remodal\" data-remodal-id=\"reModal" + nome + "\">";
    //retorno = retorno + "    <h3>Descrições Gerais</h3>";
    ////retorno = retorno + "    <p>";
    ////retorno = "<div class='control-group'>"
    //retorno = retorno + "<div class='controls'>"
    //retorno = retorno + "<label>adicionar item</label>"
    //retorno = retorno + "<input data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' title='" + tooltip + "' type='text' id='" + nome + "' name='" + nome + "' placeholder='" + titulo + "' class='form-control'>"
    //retorno = retorno + "</div>"
    ////retorno = retorno + "</div>"
    ////retorno = retorno + "</p>";
    //retorno = retorno + "<br>";
    //retorno = retorno + "<br>";
    //retorno = retorno + "<a class=\"remodal-cancel ls-red-btn btn\" href=\"#\">Cancelar</a>";
    //retorno = retorno + "<a class=\"remodal-confirm ls-light-green-btn btn\" href=\"#\">OK</a>";
    //retorno = retorno + "</div>";

    containerID = "#" + containerID;
    $(containerID).append(retorno);

    if (value) {
        $("#" + id).attr("data-oldvalue", value)
    }

    EventHideModal(id, controlID, propertyID, parameters);
}

function OpenAbaDSG(nameLayout, layoutID, titleMenu, enterpriseID) {
    var title = titleMenu.replace("%20", " ");
    title = title.replace("%20", " ");
    title = title.replace("%20", " ");
    title = title.replace("%20", " ");
    title = title.replace("%20", " ");
    title = title.replace("%20", " ");


    var dados = "&paramReferenceID=*&filtro=*&enterpriseID=" + enterpriseID;

    CreateAba(nameLayout, layoutID, title, dados);

}

function FormOpeningDSG(id, typeOpeningLayout, nameLayout, layoutID, titleMenu, forcingTemplate, enterpriseID) {
    $('#' + id).attr('EventHide', 'true');
    //FormOpening(TypeOpeningLayout, nameLayout, LayoutID, TitleMenu, ForcingTemplate);
    containerType = "MODAL";
    var dados = "&enterpriseID=" + enterpriseID;
    CreateAba(nameLayout, layoutID, titleMenu, dados, false, containerType, forcingTemplate)
}

function EventHideModal(id, controlID, propertyID, parameters) {
    $('#alertaModalShow').on('hide.bs.modal', function () {
        var ok = $('#' + id).attr('EventHide');
        if (ok == 'true') {
            RefreshDropDown(id, controlID, propertyID, parameters);
            $('#' + id).attr('EventHide', 'false');
        }
    })  
}

function RefreshDropDown(id, controlID, propertyID, parameters) {
    var dados = "controlID=" + controlID + "&propertyID=" + propertyID + "&enterpriseID=" + globalEnterpriseID;
    var url = getGlobalParameters("urlPlataforma") + "/api/render/RefreshDropDown";
    //var url = "http://54.201.159.17/api/render/RefreshDropDown";

    $.ajax({
        type: "get",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'text/plain'
        },
        url: url + "?" + dados,
        dataType: "json",
        cors: true,
        async: true,
        crossDomain: true,
        //data: {
        //    Dados: dados
        //},
        success: function (result) {

            if (result.property) {
                if (result.property.value.length > 0) {
                    var select = document.getElementById(id);

                    var opcoes = [select.options.length];
                    for (var i = 0; i < select.options.length; i++) {
                        opcoes[i] = select.options[i].text;
                    }

                    for (i = 0; i < select.length; i) {
                        select.remove(i);
                        if (select.length == 0) {
                            break;
                        }
                    }

                    for (var i = 0; i < result.property.value.length; i++) {
                        var x = document.getElementById(id);
                        var option = document.createElement("option");
                        option.value = result.property.value[i];
                        option.text = result.property.text[i];
                        x.add(option);
                    }

                    select = document.getElementById(id);

                    for (var i = 0; i < select.options.length; i++) {
                        var text = select.options[i].text;
                        var temTexto = false;
                        for (var y = 0; y < opcoes.length; y++) {
                            if (text == opcoes[y]) {
                                temTexto = true;
                            }
                        }
                        if (temTexto == false) {
                            select.selectedIndex = i;
                            break;
                        }
                    }


                }
            }
            
        },
        error: function (result) {

        }

    });
}