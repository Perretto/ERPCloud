/*!
 * remark (http://getbootstrapadmin.com/remark)
 * Copyright 2015 amazingsurge
 * Licensed under the Themeforest Standard Licenses
 */
(function(window, document, $) {
  'use strict';

  $.configs.set('tour', {
      steps: [{
          element: ".menu-control",
          position: "right",
          intro: "Expandir o menu <p class='content'>It is nice custom navigation for desktop users and a seek off-canvas menu for tablet and mobile users</p>"
      }, {
          element: ".search-box",
          position: "right",
          intro: "Buscar <p class='content'>It is nice custom navigation for desktop users and a seek off-canvas menu for tablet and mobile users</p>"
      }, {
      element: "#taskNumber",
      position: "right",
      intro: "Tarefas <p class='content'>It is nice custom navigation for desktop users and a seek off-canvas menu for tablet and mobile users</p>"
    }, {
        element: "#notificationNumber",
        intro: "Notifica&ccedil;&otilde;es <p class='content'>Click this button you can view the admin template in full screen</p>"
    }, {
        element: "#UpdateSystem",
      position: 'left',
      intro: "Fazer upgrade <p class='content'>This is a sidebar dialog box for user conversations list, you can even create a quick conversation with other users</p>"
    }],
    skipLabel: "<i class='fa fa-times'></i>",
    doneLabel: "<i class='fa fa-times'></i>",
    nextLabel: "Pr&oacute;ximo <i class='fa fa-angle-right'></i>",
    prevLabel: "<i class='fa fa-angle-left'></i> Voltar",
    showBullets: false
  });

  
})(window, document, $);
