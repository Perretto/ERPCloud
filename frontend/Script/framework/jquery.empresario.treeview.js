function createTreeView(parameters) {
    var htmlTree = "";

    var titulo;
    var conteudoTreeView = parameters.conteudoTreeView;
    var containerID = parameters.containerID;
    var LayoutID = parameters.layoutID;
    var tabGenID = parameters.tabGenID;

    //var container = parameters.container;

    //if (conteudoTreeView.Title != null) {
    //    titulo = conteudoTreeView.Title[0].text;
    //} else {
    //    titulo = conteudoTreeView.systemName;
    //}

    var metadataContainerID;

    if (tabGenID) {
        metadataContainerID = containerID.replace("_" + tabGenID, "");
    }

    var metadataLayoutID;

    if (LayoutID) {
        metadataLayoutID = LayoutID.replace("_" + tabGenID, "");
    }
    
    htmlTree = htmlTree + "<div id='" + containerID + "_treeview' class='easy-tree'>";
    
    htmlTree = htmlTree + "<ul>";
    htmlTree = htmlTree + "<li>";
    htmlTree = htmlTree + "<ul>";

    var ReferencePropertyID;
    var OwnerControlID;
    var indexPK = 0;

    for (var i = 0; i < conteudoTreeView.control.length ; i++) {
        if (conteudoTreeView.control[i].property != null) {
            if (conteudoTreeView.control[i].property.primaryKey == true) {
                if (conteudoTreeView.control[i].property.value != null) {
                    ReferencePropertyID = conteudoTreeView.control[i].propertyID;   
                    indexPK = i;
                }
            }
        }

        if (conteudoTreeView.control[i].ownerFieldTreeView == true) {
            OwnerControlID = conteudoTreeView.control[i].ID;
        }
    }


    for (var i = 0; i < conteudoTreeView.control.length ; i++) {        
            if (conteudoTreeView.control[i].property != null) {
                if (conteudoTreeView.control[i].property.value != null) {
                    if (conteudoTreeView.control[i].property.value.length > 0) {
                        if (conteudoTreeView.control[i].property.text != "") {
                            if (conteudoTreeView.control[i].visibleGrid == true) {
                                for (var j = 0; j < conteudoTreeView.control[i].property.text.length ; j++) {
                                                                       

                                    htmlTree = htmlTree + "<li id='" + conteudoTreeView.control[indexPK].property.text[j] + "' ";
                                    htmlTree = htmlTree + "data-newValue='" + conteudoTreeView.control[indexPK].property.text[0] + "' ";
                                    htmlTree = htmlTree + "data-newValue='" + conteudoTreeView.control[indexPK].property.text[0] + "' ";
                                    htmlTree = htmlTree + "data-controlid='" + conteudoTreeView.control[indexPK].ID + "' ";
                                    htmlTree = htmlTree + "data-nativeDataType='" + conteudoTreeView.control[indexPK].nativeDataType + "' ";
                                    htmlTree = htmlTree + "data-table='" + conteudoTreeView.control[indexPK].table + "' ";
                                    htmlTree = htmlTree + "data-field='" + conteudoTreeView.control[indexPK].field + "' ";
                                    htmlTree = htmlTree + "data-sequenceRecording='" + conteudoTreeView.control[indexPK].sequenceRecording + "' ";
                                    htmlTree = htmlTree + "data-derivedFrom='" + conteudoTreeView.control[indexPK].derivedFrom + "' ";
                                    htmlTree = htmlTree + "data-propertyid='" + conteudoTreeView.control[indexPK].propertyID + "' ";
                                    htmlTree = htmlTree + "'>";

                                    htmlTree = htmlTree + conteudoTreeView.control[i].property.text[j] + " ";
                                    htmlTree = htmlTree + "     <ul >";

                                    htmlTree = htmlTree + f_retornaSubItens(conteudoTreeView.control[i].controls, LayoutID, ReferencePropertyID, containerID, OwnerControlID, conteudoTreeView.control[indexPK].controls, conteudoTreeView.control[indexPK]);
                                    htmlTree = htmlTree + " </ul>";
                                    htmlTree = htmlTree + " </li>";
                                }
                            }
                        }
                    }
                }
            }
        
        }
    

    htmlTree = htmlTree + "</ul>";
    htmlTree = htmlTree + "</li>";
    htmlTree = htmlTree + "</ul>";

    htmlTree = htmlTree + AbreDiv({ classe: "ls-button-group col-md-12" });
    htmlTree = htmlTree + "<a onclick=\"addNewTreeViewItem('" + containerID + "')\" class='btn btn-primary'><i class='fa fa-plus-circle'></i></a>";
    htmlTree = htmlTree + "<a onclick=\"editTreeViewItem('" + containerID + "', '" + LayoutID + "', '" + tabGenID + "')\" class='btn btn-warning'><i class='fa fa-pencil-square'></i></a>";
    htmlTree = htmlTree + "<a onclick=\"deleteTreeViewItem('" + containerID + "','" + metadataLayoutID + "')\" class='btn btn-danger'><i class='fa fa-minus-circle'></i></a>";
    htmlTree = htmlTree + FechaDiv();

    htmlTree = htmlTree + FechaDiv();

    $("#" + containerID + " .panel-body").prepend(htmlTree);
    $("#" + containerID + " .panel-body").append("<div class='form-group'><label></label><a onclick=\"saveTreeViewItem('" + containerID + "', '" + metadataLayoutID + "')\" class='btn btn-primary'><i class='fa fa-floppy-o'></i></a></div>");

    visibleFormGroup(containerID, false);

   // $("#" + containerID + "_treeview").jstree();

    $("#" + containerID + "_treeview").EasyTree({
        addable: false,
        editable: false,
        deletable: false,
        i18n: {
            deleteNull: 'Please select the item you want to delete.',
            deleteConfirmation: 'You sure you want to delete operation?',
            confirmButtonLabel: 'Confirm',
            editNull: 'Please select the item you want to edit.',
            editMultiple: 'You can only edit one',
            addMultiple: 'Please select an add',
            collapseTip: 'Collapse branch',
            expandTip: 'Expand Branch',
            selectTip: 'Select',
            unselectTip: 'Deselect',
            editTip: 'Editing',
            addTip: 'Add to',
            deleteTip: 'Delete',
            cancelButtonLabel: 'Cancel'
        }

    });
}


