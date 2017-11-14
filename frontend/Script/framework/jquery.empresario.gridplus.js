function CreateGridPlus(paramenters) {
    result = paramenters.result;
    tabGenIDOut = paramenters.tabGenID;
    tabGenID = tabGenIDOut + "_nav";

    var title = "";
    var content = "";
    var layoutID = result.layout.ID;
    var htmlControls = "";

    var layoutName = result.layout.systemName;
    var loadData = result.layout.loadData;
    title = result.layout.layoutName;
    //style=\"text-align:right;float:right;\"

    var classSharpGrid;
    var idSharpGrid;
    var divSharpGrid;
    var inputSearch;

    classSharpGrid = "sharpGrid";
    idSharpGrid = tabGenID + "_sharpGrid";
    idSearchBox = tabGenID + "_searchBox";

    htmlControls = htmlControls + "<div id=\"" + tabGenID + "\">";
    htmlControls = htmlControls + "<a name=\"nav\"></a>";
    htmlControls = htmlControls + "<form>";
    htmlControls = htmlControls + "<div class=\"panel panel-default panel-nav\">";

    htmlControls = htmlControls + "<div class=\"panel-heading\">";
    //htmlControls = htmlControls + "<h5 style=''><span class=\"fa fa-search\"></span> Buscar</h5>";
    htmlControls = htmlControls + "<ul class=\"panel-control\"><li><a class=\"minus btn btn-icon btn-info btn-round\" href=\"javascript:void(0)\" title=\"Buscar\"><i class=\"fa fa-search\"></i></a></li></ul>";
    htmlControls = htmlControls + "</div>";
    htmlControls = htmlControls + "<div class='panel-body'>";


    htmlControls = htmlControls + "<div class=\"fixed-table-body " + classSharpGrid + "\" id=\"" + idSharpGrid + "\" >";

    htmlControls = htmlControls + "<div class=\"searchBox\">"
    htmlControls = htmlControls + "<div class='fixed-table-toolbar'>"
    htmlControls = htmlControls + "<div class='bars pull-left'>"
    htmlControls = htmlControls + "<div class=\"btn-group hidden-xs\" role=\"group\">"


    //htmlControls = htmlControls + "<div class=\"col-md-12\" style=\"padding-left:0px;padding-right:0px\">"
    //htmlControls = htmlControls + "<div class=\"col-md-3 form-group\">"; //inicio sidebar

    htmlControls = htmlControls + "<a onClick=\"editLayout(this, '" + layoutName + "', '" + layoutID + "', '" + title + "', '" + loadData + "', '', '');\"" + " class=\"btn btn-primary\" ><i class=\"fa fa-file-o\"></i> Novo </a>"
    htmlControls = htmlControls + "</div>"
    htmlControls = htmlControls + "</div>"
    //htmlControls = htmlControls + "<div class=\"pull-left search\">"
    //htmlControls = htmlControls + "<input data-serializable='false' placeholder=\"Buscar...\" id=\"" + idSearchBox + "\" type=\"text\" class='form-control'/>"
    //htmlControls = htmlControls + "</div>"
    htmlControls = htmlControls + "<div class=\"columns columns-right btn-group pull-right\">"
    htmlControls = htmlControls + "<div class=\"pull-left\">"
    htmlControls = htmlControls + "<span style=\"font-size: 15px;\">Filtro Avançado:  </span><br/>";
    htmlControls = htmlControls + "</div>"
    htmlControls = htmlControls + "<div class=\"pull-left\">"
    htmlControls = htmlControls + "<input data-layoutID=\"" + layoutID + "\"  id=\"navigation-text-search\" class=\"form-control navigation-text-search\" placeholder=\"Procurar por...\" type='text'/>";
    htmlControls = htmlControls + "</div>"
    htmlControls = htmlControls + "<div class=\"pull-left\">"
    htmlControls = htmlControls + "<select id=\"select-repeated-options\"  class=\"form-control select-repeated-options\">";
    htmlControls = htmlControls + "<option value=\"\">Selecione...</option>";
    var texthidden = "";
    for (var i = 0; i < result.container.length; i++) {
        title = result.container[i].dataType[0].title[0].text;
        layoutID = result.layoutID;
        content = createGridPlusContent(result.container[i], layoutID);
        htmlControls = htmlControls + createGridPlusItem(title, content, tabGenID);
        texthidden = texthidden + createHidenGridPlusContent(result.container[i], layoutID);
    }
    htmlControls = htmlControls + "</select>";
    htmlControls = htmlControls + texthidden;

    htmlControls = htmlControls + "</div>"



    htmlControls = htmlControls + "<div class=\"pull-left\">";
    htmlControls = htmlControls + "<a href=\"#\" class=\"btn btn-primary addfilter\">Adicionar</a>";
    htmlControls = htmlControls + "</div>";

    //htmlControls = htmlControls + "<div class=\"pull-left\">";
    //htmlControls = htmlControls + "<span style=\"font-size: 12px;\">Filtros Adicionados: </span><br/>";
    //htmlControls = htmlControls + "</div>";

    htmlControls = htmlControls + "<div class=\"pull-left\">";
    htmlControls = htmlControls + "<div class=\"keep-open btn-group\" title=\"Filtros Adicionados\">"
    htmlControls = htmlControls + "<button type=\"button\" class=\"btn btn-primary btn-outline dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"true\">"
    htmlControls = htmlControls + "<i class=\"glyphicon wb-list-bulleted\"></i>"
    htmlControls = htmlControls + "<span class=\"caret\"></span></button>"
    htmlControls = htmlControls + "<div id=\"notification\" class=\"dropdown-menu right top-notification\"><span>Filtros Adicionados</span>"
    htmlControls = htmlControls + "<ul class=\"ls-feed\" id=\"slippylist\" data-id=\"slippylist_" + tabGenID + "\">";
    htmlControls = htmlControls + "</ul>";
    htmlControls = htmlControls + "</div>"
    htmlControls = htmlControls + "</div>"
    htmlControls = htmlControls + "</div>"

    htmlControls = htmlControls + "<div class=\"pull-right\">";
    htmlControls = htmlControls + "<a id=\"Filtrar\" onClick=\"clickSearchGridPlus('" + tabGenID + "', '" + layoutName + "')\"" + " class=\"btn btn-primary\">Filtrar   <i class=\"fa fa-filter\"></i></a><br/>";
    htmlControls = htmlControls + "</div>"

    htmlControls = htmlControls + "</div>"

    //htmlControls = htmlControls + "</div>"; //fim sidebar

    htmlControls = htmlControls + "</div>"
    htmlControls = htmlControls + "</div>"


    htmlControls = htmlControls + "<div class=\"gridsearch col-md-12\" >"
    htmlControls = htmlControls + "</div>"
    //htmlControls = htmlControls + " </div>";
    htmlControls = htmlControls + "</div>"
    htmlControls = htmlControls + " </div>";
    htmlControls = htmlControls + " </div>";
    htmlControls = htmlControls + " </form>";
    htmlControls = htmlControls + " </div>";


    $("#" + tabGenIDOut + " form .panel-body").append(htmlControls);


    $("#" + tabGenID + "_list, #" + tabGenID + "_list .ac-container ").accordion({
        heightStyle: "content",
        active: false,
        collapsible: true
    });

    $("#" + tabGenID + " form .panel-body .ac-container input[type=checkbox]").iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue',
        increaseArea: '20%' // optional
    });

    $("#" + tabGenID + " form .panel-body .addfilter").click(function () {
        event.preventDefault();
        var id = $(this).attr("data-referenceinput");
        var title = $(this).attr("data-title");
        addGridPlusFilter(id, title, tabGenID);
    });

    $('.dateNavigation').datetimepicker({
        lang: "pt",
        timepicker: false,
        datepicker: true,
        format: 'd/m/Y'
    });

    createGridPlusFilter(tabGenID);

    removeGridPlusFilter();


    panel_change_start(tabGenID + " > form > .panel");
    //var panelBody = $("#" + tabGenID + " > form > .panel > .panel-body")
    //    panelBody.prepend(htmlControls);
    clickSearchGridPlus(tabGenID, layoutName);
}

