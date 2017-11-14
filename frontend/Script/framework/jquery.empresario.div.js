function AbreDiv(parameters) {
    var classe = (parameters.classe) ? "class='" + parameters.classe + "' " : "";
    var id = (parameters.id) ? "id='" + parameters.id + "' " : "";
    var controlID = (parameters.controlID) ? "controlID='" + parameters.controlID + "' " : "";
    var parametros = (parameters.parametros) ? parameters.parametros : "";

    var retorno = "<div " + id + classe + name + controlID;

    if (parameters.attribute)
    {
        for (var i = 0; i < parameters.attribute.length; i++)
        {
            retorno += " " + parameters.attribute[i].name + "='" + parameters.attribute[i].value + "'";
        }
    }        

    return  retorno + ">";
}

function FechaDiv() {
    return "</div>";
}