/*---------------- Multi Nested List -------------------*/
function multiNestedList(id) {
    'use strict';

    var $this;

    // Select the main list and add the class "hasSubmenu" in each LI that contains an UL
    $('#' + id + ' ul').each(function () {
        $this = $(this);
        $this.find("li").has("ul").addClass("hasSubmenu");
    });
    // Find the last li in each level
    $('#' + id + ' li:last-child').each(function () {
        $this = $(this);
        // Check if LI has children
        if ($this.children('ul').length === 0) {
            // Add border-left in every UL where the last LI has not children
            $this.closest('ul').css("border-left", "1px solid #e3dfd8");
        } else {
            // Add border in child LI, except in the last one
            $this.closest('ul').children("li").not(":last").css("border-left", "1px solid #e3dfd8");
            // Add the class "addBorderBefore" to create the pseudo-element :defore in the last li
            $this.closest('ul').children("li").last().children("a").addClass("addBorderBefore");
            // Add margin in the first level of the list
            //$this.closest('ul').css("margin-top","20px");
            // Add margin in other levels of the list
            $this.closest('ul').find("li").children("ul").css("margin-top", "20px");
        };
    });
    // Add bold in li and levels above
    $('#' + id + ' ul li').each(function () {
        $this = $(this);
        $this.mouseenter(function () {
            $(this).children("a").css({ "font-weight": "bold", "color": "#ff7878" });
        });
        $this.mouseleave(function () {
            $(this).children("a").css({ "font-weight": "normal", "color": "#65615B" });
        });
    });
    // Add button to expand and condense - Using FontAwesome
    $('#' + id + ' ul li.hasSubmenu').each(function () {
        $this = $(this);
        $this.prepend("<a href='#'><i class='fa fa-minus-circle'></i><i style='display:none;' class='fa fa-plus-circle'></i></a>");
        $this.children("a").not(":last").removeClass().addClass("toogle");
    });
    // Actions to expand and consense
    $('#' + id + ' ul li.hasSubmenu a.toogle').click(function () {
        $this = $(this);
        $this.closest("li").children("ul").toggle("slow");
        $this.children("i").toggle();
        return false;
    });
}



