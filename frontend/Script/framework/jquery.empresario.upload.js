function CreateUpload(parameters) {
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

    SetUpload(id + "_file", id);

    
}

function SetUpload(id, hiddenId) {
   
    $("#" + id).change(function () {
        var input = document.getElementById(id);
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var image = reader.result;
                var result = document.getElementById(hiddenId);
                result.value = image;
				
				var idContainer = hiddenId.substring(0, hiddenId.indexOf("_"));
                //$(".control-image")[0].children[0].src = image;
				//[0].src = image;
				var controlImage = $(".control-image > div > figure > img");
				for (var i = 0; i < controlImage.length; i++)
				{
					if (controlImage[i].id.indexOf(idContainer) > -1)
					{
						$(".control-image > div > figure > img")[i].src = image;
						break;
					}
				}
				
                //alert(image);
            };
            reader.readAsDataURL(input.files[0]);
            //$(".control-image")[0].children[0].src = reader;
        }
    })
}
    