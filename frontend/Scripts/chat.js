/// <reference path="jquery-1.7.1.min.js" />
/// <reference path="jquery.signalR-1.0.0-rc1.js" />

$(function () {
    var chat = $.connection.chatHub;

    if (chat) {

        chat.client.publishMessage = function (nome, mensagem) {
            var containerNome = $('<span/>').text(nome).html();
            var containerMensagem = $('<div/>').text(mensagem).html();

            $("#conversa").append(
                '<li><strong>'
                    + containerNome +
                    '</strong>: '
                    + containerMensagem + '</li>');
        };

    }
    $.connection.hub.start().done(function () {
        var id = $.connection.hub.id;
        $("#enviar").click(function () {
            var nome = $("#nome").val();
            var mensagem = $("#mensagem").val();
            var id = $("#connectionId").val();
            chat.server.message(nome, mensagem, id);

            $("#mensagem").val('');
        });

        $("#enviartudo").click(function () {
            var nome = $("#nome").val();
            var mensagem = $("#mensagem").val();

            chat.server.enviarMensagem(nome, mensagem);

            $("#mensagem").val('');
        });
    });

    
});