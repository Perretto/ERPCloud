var onSearch;
var searchData;

function loadSearchData() {
    var enterpriseID = returnCookie("EnterpriseID");
    var lang = returnCookie("Lang");
    var url = getGlobalParameters("urlPlataforma") + "/api/searchbox/fillsearchtable?enterpriseID=" + enterpriseID + "&lang=" + lang;

    getMessageJS("2");
    //notification({ messageText: "Aguarde enquanto os recursos de busca do EmpresarioERP são carregados", messageTitle: "Atenção!", fix: true, type: "warning", icon: "exclamation" });
    $.ajax({
        url: url,
        async: true,
        success: function (retorno) {
            searchData = retorno;
            //notification({ messageText: "Busca do EmpresarioERP carregada com sucesso", messageTitle: "Pronto!", fix: false, clearAll: true, type: "ok", icon: "thumbs-up" });
            getMessageJS("3");
        },
        error: function (retorno) {
            alert(retorno)
            searchData = false;
        }
    });

}

function InitializeGlobalSearch() {

    var searchBox = '';
    var inputValue;
    var groupDefault;
    var groupTemp;
    onSearch = false;

    searchBox = searchBox + "<div class='search-box'>\n";
    searchBox = searchBox + "	<ul>\n";
    searchBox = searchBox + "		<li>\n";
    searchBox = searchBox + "			<a href=\"javascript:CreateAba('', '', '', '', false, '',false, 'SEARCH');\">\n";
    searchBox = searchBox + "				<span class='fa fa-search'></span>\n";
    searchBox = searchBox + "			</a>\n";
    //searchBox = searchBox + "			<div class='dropdown-menu  top-dropDown-1'>\n";
    //searchBox = searchBox + "				<h4>Qual informação deseja buscar?</h4>\n";
    //searchBox = searchBox + "				<form action='localizador.html'>\n";
    //searchBox = searchBox + "					<input type='search' id='searchField' placeholder='Ex: empresa, produto, descrição, etc...' autocomplete='off'>\n";
    //searchBox = searchBox + "				</form>\n";
    //searchBox = searchBox + "			</div>\n";
    searchBox = searchBox + "		</li>\n";
    searchBox = searchBox + "	</ul>\n";
    searchBox = searchBox + "</div>\n";

    $(".search-box").replaceWith(searchBox);

    //ListenerObjects("#searchField", "INPUT");
    //ListenerObjects("#searchInput", "INPUT");	
    //ListenerObjects("#filter1", "BUTTON");
    //ListenerObjects("#filter2", "BUTTON");
    //ListenerObjects("#filter3", "BUTTON");
    //ListenerObjects("#filter4", "BUTTON");

    //ListenerObjects("#combobox1", "OPTION");

    //ListenerObjects("#grid", "GROUP_DEFAULT");

}

function ListenerObjects(obj, objType) {

    switch (objType) {

        case "INPUT":

            $(obj).keyup(function (e) {
                var key_code = e.keyCode ? e.keyCode :
                       e.charCode ? e.charCode :
                       e.which ? e.which : void 0;
                if (key_code == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false
                }
                if (this.value.length > 2 && searchData) {

                    groupDefault = false;
                    inputValue = this.value;
                    getAjaxGroup(inputValue);

                } else {

                    if (!onSearch) {
                        $("#grid").html("");
                        //groupDefault = true;
                        //createGroups(null);

                    }

                }

            });

            break;

        case "BUTTON":

            $(obj).click(function () {

                if (this.value.length > 0) {

                    groupDefault = false;
                    inputValue = this.value;
                    getAjaxGroup(inputValue);

                }

            });

            break;

        case "OPTION":

            $(obj).change(function () {

                if (this.value.length > 0) {

                    groupDefault = false;
                    inputValue = this.value;
                    getAjaxGroup(inputValue);

                }

            });

            break;

        case "GROUP_DEFAULT":

            //getAjax(getGlobalParameters("urlPlataforma") + "/api/render/renderMenu");

            groupDefault = false;
            createGroups(null);

            break

    }

    return;

};


