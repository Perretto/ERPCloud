function CreateTextPerc(parameters) {
    var retorno = "";
    var readonlybool = "";

    //titulo, classe, tamanho, nome, tooltip, controlID, propertyID, containerID, mask, defaultValue, readOnly, maxLength
    var titulo = parameters.titulo;
    var classe = parameters.classe;
    var tamanho = parameters.tamanho;
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


    //CreateEvent
    var onLostFocusName = parameters.onLostFocusName;
    var onFocusName = parameters.onFocusName;
    var onKeyPressName = parameters.onKeyPressName;
    var onClickName = parameters.onClickName;
    var onChangeName = parameters.onChangeName;

    if (readOnly == true || readOnly == "true") {
        readonlybool = "readonly"
    }

    //var retorno = "<div class='form-group " + classe + " " + tamanho + "'>";
    //retorno = retorno + "<label class='control-label' for='basicinput'>" + titulo + "</label>";
    retorno = retorno + "<div class='input-group'>";
    //retorno = retorno + "<div class='input-group ls-group-input'>";

    retorno = retorno + "<input  data-oldvalue='' data-serializable='" + serializable + "'  data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  name='" + nome + "' id='" + id + "' maxlength='" + maxLength + "' value='" + value + "' data-mask='" + mask + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' title='" + tooltip + "' type='text' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control text-right " + classe + "' " + readonlybool + " />";

    retorno = retorno + "<span class='input-group-addon'>%</span>";
    //retorno = retorno + "</div>";
    retorno = retorno + "</div>";
    //retorno = retorno + "</div>";


    containerID = "#" + containerID;
    $(containerID).append(retorno);

    if (mask != "" && mask != null && mask != undefined) {
        $("#" + id).mask(mask, { reverse: true });
    }


    //if (Value != null && Value != "" && Value != undefined) {
    var valorFinal = ConvertToNumberFixed(value);

    $("#" + id).val(valorFinal).keyup();
    //} else {
    //    $("#" + id).val(defaultValue);
    //}
    if (value) {
        $("#" + id).attr("data-oldvalue", value)
    }
}