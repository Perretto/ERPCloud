//CRIAÇÃO DE WIZARD
function createSteps(containersCount, titulosContainers, parameters) {
    var recipient = parameters.recipient;
    var targetID = parameters.recipient;
    var containerID = parameters.recipient;
    var toolbar = parameters.metadados.toolBar;
    var urlRenderLayoutData = parameters.urlRenderLayoutData;
    var id;

    if (toolbar != null) {
        id = toolbar.controls[i].systemName;
    }

    var title = parameters.title;
    var form = parameters.metadados;
    var guid;
    var htmlControlsTabs = "";
    var htmlControls = "";
    var metadataContainerID;
    var tabGenID = parameters.tabGenID;
    var layoutID = parameters.layoutID;
    var formID = form.ID;

    if (tabGenID) {
        metadataContainerID = containerID.replace("_" + tabGenID, "");
    }

    if (parameters.ableClose != null || parameters.ableClose != undefined) {
        var ableClose = parameters.ableClose;
    } else {
        var ableClose = false;
    }

    var forms = $("#" + recipient + " > .panel > .panel-body > form")

    if (containersCount > 0) {
        var div = $(div);

        //cria os steps do wizard
        htmlControlsTabs += "<div class=\"steps steps-xs row \" data-plugin=\"matchHeight\" data-by-row=\"true\" role=\"tablist\">";
        //cria o conteudo das steps

        //cria cada step
        for (var i = 0; i < containersCount; i++) {
            guid = gerarGUID();
            //variavel necessaria para marcar o step ativo (no caso, o primeiro)
            isActive = (i == 0) ? "current" : "";
            var number = i + 1;
            htmlControlsTabs += "<div containerid='" + parameters.metadados.container[i].ID + "' class=\"erpstep step col-md-3 " + isActive + "\" tabgenid=\"" + tabGenID + "\" containerOnLoad=\"" + parameters.metadados.container[i].onLoadName + "\"   data-target=\"wizard_" + i + guid + "\" data- data-formid=\"" + formID + "\" role=\"tab\">";
            htmlControlsTabs += "<span class=\"step-number\">" + number + "</span>";
            htmlControlsTabs += "<div class=\"step-desc\">";
            htmlControlsTabs += "<span class=\"step-title\">" + titulosContainers[i] + "</span>";
            htmlControlsTabs += "</div>";
            htmlControlsTabs += "</div>";

            isActive = (i == 0) ? "active" : "";

            $("#" + forms[i].id).wrap("<div data-containeridwizard='" + parameters.metadados.container[i].ID + "' data-guidwizard='" + tabGenID + "'  id='wizard_" + i + guid + "' class='wizard-pane " + isActive + "' data-formid=\"" + formID + "\" role=\"tabpanel\"/>")
        }

        $("#" + recipient + ">.panel>.panel-body>.wizard-pane").wrapAll("<div class=\"wizard-content\">")

        htmlControlsTabs = htmlControlsTabs + "</div>"
        
        $("#" + recipient + ">.panel>.panel-body>.wizard-content").before(htmlControlsTabs);

        for (var i = 0; i < containersCount; i++) {
            var formObject = $("#" + forms[i].id);
            formObject.data('original_serialized_form', formObject.serialize());
        }

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
                if (containerObject.data('original_serialized_form') !== containerObject.serialize()) {
                    if (containerObject.length > 0) {
                        containerObject = containerObject[0];
                    }
                    $(containerObject).find("#Gravar").click();
                }

                $("html, body").animate({
                    scrollTop: 0
                }, 600);
            },
            onBeforeHide: function () {
                $("html, body").animate({
                    scrollTop: 0
                }, 600);
                //onSave(targetID, id, containerID, metadataContainerID, layoutID, false, form.onAfterSavingName);
            },
            onBack: function () {
                $("html, body").animate({
                    scrollTop: 0
                }, 600);
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
                    $(containerObject).find("#Gravar").click();
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
                    // Finalizar em recebimento
                else if (layoutid.includes("bd7c9d03-c5b9-48ad-8c1d-c9a990060ce9")) {
                    procrecFinalizaRecebimentoJS();
                }
                    // Finalizar em pagamento
                else if (layoutid.includes("e67c4c2e-7d3d-4403-b643-1f10d44b17c2")) {
                    procPagFinalizaPagamentoJS();
                } else {
                    //OpenFormSearch(recipient);
                    $("#" + layoutid + " .panel-nav").find("#Filtrar").click();
                    //toogleColapseContainer($(formObject).find("#Gravar").parents(".innerTab"), true)
                }
                OpenFormSearch(recipient);
                var onfinish = $("#" + layoutid);
                if (onfinish) {
                    if (onfinish.length > 0) {
                        for (var i = 0; i < onfinish.length; i++) {
                            var onloadName = $(onfinish[i]).attr("data-finish");
                            eval(onloadName);
                        }
                    }
                }
                var form = $("#" + layoutid).find("form");
                for (var i = 0; i < form.length; i++) {
                    $(form[i]).formValidation('resetForm', true);
                }
            }
        });

        var wizard = $("#" + recipient + ">.panel").wizard(options).data('wizard');
    }
}

function teste(layoutid) {
    alert(layoutid);
}