function CreateFormSearch(form, targetID, layoutID, tabGenID) {
    var formSearch = "";
    var id = form.ID + "_FormSearch";
    var controlID;
    var propertyID;
    var table;
    var field;
    var title;
    var layoutID;

    var retorno = "";

    retorno = retorno + "<div class='modal slide' id='" + id + "_alertaModalFormSearchShow' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>";
    retorno = retorno + "   <div class='modal-dialog'>";
    retorno = retorno + "        <div class='modal-content'>";
    retorno = retorno + "            <div class='modal-header label-info white'>";
    retorno = retorno + "                <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>";

    if (form.title) {
        if (form.title.length > 0) {
            retorno = retorno + "                <h4 class='modal-title' id='H2'>" + form.title[0].text + "<br /></h4>";
        } else {
            retorno = retorno + "                <h4 class='modal-title' id='H2'>" + form.systemName + "<br /></h4>";
        }
    } else {
        retorno = retorno + "                <h4 class='modal-title' id='H2'>" + form.systemName + "<br /></h4>";
    }
    

    retorno = retorno + "            </div>";
    retorno = retorno + "            <div class='modal-body'>";
    retorno = retorno + "                <div id='" + id + "_alertaModalFormSearch'></div>";
    retorno = retorno + "                <label  class='' id='" + id + "_ContainerFormSearch'></label>";
    retorno = retorno + "                <div id='" + id + "_ContainerControlType'></div>";
    retorno = retorno + "                <table style='width:100%' id='" + id + "_ContainerSearch'></table>";
    retorno = retorno + "                <div id='" + id + "_ContainerButtonSearch'></div>";
    retorno = retorno + "                <div id='" + id + "_GridFormSearch'></div>";
    retorno = retorno + "            </div>";
    //retorno = retorno + "            <div class='modal-footer'>";
    //retorno = retorno + "                <button type='button' class='btn btn-info btn-xs' data-dismiss='modal'>Close</button>";
    //retorno = retorno + "            </div>";
    retorno = retorno + "        </div>";
    retorno = retorno + "    </div>";
    retorno = retorno + "</div>";

    $("#" + targetID).append(retorno);


    formSearch = formSearch + "<div class='row'>";
    formSearch = formSearch + "    <div class='col-md-12'>";
    formSearch = formSearch + "        <select id='select-repeated-options' class='demo-default col-md-12' multiple>";
    //FormSearch = FormSearch + "            <option value=''>Select...</option>";


    if (form.container != null || form.container != undefined) {
        for (var i = 0; i < form.container.length; i++) {
            if (form.container[i].Form != null) {
                if (form.container[i].Form[0].container != null) {
                    for (var k = 0; k < form.container[i].Form[0].container.length; k++) {
                        formSearch = formSearch + "            <optgroup label='" + form.container[i].Form[0].container[k].title[0].text + "'>";
                        for (var y = 0; y < form.container[i].Form[0].container[k].control.length; y++) {
                            fable = form.container[i].Form[0].container[k].control[y].table;
                            field = form.container[i].Form[0].container[k].control[y].field;

                            if (form.container[i].Form[0].container[k].control[y].title) {
                                if (form.container[i].Form[0].container[k].control[y].title.length > 0) {
                                    title = form.container[i].Form[0].container[k].control[y].title[0].text;
                                } else {
                                    title = form.container[i].Form[0].container[k].control[y].systemName;
                                }
                            } else {
                                title = form.container[i].Form[0].container[k].control[y].systemName;
                            }
                            
                            controlType = form.container[i].Form[0].container[k].control[y].controlType;
                            controlID = form.container[i].Form[0].container[k].control[y].ID;
                            propertyID = form.container[i].Form[0].container[k].control[y].propertyID;
                            layoutID = form.layoutID;
                            formSearch = formSearch + "                <option data-table='" + table + "' onclick=\"OpenTypeData('" + id + "','" + controlType + "','" + title + "','" + controlID + "', '" + propertyID + "','" + table + "','" + field + "','" + layoutID + "', '" + tabGenID + "')\"  value='a'>" + title + "</option>";
                        }
                        formSearch = formSearch + "            </optgroup>";
                    }
                }
            }

            if (form.container[i].title) {
                formSearch = formSearch + "            <optgroup label='" + form.container[i].title[0].text + "'>";
            } else {
                formSearch = formSearch + "            <optgroup label='" + form.container[i].systemName + "'>";
            }
            
            for (var j = 0; j < form.container[i].control.length; j++) {
                controlID = form.container[i].control[j].ID;
                propertyID = form.container[i].control[j].propertyID;
                table = form.container[i].control[j].table;
                field = form.container[i].control[j].field;

                if (form.container[i].control[j].title) {
                    if (form.container[i].control[j].title.length > 0) {
                        title = form.container[i].control[j].title[0].text;
                    } else {
                        title = form.container[i].control[j].systemName;
                    }
                } else {
                    title = form.container[i].control[j].systemName;
                }                

                controlType = form.container[i].control[j].controlType;
                layoutID = form.layoutID;
                formSearch = formSearch + "                <option  data-table='" + table + "' onclick=\"OpenTypeData('" + id + "','" + controlType + "','" + title + "','" + controlID + "', '" + propertyID + "','" + table + "','" + field + "','" + layoutID + "', '" + tabGenID + "')\"   value='a'>" + title + "</option>";
            }
            formSearch = formSearch + "            </optgroup>";
        }
    } else {
        if (form != null) {
            if (form.title) {
                if (form.title.length > 0) {
                    formSearch = formSearch + "            <optgroup label='" + form.title[0].text + "'>";
                } else {
                    formSearch = formSearch + "            <optgroup label='" + form.systemName + "'>";
                }
            } else {
                formSearch = formSearch + "            <optgroup label='" + form.systemName + "'>";
            }
            
            for (var y = 0; y < form.control.length; y++) {
                table = form.control[y].table;
                field = form.control[y].field;
                if (form.control[y].title) {
                    if (form.control[y].title.length > 0) {
                        title = form.control[y].title[0].text;
                    } else {
                        title = form.control[y].systemName;
                    }
                } else {
                    title = form.control[y].systemName;
                }
                controlType = form.control[y].controlType;
                controlID = form.control[y].ID;
                propertyID = form.control[y].propertyID;
                layoutID = layoutID;
                formSearch = formSearch + "                <option data-table='" + table + "' onclick=\"OpenTypeData('" + id + "','" + controlType + "','" + title + "','" + controlID + "', '" + propertyID + "','" + table + "','" + field + "','" + layoutID + "', '" + tabGenID + "')\"  value='a'>" + title + "</option>";
            }
            formSearch = formSearch + "            </optgroup>";
                 
            if (form.title) {
                if (form.title.length > 0) {
                    formSearch = formSearch + "            <optgroup label='" + form.title[0].text + "'>";
                } else {
                    formSearch = formSearch + "            <optgroup label='" + form.systemName + "'>";
                }
            } else {
                formSearch = formSearch + "            <optgroup label='" + form.systemName + "'>";
            }
            

            for (var j = 0; j < form.control.length; j++) {
                controlID = form.control[j].ID;
                propertyID = form.control[j].propertyID;
                table = form.control[j].table;
                field = form.control[j].field;
                if (form.control[j].title) {
                    if (form.control[j].title.length > 0) {
                        title = form.control[j].title[0].text;
                    } else {
                        title = form.control[j].systemName;
                    }
                } else {
                    title = form.control[j].systemName;
                }
                controlType = form.control[j].controlType;
                layoutID = layoutID;
                formSearch = formSearch + "                <option  data-table='" + table + "' onclick=\"OpenTypeData('" + id + "','" + controlType + "','" + title + "','" + controlID + "', '" + propertyID + "','" + table + "','" + field + "','" + layoutID + "', '" + tabGenID + "')\"   value='a'>" + title + "</option>";
            }
            formSearch = formSearch + "            </optgroup>";
        }
    }

    formSearch = formSearch + "        </select>";
    formSearch = formSearch + "    </div>";
    formSearch = formSearch + "</div>";


    $("#" + id + "_alertaModalFormSearch").html("");
    $("#" + id + "_ContainerFormSearch").html("");
    $("#" + id + "_ContainerFormSearch").html(formSearch);
    //document.getElementById(id + "_ContainerFormSearch").innerHTML = formSearch;

    //$.getScript("scripts/pages/dragAndDrop.js");
}

