function CreateAutoComplete(parameters) {
    var retorno = "";
    var readonlybool = "";

    //titulo, classe, tamanho, nome, tooltip, controlID, propertyID, containerID, mask, defaultValue, readOnly
    var titulo = parameters.titulo;
    var classe = parameters.classe;
    var tamanho = parameters.tamanho;
    var nome = parameters.nome;
    var tooltip = parameters.tooltip;
    var controlID = parameters.controlID;
    var propertyID = parameters.propertyID;
    var containerID = parameters.containerID;
    var mask = parameters.mask;
    var defaultValue = parameters.defaultValue;
    var readOnly = parameters.readOnly;
    var maxLength = parameters.maxLength;
    var required = (parameters.required == true) ? "required=\"required\"" : "";

    var nameLayout = parameters.nameLayout;
	var layoutName= parameters.layoutName;
    var LayoutID = parameters.layoutID;
    var TitleMenu = parameters.titleMenu;
    var id = parameters.id;
    var FormID = parameters.FormID;

    var NativeDataType = parameters.nativeDataType;
    var Table = parameters.table;
    var Field = parameters.field;
    var SequenceRecording = parameters.sequenceRecording;
    var DerivedFrom = parameters.derivedFrom;
    var Fill1PropertyID = parameters.fill1PropertyID;
    var Fill2PropertyID = parameters.fill2PropertyID;

    var Serializable = parameters.serializable;
    var Template = parameters.Template;
    var Value = "";
    var Text = "";

    if (parameters.text) {
        if (parameters.text.length > 0) {
            Text = parameters.text[0];
        }
    }


    if (parameters.newValue.length > 0) {
        Value = parameters.newValue[0];
    } else {
        Value = parameters.defaultValue;
    }

    var LocalAutoComplete = parameters.localAutoComplete;
    var layoutScreen = parameters.layoutScreen;

    if (layoutScreen == "00000000-0000-0000-0000-000000000000") {
        layoutScreen = LayoutID;
    }

    var containerIDScreen = parameters.containerIDScreen;

    //CreateEvent
    var onLostFocusName = parameters.onLostFocusName;
    var onFocusName = parameters.onFocusName;
    var onKeyPressName = parameters.onKeyPressName;
    var onClickName = parameters.onClickName;
    var onChangeName = parameters.onChangeName;

    var tabGenID = parameters.tabGenID;

    var title = TitleMenu.replace(" ", "%20");
    title = title.replace(" ", "%20");
    title = title.replace(" ", "%20");
    title = title.replace(" ", "%20");
    title = title.replace(" ", "%20");
    title = title.replace(" ", "%20");

    var serializableHidden;
    var serializableText;

    if (Serializable == false) {
        serializableHidden = true;
        serializableText = false;
        propertyIDText = "";
        propertyIDHidden = propertyID;
        FieldText = "";
        FieldHidden = Field;
    } else {
        serializableHidden = false;
        serializableText = true;
        propertyIDText = propertyID;
        propertyIDHidden = "";
        FieldText = Field;
        FieldHidden = "";
    }


    //if (Template == "MASTERDETAIL") {
    //    serializableHidden = false;
    //    serializableText = false;
    //}


    if (readOnly == true || readOnly == "true") {
        readonlybool = "readonly"
    }

    //retorno = "<div class='form-group " + classe + " " + tamanho + "'>"
    //retorno = retorno + "<label>" + titulo + "</label>"




    if (nameLayout != "" && LayoutID != "") {
        retorno = retorno + "<div class='input-group'>";
        retorno = retorno + "<span id='" + id + "_key' class='input-group-addon' onclick=javascript:OpenAba('" + nameLayout + "','" + LayoutID + "','" + title + "','" + propertyID + "','" + FormID + "','" + id + "','" + Fill1PropertyID + "')>";
        retorno = retorno + "<i class=\"fa fa-key\"></i>";
        retorno = retorno + "</span>";
    }
	
    //retorno = retorno + "<input Serializable='" + serializableText + "'  NativeDataType='" + NativeDataType + "' Table='" + Table + "' data-field='" + Field + "' SequenceRecording='" + SequenceRecording + "' DerivedFrom='" + DerivedFrom + "' maxlength='" + maxLength + "' onfocus=\"bindAutocomplete('" + controlID + "', '" + nameLayout + "','" + LayoutID + "','" + TitleMenu + "','" + propertyID + "','" + containerID + "','" + FormID + "','" + id + "','" + Fill1PropertyID + "')\" data-controlID='" + controlID + "' data-propertyID='" + propertyID + "'  title='" + tooltip + "' type='text' id='" + nome + "_autocomplete' name='" + nome + "_autocomplete' placeholder='" + titulo + "' class='form-control autocomplete " + classe + "' " + readonlybool + " >"
	
	if (nameLayout != "")
	{
	    retorno = retorno + "<input data-propertyIDHidden='" + Fill2PropertyID + "'" + required + " data-serializable='" + serializableText + "'  data-nativeDataType='" + NativeDataType + "' data-table='" + Table + "' data-field='" + FieldText + "' data-sequenceRecording='" + SequenceRecording + "' data-derivedFrom='" + DerivedFrom + "' data-fill2PropertyID='" + Fill2PropertyID + "' maxlength='" + maxLength + "' localAutoComplete='" + LocalAutoComplete + "' data-containerID='" + containerIDScreen + "' onfocus=\"bindAutocomplete('" + controlID + "', '" + nameLayout + "','" + layoutScreen + "','" + TitleMenu + "','" + propertyID + "','" + containerIDScreen + "','" + FormID + "','" + id + "','" + Fill1PropertyID + "', '" + tabGenID + "')\" data-controlID='" + controlID + "' data-propertyID='" + propertyIDText + "' title='" + tooltip + "' type='text' id='" + id + "_autocomplete' name='" + nome + "_autocomplete' placeholder='" + titulo + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control autocomplete " + classe + "' " + readonlybool + ">"
	}
	else
	{
	    retorno = retorno + "<input data-propertyIDHidden='" + Fill2PropertyID + "'" + required + " data-serializable='" + serializableText + "'  data-nativeDataType='" + NativeDataType + "' data-table='" + Table + "' data-field='" + FieldText + "' data-sequenceRecording='" + SequenceRecording + "' data-derivedFrom='" + DerivedFrom + "' data-fill2PropertyID='" + Fill2PropertyID + "' maxlength='" + maxLength + "' localAutoComplete='" + LocalAutoComplete + "' data-containerID='" + containerIDScreen + "' onfocus=\"bindAutocomplete('" + controlID + "', '" + layoutName + "','" + layoutScreen + "','" + TitleMenu + "','" + propertyID + "','" + containerIDScreen + "','" + FormID + "','" + id + "','" + Fill1PropertyID + "', '" + tabGenID + "')\" data-controlID='" + controlID + "' data-propertyID='" + propertyIDText + "' title='" + tooltip + "' type='text' id='" + id + "_autocomplete' name='" + nome + "_autocomplete' placeholder='" + titulo + "' onblur='" + onLostFocusName + "' onclick='" + onClickName + "' onchange='" + onChangeName + "' onkeypress='" + onKeyPressName + "' class='form-control autocomplete " + classe + "' " + readonlybool + ">"
		
	}
    // value='" + Value + "'

	retorno = retorno + "<input data-oldvalue='00000000-0000-0000-0000-000000000000' data-serializable='" + serializableHidden + "' data-nativeDataType='" + NativeDataType + "' data-table='" + Table + "' data-field='" + FieldHidden + "' data-sequenceRecording='" + SequenceRecording + "' data-derivedFrom='" + DerivedFrom + "' data-fill1PropertyID='" + Fill1PropertyID + "' type='hidden' name='" + nome + "' id='" + id + "' data-propertyID='" + propertyIDHidden + "' localAutoComplete='" + LocalAutoComplete + "'>"

    if (nameLayout && LayoutID) {
        retorno = retorno + "</div>";
    }

    containerID = "#" + containerID;
    $(containerID).append(retorno);

    //if (Value != null && Value != "" && Value != undefined) {

    if (Text != "") {
        $("#" + id + "_autocomplete").val(Text);
        $("#" + id).val(Value);
    }else{
        $("#" + id + "_autocomplete").val(Value);
    }

    if (Value) {
        $("#" + id).attr("data-oldvalue", Value)
    }
    

    //} else {
    //    $("#" + nome + "_autocomplete").val(defaultValue);
    //}
    //bindAutocomplete(controlID, nameLayout, LayoutID, TitleMenu, propertyID);
}

