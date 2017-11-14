function CreateLabel(parameters) {
    var retorno = "";
    //nome, tooltip, containerID, defaultValue
    var nome = parameters.nome;
    var tooltip = parameters.tooltip;
    var containerID = parameters.containerID;
    var defaultValue = parameters.defaultValue;
    var tamanho = parameters.tamanho;
    var classe = parameters.classe;
    var titulo = parameters.titulo;
    var controlID = parameters.controlID;
    var propertyID = parameters.propertyID;

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


    //retorno = "<div class='form-group " + classe + " " + tamanho + "'>";
    if (titulo) {
        if (propertyID == '00000000-0000-0000-0000-000000000000' || propertyID == '') {
            titulo = ""
        }
    }
    
    if (propertyID == '00000000-0000-0000-0000-000000000000' || propertyID == '') {
        if (titulo) {
            defaultValue = titulo;
            titulo = "";
        } else {
            defaultValue = "";
        }
    }

    if (value) {
        defaultValue = value;
    }

    retorno = retorno + "<label  data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  data-controlid='" + controlID + "'>" + titulo + "</label>";
    retorno = retorno + "<span data-serializable='" + serializable + "' data-controlid='" + controlID + "' class='labelField'>" + defaultValue + "</span>";

    //retorno = retorno + "</div>";
    containerID = "#" + containerID;
    $(containerID).append(retorno);


}