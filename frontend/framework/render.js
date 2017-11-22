
function f_aba(nameLayout,layoutID,titleMenu,loadData, enterpriseID){
    var tabGenID = guid();
    var EnterpriseName = "";

    $("#controls-recipient > .active").removeClass("active");
    $("#controls-tabs .active").removeClass("active");
    var tab = "<li layoutid='" + layoutID + "_" + tabGenID + "' class='active'><a href='#" + tabGenID + "' data-toggle='tab' title='" + EnterpriseName + "'>" + titleMenu + "&nbsp&nbsp<img src='images/loader.gif' height='15px' /></a></li>";
    $("#controls-tabs").append(tab);
    $("#controls-recipient").append("<div class='tab-pane fade in  controls-recipient active' id='" + tabGenID + "'>");

    fillTab(nameLayout,layoutID,titleMenu,loadData, enterpriseID, tabGenID)
}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
  
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function fechaAba(id) {
    $("#controls-tabs li a[href='#" + id + "']").closest("li").remove();
    $("#controls-recipient #" + id).remove();
}

function atualizaAba(formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu) {
    var loadData = "";
    var enterpriseID = "";
    fillTab(formID,layoutID,titleMenu,loadData, enterpriseID, tabGenID)
}

function fillTab(nameLayout,layoutID,titleMenu,loadData, enterpriseID, tabGenID){
    $.ajax({url: returnCookie("urlPlataform") + "/api/layouts?layoutID=" + layoutID, success: function(result){	
        var tabGenID2 = guid();
        result[0].html = replaceAll(result[0].html, result[0].tabgenid, tabGenID2)
        
        var forcingTemplate = "";
        var layoutType = "";
        var urlRenderLayout = "";
        var urlRenderLayoutData = "";
        var titleMenu = "";
        var data = result[0].html;
        var formID = layoutID;

        //Tira o load da aba
        $("#controls-tabs li a[href='#" + tabGenID + "'] img").replaceWith(" <span class='tabControls'>&nbsp&nbsp<i class='fa fa-refresh' onClick='atualizaAba(\"" + layoutID + "\",\"" + layoutID + "\",\"" + tabGenID + "\",\"" + forcingTemplate + "\",\"" + layoutType + "\",\"" + urlRenderLayout + "\",\"" + urlRenderLayoutData + "\",\"" + titleMenu + "\");'></i>&nbsp&nbsp<i class='icon wb-close-mini' onClick='fechaAba(\"" + tabGenID + "\");'></i></span>")
        
        $("#" + tabGenID).append(result[0].html);
        panel_change_start(tabGenID + " > form > .panel  > .panel-body > div > .panel-nav ");
        tabGenID = tabGenID2;
        var wizard = $("[data-guidwizard='" + tabGenID + "']");
        
        for (var i = 0; i < wizard.length; i++) {
            if ($("#" + wizard[i].id).attr("data-guidwizard")) {
                if ($("#" + wizard[i].id).html().indexOf("<form") < 0) {
                    var htmlobj = $.parseHTML(data)
                    var idform = $(wizard[i]).attr("data-containeridwizard") + "_" + $(wizard[i]).attr("data-guidwizard");
                    var htmldiv = $(wizard[i]).html();

                    $(wizard[i]).html("<form id='" + idform + "' >" + htmldiv + "</form>");
                    //document.getElementById(wizard[i].id).innerHTML = "<form id='" + idform + "' >" + htmldiv + "</form>";
                    //sharpGrid(idform);
                }
            }
        }

        var inputs = $("#" + tabGenID + " input");
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if ($(input).val() == null || $(input).val() == "null") {
                $(input).val("");
                $(input).attr("");
            }

            //Mascara
            var marcara = $(input).attr("data-mask");
            if (marcara) {
                var typecontrol = $(input).attr("typecontrol");
                var reverse = true;

                if (typecontrol) {
                    switch (typecontrol) {
                        case "text":
                            reverse = false;
                            break;
                        default:
                            break;
                    }
                }        

                $(input).mask(marcara, {
                    reverse: reverse,
                    translation: {
                        '#': {
                            pattern: /-|\d/,
                            recursive: true
                        }
                    },
                    onChange: function (value, e) {
                        var target = e.target,
                            position = target.selectionStart; // Capture initial position

                        //target.value = value.replace(/(?!^)-/g, '').replace(/^,/, '').replace(/^-,/, '-').replace(/^(\.-)|^(-\.)/, '-');

                        //target.selectionEnd = position; // Set the cursor back to the initial position.
                    }
                });
            }

            //chave da empresa
            var fieldName = $(input).attr("data-field");
            if (fieldName == "id_empresa") {
                $(input).val(returnCookie("EnterpriseID"));
            }
        }

        //getDropdownHTML(layoutID, tabGenID);

        //Tira o load da aba
        $("#controls-tabs li a[href='#" + tabGenID + "'] img").replaceWith(" <span class='tabControls'>&nbsp&nbsp<i class='fa fa-refresh' onClick='atualizaAba(\"" + formID + "\",\"" + layoutID + "\",\"" + tabGenID + "\",\"" + forcingTemplate + "\",\"" + layoutType + "\",\"" + urlRenderLayout + "\",\"" + urlRenderLayoutData + "\",\"" + titleMenu + "\");'></i>&nbsp&nbsp<i class='icon wb-close-mini' onClick='fechaAba(\"" + tabGenID + "\");'></i></span>")
        //$(".form-control").mask($(".form-control").attr("data-mask"));

        //Binda o plugin de data
        $("[data-nativedatatype='Data']").datetimepicker({
            lang: "pt",
            timepicker: false,
            format: 'd/m/Y',
            formatDate: 'Y/m/d',
        });

        //Binda o checkbox
        $(".icheckbox_flat-blue").css("display", "-webkit-inline-box");
        $(".icheckbox_flat-blue").removeClass("icheckbox_flat-blue");
        $(".icheck-grey").iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue',
            increaseArea: '20%' // optional
        });

        

        //Binda o Wizard

        if ($("[tabgenid=" + tabGenID + "]").length > 1) {
            var defaults = $.components.getDefaults("wizard");
            var options = $.extend(true, {}, defaults, {
                onBeforeShow: function () {

                    var layout = $(".profile-tab .active");
                    var layoutid = "";
                    if (layout) {
                        if (layout.length > 0) {
                            layoutid = $(layout[0]).attr("layoutid");
                        }
                    }

                    var formObject;
                    var containerObject;
                    if (layoutid) {
                        formObject = $("#" + layoutid).find(".current");

                        if (formObject.length == 0) {
                            formObject = $("#" + layoutid).find(".done");
                        }

                        if (formObject.length > 0) {
                            var formid = $(formObject[0]).attr("tabgenid");
                            var containerid = $(formObject[0]).attr("containerid");

                            /* Não salva ao mudar de página do Wizard */
                            if (containerid == '9c64ffa0-2156-4dd9-8104-b5be352b4b5e' || containerid == '72cabf04-07b8-4706-aa17-0d2ea8f5e8d8' || containerid == 'c93dad75-a0b9-4c60-aedd-d6e27bf9a616')
                                return;

                            containerObject = $("#" + containerid + "_" + formid);
                        }
                    }
                    //var formObject = $(".wizard-pane .active").find("form");
                    if (containerObject) {
                        if (containerObject.data('original_serialized_form') !== containerObject.serialize()) {
                            if (containerObject.length > 0) {
                                containerObject = containerObject[0];
                            }
                            //$(containerObject).find("#Gravar").click();
                        }
                    }
                    

                    //$("html, body").animate({
                    //    scrollTop: 0
                    //}, 600);

                },
                onBeforeHide: function () {
                    //$("html, body").animate({ scrollTop: 0 }, 600);
                    //onSave(targetID, id, containerID, metadataContainerID, layoutID, false, form.onAfterSavingName);
                },
                onBack: function () {
                    //$("html, body").animate({ scrollTop: 0 }, 600);
                },
                onFinish: function () {
                    var layout = $(".profile-tab .active");
                    var layoutid = "";
                    if (layout) {
                        if (layout.length > 0) {
                            layoutid = $(layout[0]).attr("layoutid");
                        }
                    }

                    var formObject;
                    var containerObject;
                    if (layoutid) {
                        formObject = $("#" + layoutid).find(".current");
                        if (formObject.length > 0) {
                            var formid = $(formObject[0]).attr("tabgenid");
                            var containerid = $(formObject[0]).attr("containerid");
                            containerObject = $("#" + containerid + "_" + formid);

                        }
                    }
                    //var formObject = $(".wizard-pane .active").find("form");
                    if (containerObject.data('original_serialized_form') !== containerObject.serialize() && layoutid.includes("07ca6db2-a587-4a59-aa82-95f1795bdf68") == false) {
                        if (containerObject.length > 0) {
                            containerObject = containerObject[0];
                        }
                        //$(containerObject).find("#Gravar").click();
                    }

                    //if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Vendas") {
                    if (layoutid.includes("ee5b8618-b239-49ca-86a9-6975134c8713")) {
                        bt_gerarVenda();
                    }
                        //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Compras") {
                    else if (layoutid.includes("cacd9a15-c86d-4014-9a38-8ed7579905bb")) {
                        finalizarCompraJS();
                    }
                        //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Itens") {
                    else if (layoutid.includes("e02eea99-7c78-4bd7-aed4-47d401d3e13b")) {
                        AlterStatusRomaneioJS();
                        f_aba('romaneio', '358188AE-0B11-438F-8A4A-9BEBB7943D44', 'Picking', 'false', returnCookie("EnterpriseID"));
                    }
                        //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Nota Fiscal") {
                        //else if (layoutid.includes("07ca6db2-a587-4a59-aa82-95f1795bdf68")) {
                        //LancaEstoqueNota();
                        //f_aba('layNFe', '7df84e2b-376c-4af9-8d16-42ad021b7542', 'Controle de NF-e', 'true', returnCookie("EnterpriseID"));
                        //}
                        //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Picking") {
                    else if (layoutid.includes("358188ae-0b11-438f-8a4a-9bebb7943d44")) {
                        AlterStatusRomaneioJS();
                    }
                        //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Entrada Simples de Material") {
                    else if (layoutid.includes("a47ab0f5-98e4-4cde-9bf6-6e7f93ea4390")) {
                        finalizarEntradaSimplesJS();
                    }
                        //else if ($(".steps.steps-xs.row").find("span.step-title")[0].innerHTML == "Ordem de Produção") {
                    else if (layoutid.includes("01b095a1-dd9b-45b5-ab68-8b1f5c4dbffc")) {
                        finalizarOrdemProducaoJS();
                    }
                    else {
                        //OpenFormSearch(recipient);
                        $("#" + layoutid + " .panel-nav").find("#Filtrar").click();
                        //toogleColapseContainer($(formObject).find("#Gravar").parents(".innerTab"), true)
                    }

                    var onfinish = $("#" + layoutid);
                    if (onfinish) {
                        if (onfinish.length > 0) {
                            for (var i = 0; i < onfinish.length; i++) {
                                var onloadName = $(onfinish[i]).attr("data-finish");
                                eval(onloadName);
                            }
                        }
                    }
                }
            });

            $("#" +tabGenID + ">.panel .wizard-buttons").html("");
            
                        //var wizard = $("#" + layoutID + "_" + tabGenID + ">.panel").wizard(options).data('wizard');
            var wizard = $("#" +tabGenID + ">.panel").wizard(options).data('wizard');
            

        }


        $("form").formValidation({
            framework: 'bootstrap'

        })
        .on('success.form.fv', function (e) {
            // Reset the message element when the form is valid
            $('.summary-errors').html('');
            $('.summary-errors').hide();
        })
        .on('err.field.fv', function (e, data) {
            // data.fv     --> The FormValidation instance
            // data.field  --> The field name
            // data.element --> The field element
            $('#' + data.fv.$form[0].id + ' > .summary-errors').show();

            // Get the messages of field
            var messages = data.fv.getMessages(data.element);

            // Remove the field messages if they're already available
            $('#' + data.fv.$form[0].id + ' > .summary-errors').find('li[data-field="' + data.field + '"]').remove();
            if ($('#' + data.fv.$form[0].id + ' > .summary-errors').find('ul').length == 0) {

                var message = getObjMessageJS("7");
                var mess = "";

                if (message) {
                    if (message.title) {
                        if (message.title.length > 0) {
                            mess = message.title[0].text;
                        }
                    }
                }

                $('#' + data.fv.$form[0].id + ' > .summary-errors').append('<p>' + mess + '</p>');
                $('#' + data.fv.$form[0].id + ' > .summary-errors').append('<ul/>');
            }

            // Loop over the messages
            for (var i in messages) {
                // Create new 'li' element to show the message

                var label = $(data.element.parents('div')[1]).find('label').html();
                if (label == undefined) {
                    label = $(data.element.parents('div')[2]).find('label').html();
                }
                if (label == undefined) {
                    label = $(data.element.parents('div')[3]).find('label').html();
                }

                $('<li/>')
                  .attr('data-field', data.field)
                  .wrapInner(
                    $('<a/>')
                    .attr('href', 'javascript: void(0);')
                    // .addClass('alert alert-danger alert-dismissible')

                    .html(messages[i] + " no campo " + label)
                    .on('click', function (e) {
                        // Focus on the invalid field
                        data.element.focus();
                    })
                  ).appendTo('#' + data.fv.$form[0].id + ' > .summary-errors > ul');
            }

            // Hide the default message
            // $field.data('fv.messages') returns the default element containing the messages
            data.element
              .data('fv.messages')
              .find('.help-block[data-fv-for="' + data.field + '"]')
              .hide();
        })
        .on('success.field.fv', function (e, data) {
            // Remove the field messages
            $('#' + data.fv.$form[0].id + ' > .summary-errors > ul').find('li[data-field="' + data.field + '"]').remove();
            var formfv = $(".wizard-pane.active").find("form");

            if (formfv.length == 0) {
                formfv = $(".panel > .panel-body > .tab-content.tab-border > .tab-pane.active > form");
            }

            var fvv = formfv.data('formValidation');

            if (fvv != undefined && fvv != "undefined") {
                if (fvv.isValid()) {
                    $('#' + data.fv.$form[0].id + ' > .summary-errors').hide();
                }
            }

        });

        
        

    }});
}