function OpenFormSearch(tabGenID) {
    //$("#" + id + "_alertaModalFormSearchShow").modal('show');
    var target = $("#"+tabGenID).parents().find(".panel-nav");
    $('html, body').animate({ scrollTop: target.offset().top }, 1000);
    toogleColapseContainer(target, false)
    return false;
}

function OpenTypeData(id, controlType, titulo, controlID, propertyID, table, field, layoutID, tabGenID) {
    var formSearch = "";
    var type = "";

    controlType = controlType.replace(/^\s+|\s+$/g, "");
    switch (controlType) {
        case "TEXT":
            formSearch = "<label>" + titulo + "</label><input id='" + id + "' type='text' />";
            type = "TEXT";
            break;
        case "CHECKBOX":
            formSearch = "<input  id='" + id + "' type='text' />" + titulo + "<br>";
            type = "TEXT";
            break;
        case "DATE":
            formSearch = "<label>" + titulo + "</label><span>De: </span><input  id='" + id + "_1' type='date' /><span> Até: </span><input  id='" + id + "_2' type='date' />";
            type = "DATE";
            break;
        case "TIME":
            break;
        case "DROPDOWN":
            formSearch = "<label>" + titulo + "</label><input  id='" + id + "' type='text' />";
            type = "TEXT";
            break;
        case "HIDDEN":
            formSearch = "<label>" + titulo + "</label><input  id='" + id + "' type='text' />";
            type = "TEXT";
            break;
        case "PASSWORD":
            formSearch = "<label>" + titulo + "</label><input  id='" + id + "' type='text' />";
            type = "TEXT";
            break;
        case "NUMBER":
            formSearch = "<label>" + titulo + "</label><input  id='" + id + "' type='number' />";
            type = "TEXT";
            break;
        case "RADIO":
           break;      
        case "EMAIL":
            formSearch = "<label>" + titulo + "</label><input id='" + id + "'  type='text' />";
            type = "TEXT";
            break;
        case "TELEFONE":
            formSearch = "<label>" + titulo + "</label><input id='" + id + "'  type='text' />";
            type = "TEXT";
            break;
        case "DROPDOWNDSG":
            formSearch = "<label>" + titulo + "</label><input id='" + id + "'  type='text' />";
            type = "TEXT";
             break;
        case "TREEVIEWTEXT":
            formSearch = "<label>" + titulo + "</label><input id='" + id + "'  type='text' />";
            type = "TEXT";
            break;
        case "DATETIME":
            formSearch = "<label>" + titulo + "</label><input  id='" + id + "' type='datetime' />";
            type = "DATE";
           break;
        case "AUTOCOMPLETE":
            formSearch = "<label>" + titulo + "</label><input id='" + id + "'  type='text' />";
            type = "TEXT";
            break;
        case "TEXTAREA":
            formSearch = "<label>" + titulo + "</label><input id='" + id + "'  type='text' />";
            type = "TEXT";
            break;
        case "TEXTVALUE":
            formSearch = "<label>" + titulo + "</label><input id='" + id + "'  type='text' />";
            type = "TEXT";
            break;
        case "DATECHECK":
            formSearch = "<label>" + titulo + "</label><span>De:</span><input id='" + id + "_1'  type='date' /><span> Até:</span><input  id='" + id + "_2' type='date' />";
            type = "DATE";
            break;
        case "TIMECHECK":
            formSearch = "<label>" + titulo + "</label><span>De:</span><input  id='" + id + "_1' type='time' /><span> Até:</span><input id='" + id + "_2'  type='time' />";
            type = "TIME";
            break;
        case "TEXTPERC":
            formSearch = "<label>" + titulo + "</label><input  id='" + id + "' type='text' />";
            type = "TEXT";
           break;
        case "IMAGE":
            break;
        case "FILE":
            break;
        default:
    }

    formSearch = formSearch + "<input onclick=\"ClickAdd('" + id + "','" + type + "','" + titulo + "','" + controlID + "', '" + propertyID + "', '" + table + "','" + field + "', '" + layoutID + "', '" + tabGenID + "')\" type='button' value='Adicionar' />";

    document.getElementById(id + "_ContainerControlType").innerHTML = formSearch;
}

