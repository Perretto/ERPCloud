function SerializeFields(param) {

    var formID = param.formID;
    var returnString = (param.returnString) ? param.returnString : false;
    var fillGrid = (param.fillGrid) ? param.fillGrid : false;
    var containerID = param.containerID;
    var layoutID = param.layoutID;
    var str = "";
    var str2 = "";
    var msg = [];
    var cont = 0;
    var form = document.getElementById(formID);
    var elements = form.querySelectorAll('input,select,table,textarea');
    var myJson = {};

    var container = document.getElementById(formID + "_panel");
    var isParameter = container.getAttribute('data-parameters');

    for (var i = 0; i < elements.length; i++) {

        var serializable = elements[i].getAttribute("data-serializable");
        myJson = {};

        var valOrigem = [];
        var valNovo = [];
        var texto = [];

        ///CRIA ARRAY DE VALORES
        if (elements[i].tagName === 'SELECT') {
            try {
                valOrigem = $.makeArray(elements[i].options[elements[i].selectedIndex].value);
                valNovo = $.makeArray(elements[i].options[elements[i].selectedIndex].value);
                texto = $.makeArray(elements[i].options[elements[i].selectedIndex].text);
            } catch (e) {

            }
        } else if (elements[i].tagName === 'TABLE' && returnString != true) {
            continue;
        }
        else {
            if ($(elements[i]).is(':checkbox')) {
                valOrigem = $.makeArray($(elements[i]).is(':checked'));
                valNovo = $.makeArray($(elements[i]).is(':checked'));

                myJson["derivedFrom"] = null;
            } else {
                valOrigem = $.makeArray(elements[i].value);
                valNovo = $.makeArray(elements[i].value);

                myJson["derivedFrom"] = elements[i].getAttribute("data-derivedFrom");
            }
        }

        ///OBTEM ATRIBUTOS
        myJson["nativeDataType"] = elements[i].getAttribute("data-nativeDataType");
        myJson["table"] = elements[i].getAttribute("data-table");
        myJson["field"] = elements[i].getAttribute("data-field");
        myJson["oldValue"] = valOrigem;
        myJson["newValue"] = valNovo;
        myJson["sequenceRecording"] = elements[i].getAttribute("data-sequenceRecording");
        myJson["controlID"] = elements[i].getAttribute("data-controlId");
        myJson["EnterpriseID"] = returnCookie("EnterpriseID");
        myJson["userID"] = returnCookie("UserID");
        myJson["containerID"] = containerID;
        myJson["layoutID"] = layoutID;

        ///OBTEM DERIVADE
        if (elements[i].tagName === 'SELECT') {
            myJson["derivedFrom"] = null;
        } else {
            myJson["derivedFrom"] = elements[i].getAttribute("data-derivedFrom");
        }

        ///OBTEM ROTULO
        if (elements[i].tagName === 'SELECT') {
            try {
                myJson["texto"] = elem, ents[i].options[elements[i].selectedIndex].text;
            } catch (e) {

            }
        }
        else if ($(elements[i]).is(':checkbox')) {
            if ($(elements[i]).is(':checked')) {
                myJson["texto"] = "SIM";
            } else {
                myJson["texto"] = "NÃO";
            }
        } else {
            myJson["texto"] = elements[i].value;
        }

        var isDisabled = elements[i].getAttribute('disabled');
        if (isDisabled == true) {
            valOrigem = $.makeArray('');
            valNovo = $.makeArray('');
        }

        if (serializable == "true" || fillGrid == true) {
            if (myJson.table != null && myJson.field != null) {
                if (str.indexOf(myJson.table + "." + myJson.field + " ") == -1 || isParameter) {
                    msg[cont] = myJson;
                    cont++;
                    str = str + myJson.table + "." + myJson.field + " ";
                }
            } else {
                //msg[cont] = myJson;
                //cont++;
            }
        }
    }

    var controlFK = $(form).find("[data-field='id']");
    var telaFK = $(form)
    var abaFK = telaFK.parents("form.containerForm");

    //var abaFK = telaFK.parents(".tab-pane");
    if (abaFK.length > 0) {
        var abaFKID = abaFK[0].id;
        var valfk = new Array;

        if (controlFK.length > 0) {
            if (valfk.length > 0) {

                valfk[0] = controlFK[0].value;

                var controlDerived = $("#" + abaFKID + " [data-derivedFrom='" + $(controlFK[0]).attr("data-table") + "']");

                for (var i = 0; i < controlDerived.length; i++) {
                    if ($(controlDerived[i]).attr("data-field") == "id") {
                        if (str.indexOf($(controlDerived[i]).attr("data-table") + "." + $(controlDerived[i]).attr("data-field") + " ") == -1) {
                            myJson = {};
                            myJson["nativeDataType"] = $(controlDerived[i]).attr("data-nativeDataType");
                            myJson["table"] = $(controlDerived[i]).attr("data-table");
                            myJson["field"] = $(controlDerived[i]).attr("data-field");
                            myJson["oldValue"] = valfk;
                            myJson["newValue"] = valfk;
                            myJson["sequenceRecording"] = $(controlDerived[i]).attr("data-sequenceRecording");
                            myJson["controlID"] = $(controlDerived[i]).attr("data-controlid");
                            myJson["derivedFrom"] = $(controlDerived[i]).attr("data-derivedFrom");
                            myJson["enterpriseID"] = returnCookie("EnterpriseID");
                            myJson["userID"] = returnCookie("UserID");
                            myJson["containerID"] = containerID;
                            myJson["layoutID"] = layoutID;

                            msg[msg.length] = myJson;
                            break;
                        }
                    }
                }

            }
        }
    }


    if (returnString == true) {
        return JSON.stringify(msg);
    }
    else {
        return msg;
    }
}

