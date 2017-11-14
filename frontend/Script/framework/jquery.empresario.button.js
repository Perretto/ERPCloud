function CreateButton(parameters) {

    var readonlybool = "";

    //nome, tooltip, onClick, classe, objeto, controlID, propertyID, readOnly
    var nome = parameters.nome;
    var tooltip = parameters.tooltip;
    var onClick;
    if (parameters.onClick) {
        onClick = parameters.onClick;
    } else {
        onClick = parameters.onClickName + "()";
    }
    
    var classe = parameters.classe;
    var icone = parameters.icone;
    var controlID = parameters.controlID;
    var propertyID = parameters.propertyID;
    var readOnly = parameters.readOnly;
    var containerID = parameters.containerID;
    var titulo = parameters.titulo;
    var tamanho = parameters.tamanho;
    var returnString = parameters.returnString;


    var nativeDataType = parameters.nativeDataType;
    var table = parameters.table;
    var field = parameters.field;
    var sequenceRecording = parameters.sequenceRecording;
    var derivedFrom = parameters.derivedFrom;

    //CreateEvent
    var onLostFocusName = parameters.onLostFocusName;
    var onFocusName = parameters.onFocusName;
    var onKeyPressName = parameters.onKeyPressName;
    var onClickName = parameters.onClickName;
    var onChangeName = parameters.onChangeName;



    if (readOnly == true || readOnly == "true") {
        readonlybool = "disabled"
    }

    if (!icone) {
        icone = "";
    }

    var retorno = "";

    //retorno = "<div class='form-group " + classe + " " + tamanho + "'>"
    //retorno = retorno + "<label>" + "</label>"
    //retorno = retorno + "<div class='controls'>"
    //retorno = retorno + "<a NativeDataType='" + NativeDataType + "' Table='" + Table + "' Field='" + Field + "' SequenceRecording='" + SequenceRecording + "' DerivedFrom='" + DerivedFrom + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  type='button' title='" + titulo + "' id='" + nome + "' name='" + nome + "' class='" + classe + " " + readonlybool + "'  onclick='" + onClick + "' " + readonlybool + ">" + icone + " " + titulo + " </a>";
    retorno = retorno + "<a data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  type='button' title='" + tooltip + "' id='" + nome + "' name='" + nome + "' class='btn btn-primary " + classe + " " + readonlybool + "'  onclick='" + onClick + "' " + readonlybool + ">" + icone + " " + titulo + " </a>";

    //retorno = retorno + "</div>"
    //retorno = retorno + "</div>"

    containerID = "#" + containerID;
    if (returnString == true) {
        return retorno
    }
    else {
        $(containerID).append(retorno);
    }
    
}