
function onDelete(formID, id, metadataContainerID, layoutID, instanceTela) {
    
    var url = getGlobalParameters("urlPlataform") + "/api/DeleteData";
    var clear = false

    if($("#" + formID).length == 0){
        formID = instanceTela
        clear = true
    }

    loaderImage(formID, true);

    var retorno = SerializeFields({
        formID: formID,
        containerID: metadataContainerID,
        layoutID: layoutID,
        returnString: true
    });
    
    var objectJSON = $.parseJSON(retorno)

    if (objectJSON) {
        if (objectJSON.length > 0) {
            var id = objectJSON[0].id;

            $.ajax({
                contentType: "application/json",
                accepts: "application/json",
                url: url + "/" + metadataContainerID + "/" + id + "/", 
                type: "GET",
                success: function(result){                    
                    if (result.status) {
                        if (result.status == "success") {
                            notification({
                                messageText: "Deletado com sucesso", messageTitle: "OK", fix: false, type: "ok", icon: "thumbs-up"
                            });
                            ClearForm(formID, clear);
                        }
                    } else{
                        notification({
                            messageText: result.originalError.info.message, messageTitle: "Ops", fix: false, type: "warning", icon: "thumbs-down"
                        });
                    }      
                }
            })

        }
    }

    loaderImage(formID,false);
}


function onDeleteOld(formID, id, metadataContainerID, layoutID, instanceTela) {
    if ($("#" + formID).length == 0) {
        formID = formID.replace(metadataContainerID,layoutID)
    }
    loaderImage(formID + "_panel", true);
    var url = getGlobalParameters("urlPlataforma") + "/api/database/DeleteData";

    try {

        var mess = "Deseja deletar o registro? ";
        
        //result = confirm(mess, function () {
            retorno = SerializeFields({
                formID: formID,
                containerID: metadataContainerID,
                layoutID: layoutID,
                returnString: true
            });

            var parameters = new Object();
            parameters.type = "POST";
            parameters.url = url;
            parameters.dados = retorno;
            parameters.callbackSuccess = function (result) {
                if (result.length > 0) {
                    if (result[0].message != null) {
                        if (result[0].message[0].success) {
                            notification({
                                messageText: result[0].message[0].title[0].toolTip,
                                messageTitle: result[0].message[0].title[0].text,
                                fix: false,
                                type: "ok",
                                icon: "thumbs-up"
                            });
                            var clearTable = false;
                            var $form = $("#" + formID);
                            clearTable = ($form.hasClass("principalContainer") && !$form.hasClass("masterdetail")) ? true : false;
                            $("#" + formID + "_table").find("tr.selected").remove();
                            ClearForm(formID, clearTable);

                            clickSearch(instanceTela + "_nav", "cadastrodeclientes");

                        }
                        else {
                            notification({
                                messageText: result[0].message[0].title[0].toolTip,
                                messageTitle: result[0].message[0].title[0].text,
                                fix: false,
                                type: "warning",
                                icon: "thumbs-down"
                            });
                        }
                    }
                }
            };
            parameters.callbackError = function (result) {
                notification({
                    messageText: result, messageTitle: "Ops!", fix: false, type: "warning", icon: "exclamation"
                });
            };
            parameters.callbackComplete = function (result) {
                loaderImage(formID + "_panel", false);
            };
            parameters.async = true;
            AjaxQuery(parameters);
        //}, function () {
            loaderImage(formID + "_panel", false);
        //})
    }

    catch (e) {
        notification({
            messageText: e, messageTitle: "Ops!", fix: false, type: "warning", icon: "exclamation"
        });
        loaderImage(formID + "_panel", false);
    }

    //Função BeforeDelete - ERP
    //Função que deleta o registro
    //Função que limpa a tela
    //Função do AfterDelete-ERP

}