function f_retornaSubItens(lstItens, LayoutID, ReferencePropertyID, containerID, OwnerControlID, lstItensPK,  FieldPK) {
    var subItens = "";

    for (var i = 0; i < lstItens.length; i++) {
        if (lstItens[i].controls != null) {            
            subItens = subItens + CreateUL(lstItens[i], LayoutID, ReferencePropertyID, containerID, OwnerControlID, lstItensPK[i], FieldPK);
            subItens = subItens + f_retornaSubItens(lstItens[i].controls, LayoutID, ReferencePropertyID, containerID, OwnerControlID, lstItensPK[i].controls, FieldPK);
           
            subItens = subItens + " </ul>";
            subItens = subItens + " </li>";
        }
        else {
            subItens = subItens + CreateLI(lstItens[i], LayoutID, ReferencePropertyID, containerID, OwnerControlID, lstItensPK[i], FieldPK);
        }
    } 
    return subItens;
}

function CreateLI(Item, LayoutID, ReferencePropertyID, containerID, OwnerControlID, ItemPK, FieldPK) {
    var subItens = "";
    subItens = subItens + "<li id='" + ItemPK.text[0] + "' ";
        subItens = subItens + "data-newValue='" + ItemPK.text[0] + "' ";
        subItens = subItens + "data-oldValue='" + ItemPK.text[0] + "' ";    
        subItens = subItens + "data-controlid='" + FieldPK.ID + "' ";
        subItens = subItens + "data-nativeDataType='" + FieldPK.nativeDataType + "' ";
        subItens = subItens + "data-table='" + FieldPK.table + "' ";
        subItens = subItens + "data-field='" + FieldPK.field + "' ";
        subItens = subItens + "data-sequenceRecording='" + FieldPK.sequenceRecording + "' ";
        subItens = subItens + "data-derivedFrom='" + FieldPK.derivedFrom + "' ";
        subItens = subItens + "data-propertyid='" + FieldPK.propertyID + "' ";
    subItens = subItens + ">";

    subItens = subItens + Item.text[0];
    subItens = subItens + "</li>";

    return subItens;
}

function CreateUL(Item, LayoutID, ReferencePropertyID, containerID, OwnerControlID, ItemPK, FieldPK) {
    var subItens = "";
    subItens = subItens + "<li id='" + ItemPK.text[0] + "' ";
    subItens = subItens + "data-newValue='" + ItemPK.text[0] + "' ";
    subItens = subItens + "data-oldValue='" + ItemPK.text[0] + "' ";
    subItens = subItens + "data-controlid='" + FieldPK.ID + "' ";
    subItens = subItens + "data-nativeDataType='" + FieldPK.nativeDataType + "' ";
    subItens = subItens + "data-table='" + FieldPK.table + "' ";
    subItens = subItens + "data-field='" + FieldPK.field + "' ";
    subItens = subItens + "data-sequenceRecording='" + FieldPK.sequenceRecording + "' ";
    subItens = subItens + "data-derivedFrom='" + FieldPK.derivedFrom + "' ";
    subItens = subItens + "data-propertyid='" + FieldPK.propertyID + "' ";
    subItens = subItens + ">";
    subItens = subItens + Item.text[0];

    subItens = subItens + " <ul>";

    return subItens;

}

//function CreateAba(systemName, LayoutID, TitleMenu) {
//    CreateAba(systemName, LayoutID, TitleMenu);
//}


