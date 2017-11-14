function CreateReset(parameters) {
    var retorno = "";
    var readonlybool = "";

    //titulo, classe, tamanho, nome, tooltip, controlID, propertyID, containerID, readOnly
    var titulo = parameters.titulo;
    var classe = parameters.classe;
    var tamanho = parameters.tamanho;
    var nome = parameters.nome;
    var tooltip = parameters.tooltip;
    var controlID = parameters.controlID;
    var propertyID = parameters.propertyID;
    var containerID = parameters.containerID;
    var readOnly = parameters.readOnly;
    var id = parameters.id;

    var nativeDataType = parameters.nativeDataType;
    var table = parameters.table;
    var field = parameters.field;
    var sequenceRecording = parameters.sequenceRecording;
    var derivedFrom = parameters.derivedFrom;
    var serializable = parameters.serializable;
    serializable = false;

    //CreateEvent
    var onLostFocusName = parameters.onLostFocusName;
    var onFocusName = parameters.onFocusName;
    var onKeyPressName = parameters.onKeyPressName;
    var onClickName = parameters.onClickName;
    var onChangeName = parameters.onChangeName;

    if (readOnly == true || readOnly == "true") {
        readonlybool = "disabled"
    }

    retorno = "<div class='control-group " + classe + "'>"
    //retorno = retorno + "<label>" + titulo + "</label>"
    retorno = retorno + "<div class='controls'>"

    retorno = retorno + "<input data-serializable='" + serializable + "'  data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' title='" + tooltip + "' type='reset' value='" + titulo + "' id='" + id + "' name='" + nome + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control' " + readonlybool + " >"

    retorno = retorno + "</div>"
    retorno = retorno + "</div>"

    containerID = "#" + containerID;
    $(containerID).append(retorno);
}
