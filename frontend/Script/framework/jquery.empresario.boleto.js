var idGera = "0";

function queryParams(params) {



    return {
        limit: 10,
        offset: paginaAtual
    };
}

function geraBoleto(id, banco) {
    idGera = id;
    var bancoBoleto = banco;

    Ext.Ajax.request({
        success: function (o) {
            var decoded = Ext.decode(o.responseText);
            Ext.MessageBox.hide();
            if (decoded.success) {
                window.location = 'http://' + window.location.host  + ':8080/IntelectaReportWeb/principal.do?method=carregaBoletoGerado&arqRelatorio=boleto.pdf';
                jAlert('<font color=green>Boleto gerado com sucesso.</font>', 'Intelecta Tecnologia', function () {
                });
            } else {
                var erro = decoded.erro;
                jAlert('<font color=red>' + erro + '</font>', 'Intelecta Tecnologia');
            }
        },
        failure: function () { Ext.MessageBox.hide(); },
        scope: this,
        url: 'http://' + window.location.host + ':8080/IntelectaReportWeb/principal.do',
        params: { method: 'geraBoleto', idGera: idGera, bancoBoleto: bancoBoleto }
    })

    idGera = "0";
}