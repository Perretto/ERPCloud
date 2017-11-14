function AbreForm(parameters) {
    var classe = (parameters.classe) ? "class='" + parameters.classe + "' " : "";
    var id = (parameters.id) ? "id='" + parameters.id + "' " : "";
    var name = (parameters.name) ? "name='" + parameters.name + "' " : "";
    var controlID = (parameters.controlID) ? "controlID='" + parameters.controlID + "' " : "";
    var layoutID = (parameters.layoutID) ? "layoutID='" + parameters.layoutID + "' " : "";
    var principalDataTypeID = (parameters.principalDataTypeID) ? "principalDataTypeID='" + parameters.principalDataTypeID + "' " : "";
    var finish = (parameters.finish) ? "data-finish='" + parameters.finish + "' " : "";
    var onFinishCode = (parameters.onFinishCode) ? "<script>" + parameters.onFinishCode + "</script>" : "";
    return onFinishCode + "<form " + controlID + id + classe + name + layoutID + " " + finish + ">";
}

function FechaForm() {
    return "</form>";
}