function getAjaxGroup(inputValue) {

    onSearch = true;

    //str = '\"' + str + '\"';

    //inputValue = inputValue.replace("+", "OR"); 
    //http://54.201.159.17:8983/solr/ERP/select?q=%28catchall%3Aavenida%29+and+%28catchall%3Apresidente*%29&wt=json&indent=true
    //http://54.201.159.17:8983/solr/ERP/select?q=%28catchall%3A27E75B69-2CB3-4A4A-86A3-13152778B229%29+OR+%28catchall%3AC5640B93-E782-491B-BCF6-132CE0FB36BC%29&wt=json&indent=true	

    var qry = '';
    //qry = { 'wt': 'json', 'q': 'catchall:/.*' + inputValue.replace(" ", "%20") + '.*/', 'indent': 'true', 'group': 'true', 'group.field': 'tabela' };
    qry = '?wt=json&q=catchall:/.*' + inputValue.replace(" ", "%20") + '.*/&indent=true&group=true&group.field=tabela';

    console.log(qry);

    var full = window.location.host;

    var parts = full.split('.');
    if (parts.length > 3) {
        var dados = parts[0];
    }
    else {
        var dados = "intelecta";
    }

    if (onSearch) {

        if (dados == '54') {
            dados = 'ERP';

        }
        $.ajax({
            url: getGlobalParameters("urlSearch") + '/solr/' + dados.toUpperCase() + '/select' + qry,
            //data: qry,
            success: function (data) {

                var obj = data.grouped.tabela.groups;

                createGroups(obj);

                onSearch = false;

                return;

            },
            error: function (data) { alert('não carregou json'); },
            dataType: 'jsonp',
            jsonp: 'json.wrf'

        });

        return;

    }
}

function createGroups(obj) {

    onSearch = true;

    if (onSearch) {

        itemGroup = '';

        if (groupDefault == false) {

            itemGroup = itemGroup + "<div id='grid' class='m-row shuffle--container shuffle--fluid'>\n";

            for (var i in obj) {

                var searchDataItem = searchDataSelector(obj[i].doclist.docs[0].campo_tabela);

                if (searchDataItem && searchDataItem.layoutTitle) {

                    itemGroup = itemGroup + "<div id='" + ['group_' + i] + "' class='col-md-3 col-sm-2 col-xs-16 m-col-md-2 picture-item' data-groups='" + obj[i].doclist.docs[0].campo_tabela + "'\n";
                    itemGroup = itemGroup + "	 data-date-created='2010-09-14' data-title='" + obj[i].doclist.docs[0].campo_tabela + "'>\n";
                    itemGroup = itemGroup + "	<div class='picture-item__inner' style='height:100%; padding-left:20px; padding-right:20px; padding-top:15px; padding-bottom:20px'>\n";
                    itemGroup = itemGroup + "		<div class='picture-item__title pull-left' style='padding:0px'>\n";
                    itemGroup = itemGroup + "			<h3 class='ls-top-header' style='font-size:20px; overflow:hidden'>" + searchDataItem.layoutTitle + "</h3><hr>\n";
                    itemGroup = itemGroup + "			<span class='ls-top-header' style='font-size:15px'>Foram encontrados <b> " + obj[i].doclist.numFound + " itens </b><br>com a palavra <b>" + inputValue + "</b>:</span><br><br>\n";

                    itemGroup = itemGroup + "			<div id='" + ['links_' + i] + "'>Loading...\n";
                    getAjaxItens(obj[i].doclist.docs[0].campo_tabela, inputValue, i);
                    itemGroup = itemGroup + "			</div>\n";

                    itemGroup = itemGroup + "		</div>\n";
                    itemGroup = itemGroup + "	</div>\n";
                    itemGroup = itemGroup + "</div>\n";

                }

            }

            itemGroup = itemGroup + "</div>\n";
            itemGroup = itemGroup + "<div class='clearfix'></div>\n";

            $("#grid").replaceWith(itemGroup);


        } else {

            groupTemp = "";

            itemGroup = itemGroup + "<div id='grid' class='m-row shuffle--container shuffle--fluid'>\n";

            for (var j in resultado) {

                console.log(resultado.length);

                if (resultado[j].Layouts == null) {

                    if (resultado[j].Menus != null) {

                        itemGroup = itemGroup + "<div id='" + ['group_' + j] + "' class='col-md-3 col-sm-2 col-xs-16 m-col-md-2 picture-item' data-groups='" + resultado[j].Title[0].text + "'\n";
                        itemGroup = itemGroup + "    data-date-created='2010-09-14' data-title='" + resultado[j].Title[0].text + "'>\n";
                        itemGroup = itemGroup + "   <div class='picture-item__inner' style='height:100%; padding-left:20px; padding-right:20px; padding-top:15px; padding-bottom:20px'>\n";
                        itemGroup = itemGroup + "       <div class='picture-item__title pull-left' style='padding:0px'>\n";
                        itemGroup = itemGroup + "           <h3 class='ls-top-header' style='font-size:20px; overflow:hidden'>" + resultado[j].Title[0].text + "</h3><hr>\n";
                        itemGroup = itemGroup + "           <div id='" + ['links_' + j] + "'>\n";

                        for (var k in resultado[j].Menus) {

                            itemGroup = itemGroup + "<a href='cadastros.html' class='btn_item_search'>" + resultado[j].Menus[k].Title[0].text + "</a>\n";

                        }

                        itemGroup = itemGroup + "           </div>\n";
                        itemGroup = itemGroup + "       </div>\n";
                        itemGroup = itemGroup + "   </div>\n";
                        itemGroup = itemGroup + "</div>\n";

                    }
                }
            }

            itemGroup = itemGroup + "</div>\n";
            itemGroup = itemGroup + "<div class='clearfix'></div>\n";

            groupTemp = itemGroup;

            $("#grid").replaceWith(itemGroup);

        }

        onSearch = false;

        return;
    }

}

