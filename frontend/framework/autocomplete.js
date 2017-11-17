
function bindAutocomplete(controlID, nameLayout, LayoutID, TitleMenu, PropertyID, containerID, FormID, id, Fill1PropertyID, tabGenID) {
    
        var EnterpriseID = returnCookie("EnterpriseID");
        var UserID = returnCookie("UserID");
    
        $(".autocomplete").autocomplete({
            minLength: 1,
            source: function (request, response) {
                var filter = "/" + request.term + "/" + controlID;
                //loaderImage(controlID + "_formgroup .control-group", true);
                $.ajax({
                    url: getGlobalParameters("urlPlataform") + "/api/RenderAutoComplete" + filter,
                    //data: { Filtro: request.term, GuidControl: controlID, EnterpriseID: EnterpriseID, UserID: UserID, LayoutID: LayoutID },
                    dataType: 'json',
                    success: function (data) {
                        response(
                            data
                        );
                    

                   
                    loaderImage(controlID + "_formgroup .control-group", false);
                    //response(label: data[0].text, value: data[0].value });
                    },
                    error: function () {
                        loaderImage(controlID + "_formgroup", false);    
                    }
                })
    
            },
            select: function (event, ui) {
                loaderImage(containerID + "_panel", true);
                var id = $(this).attr("id");
                id = id.replace("_autocomplete", "");

                var chaveid = "";
                if (ui.item.id.length > 0) {
                    chaveid = ui.item.id;
                    //document.getElementsById(id) = ui.item.id[0];
                    $("#" + id).val(ui.item.id[0]);
                    $("#" + id).attr('name', ui.item.id[0]);
                }
    
    
                if (ui.item.id == "MSG_ERR") {
    
                    loaderImage(containerID + "_panel", false);
                    if (LayoutID != "" && nameLayout != "" && TitleMenu != "") {
    
                        CreateAba(nameLayout, LayoutID, TitleMenu);
    
                        id = "#" + id.replace("#", "");
                        document.getElementById(id) = "";
                    }
                    //var tipo;
                    //var mensagem;
                    //tipo = "ALERTAMODAL";
                    //mensagem = "teste de alerta!!";
                    //Alerta(tipo, mensagem);
                } else {
                    var item = $("#" + id);
                    if (item.attr("localAutoComplete") == "false") {
                        filleditnavigation(chaveid,LayoutID, "" ,"960db7ed-e1bb-692f-03e9-df62d8c20e4e_nav" )

                        //$.ajax({
                        //    url: getGlobalParameters("urlPlataforma") + "/api/database/DataSearch",
                        //    data: { Filtro: ui.item.id, FormID: LayoutID, ReferenceID: Fill1PropertyID, EnterpriseID: EnterpriseID },
                        //    dataType: 'json',
                        //    success: function (data) {
                        //        //FillForm(data, FormID, tabGenID);
                        //        loaderImage(containerID + "_panel", false);
                        //    }
                        //});
                    }
                    else {
                                loaderImage(containerID + "_panel", false);
                    }
                }
                loaderImage(containerID + "_panel", false);
                $("#" + id).val(ui.item.id).trigger("change");
            }
        });
    
    }
    