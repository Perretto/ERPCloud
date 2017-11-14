function CreateCheckBox(parameters) {
    var retorno = "";
    var checked="";
    var readonlybool="";


    //titulo, classe, tamanho, nome, tooltip, controlID, propertyID, containerID, defaultValue, readOnly
    var titulo = parameters.titulo;
    var classe = parameters.classe;
    var tamanho = parameters.tamanho;
    var nome = parameters.nome;
    var tooltip = parameters.tooltip;
    var controlID = parameters.controlID;
    var propertyID = parameters.propertyID;
    var containerID = parameters.containerID;
    var defaultValue = parameters.defaultValue;
    var readOnly = parameters.readOnly;
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


    if (defaultValue == true) {
        checked = "checked"
    }
    if (readOnly == true || readOnly == "true") {
        readonlybool = "disabled"
    }

    //retorno = "<div class='form-group " + classe + " " + tamanho + "'>";
    //retorno = retorno + "<label class=\"checkbox-inline\">";
    //retorno = retorno + "<input Serializable='" + Serializable + "' NativeDataType='" + NativeDataType + "' Table='" + Table + "' Field='" + Field + "' SequenceRecording='" + SequenceRecording + "' DerivedFrom='" + DerivedFrom + "'  " + checked + " class='icheck-grey' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "' type='checkbox' id='" + id + "' name='" + nome + "' placeholder='" + titulo + "' " + readonlybool + "> ";
    retorno = "<label class='label-control'><input  data-oldvalue='false' data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  " + checked + " class='icheck-grey' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "' type='checkbox' id='" + id + "' name='" + nome + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' placeholder='" + titulo + "' " + readonlybool + "> " + titulo + "</label>";
    //retorno = retorno + titulo + "</label>";
    //retorno = retorno + "</div>";
    containerID = "#" + containerID;
    $(containerID).append(retorno);

    carregaIcheckCheckBox(id);
    if (readonlybool == "disabled") {
        $("#" + id).iCheck('disable');
    }

    //if (Value != null && Value != "" && Value != undefined) {
    $("#" + id).val(value);
    if (value == "True" || value == true) {
        $("#" + id).iCheck('check');
    }
    //} else {
    //    $("#" + id).val(defaultValue);
    //}


    if (value) {
        $("#" + id).attr("data-oldvalue", value)
    }


}

function carregaIcheckCheckBox(id) {
    //id = "#" + id;
    $("#" + id).iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue',
        increaseArea: '20%' // optional
    });
}

function carregaIcheckCheckBoxColor(id, color) {
    //id = "#" + id;
    $("#" + id).iCheck({
        checkboxClass: 'icheckbox_flat-' + color,
        radioClass: 'iradio_flat-blue',
        increaseArea: '20%' // optional
    });
}





//function CheckBox(titulo, classe, tamanho, nome, tooltip, controlID, propertyID, tabID) {
//    var retorno
//    retorno = "<div class='form-group " + classe + "'>";
//    retorno = retorno + "<label class=\"checkbox-inline\">";
//    retorno = retorno + "<input class='icheck-grey' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "' type='checkbox' id='" + nome + "' name='" + nome + "' placeholder='" + titulo + "' > ";
//    retorno = retorno + titulo + "</label>";
//    retorno = retorno + "</div>";
//    return retorno;
//}