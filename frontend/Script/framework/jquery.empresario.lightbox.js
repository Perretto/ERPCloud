(function(document, window, $) {
	'use strict';

	$('.popup-modal-ajax').magnificPopup({
		type: 'ajax',
		alignTop: true,
		overflowY: 'scroll',
		closeOnContentClick: false,
		closeBtnInside: false,
		modal: true
	});

	$(document).on('click', '.popup-modal-ajax-close', function (e) {
	    e.preventDefault();
	    $.magnificPopup.close();
	});
})(document, window, jQuery);