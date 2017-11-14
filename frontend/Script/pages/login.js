/*------------------------------------------------------------------
 [ Login  Trigger Js]

 Project     :	Fickle Responsive Admin Template
 Version     :	1.0
 Author      : 	AimMateTeam
 URL         :   http://aimmate.com
 Support     :   aimmateteam@gmail.com
 Primary use :   Login Page
 -------------------------------------------------------------------*/

jQuery(document).ready(function($) {
    'use strict';

    bootstrap_switch_trigger_call();
    forgo_password_view();
    login_view_submit();
    // Bind progress buttons and simulate loading progress
    ladda_button_call();
});
/*** Switch Call ***/
function bootstrap_switch_trigger_call(){
    $(".switchCheckBox").bootstrapSwitch();

}
/*** Switch Call  End***/
function forgo_password_view(){
    $(".forgot-password, .login-view").click(function () {
        $('.login-form, .forgot-pass-box').slideToggle('slow');
    });
}

$.getScript("script/framework/jquery.empresario.general.js");

function login_view_submit(){
    $('#form-login').submit(function () {
        /*var setUrl = window.location.origin + '/index.html'
         window.location.assign(setUrl);*/
        var lang;
        var login = document.getElementById("iUserName").value;
        var senha = document.getElementById("iPassword").value;
        var EmpID = document.getElementById("iEnterpriseID").value;
        var element = document.getElementById("idiom");

        if (element.length > 0) {
            lang = element[0].getAttribute("data-idiom");
        }        

        $.ajax({
            url: getGlobalParameters("urlPlataforma") + "/api/login/login?" + "login=" + login + "&password=" + senha + "&EnterpriseID=" + EmpID,
            type: "get",
            async: false,
            crossDomain: true,
            success: function (response) {
                if (trataRetorno(response)) {                    
                    //var setUrl = window.location.origin + '/index.html'
                    var setUrl = getGlobalParameters("urlInterface") + "/index.html?EnterpriseID=" + EmpID + "&UserID=" + response + "&Lang=" + lang;
                    window.location.assign(setUrl);                    
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });        

        return false;
    });

    getEnterpriseID();
}

function getEnterpriseID() {
    $("#enterpriseLink").change(function () {
        var element = document.getElementById("enterpriseLink");
        var index = element.selectedIndex;

        $("#iEnterpriseID").val(element[index].getAttribute("data-enterpriseID"));
    });
}

function trataRetorno(response) {
    if (response) {
        if (response != "") {
            GerarCookie("empresarioERP", "logado", 1);
            return true;
        } else {
            alert("Usuário inválido!!!");
            return false;
        }
    }
}
function GerarCookie(strCookie, strValor, lngDias) {
    var dtmData = new Date();

    if (lngDias) {
        dtmData.setTime(dtmData.getTime() + (lngDias * 24 * 60 * 60 * 1000));
        var strExpires = "; expires=" + dtmData.toGMTString();
    }
    else {
        var strExpires = "";
    }
    document.cookie = strCookie + "=" + strValor + strExpires + "; path=/";
}

function ladda_button_call(){
    Ladda.bind('button.ladda-button', {
        callback: function (instance) {
            var progress = 0;
            var interval = setInterval(function () {
                progress = Math.min(progress + Math.random() * 0.1, 1);
                instance.setProgress(progress);

                if (progress === 1) {
                    instance.stop();
                    clearInterval(interval);
                    //Checking Login in here


                    var jacked = humane.create({baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-success'});
                    jacked.log("<i class='fa fa-smile-o'></i> Successfully logedin ");



                    
                    //setInterval(function () {
                    //    var setUrl = '/index.html';
                    //    window.location.assign(setUrl);
                    //}, 500);
                }
            }, 200);
        }
    });
}