function createGridPlusItem(title, content, tabGenID) {

    var htmlControls = "";
    htmlControls = htmlControls + "<optgroup label=" + title + ">";
    htmlControls = htmlControls + content;
    htmlControls = htmlControls + "</optgroup>";

    //htmlControls = htmlControls + "                <h3>" + title + "</h3>";
    //htmlControls = htmlControls + "                <div>";

    //htmlControls = htmlControls + content;

    //htmlControls = htmlControls + "                </div>";

    return htmlControls;
}

function createGridPlusContent(result, layoutID) {
    var htmlControls = "";
    var content = "";

    for (var j = 0; j < result.dataType.length; j++) {
        var table = result.dataType[j].systemName;

        for (var i = 0; i < result.dataType[j].property.length; i++) {
            if (result.dataType[j].property[i].dataType) {

                var type = result.dataType[j].property[i].dataType.typeNative;
                var title = result.dataType[j].property[i].title[0].text;

                htmlControls = htmlControls + "<option data-table=\"" + table + "\" data-field=\"" + result.dataType[j].property[i].systemName.toLowerCase() + "\" value=" + result.dataType[j].property[i].ID + ">" + title + "</option>";
            }
        }
    }

    return htmlControls;
}

function createHidenGridPlusContent(result, layoutID) {
    var htmlControls = "";
    var content = "";

    for (var j = 0; j < result.dataType.length; j++) {
        var table = result.dataType[j].systemName;

        for (var i = 0; i < result.dataType[j].property.length; i++) {
            if (result.dataType[j].property[i].dataType) {

                var type = result.dataType[j].property[i].dataType.typeNative;
                var title = result.dataType[j].property[i].title[0].text;

                switch (type) {
                    case "GUID":
                        htmlControls = htmlControls + createNavigationGuidGridPlus(result.dataType[j].property[i], table, layoutID, title);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    return htmlControls;
}

function addGridPlusFilter(id, title, tabGenID) {


    var input = $("#" + tabGenID + " form .panel-body .navigation-text-search")
    var combo = $("#" + tabGenID + " form .panel-body .select-repeated-options")

    var gValue = input.val();
    var aValue = input.val();

    var title = combo.find(" :selected").text();


    var propertyID = combo.find(" :selected").val();
    var table = combo.find(" :selected").attr("data-table");
    var field = combo.find(" :selected").attr("data-field");
    var layoutID = input.attr("data-layoutID");
    var type = input.attr("type");


    if (aValue == "") {
        aValue = "''"
    }
    if (title != "Selecione...") {
        var $html =
             "<li style=\"width:auto;float:left;font-size: 10px;\" data-value=" + aValue + " data-propertyID=" + propertyID + " data-table=" + table + " data-field=" + field + " data-layoutID=" + layoutID + ">" +
             "<span class=\"filter-label\">" + title + "</span> " +
             "<span class=\"filter-value\">" + gValue + "</span> " +
             "<a style=\"font-size:18px;color:red\" href=\"javascript:void(0)\" class=\" remove\" tabindex=\"-1\" title=\"Remover\">×</a>" +
             "</li>";

        $('[data-id=slippylist_' + tabGenID + "]").append($html);
        input.val("");
    }
    else {
        alert("Selecione uma opção válida!");
    }
    //new Slip(ol);

}

function createGridPlusFilter(tabGenID) {
    var htmlControls = "";

    htmlControls += AbreForm({ classe: "" });
    htmlControls += AbreDiv({ id: "table_" + tabGenID, classe: "panel" });
    htmlControls += AbreDiv({ id: "panel_" + tabGenID, classe: "panel-body" });
    htmlControls += FechaDiv();
    htmlControls += FechaDiv();
    htmlControls += FechaForm();

    $("#" + tabGenID + " form .panel-body .gridsearch").append(htmlControls);
}


function removeGridPlusFilter() {
    $(document).on("click", ".remove", function () {
        $(this).parent('li').remove();
    });
}


function clickSearchGridPlus(tabGenID, layoutName) {

    var tabNav = $("#" + tabGenID);
    var listFields = tabNav.find(".ac-container");
    listFields.accordion("option", "active", false);
    var li = $("[data-id=slippylist_" + tabGenID + "] li");
    tabNav.loader();

    var AValue = [];
    var PropertyID = [];
    var ControlID = [];
    var Table = [];
    var Tables = [];
    var Field = [];
    var LayoutID;
    var Top = false;

    if (layoutName == 'contasapagar') {
        addGridPlusFilterTipoRecebimento(tabGenID, layoutName, "P", "Pagamentos");
        li = $("[data-id=slippylist_" + tabGenID + "] li");
        Top = true;
    }
    else if (layoutName == 'contasareceber') {
        addGridPlusFilterTipoRecebimento(tabGenID, layoutName, "R", "Recebimentos");
        li = $("[data-id=slippylist_" + tabGenID + "] li");
        Top = true;
    }

    if (li.length == 0) {
        addGridPlusFilterID(tabGenID, layoutName);
        li = $("[data-id=slippylist_" + tabGenID + "] li");
        Top = true;
    }


    for (var i = 0; i < li.length; i++) {
        AValue[i] = li[i].getAttribute("data-value");
        PropertyID[i] = li[i].getAttribute("data-propertyID");
        Table[i] = li[i].getAttribute("data-table");
        Tables[i] = li[i].getAttribute("data-table");
        Field[i] = li[i].getAttribute("data-field");
        LayoutID = li[i].getAttribute("data-layoutID");
    }

    AjaxSearchGridPlus(ControlID, PropertyID, AValue, Table, Field, LayoutID, Tables, tabGenID, Top, function () {
        tabNav.loader();
    });
}

function AjaxSearchGridPlus(ControlID, PropertyID, Value, Table, Field, LayoutID, Tables, tabGenID, Top, callback) {
    var EnterpriseID = returnCookie("EnterpriseID");
    var Lang = returnCookie("Lang");
    Lang = Lang.replace("#", "");

    var url = getGlobalParameters("urlPlataforma") + "/api/render/RenderFormSearch";
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        data: { ControlID: ControlID, PropertyID: PropertyID, Value: Value, Table: Table, Field: Field, LayoutID: LayoutID, Tables: Tables, EnterpriseID: EnterpriseID, Lang: Lang, Top: Top },
        success: function (response) {
            createNavigationGridPlus(response, tabGenID);
        },
        error: function (response) {
        },
        complete: function () {
            callback();
        }
    });
}




function createNavigationGridPlus(result, tabGenID) {
    var navigation = new Object();
    result[0].container[0].template = new Object();
    result[0].container[0].template.systemName = "GRID";

    gridControls = renderControlStructure(result[0].container[0], "table_" + tabGenID, tabGenID, true, "GRID", result[0].layout.ID, result[0].layout.systemName);

    gridControls.titulo = result[0].layout.systemName;
    gridControls.containerID = "table_" + tabGenID;

    navigation.status = true;
    navigation.layoutName = result[0].layout.systemName;
    navigation.layoutID = result[0].layout.ID;
    navigation.title = result[0].layout.layoutName;
    navigation.loadData = result[0].layout.loadData;

    gridControls.navigation = navigation;

    $("#panel_" + tabGenID).html("");
    createGridPlusNav(gridControls);

}

function newLayoutGridPlus(layoutName, layoutID, title, loadData) {
    var dados = "&EnterpriseID=" + returnCookie("EnterpriseID");

    if (loadData == "true") {
        dados = dados + "&ParamReferenceID=*&Filtro=*";
    }

    CreateAba(layoutName, layoutID, title, dados, false)
}



function addGridPlusFilterID(tabGenID, layoutName) {


    var gValue = "";
    var aValue = "";
    var propertyID = "";
    var table = "";
    var field = "";
    var layoutID = "";
    var type = "";


    var input = $("input[data-field=id]");

    if (input.length > 1) {
        for (var i = 0; i < input.length; i++) {
            if (layoutName.indexOf(input[i].getAttribute("data-table")) > -1 || input[i].getAttribute("data-table") == "entidade") {
                gValue = input[i].value;
                aValue = input[i].value;
                propertyID = input[i].getAttribute("data-propertyID");
                table = input[i].getAttribute("data-table");
                field = input[i].getAttribute("data-field");
                layoutID = input[i].getAttribute("data-layoutID");
                type = input[i].getAttribute("type");
            }
        }
        if (table == "") {
            gValue = input.val();
            aValue = input.val();
            propertyID = input.attr("data-propertyID");
            table = input.attr("data-table");
            field = input.attr("data-field");
            layoutID = input.attr("data-layoutID");
            type = input.attr("type");
            if (layoutName == "cadastrodevendedores") {
                table = "vendedor";
            }
            else if (layoutName == "cadastrodefornecedores") {
                table = "fornecedor";
            }
        }
        else if (table == "entidade") {
            if (layoutName == "cadastrodevendedores") {
                table = "vendedor";
            }
            else if (layoutName == "cadastrodefornecedores") {
                table = "fornecedor";
            }
        }
    }
    else {
        gValue = input.val();
        aValue = input.val();
        propertyID = input.attr("data-propertyID");
        table = input.attr("data-table");
        field = input.attr("data-field");
        layoutID = input.attr("data-layoutID");
        type = input.attr("type");
        if (layoutName == "cadastrodevendedores") {
            table = "vendedor";
        }
        else if (layoutName == "cadastrodefornecedores") {
            table = "fornecedor";
        }
    }


    if (type == "checkbox") {
        if (input.is(":checked")) {
            aValue = true;
            gValue = "<i class=\"fa fa-check\"></i>"
        }
        else {
            aValue = false;
            gValue = "<i class=\"fa fa-times\"></i>";
        }
    } else if (type == "select-one") {
        gValue = input.find(" :selected").text();
    } else if (type == "data") {
        var input2 = $("#" + id + "_2");
        var aValue2 = input2.val()
        gValue = aValue + " <i class='fa fa-arrows-h'></i> " + aValue2;
        aValue = aValue + ";" + aValue2;

    } else {
        aValue = aValue.replace(new RegExp(" ", 'g'), "%20")
    }

    if (aValue == "") {
        aValue = "''"
    }
    var $html =
             "<li style=\"width:auto;float:left;font-size: 10px;\" data-value=" + aValue + " data-propertyID=" + propertyID + " data-table=" + table + " data-field=" + field + " data-layoutID=" + layoutID + ">" +
             "<span class=\"filter-label\">Listar Todos</span> " +
             "<span class=\"filter-value\">" + gValue + "</span> " +
             "<a style=\"font-size:18px;color:red\" href=\"javascript:void(0)\" class=\" remove\" tabindex=\"-1\" title=\"Remover\">×</a>" +
             "</li>";

    $('[data-id=slippylist_' + tabGenID + "]").append($html);
}

function createNavigationGuidGridPlus(property, table, layoutID, title) {
    var htmlControls = "";
    var id = gerarGUID();

    var propertyID = property.ID;
    var field = property.systemName;
    var derivedFrom = property.derivedFrom;

    //htmlControls = htmlControls + "<div class=\"input-group\">";

    htmlControls = htmlControls + "<input id=\"" + id + "\" class=\"form-control\" type='hidden' data-propertyID=\"" + propertyID + "\" data-table=\"" + table + "\" data-field=\"" + field.toLowerCase() + "\" data-layoutID=\"" + layoutID + "\" data-derivedFrom=\"" + derivedFrom + "\" />";
    //htmlControls = htmlControls + "<div class=\"input-group-btn\">";
    //htmlControls = htmlControls + "<a data-title=" + title + "  data-referenceinput=\"" + id + "\" href=\"#\" class=\"btn btn-primary addfilter\"><i class=\"fa fa-plus\"></i></a>";
    //htmlControls = htmlControls + "</div>";
    //htmlControls = htmlControls + "</div>";
    return htmlControls;
}

function addGridPlusFilterTipoRecebimento(tabGenID, layoutName, tipo, title) {


    var input = $("#" + tabGenID + " form .panel-body .navigation-text-search")
    var combo = $("#" + tabGenID + " form .panel-body .select-repeated-options")

    var gValue = tipo;
    var aValue = tipo;
    var propertyID = "93f48d42-588f-4c4e-813b-802e8486b0fd";
    var table = 'recpag_contas'
    var field = 'nm_tipo';
    var layoutID = input.attr("data-layoutID");
    var type = input.attr("type");

    if (aValue == "") {
        aValue = "''"
    }
    var $html =
            "<li id='LiTipoRecebimento' style=\"width:auto;float:left;padding:5px;font-size: 10px;\" data-value=" + aValue + " data-propertyID=" + propertyID + " data-table=" + table + " data-field=" + field + " data-layoutID=" + layoutID + ">" +
            "<i class=\"fa fa-circle-o\"></i> " +
            "<span class=\"filter-label\">" + title + "</span> " +
            "<span class=\"filter-value\">" + gValue + "</span> " +
            "<a style=\"font-size:18px;color:red\" href=\"javascript:void(0)\" class=\" remove\" tabindex=\"-1\" title=\"Remover\">×</a>" +
            "</li>";
    var li = $("#LiTipoRecebimento");
    if (li.length == 0) {
        $('[data-id=slippylist_' + tabGenID + "]").append($html);
    }
    input.val("");

}


function createGridPlusNav(parameters) {

    var titulo = parameters.titulo;
    var containerID = parameters.containerID;
    var controls = parameters.controls;

    var navigation = parameters.navigation;

    //var dadosGrid = parameters.dadosGrid;
    //var container = parameters.container;
    var isVisible = "";
    var indexIdControl;
    //var VisibleGrid = parameters.visibleGrid;
    var valueID;
    var buttons = [];


    retorno = ""
    retorno += "<div id=\"" + containerID + "_table\" class=\"table-responsive ls-table tableContainer\">";
    retorno += "<table data-toggle=\"table\" class=\"table table-hover table-bordered table-striped table-bottomless ls-animated-table\">";
    retorno += "<thead>";
    retorno += "<tr>";
    retorno += "<th class=\"gridButtons\"><i class=\"fa fa-cog\"></i></th>";

    for (var i = 0; i < controls.length; i++) {
        isVisible = "";
        if (controls[i].visibleGrid == false) {
            isVisible = " style='display:none' ";
        } else if (navigation && (controls[i].controlType == "DROPDOWN" || controls[i].controlType == "DROPDOWNDSG")) {
            isVisible = " style='display:none' ";
        }

        if (controls[i].field == "id") {
            indexIdControl = i;
        }

        if (controls[i].controlType == "CHECKBOXGRID" || controls[i].controlType == "BUTTONGRID") {
            buttons.push(controls[i]);
        }


        retorno += "<th "
        retorno += "data-Field='" + controls[i].field + "' "
        retorno += "data-Table='" + controls[i].table + "' "
        retorno += "data-DerivedFrom='" + controls[i].derivedFrom + "' "
        retorno += "data-NativeDataType='" + controls[i].nativeDataType + "' "
        retorno += "data-controlID='" + controls[i].controlID + "' "
        retorno += "data-SequenceRecording='" + controls[i].sequenceRecording + "' "
        retorno += "data-propertyID='" + controls[i].propertyID + "' "
        retorno += "placeholder='" + controls[i].titulo + "' "
        retorno += "data-propertyID='" + controls[i].propertyID + "' "
        retorno += "data-visibleGrid='" + controls[i].visibleGrid + "' "
        retorno += "data-id='" + controls[i].id + "' "
        retorno += isVisible + ">"
        retorno += "" + controls[i].titulo + ""
        retorno += "</th>";
    }

    if (titulo == "Lista") {
        retorno += "<th>Ação</th>"
    }
    gridButtons[containerID + "_table"] = buttons;

    if (containerID.indexOf("857a1f6d-887b-4a08-b5b3-646ea4457c04") != -1 || containerID.indexOf("828810bd-5e6f-4dd9-a66c-b7e9be94fdd8") != -1) {
        retorno += "</tr>";
        retorno += "</thead>";
        retorno += "<tbody>";
        retorno += "</tbody>";
        retorno += "<tfoot>";
        retorno += "<tr>";
        retorno += "<th>";
        retorno += "<strong><font size = 2>Total</font></strong>";
        retorno += "</th>";
        retorno += "<th></th>";
        retorno += "<th></th>";
        retorno += "<th></th>";
        if (containerID.indexOf("857a1f6d-887b-4a08-b5b3-646ea4457c04") != -1) { //se é venda add mais 2 th
            retorno += "<th></th>";
            retorno += "<th></th>";
        }
        retorno += "<th id=\"vlunitario1\">0,00</th>";
        retorno += "<th id=\"vldesconto1\">0,00</th>";
        retorno += "<th id=\"vltotal1\">0,00</th7>";
        retorno += "<tr><td colspan=\"1000\" style=\"text-align:center\"><i class=\"fa fa-ellipsis-h\"></i></td></tr>";
        retorno += "</tr>";
        retorno += "</tfoot>"
        retorno += "</table>";
        retorno += "</div>";


    }
    else {
        retorno += "</tr>";
        retorno += "</thead>";
        retorno += "<tbody>";
        retorno += "</tbody>";
        retorno += "<tfoot>";
        retorno += "<tr><td colspan=\"1000\" style=\"text-align:center\"><i class=\"fa fa-ellipsis-h\"></i></td></tr>";
        retorno += "</tfoot>"
        retorno += "</table>";
        retorno += "</div>";

    }


    recipient = "#" + containerID + " .panel-body";
    $(recipient).prepend(retorno);
    sharpGridPlusnav(containerID);
    addRowGrid(containerID, controls, navigation);
}
function sharpGridPlusnav(containerID) {
    //define a tabela
    var table = $("#" + containerID + "_table table");
    //marcação nas linhas para que a paginação contabilize todas as linhas inicialmente
    $("#" + containerID + "_table table tbody tr").addClass("filtered");
    //funcao que atribui o mecanismo de search nos campos da tabela
    sharpGridPlusSearchnav(containerID);
    sharpGridPager(containerID);
    //atribuição de evento onde, ao incluir ou excluir itens da tabela, sejam novamente chamadas as funcoes de paginacao e edicao
    if (table) {
        table.bind('DOMNodeInserted DOMNodeRemoved',
            function () {
                sharpGridPager(containerID);
                sharpGridEditor(containerID);
            });
    }
}

function sharpGridPlusSearchnav(containerID) {

    var table = $("#" + containerID + "_table table");
    var classSharpGrid;
    var idSharpGrid;
    var divSharpGrid;
    var inputSearch;

    classSharpGrid = "sharpGrid";
    idSharpGrid = containerID + "_sharpGrid";
    idSearchBox = containerID + "_searchBox";

    jQuery.expr[':'].contains = function (a, i, m) {
        return jQuery(a).text().toUpperCase()
            .indexOf(m[3].toUpperCase()) >= 0;
    };
    $("#" + idSearchBox).on("keyup", function () {
        var term = $(this).val()
        var listCell = table.find("td:contains(\'" + term + "\')").not(".no-search");
        var ind = [];
        listCell.each(function (i) {
            ind.push($(this).parent("tr"));
        })
        $("#" + containerID + "_table table tbody" + " tr").hide();
        if (ind.length) {
            $("#" + containerID + "_table table tbody" + " tr").removeClass("filtered");
            for (var i = 0; i < ind.length; i++) {
                $(ind[i]).addClass("filtered");
            }
        }
        else {
            if (term.length > 0) {
                $("#" + containerID + "_table table tbody" + " tr").removeClass("filtered");

            }
            else {
                $("#" + containerID + "_table table tbody" + " tr").addClass("filtered");
            }
        }
        $("#" + containerID + "_table table tbody" + " tr.filtered").show();
        sharpGridPager(containerID);
    });
    sharpGridPager(containerID);

}