function ClearForm(formId, clearTable) {

    var form = document.getElementById(formId);

    if ($(form).hasClass("principalContainer")) {
        form = $(form).parents("form")
        form = form[0]
        clearTable = true
    }

    if (form) {
        //var elements = form.getElementsByTagName("input");
        var elements = form.querySelectorAll('input,select,table,textarea,password,checkbox,select-multi,select-one');

        for (i = 0; i < elements.length; i++) {
            field_type = elements[i].type;
            var derivedFrom = elements[i].getAttribute("data-derivedFrom");
            if (derivedFrom == "null" || elements[i].classList.contains("autocomplete") || $(elements[i]).attr("localautocomplete") != undefined) {

                switch (field_type) {
                    case "hidden":
                        elements[i].value = "";
                        break;
                    case "text":
                        if (elements[i].getAttribute("data-nativeDataType") == "Data") {
                            elements[i].value = $(elements[i]).attr("data-oldvalue");

                            //var today = new Date();
                            //var dd = today.getDate();
                            //var mm = today.getMonth() + 1; //January is 0!
                            //var yyyy = today.getFullYear();

                            //if (dd < 10) {
                            //    dd = '0' + dd
                            //}

                            //if (mm < 10) {
                            //    mm = '0' + mm
                            //}

                            //today = dd + '/' + mm + '/' + yyyy;
                            //elements[i].value = today;
                        }
                        else if (elements[i].getAttribute("data-nativeDataType") == "Moeda" || elements[i].getAttribute("data-nativeDataType") == "Quantidade") {
                            elements[i].value = 0;
                        }
                        else {
                            elements[i].value = "";
                        }
                        break;
                    case "password":
                        elements[i].value = "";
                        break;
                    case "textarea":
                        elements[i].value = "";
                        break;
                        //case "radio":
                    case "number":
                        elements[i].value = 0;
                        break;
                    case "email":
                        elements[i].value = "";
                    case "file":
                        var input = $(elements[i]);
                        var propertyID = $(elements[i]).attr("data-propertyid");
                        input.replaceWith(input.val('').clone(true));
                        $(elements).find("input[data-propertyid=" + propertyID + "]").val("")
                        break;
                    default:
                        break;
                }
            }

            switch (field_type) {
                case "checkbox":
                    //if (elements[i].checked) {
                    $("#" + elements[i].id).iCheck('uncheck');
                    //}
                    break;
                case "select-one":
                    elements[i].selectedIndex = 0;
                    break;
                case "select-multi":
                    elements[i].selectedIndex = 0;
                    break;
                default:
                    break;
            }
        }

        var thisTable = $("#" + formId + "_table")
        if (thisTable.length == 0) {
            thisTable = $("<table></table>");
            thisTable.id = ""
        }

        thisTable.find("tr.selected").removeClass("selected")

        if (clearTable == true) {
            var tables = form.querySelectorAll('table');

            for (var i = 0; i < tables.length; i++) {
                var table = tables[i];
                if ($(table).parents(".tableContainer").id != thisTable.id) {
                    var derivedFrom = table.getAttribute("data-derivedFrom");
                    if (!derivedFrom) {
                        table = (table.tBodies[0]) ? table.tBodies[0] : table;
                        var rowCount = table.rows.length;

                        if (rowCount > 0) {
                            for (var j = rowCount; j >= 0; j--) {
                                var row = table.rows[0];
                                if (typeof row != 'undefined') {
                                    table.deleteRow(0);
                                }
                            }
                        }
                    }
                }

            }
        }

        $(form).formValidation('resetForm', true);
    }
}