function bindAutocomplete(controlID, nameLayout, LayoutID, TitleMenu, PropertyID, containerID, FormID, id, Fill1PropertyID, tabGenID) {

    var EnterpriseID = returnCookie("EnterpriseID");
    var UserID = returnCookie("UserID");

    $(".autocomplete").autocomplete({
        minLength: 1,
        source: function (request, response) {

            loaderImage(controlID + "_formgroup .control-group", true);
            $.ajax({
                url: getGlobalParameters("urlPlataforma") + "/api/render/RenderAutoComplete",
                data: { Filtro: request.term, GuidControl: controlID, EnterpriseID: EnterpriseID, UserID: UserID, LayoutID: LayoutID },
                dataType: 'json',
                success: function (data) {
                    response($.map(data, function (item) {
                        return {
                            label: item.text,
                            id: item.value,
                            PropertyID: Fill1PropertyID
                        }
                    }));
                    loaderImage(controlID + "_formgroup .control-group", false);
                    //response(label: data[0].text, value: data[0].value });
                },
                error: function () {
                    loaderImage(controlID + "_formgroup", false);

                }
            })

        },
        select: function (event, ui) {
            loaderImage(containerID + "_panel", true);
            var id = $(this).attr("id");
            id = id.replace("_autocomplete", "");
            if (ui.item.id.length > 0) {
                //document.getElementsById(id) = ui.item.id[0];
                $("#" + id).val(ui.item.id[0]);
                $("#" + id).attr('name', ui.item.id[0]);
            }


            if (ui.item.id == "MSG_ERR") {

                loaderImage(containerID + "_panel", false);
                if (LayoutID != "" && nameLayout != "" && TitleMenu != "") {

                    CreateAba(nameLayout, LayoutID, TitleMenu);

                    id = "#" + id.replace("#", "");
                    document.getElementById(id) = "";
                }
                //var tipo;
                //var mensagem;
                //tipo = "ALERTAMODAL";
                //mensagem = "teste de alerta!!";
                //Alerta(tipo, mensagem);
            } else {
                var item = $("#" + id);
                if (item.attr("localAutoComplete") == "false") {
					
					//$.ajax({
                    //    url: getGlobalParameters("urlPlataforma") + "/api/render/renderform",
                    //    data: { Dados: nameLayout, EnterpriseID: EnterpriseID, UserID: returnCookie("UserID"), Lang: //returnCookie("Lang"), Navigation:false, InstanceID:tabGenID, ParamReferenceID: Fill1PropertyID, Filtro: ui.item.id  },
                    //    dataType: 'json',
                    //    success: function (data) {
					//		FillForm(data, FormID, tabGenID);
                    //        loaderImage(containerID + "_panel", false);
                    //    }
                   // });
	
                    $.ajax({
                        url: getGlobalParameters("urlPlataforma") + "/api/database/DataSearch",
                        data: { Filtro: ui.item.id, FormID: LayoutID, ReferenceID: Fill1PropertyID, EnterpriseID: EnterpriseID },
                        dataType: 'json',
                        success: function (data) {
                            FillForm(data, FormID, tabGenID);
                            loaderImage(containerID + "_panel", false);
                        }
                    });
                }
                else {
                            loaderImage(containerID + "_panel", false);
                }
            }
            loaderImage(containerID + "_panel", false);
            $("#" + id).val(ui.item.id).trigger("change");
        }
    });

}

function OpenAba(nameLayout, LayoutID, TitleMenu, propertyID, FormID, id, Fill1PropertyID) {
    var title = TitleMenu.replace("%20", " ");
    title = title.replace("%20", " ");
    title = title.replace("%20", " ");
    title = title.replace("%20", " ");
    title = title.replace("%20", " ");
    title = title.replace("%20", " ");

    var value = $("#" + id).val();  //'4F4A8B2D-33B9-422E-A15D-4B2803A8403F';//document.getElementById(id).innerHTML;
    var dados = "&ParamReferenceID=" + Fill1PropertyID + "&Filtro=" + value;

    dados = dados + "&EnterpriseID=" + returnCookie("EnterpriseID");
    dados = dados + "&UserID=" + returnCookie("UserID");
    //teste
    //dados = "&ParamReferenceID=dfc28364-b95d-4913-b058-a037537d8876&Filtro=%INTELECTA%20TECNOLOGIA%20LTDA%";

    if (nameLayout != "" && LayoutID != "" && title != "") {
        CreateAba(nameLayout, LayoutID, title, dados);
    }
}