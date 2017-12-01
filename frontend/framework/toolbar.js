
function onDelete(formID, id, metadataContainerID, layoutID, instanceTela) {
    
    var url = getGlobalParameters("urlPlataform") + "/api/DeleteData";
  

    if($("#" + formID).length == 0){
        formID = instanceTela
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


                            ClearForm(formID, true);

                            //editGridLine("", metadataContainerID, id)

                        }else{
                            notification({
                                messageText: result.message, messageTitle: "Ops", fix: false, type: "warning", icon: "thumbs-down"
                            });
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


function onSave(form, id, instanceID, containerID, layoutID, async, onAfterSaving, onBeforeSaving){
    loaderImage(form + "_panel", true);
    var url = getGlobalParameters("urlPlataforma") + "/api/database/WriteData";
    var retorno;
    if (async != false) {
        async = true;
    };
    var isvalid = false;

    var clear = true;

    if ($("#" + form).length == 0) {
        form = form.replace(containerID,layoutID)
    }

    var formv = $("#" + form);

    var template = $("#" + form + "_table").attr("data-template");

    if(template == "MASTERDETAIL"){
        clear = false;
    }

    var fv = formv.data('formValidation');
    isvalid = fv.validate();

    if (isvalid.$invalidFields) {
        if (isvalid.$invalidFields.length > 0) {
            isvalid = false;
        } else {
            isvalid = true;
        }
    } else {
        isvalid = true;
    }

    if (isvalid) {
        var data = SerializeFields({
            formID: form,
            containerID: containerID,
            layoutID: layoutID,
            returnString: false
        });

        $.ajax({
            contentType: "application/json",
            accepts: "application/json",
            url: returnCookie("urlPlataform") + "/api/save/", 
            type: "POST",
            data:  data,
            success: function(result){
                if (result.status == "success") {
                    
                    if (clear == false) {
                        ClearForm(form, true);

                        var id = "63A28C99-3BC2-49E8-A2C8-01E734D9326D";
                        fillgrid(containerID, id)
                    }
                    notification({
                        messageText: "Salvo com sucesso", messageTitle: "OK", fix: false, type: "ok", icon: "thumbs-up"
                    });

                }else{
                    notification({
                        messageText: result.message, messageTitle: "Ops", fix: false, type: "warning", icon: "thumbs-down"
                    });
                }                 
            }
        })
    }
}

function SerializeFields(param){

    var myJson = {};
    var arrayObjs = [];
    var formID = param.formID;
    var returnString = (param.returnString) ? param.returnString : false;
    var fillGrid = (param.fillGrid) ? param.fillGrid : false;
    var containerID = param.containerID;
    var layoutID = param.layoutID;

    var form = document.getElementById(formID);
    var elements = form.querySelectorAll('input,select,table,textarea');
    
    for (var i = 0; i < elements.length; i++) {
        var serializable = elements[i].getAttribute("data-serializable");
        myJson = {};
        ///CRIA ARRAY DE VALORES
        
        if (elements[i].tagName === 'SELECT') {
            try {
                myJson["valor"] = elements[i].options[elements[i].selectedIndex].value;
                //console.log(elements[i].options[elements[i].selectedIndex].text);
            } catch (e) {

            }
        } else if (elements[i].tagName === 'TABLE' && returnString != true) {
            continue;
        }
        else {
            if ($(elements[i]).is(':checkbox')) {
                myJson["valor"] = $(elements[i]).is(':checked')
            } else {
                myJson["valor"] = elements[i].value
            }
        }
        
        myJson["field"] = $(elements[i]).attr("data-field")
        myJson["table"] = $(elements[i]).attr("data-table")  

        arrayObjs.push(myJson);
    }

    arrayObjs = sortBy(arrayObjs, "table")

    var json = ""    
    json += '['
    json += '    {'

    var Arraytable = [];

    for (var i = 0; i < arrayObjs.length; i++) { 
        if (arrayObjs[i].table && arrayObjs[i].field) {            
            if (Arraytable.indexOf(arrayObjs[i].table) < 0) {
                if (Arraytable.length > 0) {
                    json += '    }, {'
                }
    
                Arraytable.push(arrayObjs[i].table)
                json += '        "TABLE": "' + arrayObjs[i].table + '"'
            }else{
                json += '        ,"' + arrayObjs[i].field + '": "' + arrayObjs[i].valor + '" '
            }
        }         
    }
   
    json += '    }'
    json += ']'
    
    return json;
}


function sortBy(element, p) {
    return element.slice(0).sort(function(a,b) {
      return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
    });
  }

  function validateForm(formID){
    var retorno = true;    
    var form = document.getElementById(formID);
    var elements = form.querySelectorAll('input,select,table,textarea');
    var arrayfieldsValidate = []
    $(".summary-errors.alert.alert-danger.alert-dismissible").hide();
    $(".summary-errors.alert.alert-danger.alert-dismissible").html("Lista de Erros: </br>")
    for(var i=0; i < elements.length; i++){
        if ($(elements[i]).hasClass("required")) {
            if ($(elements[i]).val() == "") {
                var nameField = "";
                nameField = elements[i].placeholder;
                $(".summary-errors.alert.alert-danger.alert-dismissible").show();
                $(".summary-errors.alert.alert-danger.alert-dismissible").append("Campo " + nameField + " inválido </br>")
                $(elements[i]).css("border-color","#ff0000")
                retorno = false
            }else{
                $(elements[i]).css("border-color","#F7931E")
            }            
        }        
    }
    
    

    return retorno;
  }
