function CreateDateTime(parameters) {
    var retorno
    var readonlybool

    //titulo, classe, tamanho, nome, tooltip, controlID, propertyID, containerID, mask, defaultValue, readOnly
    var titulo = parameters.titulo;
    var classe = parameters.classe;
    var tamanho = "col-md-3";
    var nome = parameters.nome;
    var tooltip = parameters.tooltip;
    var controlID = parameters.controlID;
    var propertyID = parameters.propertyID;
    var containerID = parameters.containerID;
    var mask = parameters.mask;
    var defaultValue = parameters.defaultValue;
    var readOnly = parameters.readOnly;
    var id = parameters.id;

    var nativeDataType = parameters.nativeDataType;
    var table = parameters.table;
    var field = parameters.field;
    var sequenceRecording = parameters.sequenceRecording;
    var derivedFrom = parameters.derivedFrom;
    var serializable = parameters.serializable;

    var value = "";
    if (parameters.newValue.length > 0) {
        value = parameters.newValue[0];
    } else {
        value = parameters.defaultValue;
    }
    if (value == null) {
        value = "";
    }
    if (value.length > 10) {
        value = value.substr(0, 10)
    }

    if (value == "undefined" || value == undefined) {
        value = "";
    }

    //CreateEvent
    var onLostFocusName = parameters.onLostFocusName;
    var onFocusName = parameters.onFocusName;
    var onKeyPressName = parameters.onKeyPressName;
    var onClickName = parameters.onClickName;
    var onChangeName = parameters.onChangeName;

    if (readOnly == true || readOnly == "true") {
        readonlybool = "readonly disabled"
    }

    //retorno = "<div class='form-group col-md-3 " + classe + " " + tamanho + "'>"
    //retorno = retorno + "<label>" + titulo + "</label>"
    retorno = "<div>"

    //retorno = retorno + "<input type='text' data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'   data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "'  id='" + id + "' name='" + nome + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control dateTimePicker " + classe + "' " + readonlybool + ">"
    retorno = retorno + "<input  data-oldvalue='' data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "' value='" + value + "' data-mask='" + mask + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "'  id='" + id + "' name='" + nome + "' placeholder='" + titulo + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control " + classe + "' " + readonlybool + " >"

    retorno = retorno + "</div>"

    containerID = "#" + containerID;
    $(containerID).append(retorno);

    carregaDateTimePicker(id);

    //if (Value != null && Value != "" && Value != undefined) {
    $("#" + id).val(value);
    //} else {
    //    $("#" + id).val(defaultValue);
    //}

    if (mask != "" && mask != null && mask != undefined) {
        $("#" + id).mask(mask);
    }
}


function carregaDateTimePicker(id) {
    $('#' + id).datetimepicker({
        lang: "pt",
        format: 'd/m/Y H:i',
        formatDate: 'Y/m/d',
    });
}