function ClickAdd(id, type, titulo, controlID, propertyID, table, field, layoutID, tabGenID) {
    
    var formSearch = "";
    var idlineint;
    var idline;

    idlineint = Math.random();
    idline = idlineint.toString();
    idline = idline.replace(".", "");

    switch (type) {
        case "TEXT":
            var value = $("#" + id).val();
            if (value != "") {
                formSearch = "<tr id='" + idline + "'><td>" + titulo + ": </td><td data-layoutID='" + layoutID + "' data-table='" + table + "' data-field='" + field + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' data-serializable='true' id='" + controlID + "'>" + value + "</td>";
                formSearch = formSearch + "<td class='form-group btn btn-xs btn-danger'><a onclick=\"DeleteLine('" + idline + "')\"><i class='fa fa-trash-o'></i></a></td></tr>";
                $("#" + id).val("");
            }
            break;
        case "DATE":
            var value1 = $("#" + id + "_1").val();
            var value2 = $("#" + id + "_2").val();
            if (value1 != "" && value2 != "") {
                formSearch = "<tr id='" + idline + "'><td>" + titulo + ": </td>";
                formSearch = formSearch + "<td data-layoutID='" + layoutID + "' data-table='" + table + "' data-field='" + field + "'  data-propertyID='" + propertyID + "' data-controlID='" + controlID + "' data-serializable='true' id='" + controlID + "_1'>De: " + value1 + "</td>";
                formSearch = formSearch + "<td data-layoutID='" + layoutID + "' data-table='" + table + "' data-field='" + field + "' data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' data-serializable='true' id='" + controlID + "_2'>Até: " + value2 + "</td>";
                formSearch = formSearch + "<td class='form-group btn btn-xs btn-danger'><a onclick=\"DeleteLine('" + idline + "')\"><i class='fa fa-trash-o'></i></a></td></tr>";

                $("#" + id + "_1").val("");
                $("#" + id + "_2").val("");
            }
            break;
        default:
    }

    $("#" + id + "_ContainerSearch").append(formSearch);

    var HTMLButtonSearch;
    HTMLButtonSearch = "<br><input onclick=\"ClickSearch('" + id + "', '" + tabGenID + "')\" type='button' value='Buscar' />";
  
    document.getElementById(id + "_ContainerButtonSearch").innerHTML = HTMLButtonSearch;
}

