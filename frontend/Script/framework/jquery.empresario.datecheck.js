function CreateDateCheck(parameters) {
    var retorno = "";
    var readonlybool;
    var checked = "";

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

    var template = parameters.template;
    var value;
    if (parameters.newValue.length > 0 && template != "TREEDETAIL") {
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
        readonlybool = "readonly disabled"
        //checked = "";
    } else {
        //checked = "checked";
        readonlybool = "";
    }

    //if (defaultValue == "") {
    //    readonlybool = "readonly";
    //    checked = "";
    //} else {
    //    checked = "checked";
    //    readonlybool = "";
    //}


    //retorno = "<div class='form-group " + classe + " " + tamanho + "'>"
    //retorno = retorno + "<label>" + titulo + "</label>"
    retorno = retorno + "<div class='input-group'>";
    //retorno = retorno + "<input Serializable='" + Serializable + "'NativeDataType='" + NativeDataType + "' Table='" + Table + "' data-field='" + Field + "' SequenceRecording='" + SequenceRecording + "' DerivedFrom='" + DerivedFrom + "'  data-mask='" + mask + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "' type='text' id='" + id + "' name='" + nome + "' placeholder='" + titulo + "' class='form-control dateTimePicker " + classe + "' readonly >"
    retorno = retorno + "<input  data-oldvalue='' data-serializable='" + serializable + "'data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  data-mask='" + mask + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "' type='text' id='" + id + "' name='" + nome + "' placeholder='" + titulo + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control dateTimePicker " + classe + "' readonly disabled >"
    //retorno = retorno + "<input " + checked + " class='icheck-grey' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "' type='checkbox' id='" + nome + "' name='" + nome + "' placeholder='" + titulo + "' " + readonlybool + "> ";
    retorno = retorno + "<span class='input-group-addon'>" + "<input  " + checked + " class='icheck-grey' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "' type='checkbox' id='" + id + "_check' name='" + nome + "' placeholder='" + titulo + "' " + readonlybool + "> " + "</span>";
    retorno = retorno + "</div>"
    //retorno = retorno + "</div>"

    containerID = "#" + containerID;
    $(containerID).append(retorno);

    carregaDateCheckPicker(id);
    
    carregaIcheckDataCheck(id);
    bindDateCheck(id);

    //if (Value != null && Value != "" && Value != undefined) {
    $("#" + id).val(value);

    if (mask != "" && mask != null && mask != undefined) {
        $("#" + id).mask(mask);
    }

    if (value != null && value != "" && value != undefined) {
        document.getElementById(id).disabled = true;
        document.getElementById(id).readOnly = true;
    }


    //} else {
    //    $("#" + id).val(defaultValue);
    //}

    bindIDataCheck(id, onClickName);

    if (value) {
        $("#" + id).attr("data-oldvalue", value)
    }

}

function bindIDataCheck(id, onClickName) {
    $("#" + id + "_check").on('ifClicked', function () {
        if (onClickName != "" && onClickName != undefined && onClickName != null) {
            window[onClickName](arguments);
            //executeFunctionByName(onClickName + ".");
        }
    });
}

function bindDateCheck(id) {

    //$("#" + id + "_check").on('ifChecked', function () {
    //    document.getElementById(id).readOnly = false;
    //});
    
    //$("#" + id + "_check").on('ifUnchecked', function () {
    //    document.getElementById(id).readOnly = true;
    //});

    //var ControlChecked = document.getElementById(id + "_check").checked;
    //var checked;


    //if (ControlChecked == true) {
    //    document.getElementById(nome).disabled = false;
    //} else {
    //    document.getElementById(nome).disabled = true;
    //}


    $("#" + id + "_check").on('ifChecked', function () {
        document.getElementById(id).disabled = false;
        document.getElementById(id).readOnly = false;
    });

    $("#" + id + "_check").on('ifUnchecked', function () {
        document.getElementById(id).disabled = true;
        document.getElementById(id).readOnly = true;
    });

}



function carregaIcheckDataCheck(id) {
    //id = "#" + id;
    $("#" + id + "_check").iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue',
        increaseArea: '20%' // optional
    });
}

function carregaDateCheckPicker(id) {
    $('#' + id).datetimepicker({
        lang: "pt",
        timepicker: false,
        datepicker: true,
        format: 'd/m/Y'
    });
}