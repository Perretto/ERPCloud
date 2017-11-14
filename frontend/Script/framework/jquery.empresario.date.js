function CreateDate(parameters) {
    var retorno = "";
    var readonlybool = "";

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

    //CreateEvent
    var onLostFocusName = parameters.onLostFocusName;
    var onFocusName = parameters.onFocusName;
    var onKeyPressName = parameters.onKeyPressName;
    var onClickName = parameters.onClickName;
    var onChangeName = parameters.onChangeName;

    var value="";
    if (parameters.newValue.length > 0) {
        value = parameters.newValue[0];
    } else {
        value = parameters.defaultValue;
    }
    if (value == null)
    {
        value = "";
    }
    if (value.length > 10)
    {
        value = value.substr(0, 10)
    }

    if (readOnly == true || readOnly == "true") {
        readonlybool = "readonly disabled" 
    }

    //retorno = "<div class='form-group " + classe + " " + tamanho + "'>"
    //retorno = retorno + "<label>" + titulo + "</label>"
    retorno = "<div>"
    //retorno = retorno + "<input type='text' value='" + value + "' id='" + id + "' name='" + nome + "' />";
    retorno = retorno + "<input  data-oldvalue='' data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "' value='" + value + "' data-mask='" + mask + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "'  id='" + id + "' name='" + nome + "' placeholder='" + titulo + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control " + classe + "' " + readonlybool + " >"
    retorno = retorno + "</div>"
    
    containerID = "#" + containerID;
    $(containerID).append(retorno);
        
    //carregaDatePicker(id, mask);
	////if (Value != null && Value != "" && Value != undefined) {
    //    $("#" + id).val(value);
    ////} else {
    ////    $("#" + id).val(defaultValue);
    ////}

        carregaDatePicker(id);
        $("#" + id).val(value);
       

        if (mask != "" && mask != null && mask != undefined) {
            $("#" + id).mask(mask);
        }

        onChangeData(id);

        if (value) {
            $("#" + id).attr("data-oldvalue", value)
        }

      }

    function carregaDatePicker(id) {

        $('#' + id).datetimepicker({
            lang: "pt",
            timepicker: false,
            format: 'd/m/Y',
            formatDate: 'Y/m/d',
        });       
    }


    function validateDate(value, id) {
        var RegExPattern = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

        if (value != '' && value != "") {
            if (!value.match(RegExPattern)) {
                $('#' + id).val("");
                var result = confirmOk("Data inválida");
            }
        }
    }


    function onChangeData(id) {
        $('#' + id).change(function (){
            validateDate($('#' + id).val(), id);
        });
    }