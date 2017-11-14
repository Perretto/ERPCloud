function CreateTimeLine(containerID, FormID) {
    var retorno = "";
    retorno += "<div align=\"center\">";
    retorno += "<label style=\"padding-right:320px;\" class=\"\">Selecione o Produto</label>";
    retorno += "<input  data-serializable=\"false\" style=\"width: 450px;\" data-fill1propertyid=\"A8071A24-9348-45E9-BDF7-9AE1452EA0A9\" data-fill2propertyid=\"38f2d97f-1c70-4353-bcee-d63d4867b8b1\" maxlength=\"40\" localautocomplete=\"true\"   onfocus=\"bindAutocomplete('DC41C853-7C67-421A-8E29-D9E4D710765F', 'cadastrodeprodutoseservicos','0e243b81-3c5e-4686-ab81-5e42baaab488','Cadastro de Produtos e Serviços','','" + containerID + "','" + FormID + "','63BD2CAC-DDBC-4C38-95A8-6B3F456FF0D9','a8071a24-9348-45e9-bdf7-9ae1452ea0a9', '0b9bd718-dd8e-2ad3-11bf-0c2f03541ae1')\" data-controlid=\"DC41C853-7C67-421A-8E29-D9E4D710765F\" data-propertyid=\"DC41C853-7C67-421A-8E29-D9E4D710765F\" title=\"Selecione o Produto\" type=\"text\" id=\"auto\"  placeholder=\"Produto\" onblur=\"undefined\" onclick=\"undefined\" onchange=\"undefined\" onkeypress=\"undefined\" class=\"form-control autocomplete  notnull required ui-autocomplete-input\" autocomplete=\"off\">"
    retorno += "<br>";
    retorno += "</div>";
    retorno += "<br>";
    retorno += "<br>";
    retorno += "<br>";
    retorno += "<br>";
    retorno += "<br>";




    retorno = retorno + "</div>";
    if (containerID.indexOf("#") == -1) {
        containerID = "#" + containerID;
        $(containerID).append(retorno);
    }
    else {
        $(containerID).append(retorno);
    }


    $('#auto').blur(function () {
        var idProduto = $('#auto')[0].name;
        var UserID = returnCookie("UserID");
        var EnterpriseID = returnCookie("EnterpriseID");
        var objs = [idProduto, EnterpriseID];

        if ($('#auto')[0].name == "" || $('#auto')[0].name == null) {
            return;
        }
        else {

            $.ajax({
                url: getGlobalParameters("urlPlataforma") + "/api/render/RenderTimeLine",
                data: { idProduto: idProduto, EnterpriseID: EnterpriseID },
                //type: "get",
                dataType: "json",
                success: function (data) {
                    return populaTimeLine(data);
                }

            });

        }
    });

    function populaTimeLine(data) {
        if (document.getElementById('raiz') != null) {
            var node = document.getElementById('raiz');
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }

        retorno = "";
        if (data.length == 0) {
            notification({ messageTitle: "Erro na busca!", messageText: "Produto não possui composição!", fix: false, type: "warning", icon: "thumbs-down" });
        }

        if (data != null || data != "") {
            for (var i = 0; i < data.length; i = i + 3) {


                retorno = retorno + "<div id=\"raiz\" style=\"font-size:13px;\">";
                retorno = retorno + "<ul class=\"timeline timeline-icon\">";
                retorno = retorno + "<li class=\"timeline-item\" style=\"margin-bottom: 50px;\">";
                retorno = retorno + "<div class=\"timeline-dot bg-orange-600 animation-scale-up\">";
                retorno = retorno + "<i class=\"md-quote\" aria-hidden=\"true\"></i>";
                retorno = retorno + "</div>";
                if (data[i + 2] != "NULL") {
                    retorno = retorno + "<div align=\"right\" class=\"icondemo vertical-align-middle  animation-slide-left\">";
                    retorno = retorno + "<a style=\"margin-top: -15px; margin-right: 10px;\" class=\" wb-search avatar avatar-100 bg-white img-bordered\" href='" + data[i + 2] + "'>";
                    retorno = retorno + "<img src=\'" + data[i + 2] + "' alt=\"\">";
                    retorno = retorno + "</a>";
                }

                retorno = retorno + "<div class=\"icondemo vertical-align-middle timeline-info animation-slide-left timeline-item timeline-reverse \">";
                retorno = retorno + "<p class=\"icon md-shopping-cart\" style=\"margin:5px;\">  " + data[i + 1] + "</p>";
                if (data[i + 2] != "NULL") {
                    retorno = retorno + "</div>";
                }

                retorno = retorno + "</div>";
                retorno = retorno + "</li>";
                retorno = retorno + "<li class=\"timeline-item timeline-reverse\" style=\"margin-top: 0px; margin-bottom: 0px;\">";
                retorno = retorno + "<div style=\"max-width:100%\"class=\"timeline-info timeline-item timeline-reverse\">";
                retorno = retorno + "<p style=\"margin:5px;\">" + data[i] + "</p>";
                retorno = retorno + "</div>";
                retorno = retorno + "</li>";
            }

        }

        $(containerID).append(retorno);

        (function (document, window, $) {
            'use strict';
            $('.wb-search').magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                mainClass: 'mfp-fade',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
                }
            });

        })(document, window, jQuery);

    }


}