function DeserializeFields(json, form, containerRandomID) {
    var idfk = [];
    var valfk = new Array;
    var idDerived = [];
    var iArray = 0;
    var telaFK = $("#" + form)
    var abaFK = telaFK.parents("form.containerForm");

    for (index = 0; index < json.length; ++index) {

        if (json[index]['field'] == "id" && json[index]['derivedFrom'] == "null") {
            idfk[iArray] = "id_" + json[index]['table'];
            valfk[iArray] = new Array;
            valfk[iArray] = json[index]['newValue'];
            idDerived[iArray] = json[index]['table'];
            iArray = iArray + 1;
        }

        //var control = $("input[data-controlid=" + json[index]['controlID'] + "]," +
        //    "select[data-controlid=" + json[index]['controlID'] + "]," +
        //    "textarea[data-controlid=" + json[index]['controlID'] + "]");

        //// var control = elements.querySelectorAll('input,select,table,textarea');

        //for (cont = 0; cont < control.length; cont++) {

        //    control[cont].setAttribute('data-nativeDataType', json[index]['nativeDataType']);
        //    control[cont].setAttribute('data-table', json[index]['table']);
        //    control[cont].setAttribute('data-field', json[index]['field']);

        //    if (typeof json[index]['newValue'][0] != 'undefined') {
        //        if ($(control[cont]).attr("data-nativeDataType") == "tree_grupos") {

        //        }else{
        //        control[cont].setAttribute('data-oldValue', json[index]['newValue'][0]);
        //        control[cont].setAttribute('data-newValue', json[index]['newValue'][0]);
        //        control[cont].value = json[index]['newValue'][0];
        //    }

        //    }

        //    control[cont].setAttribute('data-sequenceRecording', json[index]['sequenceRecording']);
        //    control[cont].setAttribute('data-controlId', json[index]['controlID']);
        //    control[cont].setAttribute('data-derivedFrom', json[index]['derivedFrom']);
        //    //control.setAttribute('message', json[index]['message']);
        //}

        for (var p = 0; p < abaFK.length; p++) {

            var abaID = $(abaFK[p]);


            //var control = $("input[data-controlid=" + json[index]['controlID'] + "]," +
            var control = abaID.find("[data-controlid='" + json[index]['controlID'] + "']");
            //"select[data-controlid=" + json[index]['controlID'] + "]," +
            //"textarea[data-controlid=" + json[index]['controlID'] + "]");

            // var control = elements.querySelectorAll('input,select,table,textarea');

            for (cont = 0; cont < control.length; cont++) {

                control[cont].setAttribute('data-nativeDataType', json[index]['nativeDataType']);
                control[cont].setAttribute('data-table', json[index]['table']);
                control[cont].setAttribute('data-field', json[index]['field']);

                if (typeof json[index]['newValue'][0] != 'undefined') {
                    var treeview;
                    if ($(control[cont]).length > 0) {
                        treeview = $(control[cont])[0];
                    }


                    if (treeview.id.indexOf("treeview") > -1) {

                    } else {
                        control[cont].setAttribute('data-oldValue', json[index]['newValue'][0]);
                        control[cont].setAttribute('data-newValue', json[index]['newValue'][0]);
                        control[cont].value = json[index]['newValue'][0];
                        $("#" + control[cont].id).keyup();
                    }

                }

                control[cont].setAttribute('data-sequenceRecording', json[index]['sequenceRecording']);
                control[cont].setAttribute('data-controlId', json[index]['controlID']);
                control[cont].setAttribute('data-derivedFrom', json[index]['derivedFrom']);
                //control.setAttribute('message', json[index]['message']);

            }
        }
    }

    //var abaFK = telaFK.parents(".tab-pane");
    if (abaFK.length > 0) {

        for (var p = 0; p < abaFK.length; p++) {

            var abaFKID = $(abaFK[p]);

            for (var j = 0; j < idfk.length; j++) {

                var controlFK = abaFKID.find("[data-field='" + idfk[j] + "']");
                var controlDerived = abaFKID.find("[data-derivedFrom='" + idDerived[j] + "']");

                controlFK.val(valfk[j][0]);
                //controlFK.val(valfk[j][j]);

                for (var i = 0; i < controlDerived.length; i++) {
                    if ($(controlDerived[i]).attr("data-field").toLowerCase() == "id") {
                        controlDerived[i].value = valfk[j][0];
                        //controlDerived[i].value = valfk[j][j];
                    }
                }
            }
        }
    }

    var isMasterDetail = $("#" + form + "_table");

    if (isMasterDetail.length > 0) {
        //var fieldsData = {}
        //Serializa o Masterdetail
        fieldsData = SerializeMasterDetail(form);

        var cardGrid = $("#" + form + "_table").attr("data-cardgrid");

        if (cardGrid == true || cardGrid == "true") {
            addRowCard(form, fieldsData);
        } else {
            addRowGrid(form, fieldsData);
        }
    }
    //gravaMasterDetail(ContainerRandomID, Form, json);
}