function openLayout(button, tabGenID) {
          
    
        var formID = $(button).attr("data-tabgenlayout");
        ClearForm(formID, true);
        var $tabNav = $(button).parents("form .panel.panel-nav");
        toogleColapseContainer($tabNav, true)
        $($tabNav).hide()
        $("#" + formID).show();
    
        var form = $(button).attr("data-formid");
    
        //ClearForm(form, true);
    
        var formTelaIDNavigation = $(button);
    
        if (formTelaIDNavigation) {
            if (formTelaIDNavigation.length > 0) {
                formID = $(formTelaIDNavigation[0]).attr("data-tabgenlayout");
                
                var onload = $("[tabgenid='" + formID + "']");
                if (onload) {
                    if (onload.length > 0) {
                        for (var i = 0; i < onload.length; i++) {
                            var onloadName = $(onload[i]).attr("containeronload");
                            eval(onloadName);
                        }
                    }
                }
            }
        }

        //$("[data-field='id_empresa']").val(returnCookie("EnterpriseID"));
       

        
   
}


    function clickSearch(tabGenID, layoutName, layoutID, load, listartodos){
        $.ajax({url: returnCookie("urlPlataform") + "/api/listall/" + layoutID, success: function(result){	
            var id = "table_36905f00-0531-f073-3701-c5719ec12ca6_nav_table";
            var linehtml = "";
            if (result.recordsets) {
                if (result.recordsets.length > 0) {
                    if (result.recordsets[0].length > 0) {  
                        
                        var htm = "";                 
                        var data = [];
                       
                        
                        result.recordsets[0].forEach(function(element) {

                            if (element.sn_pessoafisica == true) {
                                element.sn_pessoafisica = '<i class="fa fa-check"></i>';
                            }else{
                                element.sn_pessoafisica = '<i class="fa fa-times"></i>';
                            }
                            
                            element.Id = element.Id.replace(" ","");

                            var row = {
                                "0":"<a type='button' title='editar' id='Edit' name='Edit' class='btn btn-primary btn btn-xs btn-warning 6420a34d-9c8b-fcc5-b8f3-930d33ee8ea7_edit' onclick='filleditnavigation(\"" + element.Id + "\",\"" + layoutID + "\", \"\" ,\"" + tabGenID + "\" )' data-tabgenlayout='6420a34d-9c8b-fcc5-b8f3-930d33ee8ea7_nav'><i class='fa fa-pencil'></i></a>",
                                "nm_razaosocial":element.nm_razaosocial,
                                "nr_codigo":element.nr_codigo,
                                "dt_cadastro":element.dt_cadastro,
                                "nm_nomefantasia":element.nm_nomefantasia,
                                "sn_pessoafisica":element.sn_pessoafisica,
                                "nm_cpf":element.nm_cpf,
                                "nm_cnpj":element.nm_cnpj
                            }

                            data.push(row);

                        }, this);

                        $(".pull-right.search").html("");
                        $("#" + id + " table").bootstrapTable('destroy').bootstrapTable({
                            data: data
                        });
                    }
                }
            }
        }});
    }


    
