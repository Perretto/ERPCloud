function CreateTextCurrency(parameters) {
	var retorno = "";
	var readonlybool = "";

	//titulo, classe, tamanho, nome, tooltip, controlID, propertyID, containerID, mask, defaultValue, readOnly, symbol, maxLength
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
	var maxLength = parameters.maxLength;
	var symbol = parameters.symbol;
	var id = parameters.id;

	var nativeDataType = parameters.nativeDataType;
	var table = parameters.table;
	var field = parameters.field;
	var sequenceRecording = parameters.sequenceRecording;
	var derivedFrom = parameters.derivedFrom;
	var serializable = parameters.serializable;
	var tabGenID = parameters.tabGenID;
	var layoutID = parameters.layoutID;

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

	var final = "";

	retorno = retorno + "<div class='selectize-control demo-default single'>";
	retorno = retorno + "<div class='selectize-input items not-full has-options input-group'>";

	if (symbol != "") {
		retorno = retorno + "<div class='input-group'>";
		retorno = retorno + "<span class='input-group-addon'> " + symbol + "</span>";
		final = "</div>"
	}

	retorno = retorno + "<input data-controlinputtype='TEXTCURRENCY' style='text-align: right;' data-oldvalue='' data-serializable='" + serializable + "'  data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  maxlength='" + maxLength + "' value='" + value + "' data-mask='" + mask + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' title='" + tooltip + "' type='text' class='form-control " + classe + "' " + readonlybool + " onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' name='" + nome + "' id='" + id + "'>";

	retorno = retorno + "    <span class='input-group-btn'>";
	retorno = retorno + "    <a onclick=\"panelCurrency('" + id + "_panel')\" class=\"btn btn-default\"><i class=\"fa fa-dollar\"></i></a>";
	retorno = retorno + "    </span>";
	retorno = retorno + "</div>";

	retorno = retorno + "<span class='invisible' id = '" + id + "_panel'></span>";

	retorno = retorno + "</div>";

	retorno = retorno + final;

	containerID = "#" + containerID;
	$(containerID).append(retorno);

	if (mask != "" && mask != null && mask != undefined) {
		$("#" + id).mask(mask, { reverse: true });
	}

	var valorFinal = ConvertToNumberFixed(value);
	$("#" + id).val(valorFinal).keyup();

	if (value) {
		$("#" + id).attr("data-oldvalue", value)
	}

	var htmlpanel = "";
	htmlpanel += "	<div  style='position:absolute;z-index:100000;background-color:#e1e1e1; padding: 8px;box-shadow: 5px 5px 10px #b5b5b5;'>";

	$.ajax({
	    url: getGlobalParameters("urlPlataforma") + "/api/render/renderformdinamic?layoutid=" + layoutID + "&enterpriseID=" + returnCookie("EnterpriseID") + "&instanceID=" + tabGenID + "&userID=" + returnCookie("UserID") + "&lang=" + returnCookie("Lang"),
	    type: "GET",
	    async: false,
	    success: function (data) {
	        data = data.replace("\"", "");
	        data = data.replace("\"", "");
	        htmlpanel += data;
	    },
	    error: function (xhr) {
	        //alert(xhr);
	    }
	});

	htmlpanel += "					</div>";

	$("#" + id + "_panel").html(htmlpanel);

}

function panelCurrency(id) {
    if ($("#" + id).hasClass("invisible")) {
       
		$("#" + id).removeClass("invisible");
	} else {
		$("#" + id).addClass("invisible");
	}
}