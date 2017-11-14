function CreateImage(parameters) {
    var retorno = "";
    var readonlybool = "";

    //titulo, classe, tamanho, nome, tooltip, controlID, propertyID, containerID, defaultValue, readOnly
    var titulo = parameters.titulo;
    var classe = parameters.classe;
    var tamanho = parameters.tamanho;
    var nome = parameters.nome;
    var tooltip = parameters.tooltip;
    var controlID = parameters.controlID;
    var propertyID = parameters.propertyID;
    var containerID = parameters.containerID;
    var defaultValue = parameters.defaultValue;
    var readOnly = parameters.readOnly;
    var id = parameters.id;


    var nativeDataType = parameters.nativeDataType;
    var table = parameters.table;
    var field = parameters.field;
    var sequenceRecording = parameters.sequenceRecording;
    var derivedFrom = parameters.derivedFrom;


    var value;
    if (parameters.newValue.length > 0) {
        value = parameters.newValue[0];
    } else {
        value = parameters.defaultValue;
    }


    //CreateEvent
    var onLostFocusName = parameters.onLostFocusName;
    var onFocusName = parameters.onFocusName;
    var onKeyPressName = parameters.onKeyPressName;
    var onClickName = parameters.onClickName;
    var onChangeName = parameters.onChangeName;

    var serializable = parameters.serializable;

    //CreateEvent
    var onLostFocusName = parameters.onLostFocusName;
    var onFocusName = parameters.onFocusName;
    var onKeyPressName = parameters.onKeyPressName;
    var onClickName = parameters.onClickName;
    var onChangeName = parameters.onChangeName;

    if (value != null && value != "" && value != undefined) {
        defaultValue = value;
    }


    if (readOnly == true || readOnly == "true") {
        readonlybool = "disabled"
    }
  

   

    //retorno = "<div class='form-group " + classe + " " + tamanho + "'>"

    
   
    retorno = retorno + "<div style=\"width: 120px; height: 120px\" class='control-image fluidbox-wrap' style='z-index: 990;'>";

    retorno = retorno + "<div style=\"width: 120px; height: 120px\" class=\"widget widget-shadow\"><figure style=\"width: 120px; height: 120px\"class=\" overlay-hover\">";
    retorno = retorno + "<img style=\"width: 120px; height: 120px\" class=\"overlay-figure\" src='" + defaultValue + "' alt=\"...\" id='" + id + "'>"
    retorno = retorno + "<figcaption style=\"width: 120px; height: 120px\" class=\"overlay-panel overlay-background overlay-fade overlay-icon\">"
    retorno = retorno + "<a class=\"icon wb-search\" href='" + defaultValue + "'></a>"
    retorno = retorno + "</figcaption>"
    retorno = retorno + "</figure></div>"

    //
    //retorno = retorno + "<label>" + titulo + "</label>";
    //retorno = retorno + "<img data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'   data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' id=" + id + " src='" + defaultValue + "' alt title " + readonlybool + " ></div>"
    //FUNCIONA, MARCÃO MANDOU
    //retorno = retorno + "<a href=\" http://br.web.img2.acsta.net/r_x_600/newsv7/15/06/15/15/38/3347510.jpg \" class=\"lightbox\>";
    //retorno = retorno + "<img  height=\"120\" width=\"120\" data-serializable='" + serializable + "' data-nativeDataType='" + nativeDataType + "' data-table='" + table + "' data-field='" + field + "' data-sequenceRecording='" + sequenceRecording + "' data-derivedFrom='" + derivedFrom + "'   data-controlID='" + controlID + "' data-propertyID='" + propertyID + "' onblur='" + onLostFocusName + "' onclick='"+onClickName+"' onfocus='" + onFocusName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' id=" + id + " src=\" http://br.web.img2.acsta.net/r_x_600/newsv7/15/06/15/15/38/3347510.jpg \" alt title " + readonlybool + " /></a>"
    retorno = retorno + "</div>";
   
    

    containerID = "#" + containerID;
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