function filleditnavigation(filtro, LayoutID, Fill1PropertyID, tabGenID) {

    $.ajax({url: returnCookie("urlPlataform") + "/api/findid/" + filtro, success: function(result){
        var EnterpriseID = returnCookie("EnterpriseID");

        var formTelaIDNavigation = $("#table_" + tabGenID + "_btnnovo");

        if (formTelaIDNavigation) {
            if (formTelaIDNavigation.length > 0) {
                FormID = $(formTelaIDNavigation[0]).attr("data-formid");
                tabGenID = $(formTelaIDNavigation[0]).attr("data-tabgenlayout");

                fillScreen(result);

                var formID = $(formTelaIDNavigation[0]).attr("data-tabgenlayout");
                var $tabNav = $(formTelaIDNavigation[0]).parents("form .panel.panel-nav");
                toogleColapseContainer($tabNav, true)
                $($tabNav).hide();
                $("#" + formID).show();

                //        var onload = $("[tabgenid='" + formID + "']");
                //        if (onload) {
                //            if (onload.length > 0) {
                //                for (var i = 0; i < onload.length; i++) {
                //                    var onloadName = $(onload[i]).attr("containeronload");
                //                    eval(onloadName);
                //                }
                //            }
                //        }

            }
        }
    }})
}

function fillScreen(data){
    var arraytable = [];
    var arraydatagrid = [[]];
    var arraydataJSON = [[]];
    var datagrid = [];
    var tablegrid;
    var arraytablegrid = [];
    var row = null;
    var beforeTable = "";
    var rownull = true;
    var idGrid = "";
    var containerID = "";

    var p = data.recordsets[0];
    for (var i = 0; i < p.length; i++) {        
        for (var key in p[i]) {
            var keyfield = key.split('.')
            var table = keyfield[0];
            var field = keyfield[1];

            tablegrid = $("[data-table='" + table + "'][data-fielddata='" + field + "']").closest('table');
            var idfield = $("[data-table='" + table + "'][data-fielddata='" + field + "']").attr("data-field");        

            if (field.toLowerCase() === "id") {
                idGrid = p[i][key];                
            }                    

            if (containerID === "") {
                if ($(tablegrid[0]).parents(".sharpGrid")) {
                    var div = $(tablegrid[0]).parents(".sharpGrid");
                    if (div.length > 0) {
                        containerID = div[0].id;
    
                        if (containerID) {
                            containerID = containerID.replace("_sharpGrid", "")
                        }
                    }
                }
            }
            
            
            var th = $("[data-table='" + table + "'][data-fielddata='" + field + "']");

            if(th.length > 0){              
               
                if(arraytable.indexOf(table) < 0){
                    arraytablegrid.push(tablegrid[0]);                    

                    if (row != null) {
                        var index = arraytable.indexOf(beforeTable);
                        if (index < 0) {
                            index = 0;
                        }  
                                                
                        if (rownull == false) {   
                            row["configuracao"] = "<div  style='white-space: nowrap;'><a type='button' title='editar' id='Edit' name='Edit' class='btn btn-primary btn btn-xs btn-warning ' onclick=editGridLine(this,'" + containerID + "','" + idGrid + "')><i class='fa fa-pencil'></i>  </a>  <a type='button' title='excluir' id='Delete' name='Delete' class='btn btn-primary btn btn-xs btn-danger ' onclick='deleteRowGrid(this,67310f48-6cf1-4ad6-8fdc-5fb8b4feb2d9_12dabdcd-7dea-e140-3a57-19837bbe368e, e31d2289-857e-4cd5-a9ab-ced917db810a)'><i class='fa fa-trash-o'></i>  </a></div>";
                            idGrid = "";
                            containerID = "";
                            if(arraydataJSON[index].indexOf(JSON.stringify(row)) < 0){
                                arraydatagrid[index].push(row);
                                arraydataJSON[index].push(JSON.stringify(row));
                            }                            
                        } 
                    }   
                    
                    rownull = true;
                    if (p[i][key]) {
                        rownull = false;
                    }
                                  
                    row = {};
                    arraytable.push(table)
                    row[idfield] = p[i][key]; 

                    arraydatagrid.push([]);
                    arraydataJSON.push([]);
                    beforeTable = table;
                }else{                   

                    if (p[i][key]) {
                        rownull = false;
                    }
                    row[idfield] = p[i][key]; 
                }     
            }else{
                var value = p[i][key];
                if (value != undefined && value != "undefined") {
                    if($("[data-table='" + table + "'][data-field='" + field + "']").length > 0){
                        if($("[data-table='" + table + "'][data-field='" + field + "']")[0].type === "select-one"){
                            value = value.toLowerCase();
                        }

                        var attribute = $("input[data-table='" + table + "'][data-field='" + field + "']").attr("data-nativedatatype");

                        switch (attribute) {
                            case "Data":
                                var arrayvalue = value.split("T");
                                if (arrayvalue.length > 0) {
                                    value = arrayvalue[0];
                                    value = formatDate(value);
                                }
                                break;
                            case "SimNao":
                                if (value == true) {
                                    $("[data-table='" + table + "'][data-field='" + field + "']").iCheck('check');
                                }else{
                                    $("[data-table='" + table + "'][data-field='" + field + "']").iCheck('uncheck');
                                }
                                break;
                            default:
                                break;
                        }
                    } 
                }     
                
                //if (field == "id_empresa") {
                //    value = returnCookie("EnterpriseID");
                //}
                
                $("[data-table='" + table + "'][data-field='" + field + "'][data-fielddata!='" + field + "']").val(value)
                $("[data-table='" + table + "'][data-field='" + field + "'][data-fielddata!='" + field + "']").attr("data-oldvalue", value)            
                
            }             
        }

        if (row != null) {
            var index = arraytable.indexOf(beforeTable);
            if (index < 0) {
                index = 0;
            }
            
            if (rownull == false) {               

                row["configuracao"] = "<div  style='white-space: nowrap;'><a type='button' title='editar' id='Edit' name='Edit' class='btn btn-primary btn btn-xs btn-warning ' onclick=editGridLine(this,'" + containerID + "','" + idGrid + "')><i class='fa fa-pencil'></i>  </a>  <a type='button' title='excluir' id='Delete' name='Delete' class='btn btn-primary btn btn-xs btn-danger ' onclick='deleteRowGrid(this,67310f48-6cf1-4ad6-8fdc-5fb8b4feb2d9_12dabdcd-7dea-e140-3a57-19837bbe368e, e31d2289-857e-4cd5-a9ab-ced917db810a)'><i class='fa fa-trash-o'></i>  </a></div>";
                idGrid = "";
                containerID = "";
                if(arraydataJSON[index].indexOf(JSON.stringify(row)) < 0){
                    arraydatagrid[index].push(row);
                    arraydataJSON[index].push(JSON.stringify(row));
                }
                
            }       
            row = null; 
        }
        
        arraytable = [];
    }

    var arrayT = [];

    for (var k = 0; k < arraytablegrid.length; k++) {
        arrayT.push($(arraytablegrid[k]).find("th"));
        $(arraytablegrid[k]).bootstrapTable('destroy');
    }


    for (var k = 0; k < arraytablegrid.length; k++) {
        var tableGrid = arrayT[k];

        if (arraydatagrid[k]) {
            if (arraydatagrid[k].length > 0) {
                $(arraytablegrid[k]).bootstrapTable('destroy').bootstrapTable({
                    data: arraydatagrid[k]
                });
        
                for (var i = 0; i < tableGrid.length; i++) {
                    var x = tableGrid[i].attributes;
            
                    if (x) {
                        if (x.length > 0) {
                            for (var j = 0; j < x.length; j++) {
                                $("[data-field='" + $(tableGrid[i]).attr("data-field") + "']").attr(x[j].name, x[j].value);
                            }
                        }
                    }
                }
            }
        }
    }    
}



