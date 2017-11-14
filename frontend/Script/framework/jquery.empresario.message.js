
function notification(parameters) {
    var icon = (parameters.icon) ? parameters.icon : "envelope-o";
    var messageTitle = (parameters.messageTitle) ? parameters.messageTitle : "";
    var messageText = (parameters.messageText) ? parameters.messageText : "";
    var messageText2 = (parameters.messageText2) ? parameters.messageText2 : "";
    var position = (parameters.position) ? parameters.position : "bottom right";
    var fix = (parameters.fix) ? parameters.fix : false;
    var clearAll = (parameters.clearAll) ? parameters.clearAll : false;
    var type = (parameters.type) ? parameters.type : "";
    //ok
    //error
    //warning
    //default

    switch (type) {
        case "error":
            icon = "thumbs-down";
            break;
        case "warning":
            icon = "exclamation";
            break;
        case "ok":
            icon = "thumbs-up";
            break;
        default:
            break;
    }

    $.amaran({
        content: {
            message: messageTitle,
            size: messageText,
            file: messageText2,
            icon: 'fa fa-' + icon + ''
        },
        theme: "default " + type,
        position: position,
        inEffect: 'slideBottom',
        outEffect: 'slideBottom',
        closeButton: true,
        sticky: fix,
        delay: 10000,
        clearAll: clearAll
    });
}

//function confirm(message, callback, callbackfalse) {

//    bootbox.confirm(message, function (result) {
//        if (result) {
//            var html = 'Ok';
//            callback();
//        } else {
//            var html = 'Cancel';
//            callbackfalse();
//        }
//        notificationCenter(
//            'glyphicon glyphicon-ok',
//            'alert-success',
//            '<strong>Close</strong> Você apertou ' + html,
//            'top right'
//        );
//    });
//}


function confirm(message, callback, callbackfalse) {

    swal({
        title: message,
        text: "",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e4eaeb",
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        closeOnConfirm: true,
        closeOnCancel: true
    },
function (isConfirm) {
    if (isConfirm) {
        //swal("OK!", "Operação realizada com sucesso.", "success");
        callback();
    } else {
        //swal("Cancelado", "", "error");
        if (callbackfalse)
            callbackfalse();
    }
});
}

function confirmOk(message) {
    swal(message);
}