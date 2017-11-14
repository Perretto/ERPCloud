function CreateTimeCheck(parameters) {

    var retorno = "";
    var readonlybool = "";
    var checked = "";

    //titulo, classe, tamanho, nome, tooltip, controlID, propertyID, containerID, mask, defaultValue, readOnly
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

    //retorno = "<div class='form-group " + classe + " " + tamanho + "'>"
    //retorno = retorno + "<label>" + titulo + "</label>"
    retorno = retorno + "<div class='input-group'>";
    retorno = retorno + "<input  data-oldvalue='' data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  value='" + value + "' data-mask='" + mask + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "'  id='" + id + "' name='" + nome + "' placeholder='" + titulo + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control' readonly >"

    retorno = retorno + "<span class='input-group-addon'>" + "<input  " + checked + " class='icheck-grey " + classe + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "' type='checkbox' id='" + id + "_check' name='" + nome + "' placeholder='" + titulo + "' " + readonlybool + "> " + "</span>";
    retorno = retorno + "</div>"
    //retorno = retorno + "</div>"

    containerID = "#" + containerID;
    $(containerID).append(retorno);

    carregaTimeCheckPicker(id, mask);

    if (mask != "" && mask != null && mask != undefined) {
        $("#" + id).mask(mask, { reverse: true });
    }

    carregaIcheckTimeCheck(id);
    bindTimeCheck(id);


    //if (Value != null && Value != "" && Value != undefined) {
        $("#" + id).val(value);
    //} else {
    //    $("#" + id).val(defaultValue);
    //}
        if (value) {
            $("#" + id).attr("data-oldvalue", value)
        }
}


function carregaTimeCheckPicker(id, mask) {
    $('#' + id).datetimepicker({
        lang: "pt",
        timepicker: true,
        datepicker: false,
        mask: mask,
        format: 'h:i'
    });
}


function carregaIcheckTimeCheck(id) {
    //id = "#" + id;
    $("#" + id + "_check").iCheck({
        checkboxClass: 'icheckbox_minimal-grey',
        radioClass: 'iradio_minimal-grey',
        increaseArea: '20%' // optional
    });
}

function bindTimeCheck(id) {

    $("#" + id + "_check").on('ifChecked', function () {
        document.getElementById(id).readOnly = false;
    });

    $("#" + id + "_check").on('ifUnchecked', function () {
        document.getElementById(id).readOnly = true;
    });

    //var ControlChecked = document.getElementById(id + "_check").checked;
    //var checked;


    //if (ControlChecked == true) {
    //    document.getElementById(nome).disabled = false;
    //} else {
    //    document.getElementById(nome).disabled = true;
    //}

}