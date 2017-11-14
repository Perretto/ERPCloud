function fillForm(data, containerID, tabGenID) {

    if (data != null) {
        for (var i = 0; i < data.length; i++) {

            var datacontrolid = data[i].controlID;
            var controls = $("[data-controlid=" + datacontrolid + "]");

            for (var j = 0; j < controls.length; j++) {

                if (controls[j].nodeName != "TD" && controls[j].nodeName != "TH") {


                    field_type = controls[j].type;
                    switch (field_type) {
                        case "text":
                            if ($(controls[j]).hasClass("autocomplete") == true) {
                                controls[j].value = data[i].text[0];
                                var idAutoComplete = controls[j].id;
                                idAutoComplete = idAutoComplete.replace("_autocomplete", "");
                                $("#" + idAutoComplete).val(data[i].value[0]);
                            } else if ($(controls[j]).attr("data-nativeDataType") == "Data") {
                                if (data[i].value[0]) {
                                    controls[j].value = data[i].value[0].replace(" 00:00:00", "");
                                }                                
                            } else if ($(controls[j]).attr("data-nativeDataType") == "tree_grupos") {
                                controls[j].value = data[i].text[0];
                                var idAutoTreeView = controls[j].id;
                                idAutoTreeView = idAutoTreeView.replace("_treeview", "");
                                $("#" + idAutoTreeView).val(data[i].value[0]);
                            } else if ($(controls[j]).attr("data-nativeDataType") == "plano_contas") {
                                controls[j].value = data[i].text[0];
                                var idAutoTreeView = controls[j].id;
                                idAutoTreeView = idAutoTreeView.replace("_treeview", "");
                                $("#" + idAutoTreeView).val(data[i].value[0]);
                            } else if ($(controls[j]).attr("data-nativeDataType") == "Moeda") {
                                controls[j].value = data[i].value[0];
                                $("#" + controls[j].id).keyup();
                            } else if ($(controls[j]).attr("data-nativeDataType") == "Percent") {
                                controls[j].value = parseFloat(data[i].value[0]).toFixed(2).replace(".", ",");
                                $("#" + controls[j].id).keyup();
                            } else {
                                controls[j].value = data[i].value[0];
                            }

                            break;
                        case "textarea":
                            controls[j].value = data[i].value[0];
                            break;
                        case "checkbox":

                            if (data[i].value[0] === "SIM" || data[i].value[0] === "True") {
                                //controls[j].checked = true;
                                $("#" + controls[j].id).iCheck('check');
                            }
                            else {
                                //controls[j].checked = false;
                                $("#" + controls[j].id).iCheck('uncheck');
                            } break;
                        case "select-one":
                            for (var z = 0; z < controls[j].options.length; z++) {
                                if (controls[j].options[z].value === data[i].value[0]) {
                                    controls[j].selectedIndex = z;
                                    break;
                                }
                            }
                            break;
                        case "hidden":
                            controls[j].value = data[i].value[0];
                            $(controls[j]).val(data[i].value[0]).trigger("change");
                            break;
                        default:
                            break;
                    }

                    if (controls.length > 0) {
                        if (data[i].value.length > 0) {
                            var oldvalue = data[i].value[0];

                            if (oldvalue.toLowerCase() == "nan") {
                                oldvalue = "0";
                            }
                            $(controls[0]).attr("data-oldvalue", oldvalue);
                        }
                    }

                }

            }

        }
    }

}