function fillContainer(data){
    var arraytable = [];
    var arraydatagrid = [[]];
    var arraydataJSON = [[]];
    var datagrid = [];
    var tablegrid;
    var arraytablegrid = [];
    var row = null;
    var beforeTable = "";
    var rownull = true;

    var p = data.recordsets[0];
    for (var i = 0; i < p.length; i++) {        
        for (var key in p[i]) {
            var keyfield = key.split('.')
            var table = keyfield[0];
            var field = keyfield[1];
            var value = p[i][key];

            if (value != undefined && value != "undefined") {
                if($("[data-table='" + table + "'][data-field='" + field + "']").length > 0){
                    if($("[data-table='" + table + "'][data-field='" + field + "']")[0].type === "select-one"){
                        value = value.toLowerCase();
                    }
                    
                    var attribute = $("input[data-table='" + table + "'][data-field='" + field + "']").attr("data-nativedatatype");
                    
                    switch (attribute) {
                        case "Data":
                            var arrayvalue = value.split("T");
                            if (arrayvalue.length > 0) {
                                value = arrayvalue[0];
                                value = formatDate(value);
                            }
                            break;
                        case "SimNao":
                            if (value == true) {
                                $("[data-table='" + table + "'][data-field='" + field + "']").iCheck('check');
                            }else{
                                $("[data-table='" + table + "'][data-field='" + field + "']").iCheck('uncheck');
                            }
                            break;
                        default:
                            break;
                    }

                    //$("[data-table='entidade'][data-field='sn_pessoafisica']").iCheck('check');
                }

            }
            
            $("[data-table='" + table + "'][data-field='" + field + "'][data-fielddata!='" + field + "']").val(value)
            $("[data-table='" + table + "'][data-field='" + field + "'][data-fielddata!='" + field + "']").attr("data-oldvalue", value)            
        }  
    }     
}



