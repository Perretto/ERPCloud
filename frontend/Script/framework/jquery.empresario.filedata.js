function CreateFileData(parameters) {
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

    var value = parameters.value;

    //CreateEvent
    var onLostFocusName = parameters.onLostFocusName;
    var onFocusName = parameters.onFocusName;
    var onKeyPressName = parameters.onKeyPressName;
    var onClickName = parameters.onClickName;
    var onChangeName = parameters.onChangeName;
    var Fill1PropertyID = parameters.fill1PropertyID;



    if (readOnly == true || readOnly == "true") {
        readonlybool = "disabled"
    }

    //retorno = "<input  data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='id' data-derivedFrom='" + derivedFrom + "'  value='' data-controlID='" + controlID + "_principal' data-propertyID='" + Fill1PropertyID + "'  type='hidden' id='" + id + "_principal' name='" + nome + "_principal' >";


    retorno += "<input  data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'  value='" + value + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  type='hidden' id='" + id + "' name='" + nome + "' value=''  onchange='" + onChangeName + "' >";

    retorno += "<div class='fluidbox-wrap' style='z-index: 990;'><input data-serializable='false' data-controlID='" + controlID + "'  onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' id='" + id + "_filedata' type='file' multiple='true' " + readonlybool + " ></div>"

    retorno += "<a type='button' title='Enviar' id='" + id + "_enviar' name='" + nome + "_enviar' class='btn btn-primary " + readonlybool + "'>Enviar</a>";


    containerID = "#" + containerID;
    $(containerID).append(retorno);

    var tabGenID = parameters.tabGenID;
    var containerID = parameters.containerID;
    var layoutID = parameters.layoutScreen;
    var formID = parameters.containerIDScreen;

    SetUploadData(id + "_filedata", id, tabGenID, containerID, layoutID, formID);
}


function SetUploadData(id, hiddenId, tabGenID, containerID, layoutID, formID) {

    $("#" + hiddenId + "_enviar").click(function () {
        //var input = document.getElementById(id);
        var input = $("#" + id);

        if (input) {
            if (input.length > 0) {
                if (input[0].files && input[0].files[0]) {


                    //var reader = new FileReader();
                    //reader.onload = function (e) {

                    //var formData = new FormData();
                    //formData.append("opmlFile", input[0].files[0]);
                    //var formData = input[0].files[0];

                    var data = new FormData();

                    var files = $("#" + id).get(0).files;

                    // Add the uploaded image content to the form data collection
                    if (files.length > 0) {
                        data.append("UploadedImage", files[0]);
                    }


                    $.ajax({
                        url: getGlobalParameters("urlPlataforma") + "/api/compiler/FileDataUpload",
                        type: 'POST',
                        data: data,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (result) {
                            if (result) {

                                var caminho = $(input[0]).val();
                                caminho = caminho.replace("C", "").replace("\\", "").replace(":", "").replace("fakepath", "").replace("\\", "");

                                $("#" + hiddenId).val(caminho);
                                containerID = formID.replace(tabGenID, "").replace("_", "");
                                onSave(formID, "", formID, containerID, layoutID, false);
                            }
                        }
                    });

                    //var image = reader.result;
                    //var result = document.getElementById(hiddenId);
                    //result.value = image;

                    //var idContainer = hiddenId.substring(0, hiddenId.indexOf("_"));
                    ////$(".control-image")[0].children[0].src = image;
                    ////[0].src = image;
                    //var controlImage = $(".control-image > div > figure > img");
                    //for (var i = 0; i < controlImage.length; i++) {
                    //    if (controlImage[i].id.indexOf(idContainer) > -1) {
                    //        $(".control-image > div > figure > img")[i].src = image;
                    //        break;
                    //    }
                    //}

                    //};
                    //reader.readAsDataURL(input[0].files[0]);
                }
            }
        }
    });
}