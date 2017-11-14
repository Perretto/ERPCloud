function CreateArquivo(parameters) {
	var retorno = "";
	var readonlybool = "";

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

	if (readOnly == true || readOnly == "true") {
		readonlybool = "disabled"
	}

	//retorno = "<div class='form-group " + classe + " " + tamanho + "'>"
	//retorno = retorno + "<label>" + titulo + "</label>"
	retorno = retorno + "<input data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "' type='file' value='" + titulo + "' id='" + id + "_file" + "' name='" + nome + "' class='form-control' " + readonlybool + " >"
	retorno = retorno + "<input data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "' type='hidden' id='" + id + "' name='" + nome + "' class='form-control' " + readonlybool + " >"

	//retorno = retorno + "</div>";

	containerID = "#" + containerID;

	$(containerID).append(retorno);

	//SetUpload(id + "_file", id);


}

//function SetUpload(id, hiddenId) {


//	$("#" + id).change(function () {
//		var input = document.getElementById(id);
//		if (input.files && input.files[0]) {
//			var formData = new FormData();
//			var opmlFile = $("#" + id)[0];
//			formData.append("opmlFile", opmlFile.files[0]);

//			$.ajax({
//				url: getGlobalParameters("urlPlataforma") + "/api/compiler/FileUpload",
//				type: 'POST',
//				data: formData,
//				cache: false,
//				contentType: false,
//				processData: false,
//				success: function (result) {
//					if (result) {
//						var msg = "";
//						var myJson = {};
//						var valueParameters = [];
//						valueParameters = $.makeArray(result);
//						myJson["EnterpriseID"] = returnCookie("EnterpriseID");
//						myJson["Class"] = "NotaFiscalClass";
//						myJson["Function"] = "InstalarCertificado";
//						myJson["ValueParameters"] = valueParameters;

//						msg = JSON.stringify(myJson);

//						var parameters = new Object();
//						parameters.url = getGlobalParameters("urlPlataforma") + "/api/compiler/CsharpCompilerPost";
//						parameters.dados = msg;
//						parameters.async = false;
//						parameters.type = "POST";

//						var resultado = AjaxParameter(parameters);
//						if (resultado) {
//							if (resultado != "false" || resultado != false){
							
//								//$("#" + idTela + "CoConfiguracaoNFe_ddlcertificado").val(resultado);
//								notification({ messageTitle: "OK", messageText: "Certificado carregado com sucesso.", fix: false, type: "ok", icon: "thumbs-up" });
//							} else {
//								notification({ messageTitle: "Erro", messageText: "Não conseguiu carregar o certificado.", fix: false, type: "error", icon: "thumbs-down" });
//							}

//						}

//					}
//				}
//			});
//		}
//	});

//}