function FillForm(data, containerID, tabGenID) {
    var count = 0;
    var str = "";
    var countGrid = 0;

    var idfk = [];
    var valfk = new Array;
    var idDerived = [];
    var iArray = 0;
    var control;
    var value;
    var container;
    
    if (data != null) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].value != null) {
                if (data[i].container.template != null) {
                    if (data[i].container.template.templateType != "MASTERDETAIL") {
                        
                        var image = $("img[data-propertyID=" + data[i].ID + "]");
                        if (image.length > 0) {
                            image.attr("src", data[i].value[0]);
                        } else {
                            if ($("input[data-fill2PropertyID=" + data[i].ID + "]").length) {
                                container = $("#" + containerID);
                                if (container) {
                                    if (container.length == 0) {
                                        container = $("#" + containerID + "_" + tabGenID);
                                    }
                                }

                                control = container.find("input[data-propertyID=" + data[i].ID + "],select[data-propertyID=" + data[i].ID + "],textarea[data-propertyID=" + data[i].ID + "]");
                                //control = $("input[data-fill2PropertyID=" + data[i].ID + "][data-propertyIDHidden=" + data[i].ID + "]");
                                value = data[i].value[0];
                                if (control.length > 0) {
                                    var idAutoComplete = control[0].id;
                                    if ($("#" + idAutoComplete + "_autocomplete").hasClass("autocomplete") == true) {
                                        control[0].value = data[i].value[0];
                                        //idAutoComplete = idAutoComplete.replace("_autocomplete", "");
                                        if (data[i].text[0]) {
                                            $("#" + idAutoComplete + "_autocomplete").val(data[i].text[0]);
                                        } else if (data[i].value[0]) {
                                            $("#" + idAutoComplete + "_autocomplete").val(data[i].value[0]);
                                        }
                                        else {
                                            $("#" + idAutoComplete + "_autocomplete").val("");
                                        }
                                    } else if (control[0].type == "checkbox") {
                                        if (value === "SIM" || value === "True") {
                                            //controls[j].checked = true;
                                            $("#" + control[0].id).iCheck('check');
                                        }
                                        else {
                                            //controls[j].checked = false;
                                            $("#" + control[0].id).iCheck('uncheck');
                                        }
                                    } else if ($(control[0]).attr("data-nativeDataType") == "tree_grupos") {
                                        control[1].val(value);
                                        control[0].val(data[i].text[0]);
                                    } else if ($(control[0]).attr("data-nativeDataType") == "plano_contas") {
                                        control[1].val(value);
                                        control[0].val(data[i].text[0]);
                                    } else if ($(control[0]).attr("data-nativeDataType") == "Moeda") {
                                        value = ConvertToNumber(value);
                                        $("#" + control[0].id).val(value).keyup();
                                    } else if ($(control[0]).attr("data-nativeDataType") == "Percent") {
                                        value = ConvertToNumberFixed(value);
                                        $("#" + control[0].id).val(value).keyup();
                                    } else if ($(control[0]).attr("data-nativeDataType") == "Quantidade") {
                                        value = ConvertToNumberFixed(value);
                                        $("#" + control[0].id).val(value).keyup();
                                    } else {
                                        control.val(value);
                                    }
                                }
                            } else {
                                container = $("#" + containerID);
                                if (container) {
                                    if (container.length == 0) {
                                        container = $("#" + containerID + "_" + tabGenID);
                                    }
                                }

                                control = container.find("input[data-propertyID=" + data[i].ID + "],select[data-propertyID=" + data[i].ID + "],textarea[data-propertyID=" + data[i].ID + "]");
                                //control = $("input[data-propertyID=" + data[i].ID + "],select[data-propertyID=" + data[i].ID + "],textarea[data-propertyID=" + data[i].ID + "]");
                                value = data[i].value[0];
                                if (control.length > 0) {
                                    var idAutoComplete = control[0].id;
                                    if ($("#" + idAutoComplete + "_autocomplete").hasClass("autocomplete") == true) {
                                        control[0].value = data[i].value[0];
                                        //idAutoComplete = idAutoComplete.replace("_autocomplete", "");
                                        if (data[i].text[0]) {
                                            $("#" + idAutoComplete + "_autocomplete").val(data[i].text[0]);
                                        } else if (data[i].value[0]) {
                                            $("#" + idAutoComplete + "_autocomplete").val(data[i].value[0]);
                                        }
                                        else {
                                            $("#" + idAutoComplete + "_autocomplete").val("");
                                        }
                                    } else if (control[0].type == "checkbox") {
                                        if (value === "SIM" || value === "True") {
                                            //controls[j].checked = true;
                                            $("#" + control[0].id).iCheck('check');
                                        }
                                        else {
                                            //controls[j].checked = false;
                                            $("#" + control[0].id).iCheck('uncheck');
                                        }
                                    } else if (control[0].type == "file") {
                                        var idContainer = control[1].id.substring(0, control[1].id.indexOf("_"));
                                        var controlImage = $(".control-image > div > figure > img");
                                        for (var index = 0; index < controlImage.length; index++) {
                                            if (controlImage[index].id.indexOf(idContainer) > -1) {
                                                $(".control-image > div > figure > img")[index].src = data[i].value[0];
                                                break;
                                            }
                                        }
                                        //SetUpload(control[0].ID, control[1].ID);
                                    } else if ($(control[0]).attr("data-nativeDataType") == "tree_grupos") {
                                        control[1].value = value;
                                        control[0].value = data[i].text[0];
                                    } else if ($(control[0]).attr("data-nativeDataType") == "plano_contas") {
                                        //control[1].value = value;
                                        control[0].value = data[i].text[0];
                                    } else if ($(control[0]).attr("localautocomplete") == "true") {
                                        var idAutoComplete = control[0].id;
                                        idAutoComplete = idAutoComplete.replace("_autocomplete", "");
                                        idAutoComplete += "_autocomplete";
                                        $("#" + idAutoComplete).val(data[i].text[0]);
                                        control.val(value);
                                    } else if ($(control[0]).attr("data-nativeDataType") == "Moeda") {
                                        value = ConvertToNumberFixed(value);
                                        $("#" + control[0].id).val(value).keyup();
                                    } else if ($(control[0]).attr("data-nativeDataType") == "Percent") {
                                        value = ConvertToNumberFixed(value);
                                        $("#" + control[0].id).val(value).keyup();
                                    } else if ($(control[0]).attr("data-nativeDataType") == "Quantidade") {
                                        value = ConvertToNumberFixed(value);
                                        $("#" + control[0].id).val(value).keyup();
                                    } else {
                                        control.val(value);
                                    }
                                }
                            }

                            container = $("#" + containerID);
                            if (container) {
                                if (container.length == 0) {
                                    container = $("#" + containerID + "_" + tabGenID);
                                }
                            }

                            control = container.find("input[data-propertyID=" + data[i].ID + "],select[data-propertyID=" + data[i].ID + "],textarea[data-propertyID=" + data[i].ID + "]");

                            if (control.length > 0) {
                                if (data[i].value.length > 0) {
                                    value = data[i].value[0];

                                    if (value.toLowerCase() == "nan") {
                                        value = "0";
                                    }
                                    $(control[0]).attr("data-oldvalue", value);
                                }

                                if ($(control[0]).attr("data-controlinputtype") == "TEXTCURRENCY") {
                                    FillDataCurrency(control[0], data);
                                }
                            }


                        }

                        
                        

                    } else {
                        count = count + 1;
                        if (str.indexOf(data[i].container.ID) == -1) {
                            str = str + data[i].container.ID + " ";
                            countGrid = countGrid + 1;
                        }
                    }
                }
            }

            if (data[i].systemName.toLowerCase() == "id") {// && data[i].derivedFromID == "00000000-0000-0000-0000-000000000000") {
                idfk[iArray] = "id_" + data[i].dataType.systemName;
                valfk[iArray] = new Array;
                valfk[iArray] = data[i].value;
                idDerived[iArray] = data[i].dataType.systemName;
                iArray = iArray + 1;
            }
        }

        var telaFK = $("#" + containerID)
        //var abaFK = telaFK.parents(".tab-pane");
        var abaFK = telaFK.parents("form.containerForm");

        if (abaFK.length > 0) {

            for (var p = 0; p < abaFK.length; p++) {
                 
                var abaFKID = $(abaFK[p]);

                for (var j = 0; j < idfk.length; j++) {
                    var controlFK = abaFKID.find("[data-field='" + idfk[j] + "']");

                    controlFK.val(valfk[j][0]);
                    //controlFK.val(valfk[j][j]);


                    $(controlFK).attr("data-oldvalue", valfk[j][0]);
                    
                  


                    var controlDerived = abaFKID.find("[data-derivedFrom='" + idDerived[j] + "']");

                    for (var i = 0; i < controlDerived.length; i++) {
                        if ($(controlDerived[i]).attr("data-field").toLowerCase() == "id") {
                            controlDerived[i].value = valfk[j][0];
                            $(controlDerived[i]).attr("data-oldvalue", valfk[j][0]);
                            //controlDerived[i].value = valfk[j][j];
                        }
                    }
                }
            }
        }

        var ContainerArray = new Array(count);
        var ContainerArrayFinal = new Array(count);
        var PropertyIDArray = new Array(count);
        var PropertyIDArrayFinal = new Array(count);
        var ValueArray = new Array(count);
        var GridArray = new Array(countGrid);
        var TextArray = new Array(count);
        var ValueArrayFinal = new Array(count);
        var ControlIDArray = new Array(count);
        var ControlIDArrayFinal = new Array(count);
        var visibleGridFinal = new Array(count);

        var countValue = 0;
        str = "";
        countGrid = 0;

        for (var i = 0; i < data.length; i++) {
            if (data[i].value != null) {
                if (data[i].container.template != null) {
                    if (data[i].container.template.templateType != "MASTERDETAIL") {

                    } else {
                        ContainerArray[countValue] = data[i].container.ID + "_" + tabGenID;
                        if (data[i].text) {
                            if (data[i].text.length > 0) {
                                ValueArray[countValue] = data[i].text;
                            } else {
                                ValueArray[countValue] = data[i].value;
                            }
                        } else {
                            ValueArray[countValue] = data[i].value;
                        }

                        TextArray[countGridValue] = data[i].text;
                        PropertyIDArray[countValue] = data[i].ID;
                        ControlIDArray[countValue] = data[i].controlID;

                        if (str.indexOf(data[i].container.ID) == -1) {
                            str = str + data[i].container.ID + " ";
                            GridArray[countGrid] = data[i].container.ID + "_" + tabGenID;
                            countGrid = countGrid + 1;
                        }

                        countValue = countValue + 1;
                    }
                }
            }
        }

        var html;

        //for (var i = 0; i < GridArray.length; i++) {
        //    var x = document.getElementById(GridArray[i] + "_table").rows.length;
        //    x = x - 1;
        //    for (var j = 0; j < x; j++) {
        //        $('#line_' + j + containerID).remove();
        //    }            
        //}

        var Arraypropertyid = [];
        var p = 0;
        var countGridValue = [];
        var visibleGrid = [];



        for (var i = 0; i < GridArray.length; i++) {
            //retorna todas as colunas da table e os atributos custom.
            var custom = $("#" + GridArray[i] + "_table table").find("th");

            //$("#" + GridArray[i] + "_table table").find("th").each(function () {
            for (var th = 0; th < custom.length; th++) {
                var propertyidTh = $(custom[th]).attr('data-propertyID');
                //var propertyidTh = custom[th].propertyID;

                if (propertyidTh != undefined) {
                    Arraypropertyid[p] = propertyidTh;

                    var visibleGridTh = $(custom[th]).attr('data-visibleGrid');
                    //var visibleGridTh = custom[th].visibleGrid;
                    if (visibleGridTh != undefined) {
                        visibleGrid[p] = visibleGridTh;
                    }
                    p = p + 1;
                    countGridValue[i] = p;
                }
            }
            //});
        }

        var q = 0;



        for (var p = 0; p < Arraypropertyid.length; p++) {
            for (var l = 0; l < count; l++) {
                if (PropertyIDArray[l] == Arraypropertyid[p]) {
                    ValueArrayFinal[q] = ValueArray[l];
                    ContainerArrayFinal[q] = ContainerArray[l];
                    ControlIDArrayFinal[q] = ControlIDArray[l];
                    PropertyIDArrayFinal[q] = PropertyIDArray[l];
                    visibleGridFinal[q] = visibleGrid[p];
                    q = q + 1;
                    break;
                }
            }
        }

        var x = 0;
        var countG = 0;
        var countsubG = 0;
        var isVisible = "";

        var addGrid = [];



        for (var k = 0; k < countGrid; k++) {
            var oTable = $("#" + GridArray[k] + "_table table tbody").find("tr").remove();
            //countsubG = 0
            //for (var l = 0; l < count; l++) {
            //countG = ValueArray[l].length;
            //for (var j = 0; j <= countG; j++) {
            //if (countG != 0) {
            //if (GridArray[k] == ContainerArrayFinal[l]) {
            //if (countsubG < countG) {
            //campo: "id"
            //class: null
            //controlID: "b7f43c96-ea0d-47c8-9b65-5ea5cb559848"
            //derivaDe: "null"
            //placeholder: null
            //sequencia: "2"
            //tabela: "endereco"
            //texto: ""
            //tipoDado: "ID"


            ///OBTEM ATRIBUTOS
            var msg = [];
            var valueFinal = [];

            var cont = 0;
            var myJson = {};
            var elements = $("#" + GridArray[k]);
            if (elements.length > 0) {
                for (var i = 0; i < count; i++) {
                    if (GridArray[k] == ContainerArrayFinal[i]) {
                        var element = $("th[data-propertyID=" + PropertyIDArrayFinal[i] + "]");
                        if (element.length > 0) {
                            myJson = {};
                            myJson["nativeDataType"] = element[0].getAttribute("data-nativeDataType");
                            myJson["table"] = element[0].getAttribute("data-table");
                            myJson["field"] = element[0].getAttribute("data-fielddata");
                            myJson["sequenceRecording"] = element[0].getAttribute("data-sequenceRecording");
                            myJson["controlID"] = element[0].getAttribute("data-controlid");
                            myJson["class"] = element[0].getAttribute("class");
                            myJson["placeholder"] = element[0].getAttribute("placeholder");
                            myJson["derivedFrom"] = element[0].getAttribute("data-derivedFrom");

                            myJson["visibleGrid"] = element[0].getAttribute("data-visiblegrid");
                            valueFinal = $.makeArray(ValueArrayFinal[i]); // [j]);

                            myJson["oldValue"] = valueFinal;
                            myJson["newValue"] = valueFinal;
                            myJson["texto"] = valueFinal;
                            msg[msg.length] = myJson;
                            cont++;
                        }
                    }
                }

                addRowGrid(GridArray[k], msg);

            }

            //countsubG = countsubG + 1;
            //}
            //}

            //}
            //}
            //break;
            //}

            //var countTR = 0;

            //$("#" + GridArray[k] + "_table table").find("tr").each(function () {
            //    //if ($("#" + GridArray[k] + "_table table").find("tr").length != 2) {                   
            //        if (countTR > 0) {
            //            //var tab = $("#" + GridArray[k] + "_table table");
            //            //document.getElementById(tab.id).deleteRow(countTR)
            //            //$("#" + tab.rows[countTR].id).remove();
            //            //tab[0].deleteRow(countTR);
            //            $(this).remove();
            //        }
            //    //}
            //    countTR++;
            //});

            //var linhas = $(GridArray[k] + "_table table").find("tr");
            //var lineCountGrid = linhas.length;

            //for (var i = 0; i < lineCountGrid; i++) {
            //    if (i > 0) {
            //        document.getElementById(GridArray[k] + "_table table").deleteRow(i);
            //    }
            //}



            //$("#" + GridArray[k] + "_table table tbody").append(html);

            //var table = $("#" + GridArray[k] + "_table table tbody").DataTable();

            //// Sort by column 1 and then re-draw
            //table
            //    .order([[1, 'asc']])
            //    .draw(false);

            //var dataTable = $("#" + GridArray[k] + "_table table").dataTable()
            //var newRow = $("#" + GridArray[k] + "_table table").dataTable().fnAddData(addGrid);

            ////change cell attributes
            //var oSettings = dataTable.fnSettings();
            //var nTr = oSettings.aoData[newRow[0]].nTr;
            //for (var i2 = 0; i2 < count; i2++) {
            //    $('td', nTr)[i2].setAttribute('id', i2 + 1);
            //}

        }


    }

    
}