function DeleteLine(line) {
    $("#" + line).fadeOut(300, function () { $("#" + line).remove(); });
}

function ClickSearch(id, tabGenID) {
    var idContainer = id + "_ContainerSearch";
    var table = document.getElementById(idContainer);
    var aValue = [];
    var propertyID = [];
    var controlID = [];
    var table = [];
    var field = [];
    var layoutID;

    var k = 0;

    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            if (col.getAttribute("data-serializable") == "true") {
                aValue[k] = col.innerText;                
                propertyID[k] = col.getAttribute("data-propertyID");
                controlID[k] = col.getAttribute("data-controlID");
                table[k] = col.getAttribute("data-table");
                field[k] = col.getAttribute("data-field");
                layoutID = col.getAttribute("data-layoutID");

                k = k + 1;
            }
        }
    }

    var select = document.getElementById("select-repeated-options");
    var options = select.querySelectorAll('option');
    var tables = [];
    var str="";
    var index = -1;

    for (var i = 0; i < options.length; i++) {
        if (str.indexOf(options[i].getAttribute("data-table")) == -1) {
            index = index + 1;
            tables[index] = options[i].getAttribute("data-table");
            str = str  + " - " + options[i].getAttribute("data-table");
        }
    }
    
    tables = tables.sort();
    AjaxSearch(controlID, propertyID, aValue, table, field, layoutID, tables, id, tabGenID);
}

