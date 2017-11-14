function CreateControls(parameters) {
    var LayoutID = parameters.layoutID;
    var layout = parameters.layoutID;
    var title = parameters.title;
    var FormID = parameters.ID;
    var tabGenID = parameters.tabGenID;
    var resultado = parameters.resultado;
    var innerContainer = (parameters.innerContainer) ? parameters.innerContainer : false;
    var urlRenderLayoutData = parameters.urlRenderLayoutData;
    var containerID;
    var containersCount;
    var tituloContainer;
    var titulosContainers;
    var containerSelected;
    var htmlControls = "";
    var htmlControlsTabs = "";
    var isActive;
    var controle;
    var titulo;
    var nome;
    var tooltip;
    var value;
    var mask;
    var maxLength;
    var id;
    var tamanho;
    var text;
    var propertyID;
    var controlID;
    var Serializable;
    var parametrosControle;
    var template;
    var gridValues = new Object;
    var ValueProperty;
    var TextProperty;
    var Fill1PropertyID
    var ControlType;
    var metadados;

    var metadados = resultado[0]
    var instanceTela = metadados.instanceTela;
    var principalDataTypeID = (metadados.layout) ? metadados.layout.principalDataTypeID : "";
    containersCount = metadados.container.length;
    titulosContainers = new Array();
    //define se titulos serão acima ou lateralmente aos controles
    var titleAboveControl = metadados.titleAboveControl;
    var titleAboveControlClass = (titleAboveControl) ? "" : " form-horizontal";

    var formTelaIDNavigation = $("[data-tabgenlayout='" + tabGenID + "']");

    if (formTelaIDNavigation) {
        if (metadados) {
            if (metadados.layout) {
                if (metadados.layout.ID) {
                    $(formTelaIDNavigation).attr("data-formid", metadados.layout.ID + "_" + tabGenID);
                }
            }
        }
    }


    //busca containers e cria as abas
    for (var j = 0; j < containersCount ; j++) {

        var templateL;
        //metadados = resultado[0]
        //guarda o container selecionado 
        containerSelected = metadados.container[j];
        //guarda id do container junto com id da tela
        containerID = containerSelected.ID + "_" + tabGenID;


       

        //guarda o nome do tipo de template
        if (containerSelected.template.systemName) {
            template = containerSelected.template.systemName.replace(/^\s+|\s+$/g, "");
            templateL = template.toLowerCase();
        }
        else {
            template = containerSelected.template.systemName;
            templateL = template;
        }

        //determina se o container é o principal da tela
        var containerPrincipalDataTypeID = containerSelected.principalDataTypeID;
        var isPrincipal;
        var isPrincipalClass;
        if (containerPrincipalDataTypeID == principalDataTypeID) {
            isPrincipal = true;
            isPrincipalClass = "principalContainer"
        } else {
            isPrincipal = false;
            isPrincipalClass = ""
        }


        if (parameters.forcingTemplate) {
            template = parameters.forcingTemplate
        }

        //procura o titulo, se nao houver, utiliza o nome de sistema
        if (containerSelected.title) {
            if (containerSelected.title.length > 0) {
                tituloContainer = containerSelected.title[0].text;
            } else {
                tituloContainer = containerSelected.systemName;
            }
        } else {
            tituloContainer = containerSelected.systemName;
        }


        titulosContainers[j] = tituloContainer;
        htmlControls = ""
        //cria a estrutura html do container
        //htmlControls += AbreDiv({ classe: "col-md-12 panel" })
        //htmlControls += FechaDiv()
        if (containerID.indexOf("95dcf884-6363-4938-b395-e20e754e6ee8") != -1) {
            htmlControls += "<label class=\"\">Selecione o Produto</label>";
            htmlControls += "<input  data-serializable=\"false\" data-fill1propertyid=\"A8071A24-9348-45E9-BDF7-9AE1452EA0A9\" data-fill2propertyid=\"38f2d97f-1c70-4353-bcee-d63d4867b8b1\" maxlength=\"40\" localautocomplete=\"true\" style=\"width: 750px;\"  onfocus=\"bindAutocomplete('DC41C853-7C67-421A-8E29-D9E4D710765F', 'cadastrodeprodutoseservicos','0e243b81-3c5e-4686-ab81-5e42baaab488','Cadastro de Produtos e Serviços','','" + containerID + "','" + FormID + "','DC41C853-7C67-421A-8E29-D9E4D710765F','a8071a24-9348-45e9-bdf7-9ae1452ea0a9', '0b9bd718-dd8e-2ad3-11bf-0c2f03541ae1')\" data-controlid=\"DC41C853-7C67-421A-8E29-D9E4D710765F\" data-propertyid=\"DC41C853-7C67-421A-8E29-D9E4D710765F\" title=\"Selecione o Produto\" type=\"text\" id=\"DC41C853-7C67-421A-8E29-D9E4D710765F\"  placeholder=\"Produto\" onblur=\"undefined\" onclick=\"undefined\" onchange=\"undefined\" onkeypress=\"undefined\" class=\"form-control autocomplete  notnull required ui-autocomplete-input\" autocomplete=\"off\">"
            htmlControls += "<br>"
        }

        var column = " ";

        if (containerSelected.column) {
            if (containerSelected.column > 0) {
                column = "col-md-" + containerSelected.column + " ";
            }
        }

        htmlControls += AbreForm({ id: containerID, layoutID: LayoutID, classe: "containerForm " + column + isPrincipalClass + " " + templateL, principalDataTypeID: containerPrincipalDataTypeID });

        htmlControls += "<div class=\"summary-errors alert alert-danger alert-dismissible\">";
        // htmlControls += "<button type=\"button\" class=\"close\" aria-label=\"Close\" data-dismiss=\"alert\">";
        // htmlControls += "<span aria-hidden=\"true\">×</span>";
        // htmlControls += "</button>";

        var message = getObjMessageJS("7");
        var mess = "";

        if (message) {
            if (message.title) {
                if (message.title.length > 0) {
                    mess = message.title[0].text;
                }
            }
        }


        htmlControls += "<p>" + mess + " </p>";
        htmlControls += "<ul></ul>";
        htmlControls += "</div>";

        //htmlControls += AbreDiv({ id: containerID + "_panel"});
        htmlControls += AbreDiv({
            id: containerID + "_panel", classe: "panel",
            attribute: [{
                name: "data-parameters", value: containerSelected.sn_parameters
            },
            {
                name: "tabgenid", value: tabGenID
            },
            {
                name: "containeronload", value: containerSelected.onLoadName
            },
            {
                name: "data-guidwizard", value: tabGenID
            },
            {
                name: "data-containeridwizard", value: containerID.replace("_" + tabGenID, "")
            }]
        });
        //htmlControls += AbreDiv({ classe: containerID + "-site-tour-trigger ajuda-tour" });
        //htmlControls += "<a href=\"javascript:void(0)\" class=\"ajuda\">Ajuda <i class=\"fa fa-question-circle\"></i></a>";
        //htmlControls += FechaDiv();

        //htmlControls += Subtitulo(tituloContainer, '<ul class="panel-control"><li><a class="minus" href="javascript:void(0)"><i class="fa fa-minus"></i></a></li></ul>', "");
        htmlControls += '<ul class="panel-control"></ul>';

        htmlControls += AbreDiv({ classe: "panel-body internal " + titleAboveControlClass });
        htmlControls += FechaDiv();

        htmlControls += FechaDiv();
        htmlControls += FechaForm();
        //cria container na tela

        $("#" + FormID + " > .panel > .panel-body").append(htmlControls);

        //varre os controles do container
        //inicia parametros para eventual montagem de grid
        var layoutName = "";
        if (metadados.layout) {
            layoutName = metadados.layout.systemName;
        }

        gridControls = renderControlStructure(containerSelected, containerID, tabGenID, titleAboveControl, template, metadados.layoutID, FormID, layoutName);
        gridControls.titulo = tituloContainer;
        gridControls.containerID = containerID;
        gridControls.template = template;
        gridControls.linePerPage = containerSelected.linePerPage;

        if (template == "MASTERDETAIL" || template == "GRID") {
            createGrid(gridControls);
        }
        if (template == "TREEDETAIL") {
            createTreeView({ conteudoTreeView: containerSelected, containerID: containerID, layoutID: FormID, tabGenID: tabGenID });
        }
        if (template == "TIMELINE") {
            CreateTimeLine(containerID, FormID);
        }

        if (containerSelected.form) {
            containerSelected.form.instanceTela = instanceTela;

            CreateControls({
                layout: template,
                title: containerSelected.title,
                ID: containerID,
                tabGenID: tabGenID,
                titleAboveControl: containerSelected.titleAboveControl,
                resultado: containerSelected.form,
                layoutID: LayoutID,
                innerContainer: true
            });
        }


        createToolbarEmpresario(containerID, containerSelected, containerID, LayoutID, tabGenID, instanceTela);
        panel_change_start(containerID + "_panel");
        //if (containerSelected.viewTabs == true) {
        //    createTab(containersCount, titulosContainers, { recipient: FormID })
        //}
        //CreateEvent
        containerCode = (containerSelected.onLoadName) ? "<script>" + containerSelected.onLoad + " </script>" : "";
        $("#" + containerID).append(containerCode);

        containerCode = (containerSelected.onAfterSavingName) ? "<script> function " + containerSelected.onAfterSavingName + "  " + containerSelected.onAfterSaving + "  </script>" : "";
        $("#" + containerID).append(containerCode);

        containerCode = (containerSelected.onBeforeSavingName) ? "<script> function " + containerSelected.onBeforeSavingName + "  " + containerSelected.onBeforeSaving + "  </script>" : "";
        $("#" + containerID).append(containerCode);


    }

    if (metadados.viewTabs == true) {

        if (title == "Estoque" || title == "Expedição" || title == "Cotações" || title == "Consignação de Compra" || title == "Consignação de Venda" || title == "frmRecebimento_Lista" || title == "Movimentação Bancária" || title == "Contas à Pagar" || title == "Contas à Receber" || title == "SAC" || title == "Cadastro de Usuários" || title == "Grupo de Vendedores" || title == "Grupos de Usuario" || title == "Fluxo de Caixa") {
            createTab(containersCount, titulosContainers, { recipient: FormID })
        }
        else {
            createSteps(containersCount, titulosContainers, { recipient: FormID, metadados: metadados, layoutID: LayoutID, tabGenID: tabGenID, urlRenderLayoutData: urlRenderLayoutData })
        }
    }

    createToolbarEmpresario(FormID, metadados, FormID, LayoutID, tabGenID, instanceTela);



    //if (titleAboveControl == false) {
    //    $("#" + TabFormID).addClass("form-horizontal")
    //    $("#" + TabFormID + " .form-group > label").addClass("col-md-3 control-label");
    //    $("#" + TabFormID + " .form-group").each(function () {
    //        $(this).find("*:not(label)").wrapAll("<div class=\"col-md-9\"></div>");
    //    })
    //}
    //createTab({recipient: formID})
}