function FillDataCurrency(control, data) {
    var table = $(control).attr("data-table");
    var field = $(control).attr("data-field");
    var Arrayid = $.grep(data, function (v) { return v.systemName === 'id'; });
    var id = "";

    if (Arrayid) {
        if (Arrayid.length > 0) {
            id = Arrayid[0].value[0];
        }
    }

    if (id) {
        var update = true;

        $.ajax({
            url: getGlobalParameters("urlPlataforma") + "/api/database/getDataCurrency?EnterpriseID=" + returnCookie("EnterpriseID") + "&UserID=" + returnCookie("UserID") + "&Table=" + table + "&Field=" + field + "&ValueID=" + id,
            async: false,
            success: function (response) {
                var inputspanel = $("#" + control.id + "_panel");
                if (inputspanel) {
                    if (inputspanel.length > 0) {
                        if (response) {
                            if (response.length > 0) {
                                if (response[0].value.length > 0) {
                                    for (var i = 0; i < response[0].value.length; i++) {
                                        var input = $(inputspanel[0]).find("[data-referenceid=" + response[0].value[i] + "]");

                                        if (input) {
                                            if (input.length > 0) {
                                                $(input[0]).val(response[1].value[i]);
                                                update = false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    if (update) {
        getQuotationControl(control.id);
    }
}

function getQuotationControl(idControl) {

    if (idControl) {
        var valor = $("#" + idControl).val();

        $.ajax({
            url: getGlobalParameters("urlPlataforma") + "/api/database/getQuotationDay?EnterpriseID=" + returnCookie("EnterpriseID") + "&UserID=" + returnCookie("UserID") + "&Valor=" + valor,
            async: false,
            success: function (response) {
                var inputspanel = $("#" + idControl + "_panel");
                if (inputspanel) {
                    if (inputspanel.length > 0) {
                        if (response) {
                            if (response.length > 0) {
                                if (response[0].value.length > 0) {
                                    for (var i = 0; i < response[0].value.length; i++) {
                                        var input = $(inputspanel[0]).find("[data-referenceid=" + response[0].value[i] + "]");

                                        if (input) {
                                            if (input.length > 0) {
                                                var valorConvertido = response[1].value[i];

                                                if (valorConvertido == "") {
                                                    valorConvertido = "0";
                                                }

                                                $(input[0]).val(valorConvertido);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}


function AddRow(id, Cols, Value) {
    var tbody = document.getElementById
    (id).getElementsByTagName("TBODY")[0];
    var row = document.createElement("TR")

    for (var i = 0; i < Cols; i++) {
        var td = document.createElement("TD")
        if (i == 0) {
            td.appendChild(document.createTextNode(""))
        } else {
            td.appendChild(document.createTextNode(Value))
        }
        row.appendChild(td);
    }

    tbody.appendChild(row);
}