function AjaxSearch(controlID, propertyID, value, table, field, layoutID, tables, id, tabGenID) {
    var enterpriseID = returnCookie("EnterpriseID");
    var lang = returnCookie("Lang");

    var url = getGlobalParameters("urlPlataforma") + "/api/render/RenderFormSearch";
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        data: { controlID: controlID, propertyID: propertyID, value: value, table: table, field: field, layoutID: layoutID, tables: tables, enterpriseID: enterpriseID, lang: lang },
        success: function (response) {
            CreateGridFormSearch(response[0], id, layoutID, tabGenID);
        },
        error: function (response) {
            alert(response);
    }
    });
}

function CreateGridFormSearch(response, id, layoutID, tabGenID) {
    var columCount = 0;
    var HTMLGridSearch = "";
    var filtro = [];
    var fill1PropertyID="";

    for (var i = 0; i < response.container.length; i++) {
        if (response.container[i].control != null) {
            for (var j = 0; j < response.container[i].control.length; j++) {
                if (response.container[i].control[j].Property){
                    if (response.container[i].control[j].Property.primaryKey == true) {
                        if (fill1PropertyID == "") {
                            fill1PropertyID = response.container[i].control[j].Property.ID;
                            filtro = response.container[i].control[j].Property.value;
                        }
                    }
                }
            }
        }
    }

    HTMLGridSearch = HTMLGridSearch + "<style type='text/css'>";
    HTMLGridSearch = HTMLGridSearch + ".container-tabela{";
    HTMLGridSearch = HTMLGridSearch + "    overflow: auto; ";
    HTMLGridSearch = HTMLGridSearch + "    width: 100%;";
    HTMLGridSearch = HTMLGridSearch + "    height: 200px;";
    HTMLGridSearch = HTMLGridSearch + "}";

    HTMLGridSearch = HTMLGridSearch + "table.tabela{";
    HTMLGridSearch = HTMLGridSearch + "    width:980px;";
    HTMLGridSearch = HTMLGridSearch + "}";
    HTMLGridSearch = HTMLGridSearch + "</style>";

    HTMLGridSearch = HTMLGridSearch + "<div class='container-tabela'>";
    HTMLGridSearch = HTMLGridSearch + "<table class='tabela'>";

    HTMLGridSearch = HTMLGridSearch + "<tr>";
    HTMLGridSearch = HTMLGridSearch + "<th>";
    HTMLGridSearch = HTMLGridSearch + "Ações";
    HTMLGridSearch = HTMLGridSearch + "</th>";

    for (var i = 0; i < response.container.length; i++) {
        if (response.container[i].control != null) {
            for (var j = 0; j < response.container[i].control.length; j++) {
                if (response.container[i].control[j].Property) {
                    if (response.container[i].control[j].Property.indexed) {
                        HTMLGridSearch = HTMLGridSearch + "<th>";
                        HTMLGridSearch = HTMLGridSearch + response.container[i].control[j].title[0].text;
                        HTMLGridSearch = HTMLGridSearch + "</th>";

                        if (response.container[i].control[j].Property.value != null) {
                            columCount = response.container[i].control[j].Property.value.length;

                        }
                    }
                }
            }
        }

        if (response.container[i].Form != null) {
            for (var k = 0; k < response.container[i].Form[0].container.length; k++) {
                if (response.container[i].Form[0].container[k].control != null) {
                    for (var j = 0; j < response.container[i].Form[0].container[k].control.length; j++) {
                        if (response.container[i].Form[0].container[k].control[j].Property) {
                            if (response.container[i].Form[0].container[k].control[j].Property.indexed) {
                                HTMLGridSearch = HTMLGridSearch + "<th>";
                                HTMLGridSearch = HTMLGridSearch + response.container[i].Form[0].container[k].control[j].title[0].text;
                                HTMLGridSearch = HTMLGridSearch + "</th>";
                                if (response.container[i].Form[0].container[k].control[j].Property) {
                                    if (response.container[i].Form[0].container[k].control[j].Property.value != null) {
                                        columCount = response.container[i].Form[0].container[k].control[j].Property.value.length;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    HTMLGridSearch = HTMLGridSearch + "</tr>";


    for (var l = 0; l < columCount; l++) {
        HTMLGridSearch = HTMLGridSearch + "<tr>";

        HTMLGridSearch = HTMLGridSearch + "<td>";
        if (filtro) {
            HTMLGridSearch = HTMLGridSearch + "<a href='#' onclick=\"FillFormSearch('" + filtro[l] + "','" + layoutID + "','" + fill1PropertyID + "', '" + id + "', '" + tabGenID + "')\">Editar</a>";
        }
        HTMLGridSearch = HTMLGridSearch + "</td>";

        for (var i = 0; i < response.container.length; i++) {
            if (response.container[i].control != null) {
                for (var j = 0; j < response.container[i].control.length; j++) {
                    if (response.container[i].control[j].Property) {
                        if (response.container[i].control[j].Property.indexed) {
                            HTMLGridSearch = HTMLGridSearch + "<td>";
                            HTMLGridSearch = HTMLGridSearch + response.container[i].control[j].Property.value[l];
                            HTMLGridSearch = HTMLGridSearch + "</td>";
                        }
                    }
                }
            }


            if (response.container[i].Form != null) {
                for (var k = 0; k < response.container[i].Form[0].container.length; k++) {
                    if (response.container[i].Form[0].container[k].control != null) {
                        for (var j = 0; j < response.container[i].Form[0].container[k].control.length; j++) {
                            if (response.container[i].Form[0].container[k].control[j].Property) {
                                if (response.container[i].Form[0].container[k].control[j].Property.indexed) {
                                    HTMLGridSearch = HTMLGridSearch + "<td>";
                                    HTMLGridSearch = HTMLGridSearch + response.container[i].Form[0].container[k].control[j].Property.value[l];
                                    HTMLGridSearch = HTMLGridSearch + "</td>";
                                }
                            }
                        }
                    }
                }
            }
        }

        HTMLGridSearch = HTMLGridSearch + "</tr>";
    }


    HTMLGridSearch = HTMLGridSearch + "</table>";

    HTMLGridSearch = HTMLGridSearch + "</div>";

    document.getElementById(id + "_GridFormSearch").innerHTML = HTMLGridSearch;
}

function FillFormSearch(filtro, layoutID, fill1PropertyID, id, tabGenID) {
    var enterpriseID = returnCookie("EnterpriseID");

    $.ajax({
        url: getGlobalParameters("urlPlataforma") + "/api/database/DataSearch",
        data: { filtro: filtro, formID: layoutID, referenceID: fill1PropertyID, enterpriseID: enterpriseID },
        dataType: 'json',
        success: function (data) {
            FillForm(data, "", tabGenID);
        }                
    });

    $("#" + id + "_alertaModalFormSearchShow").modal('hide');
}