function renderControlStructure(container, containerID, tabGenID, titleAboveControl, template, LayoutID, FormID, layoutName) {

    var gridControls = new Object();
    var stepElement = new Object();
    var steps = new Array();
    var fieldslist = new Array();
    var fieldElement = new Object();
    var classe = "";
    var scriptEvents = "";
    var tourCollection = "";
    gridControls.controls = new Array();
    containerSelected = container;
    if (containerSelected.control != null) {


        for (var i = 0; i < containerSelected.control.length; i++) {

            parametrosControle = new Object
            //define Controle selecionado
            controle = containerSelected.control[i]

            //define parametros iniciais do controle
            parametrosControle.containerID = containerID + " .panel-body";
            parametrosControle.containerIDScreen = containerID;

            parametrosControle.layoutID = controle.layoutID;
            parametrosControle.localAutoComplete = controle.localAutoComplete;
            parametrosControle.layoutScreen = LayoutID;
            parametrosControle.layoutName = layoutName;
            //define se é requerido
            parametrosControle.required = (controle.property && controle.property.allowNull == false) ? true : false;
            //parametro que define se será visível no grid/treeview ou não
            parametrosControle.visibleGrid = controle.visibleGrid;
            if (controle.layout != null) {
                parametrosControle.nameLayout = controle.layout.systemName;
                if (controle.layout.title) {
                    if (controle.layout.title.length > 0) {
                        parametrosControle.titleMenu = controle.layout.title[0].text;
                    } else {
                        parametrosControle.titleMenu = controle.layout.systemName;
                    }
                } else {
                    controle.layout.systemName;
                }

                parametrosControle.typeOpeningLayout = controle.typeOpeningLayout;
            } else {
                parametrosControle.nameLayout = "";
                parametrosControle.titleMenu = "";
                parametrosControle.typeOpeningLayout = "";
            }
            var help = "";
            //define Titulo
            if (controle.title) {
                if (controle.title.length > 0) {
                    parametrosControle.titulo = controle.title[0].text;
                    //define tooltip
                    parametrosControle.tooltip = (controle.title[0].toolTip) ? controle.title[0].toolTip : controle.systemName;
                    help = (controle.title[0].help) ? controle.title[0].help : "";
                } else {
                    parametrosControle.titulo = controle.systemName;
                }
            } else {
                parametrosControle.titulo = controle.systemName;
            }
            if (controle.visible) {
                stepElement = {
                    element: "#" + tabGenID + "_" + controle.systemName + (controle.controlType.replace(/^\s+|\s+$/g, "") == "AUTOCOMPLETE" ? "_autocomplete" : ""),
                    position: "right",
                    intro: parametrosControle.titulo + " <p class='content'> " + help + "</p>"
                };
                steps[steps.length] = stepElement;
                //if (parametrosControle.required) {
                //    fieldslist[fieldslist.length] = JSON.parse("{" + controle.systemName + (controle.controlType.replace(/^\s+|\s+$/g, "") == "AUTOCOMPLETE" ? "_autocomplete" : "") + ": { 'validators': { 'notEmpty': { 'message': 'O campo " + parametrosControle.titulo + " é obrigatório' } } }}");
                //}
            }
            //define o campo pai do treeview
            parametrosControle.ownerFieldTreeView = (controle.ownerFieldTreeView) ? controle.ownerFieldTreeView : false;
            //define marcara
            parametrosControle.mask = (controle.mask) ? controle.mask : "";
            //define ID
            parametrosControle.id = tabGenID + "_" + controle.systemName;
            //define Id original do controle
            parametrosControle.controlID = controle.ID;
            //define Id original da Property
            parametrosControle.propertyID = controle.propertyID;
            //define atributo name
            parametrosControle.nome = (controle.isVirtual == true) ? "" : controle.systemName;
            //define read only
            parametrosControle.readOnly = controle.readOnly;
            //define icone
            parametrosControle.symbol = (controle.symbol) ? controle.symbol : "";
            parametrosControle.icon = (controle.icon) ? controle.icon : "";
            //define se o controle é visivel na tela
            parametrosControle.classe = (controle.visible == false) ? classe + " hidden" : classe;
            //define se o controle aceita valor nulo
            parametrosControle.classe = (controle.property && controle.property.allowNull == false) ? parametrosControle.classe + " notnull required" : parametrosControle.classe;

            //define o tipo de controle
            parametrosControle.controlType = controle.controlType.replace(/^\s+|\s+$/g, "");
            //define o tipo de dado nativo
            parametrosControle.nativeDataType = controle.nativeDataType;
            //define nome da tabela
            parametrosControle.table = controle.table;
            //define nome do campo na tabela
            parametrosControle.field = controle.field;
            //define sequencia de gravacao
            parametrosControle.sequenceRecording = controle.sequenceRecording;
            //define de que propriedade essa deriva
            parametrosControle.derivedFrom = controle.derivedFrom;
            //define que propriedade preenche essa
            parametrosControle.fill1PropertyID = controle.fill1PropertyID;

            parametrosControle.fill2PropertyID = controle.fill2PropertyID;
            //define se o controle aceita valor nulo
            if (controle.property) {
                if (controle.property.primaryKey == true) {
                    parametrosControle.nome = parametrosControle.nome + "_PK"
                } else if (controle.property.foreignKey == true) {
                    parametrosControle.nome = parametrosControle.nome + "_FK_" + controle.property.dataTypeID;
                }
            }
            // define o maxlength levando em consideração, na seguinte ordem:
            if (controle.size > 0) {
                parametrosControle.tamanho = controle.size;
            }
            else if (controle.maxLength > 0) {
                parametrosControle.tamanho = controle.maxLength;
            }
            else if (controle.property) {
                parametrosControle.tamanho = (controle.property.size) ? controle.property.size : "";
            }
            else {
                parametrosControle.tamanho = "1000"
            }

            //define o MaxLength do controle
            if (controle.maxLength) {
                parametrosControle.maxLength = controle.maxLength;
            } else if (controle.property) {
                parametrosControle.maxLength = (controle.property.size) ? controle.property.size : "";
            }

            ////define valor e texto do campo (um array no caso de um grid)
            //if (containerSelected.template.systemName != "MASTERDETAIL" && containerSelected.template.systemName != "TREEDETAIL") {
            //    parametrosControle.valueProperty = (controle.property && controle.property.value) ? controle.property.value[0] : "";
            //    parametrosControle.textProperty = (controle.property && controle.property.text) ? controle.property.text[0] : "";
            //}

            parametrosControle.template = containerSelected.template.systemName;

            parametrosControle.newValue = "";
            parametrosControle.text = "";
            //define valores pre carregados ao abrir uma tela   
            if (controle.property) {
                if (controle.property.value) {
                    if (controle.property.value.length > 0) {
                        parametrosControle.newValue = controle.property.value;
                    } else {
                        parametrosControle.newValue = "";
                    }
                }
                if (controle.property.text) {
                    if (controle.property.text.length > 0) {
                        parametrosControle.text = controle.property.text;
                    } else {
                        parametrosControle.text = "";
                    }
                }
            }
            //define valores pre carregados do campo como no DropDown ou no Rádio
            if (controle.value) {
                if (controle.value.length > 0) {
                    parametrosControle.valueList = controle.value;
                } else {
                    parametrosControle.valueList = "";
                }
            }

            //define textos pre carregados do campo como no DropDown ou no Rádio

            if (!parametrosControle.text) {
                if (controle.text) {
                    if (controle.text.length > 0) {
                        parametrosControle.textList = controle.text;
                    } else {
                        parametrosControle.textList = "";
                    }
                }
            }



            if (controle.isVirtual == true || (controle.controlType == "AUTOCOMPLETE" && parametrosControle.nameLayout && parametrosControle.layoutID)) {
                parametrosControle.serializable = false;
            } else {
                parametrosControle.serializable = true;
            }


            //CreateEvent   

            if (controle.onLostFocusName) {
                scriptEvents += " " + controle.onLostFocus;
                parametrosControle.onLostFocusName = controle.onLostFocusName;
            }

            if (controle.onClickName) {
                scriptEvents += " " + controle.onClick;
                parametrosControle.onClickName = controle.onClickName;
            }

            if (controle.onFocusName) {
                scriptEvents += " " + controle.onFocus;
                parametrosControle.onFocusName = controle.onFocusName;
            }

            if (controle.onChangeName) {
                scriptEvents += " " + controle.onChange;
                parametrosControle.onChangeName = controle.onChangeName;
            }

            if (controle.onKeyPressName) {
                scriptEvents += " " + controle.onKeyPress;
                parametrosControle.onKeyPressName = controle.onKeyPressName;
            }

            parametrosControle.scriptEvents = scriptEvents;

            if (controle.property) {
                parametrosControle.defaultValue = controle.property.defaultValue;
            }

            parametrosControle.tabGenID = tabGenID;

            //Adicionado o FormID nos parametros
            parametrosControle.FormID = FormID;

            parametrosControle.report = controle.report;
            if (template != "GRID") {
                renderControl(parametrosControle, titleAboveControl, tabGenID, scriptEvents)
            }

            //preenche objeto com titulos e valores para montagem de grid
            gridControls.controls[i] = parametrosControle;

        }
    }

    $.configs.set(containerID, {
        steps: steps,
        skipLabel: "<i class='fa fa-times'></i>",
        doneLabel: "<i class='fa fa-times'></i>",
        nextLabel: "Pr&oacute;ximo <i class='fa fa-angle-right'></i>",
        prevLabel: "<i class='fa fa-angle-left'></i> Voltar",
        showBullets: false
    });

    $('.summary-errors').hide();

    $('#' + containerID).formValidation({
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

            $('#' + data.fv.$form[0].id + ' > .summary-errors').append('<p>' + mess +'</p>');
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

    (function (document, window, $) {
        'use strict';



        $('.' + containerID + '-site-tour-trigger').on('click', function () {

            var Site = window.Site;
            Site.tour = undefined;

            var tourOptions = $.configs.get(containerID),
                self = Site;
            var flag = $('body').css('overflow');
            Site.tour = introJs();

            Site.tour.onbeforechange(function () {
                $('body').css('overflow', 'hidden');
            });

            Site.tour.oncomplete(function () {
                $('body').css('overflow', flag);
            });

            Site.tour.onexit(function () {
                $('body').css('overflow', flag);
            });

            Site.tour.setOptions(tourOptions);
            self.tour.start();
        });

    })(document, window, jQuery);

    return gridControls;
}

function renderControl(parametrosControle, titleAboveControl, tabGenID, scriptEvents) {
    var retorno = ""
    var c = parametrosControle;
    retorno

    c.tabGenID = tabGenID;
    var containerID = c.containerIDScreen;

    //define tamanho dos campos na tela
    if (c.AloneInLine == true || titleAboveControl == false) {
        //coloca os controles como largura inteira
        c.tamanho = 60;
        if (!titleAboveControl) {
            c.tamanholabel = "col-md-3 control-label";
            c.tamanhofield = "col-md-9";
        }
        else {
            c.tamanholabel, c.tamanhofield = "";
        }
    }
    else {
        c.tamanholabel = "";
        c.tamanhofield = "";
        if (c.controlType == "DATE" ||
            c.controlType == "DATETIME" ||
            c.controlType == "DATECHECK" ||
            c.controlType == "DROPDOWNDSG") {
            if (c.controlType == "DROPDOWNDSG") {
                //c.tamanho = convertPixelToColumn(c.tamanho + 30);
                //c.tamanho = c.tamanho + 10;
            }
            //c.tamanho = convertPixelToColumn(20);
        }
        else {

        }
    }
    if (c.controlType != "CHECKBOX") {

    }
    c.tamanho = convertPixelToColumn(c.tamanho);

    retorno += "<div data-containerid='" + containerID + "' class=\"form-group " + c.tamanho + " " + c.classe + "\" id=\"" + c.controlID + "_formgroup\" data-controlType=\"" + c.controlType + "\">"
    retorno += "<label class=\"" + c.tamanholabel + "\" >"
    retorno += (c.controlType == "CHECKBOX" || c.controlType == "BUTTON") ? "" : c.titulo;
    retorno += "</label>"
    retorno += "<div class=\"control-group " + c.tamanhofield + "\" id=\"" + c.controlID + "_controlgroup\">"
    retorno += "</div>"
    retorno += "<script>" + scriptEvents + " </script>"
    retorno += "</div>"

    if (c.controlType != "HIDDEN") {
        $("#" + c.containerID).append(retorno);
        c.containerID = c.containerID + " #" + c.controlID + "_controlgroup";
    }
    else {

    }



    switch (c.controlType) {
        case "TEXT":
            CreateTextBox(c);
            break;
        case "CHECKBOX":
            CreateCheckBox(c);
            break;
        case "DATE":
            CreateDate(c);
            break;
        case "TIME":
            CreateTime(c);
            break;
        case "DROPDOWN":
            CreateDropDown(c);
            break;
        case "HIDDEN":
            CreateHidden(c);
            break;
        case "PASSWORD":
            CreatePassword(c);
            break;
        case "NUMBER":
            CreateControlNumber(c);
            break;
        case "RADIO":
            CreateRadio(c);
            break;
        case "SUBMIT":
            CreateSubmit(c);
            break;
        case "BUTTON":
            CreateButton(c);
            break;
        case "RESET":
            CreateReset(c);
            break;
        case "UPLOAD":
            CreateUpload(c);
            break;
        case "EMAIL":
            CreateEmail(c);
            break;
        case "TELEFONE":
            CreateTelefone(c);
            break;
        case "DROPDOWNDSG":
            CreateDropDownDSG(c);
            break;
        case "TREEVIEWTEXT":
            CreateTextTreeView(c);
            break;
        case "DATETIME":
            CreateDateTime(c);
            break;
        case "AUTOCOMPLETE":
            CreateAutoComplete(c);
            break;
        case "TEXTAREA":
            CreateTextArea(c);
            break;
        case "TEXTVALUE":
            //symbol
            CreateTextValue(c);
            break;
        case "DATECHECK":
            CreateDateCheck(c);
            break;
        case "TIMECHECK":
            CreateTimeCheck(c);
            break;
        case "TEXTPERC":
            CreateTextPerc(c);
            break;
        case "LABEL":
            CreateLabel(c);
            break;
        case "IMAGE":
            CreateImage(c);
            break;
        case "FILE":
            CreateFile(c);
            break;
            //case "GRID":
            //    CreateGrid(gridControls);
            //    break;
        case "ARQUIVO":
            CreateArquivo(c);
            break;
        case "FILEDATA":
            CreateFileData(c);
            break;
        case "TEXTCURRENCY":
            //symbol
            CreateTextCurrency(c);
            break;
        default:
            CreateTextBox(c);
    }
    dataIdPropagate(c.containerID)
}

function dataIdPropagate(cFather) {
    cFather = $(cFather);


}

function convertPixelToColumn(size) {
    classeGroup = "col-md-2"

    if (size <= 10) {
        classeGroup = "col-md-2"
    }
    else if (size > 10 && size <= 20) {
        classeGroup = "col-md-3"
    }
    else if (size > 20 && size <= 35) {
        classeGroup = "col-md-4"
    }
    else if (size > 35 && size <= 55) {
        classeGroup = "col-md-6"
    }
    else if (size > 55) {
        classeGroup = "col-md-12"
    }

    if (size == 1000) {
        classeGroup = "col-md-9"
    }
    return classeGroup;
}

