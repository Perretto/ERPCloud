function mvcNovoClick(div, target) {
	$(div).load(target);
	return false;
}
function mvcEditarClick(div, target) {
	$(div).load(target);
	return false;
}
function mvcGravarClick(div, target, divParent, targetParent, form, postTarget) {
	$.post(postTarget, $(form).serialize(), function (json) {
		$("#" + $(divParent).parent().attr('id')).load(targetParent, function (response, status, xhr) {
			$(div).load(target + json.ID);
		});
	});
}
function mvcExcluirClick(div, target) {
	$("#" + $(div).parent().attr('id')).load(target);
}
function mvcBuscarClick(div, target, parameter) {
	$("#" + $(div).parent().attr('id')).load(target + $(parameter).val());
}