function CreateTreeViewSingle(parameters) {
    var htmlTree = "";

    var titulo;
    var conteudoTreeView = parameters.conteudoTreeView;
    var container = parameters.container;
    var containerID = parameters.containerID;
    var id = parameters.id;


    if (conteudoTreeView.Title != null) {
        titulo = conteudoTreeView.Title[0].text;
    } else {
        titulo = conteudoTreeView.systemName;
    }

    //htmlTree = htmlTree + "</br>";

    //htmlTree = htmlTree + "<div class='col-md-12'>";
    //htmlTree = htmlTree + "<div class='row'>";
    //htmlTree = htmlTree + "<div class='col-md-12'>";
    //htmlTree = htmlTree + "<div class='panel panel-default'>";
    //htmlTree = htmlTree + "<div class='panel-heading'>";
    //htmlTree = htmlTree + "<h5>" + titulo + "</h5>";

    //htmlTree = htmlTree + "<ul class='panel-control'>";
    //htmlTree = htmlTree + "</ul>";

    //htmlTree = htmlTree + FechaDiv();
    //htmlTree = htmlTree + "<div class='panel-body'>";
    htmlTree = htmlTree + "<div id='" + containerID + "_treeviewmodal' class='ls-animated-multi-lists'>";

    htmlTree = htmlTree + "<ul>";

    for (var i = 0; i < conteudoTreeView.control.length ; i++) {
        if (conteudoTreeView.control[i].property != null) {
            if (conteudoTreeView.control[i].property.value != null) {
                if (conteudoTreeView.control[i].property.value.length > 0) {
                    if (conteudoTreeView.control[i].property.text != "") {
                        if (conteudoTreeView.control[i].visibleGrid == true) {
                            for (var j = 0; j < conteudoTreeView.control[i].property.text.length ; j++) {
                                htmlTree = htmlTree + "<li>";
                                htmlTree = htmlTree + "     <a  onclick=\"javascrpt:TreeViewClosing('" + id + "', '" + conteudoTreeView.control[i].property.text[j] + "','" + conteudoTreeView.control[i].property.value[j] + "')\">";
                                htmlTree = htmlTree + conteudoTreeView.control[i].property.text[j];
                                htmlTree = htmlTree + "     </a>";
                                htmlTree = htmlTree + "     <ul >";
                                htmlTree = htmlTree + f_retornaSubItensSingle(conteudoTreeView.control[i].controls, id); htmlTree = htmlTree + " </ul>";
                                htmlTree = htmlTree + " </li>";
                                
                            }
                        }
                    }
                }
            }
        }
    }

    htmlTree = htmlTree + "</ul>";

    htmlTree = htmlTree + FechaDiv();
    //htmlTree = htmlTree + FechaDiv();
    //htmlTree = htmlTree + FechaDiv();
    //htmlTree = htmlTree + FechaDiv();
    //htmlTree = htmlTree + FechaDiv();
    //htmlTree = htmlTree + FechaDiv();

    //containerID = "#" + containerID;
    $("#" + containerID).prepend(htmlTree);

    multiNestedList(containerID + "_treeviewmodal");
}



function f_retornaSubItensSingle(lstItens, id) {
    var subItens = "";
    for (var i = 0; i < lstItens.length; i++) {
        if (lstItens[i].controls != null) {
            subItens = subItens + CreateULSingle(lstItens[i], id);
            subItens = subItens + f_retornaSubItensSingle(lstItens[i].controls, id);

            subItens = subItens + " </ul>";
            subItens = subItens + " </li>";
        }
        else {
            subItens = subItens + CreateLISingle(lstItens[i], id);
        }
    }
    return subItens;
}

function CreateLISingle(Item, id) {
    var subItens = "";
    subItens = subItens + "<li>";
    subItens = subItens + "     <a  onclick=\"javascrpt:TreeViewClosing('" + id + "', '" + Item.text[0] + "','" + Item.value[0] + "')\">";
    subItens = subItens + Item.text[0];
    subItens = subItens + "     </a>";
    subItens = subItens + "</li>";

    return subItens;
}

function CreateULSingle(Item, id) {
    var subItens = "";
    subItens = subItens + "<li>";
    subItens = subItens + "     <a  onclick=\"javascrpt:TreeViewClosing('" + id + "', '" + Item.text[0] + "','" + Item.value[0] + "')\">";
    subItens = subItens + Item.text[0];
    subItens = subItens + "     </a>";
    subItens = subItens + " <ul>";

    return subItens;
}

function TreeViewClosing(id, text, value) {
    $("#" + id + "_treeview").val(text);
    $("#" + id).val(value);
    $('#alertaModalShow').modal('hide');
}


function TreeViewFillFields(Filtro, LayoutID, PropertyID, containerID) {
    var EnterpriseID = returnCookie("EnterpriseID");

    $.ajax({
        //url: 'http://54.201.159.17/api/database/DataSearch',
        url: getGlobalParameters("urlPlataforma") + "/api/database/DataSearch",
        data: { Filtro: Filtro, FormID: LayoutID, ReferenceID: PropertyID, EnterpriseID: EnterpriseID },
        dataType: 'json',
        success: function (data) {
            FillForm(data, containerID);
        }
    });
}

function OwnerTreeView(id, value, containerID) {
    NewTreeDetail(containerID);
    $("input[data-controlid=" + id + "]").val(value);
}