function SerializaGrid(idGrid) {

    var arrayLinhas = [];
    var myJson = {};

    var grid = document.getElementById(idGrid);

    var qtdRows = grid.rows.length;

    var valoresColuna = [];
    var valoresOrigem = [];

    var msg2 = [];
    var z = 0;

    var required = "";

    if (qtdRows > 0) {

        var qtdColumns = grid.rows[1].cells.length;


        for (var j = 1; j < qtdColumns; j++) {

            for (var x = 0; x < qtdRows; x++) {
                if (x > 0) {
                    try {
                        var value = grid.rows[x].cells[j].getAttribute("data-newValue");

                        valoresColuna[z] = value;
                        z = z + 1;

                        required = grid.rows[x].cells[j].getAttribute("required")
                        //Se a coluna for requerida e não tiver valor preenchida, não vamos serializar o Grid.
                        if (required != "" && required != "null" && required != null && value == "" || value == null) {
                            msg2 = [];
                            return msg2;
                        }

                    } catch (e) {

                    }
                }
            }

            z = 0;

            for (var y = 0; y < qtdRows; y++) {
                if (y > 0) {
                    try {
                        var value = grid.rows[y].cells[j].getAttribute("data-oldValue");
                        valoresOrigem[z] = value;
                        z = z + 1;

                        required = grid.rows[x].cells[j].getAttribute("required")
                        //Se a coluna for requerida e não tiver valor preenchida, não vamos serializar o Grid.
                        if (required != "" && required != "null" && required != null && value == "" || value == null) {
                            msg2 = [];
                            return msg2;
                        }

                    } catch (e) {

                    }
                }
            }

            z = 0;

            myJson["nativeDataType"] = grid.rows[1].cells[j].getAttribute("data-nativeDataType");
            myJson["table"] = grid.rows[1].cells[j].getAttribute("data-table");
            myJson["field"] = grid.rows[1].cells[j].getAttribute("data-field");
            myJson["oldValue"] = valoresOrigem;
            myJson["newValue"] = valoresColuna;
            myJson["sequenceRecording"] = grid.rows[1].cells[j].getAttribute("data-sequenceRecording");
            myJson["controlID"] = grid.rows[1].cells[j].getAttribute("data-controlId");
            myJson["derivedFrom"] = grid.rows[1].cells[j].getAttribute("data-derivedFrom");

            msg2.push(myJson);
            myJson = {};
            valoresOrigem = [];
            valoresColuna = [];
        }

        //arrayLinhas = JSON.stringify(msg);

        return msg2;
    }

}

