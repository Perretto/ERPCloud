function CreateHidden(parameters) {
    var retorno="";
    //nome, controlID, propertyID, defaultValue
    
    var nome = parameters.nome;    
    var controlID = parameters.controlID;
    var propertyID = parameters.propertyID;
    var defaultValue = parameters.defaultValue;
    var containerID = parameters.containerID;
    var id = parameters.id;

    var nativeDataType = parameters.nativeDataType;
    var table = parameters.table;
    var field = parameters.field;
    var sequenceRecording = parameters.sequenceRecording;
    var derivedFrom = parameters.derivedFrom;
    var serializable = parameters.serializable;
    var ownerFieldTreeView = parameters.ownerFieldTreeView;
    var onChangeName = parameters.onChangeName;

    var value;
    if (parameters.newValue.length > 0) {
        value = parameters.newValue[0];
    } else {
        value = parameters.defaultValue;
    }


    retorno = "<input  data-oldvalue='' data-ownerFieldTreeView='" + ownerFieldTreeView + "' data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  value='" + value + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  type='hidden' id='" + id + "' name='" + nome + "' value=''  onchange='" + onChangeName + "' >";

    containerID = "#" + containerID;
    $(containerID).append(retorno);


    //if (Value != null && Value != "" && Value != undefined) {
        $("#" + id).val(value);
    //} else {
    //    $("#" + id).val(defaultValue);
    //}

    if (value) {
        $("#" + id).attr("data-oldvalue", value)
    }
}