function NewTreeDetail(containerID) {

    var form = document.getElementById(containerID);
    var elements = form.querySelectorAll('input,textarea');

    for (var i = 0; i < elements.length; i++) {
        $("#" + elements[i].id).val("");
    }
}

function addNewTreeViewItem(containerID) {
    var liSelected = $("#" + containerID + "_treeview").find("li.li_selected");
    var idPai;

    if (liSelected.length > 0) {
        idPai = liSelected.attr("id");
    } else {
        idPai = $("#" + containerID + "_treeview >ul>li:first").attr("id");
    }

    $("#" + containerID + " input").val("");
    var ownerField = $("#" + containerID + " input[data-ownerFieldTreeView='true']")
    ownerField.val(idPai);
    visibleFormGroup(containerID, true);
}

function visibleFormGroup(containerID, visible) {
    if (visible) {
        $("#" + containerID + " .form-group").show();        
    } else {
        $("#" + containerID + " .form-group").hide();
    }
}

function saveTreeViewItem(containerID, LayoutID) {
    
    var btnSave = $("#" + containerID).parent(".panel-body").find("#Gravar");
    //var retorno = btnSave.trigger("click");

    var container = containerID.substring(0, containerID.indexOf("_"));
    container = container.replace("_", "");
    var retorno = onSave(containerID, "Gravar", containerID, container, LayoutID, false);
    //var id = "";

    //for (var i in retorno){
    //    if (retorno[i].field == "id") {
    //        id = retorno[i].newValue[0];
    //    }
    //}

    //var sourceNode = {};
    //sourceNode.text = $("#" + containerID + " input[data-visibleGrid='true']").val();
    //var targetId = $("#" + containerID + "_treeview" + " li.li_selected").attr("id");
    //sourceNode.id = id; //$("#" + containerID + " input[data-field='id']").val();

    //if (id != "") {
    //    addNode(sourceNode, targetId, containerID);
    //}


    var tab = containerID.substring(containerID.indexOf("_") + 1, containerID.length);
    $("#" + tab + "_atualizaaba").click();

    ClearForm(containerID, false);
    visibleFormGroup(containerID, false);


}

function addNode(sourceNode, targetId, containerID) {
    var owner = $("#" + containerID + "_treeview #" + targetId);

    var firstNode = $("#" + containerID + "_treeview #" + targetId); //+ " ul:first li:first");
    var itemAtributes = " data-newValue='" + firstNode.attr("data-newValue") + "' ";
    itemAtributes += "data-controlid='" + firstNode.attr("data-controlid") + "' ";
    itemAtributes += "data-nativeDataType='" + firstNode.attr("data-nativeDataType") + "' ";
    itemAtributes += "data-table='" + firstNode.attr("data-table") + "' ";
    itemAtributes += "data-field='" + firstNode.attr("data-field") + "' ";
    itemAtributes += "data-sequenceRecording='" + firstNode.attr("data-sequenceRecording") + "' ";
    itemAtributes += "data-derivedFrom='" + firstNode.attr("data-derivedFrom") + "' ";
    itemAtributes += "data-propertyid='" + firstNode.attr("data-propertyid") + "' ";

    var selectedfieldUL = "";
    var selectedfield = "";
    if (sourceNode.id) {
        selectedfield = $("#" + containerID + "_treeview #" + sourceNode.id);

        if (selectedfield.find("ul").length > 0) {
            selectedfieldUL = $("#" + containerID + "_treeview #" + targetId + " ul:first").outerHTML;
        } else {
            selectedfieldUL = "";
        }
    }
        

    if (selectedfield.length > 0) {
        if (selectedfieldUL == undefined) {
            selectedfieldUL = "";
        }
        //selectedfield.html(sourceNode.text + selectedfieldUL);
        selectedfield.find(">span>a").html(sourceNode.text);
    } else {
        if (owner.find("ul").length > 0) {
            owner = $("#" + containerID + "_treeview #" + targetId + " ul:first");

            owner.append("<li id='" + sourceNode.id + "' " + itemAtributes + " ><span><span class=\"glyphicon glyphicon-folder-open\"></span><a href=\"javascript: void(0);\">" + sourceNode.text + "</a></span></li>");
            //owner.append("<li id='" + sourceNode.id + "' " + itemAtributes + " >" + sourceNode.text + "</li>");
        } else {
            owner.append("<ul><li id='" + sourceNode.id + "' " + itemAtributes + " ><span><span class=\"glyphicon glyphicon-folder-open\"></span><a href=\"javascript: void(0);\">" + sourceNode.text + "</a></span></li></ul>");

            $("#" + containerID + "_treeview #" + targetId).addClass("parent_li").on('click', function (e) {
                var children = $(this).parent('li.parent_li').find(' > ul > li');
                if (children.is(':visible')) {
                    children.hide('fast');
                    $(this)
                        .find(' > span.glyphicon')
                        .addClass('glyphicon-folder-close')
                        .removeClass('glyphicon-folder-open');
                } else {
                    children.show('fast');
                    $(this)
                        .find(' > span.glyphicon')
                        .addClass('glyphicon-folder-open')
                        .removeClass('glyphicon-folder-close');
                }
                e.stopPropagation();
            });

            //$("#" + containerID + "_treeview #" + targetId).find(' > span.glyphicon').addClass('glyphicon-folder-close');




        }
        $("#" + containerID + "_treeview #" + sourceNode.id + " span a").on("click", function (e) {
            e.preventDefault();

            var li = $(this).parent().parent();
            if (li.hasClass('li_selected')) {                
                $(li).removeClass('li_selected');
            }
            else {
                $("#" + containerID + "_treeview ul").find('li.li_selected').removeClass('li_selected');
                $(li).addClass('li_selected');
            }
        });

        
    }

    //$("#" + containerID + "_treeview").EasyTree({
    //    addable: false,
    //    editable: false,
    //    deletable: false,
    //    i18n: {
    //    }

    //});


}

