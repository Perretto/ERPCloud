function CreateDropDown(parameters) {
    var retorno = "";
    var readonlybool = "";

    //titulo, classe, tamanho, nome, tooltip, value, text, controlID, propertyID, containerID, readOnly
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
    var mask = parameters.mask;
    var defaultValue = parameters.defaultValue;
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

    var classe = "";

    if (parameters.required == true) {
        classe = " required ";
    }

    //retorno = retorno + "<div class='form-group " + classe + " " + tamanho + "'>";
    //retorno = retorno + "<label>" + titulo + "</label>";
    //retorno = retorno + "    <select Serializable='" + Serializable + "' NativeDataType='" + NativeDataType + "' Table='" + Table + "' Field='" + Field + "' SequenceRecording='" + SequenceRecording + "' DerivedFrom='" + DerivedFrom + "'  data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' nome='" + nome + "' id='" + id + "' class='demo-default' title=\"" + tooltip + "\" " + readonlybool + " >";

    //retorno = retorno + "    <select data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' nome='" + nome + "' id='" + id + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "'" + required + " class='form-control " + classe + "' title=\"" + tooltip + "\" " + readonlybool + " >";

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
            if (textList) {
                retorno = retorno + "        <option value='" + valueList[i] + "' " + selected + ">" + textList[i] + "</option>";

            }
        }

    }

    retorno = retorno + "    </select>";
    //retorno = retorno + "</div>";

    containerID = "#" + containerID;
    $(containerID).append(retorno);

    if (value) {
        $("#" + id).attr("data-oldvalue", value)
    }
}