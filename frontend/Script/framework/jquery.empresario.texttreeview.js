function CreateTextTreeView(parameters) {
    var retorno = "";
    var readonlybool = "";
    var titulo = parameters.titulo;
    var classe = parameters.classe;
    var tamanho = parameters.tamanho;
    var nome = parameters.nome;
    var tooltip = parameters.tooltip;
    var Text = "";
    if (parameters.text) {
        if (parameters.text.length > 0) {
            Text = parameters.text[0];
        }
    }
    var value="";
    if (parameters.newValue.length > 0) {
        value = parameters.newValue[0];
    }

    var text = parameters.text;
    var controlID = parameters.controlID;
    var propertyID = parameters.propertyID;
    var containerID = parameters.containerID;
    var nameLayout = parameters.nameLayout;
    var layoutID = parameters.layoutID;
    var titleMenu = parameters.titleMenu;
    var typeOpeningLayout = parameters.typeOpeningLayout;
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

    var tabGenID = parameters.tabGenID;

    if (readOnly == true || readOnly == "true") {
        readonlybool = "readonly"
    }


    //retorno = retorno + "<div class='form-group " + classe + " " + tamanho + "'>";
    //retorno = retorno + "<label>" + titulo + "</label>";
    retorno = retorno + "<div class='selectize-control demo-default single'>";
    retorno = retorno + "<div class='selectize-input items not-full has-options input-group'>";

    //retorno = retorno + "<input Serializable='" + Serializable + "' NativeDataType='" + NativeDataType + "' Table='" + Table + "' Field='" + Field + "' SequenceRecording='" + SequenceRecording + "' DerivedFrom='" + DerivedFrom + "'   data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' title='" + tooltip + "' type='hidden' id='" + id + "' name='" + nome + "' placeholder='" + titulo + "' class='form-control " + classe + "' " + readonlybool + " >"
    retorno = retorno + "<input value='" + Text + "' data-serializable='false' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' title='" + tooltip + "' type='text' id='" + id + "_treeview' name='" + nome + "' placeholder='" + titulo + "' class='form-control " + classe + "' readonly >"


    retorno = retorno + "<input value='" + value + "' data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'   data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' title='" + tooltip + "' type='hidden' id='" + id + "' name='" + nome + "' placeholder='" + titulo + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control " + classe + "' " + readonlybool + " >"

    retorno = retorno + "    <span class='input-group-btn'>";

    retorno = retorno + "    <a onclick=\"javascrpt:TreeViewOpening('" + id + "', '" + typeOpeningLayout + "','" + nameLayout + "','" + layoutID + "','" + titleMenu + "','" + tabGenID + "')\" class=\"btn btn-default\"><i class=\"fa fa-list-ul\"></i></a>";
    retorno = retorno + "    </span>";
    retorno = retorno + "</div>";
    retorno = retorno + "</div>";
    //retorno = retorno + "</div>";

    //retorno = retorno + "    <div id=\"teste\" class=\"remodal\" data-remodal-id=\"reModal" + nome + "\">";
    //retorno = retorno + "    <h3>Descrições Gerais</h3>";
    ////retorno = retorno + "    <p>";
    ////retorno = "<div class='control-group'>"
    //retorno = retorno + "<div class='controls'>"
    //retorno = retorno + "<label>adicionar item</label>"
    //retorno = retorno + "<input data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' title='" + tooltip + "' type='text' id='" + nome + "' name='" + nome + "' placeholder='" + titulo + "' class='form-control'>"
    //retorno = retorno + "</div>"
    ////retorno = retorno + "</div>"
    ////retorno = retorno + "</p>";
    //retorno = retorno + "<br>";
    //retorno = retorno + "<br>";
    //retorno = retorno + "<a class=\"remodal-cancel ls-red-btn btn\" href=\"#\">Cancelar</a>";
    //retorno = retorno + "<a class=\"remodal-confirm ls-light-green-btn btn\" href=\"#\">OK</a>";
    //retorno = retorno + "</div>";

    containerID = "#" + containerID;
    $(containerID).append(retorno);
}