function SerializeMasterDetail(idMasterDetail) {

    var str = "";
    var str2 = "";
    var msg = [];
    var cont = 0;

    var masterDetail = document.getElementById(idMasterDetail);
    var elements = masterDetail.querySelectorAll('input,select,textarea,password,checkbox,select-multi,select-one');

    for (var i = 0; i < elements.length; i++) {



        var serializable = elements[i].getAttribute("data-serializable");
        var myJson = {};

        var valOrigem = [];
        var valNovo = [];
        var text = [];
        var textList = [];
        var valueList = [];

        ///CRIA ARRAY DE VALORES
        if (elements[i].tagName === 'SELECT') {
            try {
                valOrigem = $.makeArray(elements[i].options[elements[i].selectedIndex].value);
                valNovo = $.makeArray(elements[i].options[elements[i].selectedIndex].value);
                options = elements[i].options;
                for (var i2 = 0; i2 < options.length; i2++) {
                    textList[i2] = options[i2].text;
                    valueList[i2] = options[i2].value;
                }
            } catch (e) {

            }
        } else {
            if ($(elements[i]).is(':checkbox')) {
                valOrigem = $.makeArray($(elements[i]).is(':checked'));
                valNovo = $.makeArray($(elements[i]).is(':checked'));

                myJson["derivedFrom"] = null;
            } else {
                valOrigem = $.makeArray(elements[i].value);
                valNovo = $.makeArray(elements[i].value);

                myJson["derivedFrom"] = elements[i].getAttribute("data-derivedFrom");
            }

        }

        ///OBTEM ATRIBUTOS
        myJson["nativeDataType"] = elements[i].getAttribute("data-nativedatatype");
        myJson["table"] = elements[i].getAttribute("data-table");
        myJson["field"] = elements[i].getAttribute("data-field");
        myJson["oldValue"] = valOrigem;
        myJson["newValue"] = valNovo;
        myJson["textList"] = textList;
        myJson["valueList"] = valueList;
        myJson["sequenceRecording"] = elements[i].getAttribute("data-sequenceRecording");
        var th = $("th[data-controlid =" + elements[i].getAttribute("data-controlid") + "]")

        if (elements[i].type == "hidden") {
            myJson["visibleGrid"] = "false"
        } else {
            if (th.length > 0) {
                myJson["visibleGrid"] = th[0].getAttribute("data-visibleGrid");
            }
        }
        myJson["controlID"] = elements[i].getAttribute("data-controlid");
        myJson["class"] = elements[i].getAttribute("class");
        myJson["placeholder"] = elements[i].getAttribute("placeholder");
        myJson["title"] = elements[i].getAttribute("placeholder");

        ///OBTEM DERIVADE
        if (elements[i].tagName === 'SELECT') {
            myJson["derivedFrom"] = null;
        } else {
            myJson["derivedFrom"] = elements[i].getAttribute("data-derivedFrom");
        }

        ///OBTEM ROTULO
        if (elements[i].tagName === 'SELECT') {
            try {
                myJson["controlType"] = "DROPDOWN"
                myJson["text"] = elements[i].options[elements[i].selectedIndex].text;
            } catch (e) {

            }

        }
        else if ($(elements[i]).is(':checkbox')) {
            if ($(elements[i]).is(':checked')) {
                myJson["text"] = "SIM";
            } else {
                myJson["text"] = "NÃO";
            }
        } else {
            myJson["text"] = elements[i].value;
        }

        var isDisabled = elements[i].getAttribute('disabled');

        if (isDisabled == true) {
            valOrigem = $.makeArray('');
            valNovo = $.makeArray('');
        }

        if (myJson.table != null && myJson.field != null) {
            if (myJson.field == '') {
                myJson.field = i;
            }
            if (str.indexOf(myJson.table + "." + myJson.field + " ") == -1) {
                msg[cont] = myJson;
                cont++;
                str = str + myJson.table + "." + myJson.field + " ";
            }

        }

    }

    return msg;
}

function SerializaLinhaGrid(row, url) {

    //var row = document.getElementById(idRow);
    var cont = row.cells.length;

    var valOrigem = [];
    var valNovo = [];

    var myJson = {};
    var msg = [];

    //var controls = $("[data-controlid=" + row.cells[i].getAttribute("data-controlid") + "]");


    var indexID = 0;

    for (var x = 0; x < cont; x++) {
        if (row.cells[x].getAttribute("data-field") == "id") {
            indexID = x;
            break;
        }
    }

    valOrigem[0] = row.cells[indexID].getAttribute("data-newValue");
    valNovo[0] = row.cells[indexID].getAttribute("data-newValue");

    myJson["controlID"] = row.cells[indexID].getAttribute("data-controlid");
    myJson["nativeDataType"] = row.cells[indexID].getAttribute("data-nativeDataType");
    myJson["table"] = row.cells[indexID].getAttribute("data-table");
    myJson["field"] = row.cells[indexID].getAttribute("data-field");
    myJson["sequenceRecording"] = row.cells[indexID].getAttribute("data-sequenceRecording");
    myJson["derivedFrom"] = row.cells[indexID].getAttribute("data-derivedFrom");
    myJson["oldValue"] = valOrigem;
    myJson["newValue"] = valNovo;

    msg[0] = myJson;

    if (url != null) {
        var EnterpriseID = returnCookie("EnterpriseID");
        msg = JSON.stringify(msg);
        postAjaxParameter(EnterpriseID, url, msg, "");
    }
}