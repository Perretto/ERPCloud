function CreateTime(parameters) {

    var retorno = "";
    var readonlybool


    //titulo, classe, tamanho, nome, tooltip, controlID, propertyID, containerID, mask, defaultValue, readOnly, maxLength
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
    var maxLength = parameters.maxLength;
    var id = parameters.id;


    var nativeDataType = parameters.nativeDataType;
    var table = parameters.table;
    var field = parameters.field;
    var sequenceRecording = parameters.sequenceRecording;
    var derivedFrom = parameters.derivedFrom;
    var serializable = parameters.serializable;

    var value;
    if (parameters.newValue.length > 0) {
        value = parameters.newValue[0];
    } else {
        value = parameters.defaultValue;
    }

    if (value == "null" || value == null)
        value = " ";

    var dataTime = value;
    dataTime = dataTime.replace(" ", "*");

    var startSpace = dataTime.indexOf("*");
    var startSpaceFinal = startSpace - dataTime.length;

    if (startSpaceFinal < 0) {
        startSpaceFinal = dataTime.length - startSpace;
    }

    if (startSpaceFinal > 0) {
        dataTime = dataTime.substr(startSpaceFinal + 1, dataTime.length - startSpaceFinal)
    }

    dataTime = dataTime.replace("*", "");
    value = dataTime;

    //CreateEvent
    var onLostFocusName = parameters.onLostFocusName;
    var onFocusName = parameters.onFocusName;
    var onKeyPressName = parameters.onKeyPressName;
    var onClickName = parameters.onClickName;
    var onChangeName = parameters.onChangeName;


    if (readOnly == true || readOnly == "true") {
        readonlybool = "readonly"
    }

    //retorno = "<div class='form-group " + classe + " " + tamanho + "'>"
    //retorno = retorno + "<label>" + titulo + "</label>"
    //retorno = retorno + "<input data-serializable='" + Serializable + "' data-nativeDataType='" + NativeDataType + "' data-table='" + Table + "' data-field='" + Field + "' data-sequenceRecording='" + SequenceRecording + "' data-derivedFrom='" + DerivedFrom + "' value='" + defaultValue + "'data-mask='" + mask + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "'  id='" + id + "' name='" + nome + "' placeholder='" + titulo + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control col-md-2 " + classe + "' " + readonlybool + ">"
    //retorno = retorno + "</div>"

    retorno = retorno + "<div class='input-group'>";
    retorno = retorno + "<input  data-oldvalue='' data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  value='" + value + "' data-mask='" + mask + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "'  id='" + id + "' name='" + nome + "' placeholder='" + titulo + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control'  >"
    retorno = retorno + "</div>"

    containerID = "#" + containerID;
    $(containerID).append(retorno);


    carregaTimePicker(id, mask);

    if (mask != "" && mask != null && mask != undefined) {
        $("#" + id).mask(mask, { reverse: true });
    }



    //if (Value != null && Value != "" && Value != undefined) {
    $("#" + id).val(value);
    //} else {
    //    $("#" + id).val(defaultValue);
    //}

    if (value) {
        $("#" + id).attr("data-oldvalue", value)
    }
}

function carregaTimePicker(id, mask) {
    $('#' + id).datetimepicker({
        lang: "pt",
        timepicker: true,
        datepicker: false,
        mask: mask,
        format: 'h:i'
    });
}