function deleteTreeViewItem(containerID, metadataLayoutID) {
    var url = getGlobalParameters("urlPlataforma") + "/api/database/DeleteData";
    var valOrigem = [];
    var valNovo = [];

    var myJson = {};
    var msg = [];

    var liSelected = $("#" + containerID + "_treeview").find("li.li_selected");  
    var id = liSelected[0].getAttribute("id");
    valOrigem[0] = liSelected[0].getAttribute("data-newValue");
    valNovo[0] = liSelected[0].getAttribute("data-newValue");
    myJson["controlID"] = liSelected[0].getAttribute("data-controlid");
    myJson["nativeDataType"] = liSelected[0].getAttribute("data-nativeDataType");
    myJson["table"] = liSelected[0].getAttribute("data-table");
    myJson["field"] = liSelected[0].getAttribute("data-field");
    myJson["sequenceRecording"] = liSelected[0].getAttribute("data-sequenceRecording");
    myJson["derivedFrom"] = liSelected[0].getAttribute("data-derivedFrom");
    myJson["oldValue"] = valOrigem;
    myJson["newValue"] = valNovo;
    myJson["LayoutID"] = metadataLayoutID;
    myJson["EnterpriseID"] = returnCookie("EnterpriseID");
    myJson["UserID"] = returnCookie("UserID");

    msg[0] = myJson;

    if (url != null) {
        var EnterpriseID = returnCookie("EnterpriseID");
        msg = JSON.stringify(msg);
        var retorno = postAjaxParameter(EnterpriseID, url, msg, "", "", "", false);


        if (retorno != false) {
            deleteNode(containerID, id);
        }        
    }

}

function deleteNode(containerID, targetId) {
    $("#" + containerID + "_treeview #" + targetId).fadeOut("slow").remove();
}

function editTreeViewItem(containerID, LayoutIDScreen, tabGenID) {
    var EnterpriseID = returnCookie("EnterpriseID");

    var url = getGlobalParameters("urlPlataforma") + "/api/database/DataSearch";
    var liSelected = $("#" + containerID + "_treeview").find("li.li_selected");
    if (liSelected.length > 0) {
        var filtro = liSelected[0].id;
        var referenceID = liSelected[0].getAttribute("data-propertyid");
        var LayoutID = LayoutIDScreen.replace("_" + tabGenID, "");

        $.ajax({
            url: url,
            data: { Filtro: filtro, FormID: LayoutID, ReferenceID: referenceID, EnterpriseID: EnterpriseID },
            dataType: 'json',
            success: function (data) {
                FillForm(data, containerID, tabGenID);

                visibleFormGroup(containerID, true);
            }
        });
    }
}