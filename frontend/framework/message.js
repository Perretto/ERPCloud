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