function editGridLine(button, containerID, ID) {
    var arrayContainerID = [];
    arrayContainerID = containerID.split('_')
    
    if (arrayContainerID) {
        if (arrayContainerID.length > 0) {
            containerID = arrayContainerID[0];
        }
    }

    $.ajax({url: returnCookie("urlPlataform") + "/api/editGridLine/" + containerID + "/" + ID, success: function(result){
        fillContainer(result);
    }})
}


function onSave(form, id, instanceID, containerID, layoutID, async, onAfterSaving, onBeforeSaving){
    loaderImage(form + "_panel", true);
    var url = getGlobalParameters("urlPlataforma") + "/api/database/WriteData";
    var retorno;
    if (async != false) {
        async = true;
    };
    var isvalid = false;
   
    if ($("#" + form).length == 0) {
        form = form.replace(containerID,layoutID)
    }

    var formv = $("#" + form);

    

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

  
function atualizaAba(formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu) {
    $("#controls-tabs li a[href='#" + tabGenID + "'] .tabControls").replaceWith("<img src='images/loader.gif' height='15px' />");
    if (urlRenderLayout) {
        getAjaxParameter(urlRenderLayout, urlRenderLayoutData, function () {
            //getAjaxParameter(getGlobalParameters("urlInterface") + "/renderform", nameLayout + Dados, function () {
            fillTab(resultadoParametroExterno, formID, layoutID, tabGenID, false, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu)
            }, function () {
            //    //replaceTabControls(formID, layoutID, tabGenID, forcingTemplate, layoutType, urlRenderLayout, urlRenderLayoutData)
                replaceTabControls(formID, layoutID, tabGenID, false, layoutType, urlRenderLayout, urlRenderLayoutData, titleMenu) 
            });
    }
}



function OpenFormSearch(tabGenID) {
    //$("#" + id + "_alertaModalFormSearchShow").modal('show');
    var target = $("#" + tabGenID).parents().find(".panel-nav");
    $(target).show()
    $('html, body').animate({ scrollTop: target.offset().top }, 1000);
    toogleColapseContainer(target, false)
    return false;
}


function toogleColapseContainer(selectorContainer,close) {
    var $elements = $(selectorContainer).children(".panel-body");
    var $button = $(selectorContainer).find(".panel-heading .panel-control li a.minus");
    if (close != true && close != false) {
        close = $button.hasClass('active')
    } 

    if (close == true) {
        $elements.slideUp(200);
        $elements.parent().addClass("minimized");
        //$button.children('i').removeClass('fa-minus');
        //$button.children('i').addClass('fa-square-o');
        $button.addClass('active');
    } else if (close == false) {
        $elements.slideDown(200);
        $elements.parent().removeClass("minimized");
        //$button.children('i').removeClass('fa-square-o');
        //$button.children('i').addClass('fa-minus');
        $button.removeClass('active');
    }
}