function getAjaxItens(table, inputValue, id) {

    //http://54.201.159.17:8983/solr/ERP/select?q=catchall:a&fq=tabela:cliente&wt=json&group=false&group.field=tabela&indent=true

    onSearch = true;

    qry = '?wt=json&q=catchall:/.*' + inputValue.replace(" ", "%20") + '.*/&indent=true&fq=tabela:' + table + '&rows=10';
    var full = window.location.host;

    var parts = full.split('.');
    if (parts.length > 3) {
        var dados = parts[0];
    }
    else {
        var dados = "intelecta";
    }

    if (onSearch) {
        if (dados == '54') {
            dados = 'ERP';

        }
        $.ajax({
            url: getGlobalParameters("urlSearch") + '/solr/' + dados.toUpperCase() + '/select' + qry,
            //data: { 'wt': 'json', 'q': 'catchall:' + inputValue +'*', 'fq':'tabela:'+ table, 'indent':'true', 'rows':'10'},
            success: function (data) {

                onSearch = false;

                var links = data.response.docs;
                createLinks(links, id, table);

            },
            error: function (data) { alert('não carregou json'); },
            dataType: 'jsonp',
            jsonp: 'json.wrf'

        });

        return;
    }

}

function createLinks(obj, id, table) {

    onSearch = true;

    if (onSearch) {

        var itemGroup = '';

        if (groupDefault == false) {

            var searchDataItem = searchDataSelector(table);
            var fieldLabel;

            //fieldLabel = "campo_" + searchDataItem.Labels[Object.keys(searchDataItem.Labels)[0]];
            fieldLabel = "campo_" + searchDataItem.labels[0];

            for (var i in obj) {

                var idString;
                var dados = "";
                var hrefLink;

                var FieldRelationship = "campo_" + searchDataItem.fieldRelationship.toLowerCase();
                idString = obj[i][FieldRelationship];
                //idString = idString.substring(idString.indexOf("_") + 1);

                dados = dados + "&enterpriseID=" + returnCookie("EnterpriseID");
                dados = dados + "&userID=" + returnCookie("UserID");
                dados = dados + "&lang=" + returnCookie("Lang");
                dados = dados + "&paramReferenceID=" + searchDataItem.propertyLayoutID;
                dados = dados + "&filtro=" + idString;

                hrefLink = "CreateAba(\"" + searchDataItem.layoutName + "\"," +
           "\"" + searchDataItem.layoutID + "\"," +
           "\"" + searchDataItem.layoutTitle + "\"," +
           "\"" + dados + "\",false)"


                //editLayout('cadastrodeclientes', 'd82d11c8-ea16-47c7-be04-10423467f04e', 'Cadastro de Clientes', 'true', '', '');
                //label = obj[i][fieldLabel]

                switch (table[0]) {
                    case "banco":
                        label = obj[i]["campo_nm_apelido"];
                        break;
                    case "endereco":
                        label = obj[i]["campo_nm_logradouro"];
                        break;
                    case "contato":
                        label = obj[i]["campo_nm_nomecontato"];
                        break;
                    case "cliente":
                        label = obj[i]["campo_nm_descricao"];
                        break;
                    case "fornecedor":
                        label = obj[i]["campo_nm_descricao"];
                        break;
                    case "prestador":
                        label = obj[i]["campo_nm_descricao"];
                        break;
                    case "empresa":
                        label = obj[i]["campo_nm_razaosocial"];
                        break;
                    case "entidade":
                        label = obj[i]["campo_nm_razaosocial"];
                        break;
                    case "produtos":
                        label = obj[i]["campo_nm_descricao"];
                        break;
                    case "recpag_contas":
                        label = obj[i]["campo_nm_documento"];
                        break;
                    case "recpag_parcelas":
                        label = obj[i]["campo_nm_documento"];
                        break;
                    case "recpag_periodicos":
                        label = obj[i]["campo_nm_documento"];
                        break;
                    default:

                }

                itemGroup = itemGroup + "<a href='javascript:" + hrefLink + "' class='btn_item_search'>" + label + "</a>"

                //if (table == "endereco") {
                //	itemGroup = itemGroup + "<a href='cadastros.html' class='btn_item_search'>"+ obj[i].campo_nm_logradouro +"</a>\n";
                //}
                //else if (table == "contato") {
                //	itemGroup = itemGroup + "<a href='cadastros.html' class='btn_item_search'>"+ obj[i].campo_nm_nomecontato +"</a>\n";
                //}
                //else if (table == "cliente") {
                //	itemGroup = itemGroup + "<a href='cadastros.html' class='btn_item_search'>"+ obj[i].campo_nm_descricao +"</a>\n";
                //}			
                //else if (table == "empresa") {
                //	itemGroup = itemGroup + "<a href='cadastros.html' class='btn_item_search'>"+ obj[i].campo_nm_razaosocial +"</a>\n";
                //}			
                //else if (table == "itens") {
                //	itemGroup = itemGroup + "<a href='cadastros.html' class='btn_item_search'>"+ obj[i].campo_nm_descricao +"</a>\n";
                //}			
                //else if (table == "itensdetalhe") {
                //	itemGroup = itemGroup + "<a href='cadastros.html' class='btn_item_search'>"+ obj[i].campo_nm_descricao +"</a>\n";
                //}			
                //else if (table == "fornecedor") {
                //	itemGroup = itemGroup + "<a href='cadastros.html' class='btn_item_search'>"+ obj[i].campo_nm_descricao +"</a>\n";
                //}
                //else if (table == "prestador") {
                //	itemGroup = itemGroup + "<a href='cadastros.html' class='btn_item_search'>"+ obj[i].campo_nm_descricao +"</a>\n";
                //}
                //else if (table == "entidade") {
                //	itemGroup = itemGroup + "<a href='cadastros.html' class='btn_item_search'>"+ obj[i].campo_nm_razaosocial +"</a>\n";
                //}

            }

            $("#links_" + id).replaceWith(itemGroup);

        }

        onSearch = false;

        return;

    }

}

function searchDataSelector(table) {

    for (var i = 0; i < searchData.length; i++) {
        var thisTable = searchData[i].baseObjectSystemName;
        if (thisTable == table) {
            return searchData[i];
        }
    }
    return false

}

InitializeGlobalSearch();

