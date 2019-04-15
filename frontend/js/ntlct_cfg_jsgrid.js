/*
--------------------------------------------------------------
Customização para campo data
--------------------------------------------------------------
*/
campoData = function (config) {
	jsGrid.Field.call(this, config);
};
/*-*/
campoData.prototype = new jsGrid.Field({
	readOnly: false,
	
	sorter: function (data1, data2) {
		//return new Date(date1) - new Date(date2);
		var vlr1 = ""; var vlr2 = ""; var ret = 0; var data = "";
		
		if(data1){
			vlr1 = data1.substring(0,4),parseInt(data1.substring(5,7)) - 1,data1.substring(8,10)
		}
		if(data2){
			vlr2 = data2.substring(0,4),parseInt(data2.substring(5,7)) - 1,data2.substring(8,10)
		}
		
		if(vlr1 < vlr2) 
			ret = -1;   // return negative value when first is less than second
		else
			if(vlr1 == vlr2) 
				ret = 0;   // return zero if values are equal
			else
				if(vlr1 > vlr2) 
					ret = 1;    // return positive value when first is greater than second
					
		return(ret);
	},
	itemTemplate: function (value,item) {
		var dataAux = null;
		var ret = "";
		
		if(value){
			dataAux = new Date(value.substring(0,4),parseInt(value.substring(5,7)) - 1,value.substring(8,10));
			if(isNaN(dataAux.getDate()))
				ret = "";
			else
				ret = dataAux.toLocaleDateString();
		}
			
		return(ret);
	},
	insertTemplate: function () {
		var dataAux = null;
		var data = "";
		var ret = null;
		var lostFocus = "";
		var idElemento = "";
		var elementoInput = null;
		
		idElemento = this.name + "_ins";
		
		elementoInput = document.createElement("input");
		elementoInput.setAttribute("id",idElemento);
		elementoInput.value = "";
		
		if(this.readOnly){
			elementoInput.setAttribute("disabled","");
			ret = this._insertPicker = $(elementoInput);
		}
		else{
			if(this.hasOwnProperty("_focuslost")){
				lostFocus += "(function(){var _operacao = 'ins'; ";
				lostFocus += "var idValue = '" + idElemento + "';";
				lostFocus += "var idTela = '" + this._idtela + "'; ";
				lostFocus += "var validar =  " + this._focuslost + "; ";
				lostFocus += "validar();})()";
				elementoInput.setAttribute("onblur",lostFocus);
			}
			ret = this._insertPicker = $(elementoInput).datetimepicker({
				lang: "pt",
				timepicker: false,
				format: 'd/m/Y',
				formatDate: 'Y/m/d',
				closeOnDateSelect: true
			});
		}
		return(ret);
	},
	editTemplate: function (value,item) {
		var dataAux = null;
		var data = "";
		var ret = null;
		var lostFocus = "";
		var idElemento = "";
		var elementoInput = null;
		
		if(value){
			dataAux = new Date(value.substring(0,4),parseInt(value.substring(5,7)) - 1,value.substring(8,10));
			data = new Date(dataAux).toLocaleDateString();
		}
		
		idElemento = this.name + "_edt";
		
		elementoInput = document.createElement("input");
		elementoInput.setAttribute("id",idElemento);
		elementoInput.value = data;
		
		if(this.readOnly){
			elementoInput.setAttribute("disabled","");
			ret = this._editPicker = $(elementoInput);
		}
		else{
			if(this.hasOwnProperty("_focuslost")){
				lostFocus += "(function(){var _operacao = 'edt'; ";
				lostFocus += "var idValue = '" + idElemento + "';";
				lostFocus += "var idTela = '" + this._idtela + "'; ";
				lostFocus += "var validar =  " + this._focuslost + "; ";
				lostFocus += "validar();})()";
				elementoInput.setAttribute("onblur",lostFocus);
			}
			ret = this._editPicker = $(elementoInput).datetimepicker({
				lang: "pt",
				timepicker: false,
				format: 'd/m/Y',
				formatDate: 'Y/m/d',
				closeOnDateSelect: true
			});
		}
		return(ret);
	},
	insertValue: function() {
		var dataAux = null
		
		dataAux = this._insertPicker.datetimepicker()[0].value.split("/");
		return(dataAux[2] + "-" + dataAux[1] + "-" + dataAux[0]);
	},

	editValue: function() {
		var dataAux = null
		
		dataAux = this._editPicker.datetimepicker()[0].value.split("/");
		return(dataAux[2] + "-" + dataAux[1] + "-" + dataAux[0]);
	}
});

jsGrid.fields.data = campoData;

/*
--------------------------------------------------------------
Customização para campo numérico formatado 
--------------------------------------------------------------
*/
campoNumeroFormatado = function (config) {
	jsGrid.Field.call(this, config);
};
/*-*/
campoNumeroFormatado.prototype = new jsGrid.Field({
	readOnly: false,
	decimais: 2,
	mascara: "#.##0,00",
	
	sorter: function (vlr1, vlr2) {
		var ret = 0;
		
		if(vlr1 && vlr2){
			if(vlr1 < vlr2) 
				ret = -1;   // return negative value when first is less than second
			else{
				if(vlr1 == vlr2) 
					ret = 0;   // return zero if values are equal
				else{
					if(vlr1 > vlr2) 
						ret = 1;    // return positive value when first is greater than second
				}
			}
		}
		return(ret);
	},
	itemTemplate: function (value,item) {
		if(value){
			if(isNaN(value))
				value = 0;
		}
		else
			value = 0;
		return(formataNumero(value,this.decimais,".",","));
	},
	insertTemplate: function () {
		var ret = null;
		var lostFocus = "";
		var idElemento = "";
		var elementoInput = null;
		
		idElemento = this.name + "_ins";
		
		elementoInput = document.createElement("input");
		elementoInput.setAttribute("id",idElemento);
		if(this.readOnly){
			elementoInput.setAttribute("disabled","");
		}
		else{
			if(this.hasOwnProperty("_focuslost")){
				lostFocus += "(function(){var _operacao = 'ins'; ";
				lostFocus += "var idValue = '" + idElemento + "';";
				lostFocus += "var idTela = '" + this._idtela + "'; ";
				lostFocus += "var validar =  " + this._focuslost + "; ";
				lostFocus += "validar();})()";
				elementoInput.setAttribute("onblur",lostFocus);
			}
		}
		
		elementoInput.value = formataNumero(0,this.decimais,".",",");
		
		ret = this._insertPicker = $(elementoInput).mask(this.mascara, {
			reverse: true,
			translation: {
				'#': {
					pattern: /-|\d/,
					recursive: true
				}
			},
			onChange: function (value, e) {
				var target = e.target,
					position = target.selectionStart;
			}
		});
		
		return(ret);
	},
	editTemplate: function (value,item) {
		var campo = "";
		var idElemento = "";
		var lostFocus = "";
		var elementoInput = null;
		
		idElemento = this.name + "_edt";
		
		if(value){
			if(isNaN(value))
				value = 0;
		}
		else
			value = 0;
			
		elementoInput = document.createElement("input");
		elementoInput.setAttribute("id",idElemento);
		if(this.readOnly){
			elementoInput.setAttribute("disabled","");
		}
		else{
			if(this.hasOwnProperty("_focuslost")){
				lostFocus += "(function(){var _operacao = 'edt'; ";
				lostFocus += "var idValue = '" + idElemento + "';";
				lostFocus += "var idTela = '" + this._idtela + "'; ";
				lostFocus += "var validar =  " + this._focuslost + "; ";
				lostFocus += "validar();})()";
				elementoInput.setAttribute("onblur",lostFocus);
			}
		}
		elementoInput.value = formataNumero(value,this.decimais,".",",");
		
		ret = this._editPicker = $(elementoInput).mask(this.mascara, {
			reverse: true,
			translation: {
				'#': {
					pattern: /-|\d/,
					recursive: true
				}
			},
			onChange: function (value, e) {
				var target = e.target,
					position = target.selectionStart;
			}
		});
		return(ret);
	},
	insertValue: function() {
		var valor = null;
		var ret = 0;
		
		valor = this._insertPicker[0].value.replace(/\./g,"").replace(",", ".");
		
		if(valor){
			if(isNaN(valor))
				value = "0";
		}
		else
			valor = "0";
			
		ret = parseFloat(valor);
		return(ret);
	},

	editValue: function() {
		var valor = null;
		var ret = 0;
		
		valor = this._editPicker[0].value.replace(/\./g,"").replace(",", ".");
		
		if(valor){
			if(isNaN(valor))
				value = "0";
		}
		else
			valor = "0";
			
		ret = parseFloat(valor);
		return(ret);
	}
});

jsGrid.fields.numeroformatado = campoNumeroFormatado;


/*
--------------------------------------------------------------
Customização para campo texto padrão
--------------------------------------------------------------
*/
campoTexto = function (config) {
	jsGrid.Field.call(this, config);
};
/*-*/
campoTexto.prototype = new jsGrid.Field({
	readOnly: false,
	
	sorter: function (vlr1, vlr2) {
		var ret = 0;
		
		if(!vlr1)
			vlr1 = "";
			
		if(!vlr2)
			vlr2 = "";
			
		if(vlr1 < vlr2) 
			ret = -1;   // return negative value when first is less than second
		else{
			if(vlr1 == vlr2) 
				ret = 0;   // return zero if values are equal
			else{
				if(vlr1 > vlr2) 
					ret = 1;    // return positive value when first is greater than second
			}
		}
		
		return(ret);
	},
	itemTemplate: function (value,item) {
		if(!value)
			value = "";
		return(value);
	},
	insertTemplate: function () {
		var ret = null;
		var lostFocus = "";
		var idElemento = "";
		var elementoInput = null;
		
		idElemento = this.name + "_ins";
		
		elementoInput = document.createElement("input");
		elementoInput.setAttribute("id",idElemento);
		elementoInput.value = "";
		
		if(this.readOnly){
			elementoInput.setAttribute("disabled","");
			ret = this._insertPicker = $(elementoInput);
		}
		else{
			if(this.hasOwnProperty("_focuslost")){
				lostFocus += "(function(){var _operacao = 'ins'; ";
				lostFocus += "var idValue = '" + idElemento + "';";
				lostFocus += "var idTela = '" + this._idtela + "'; ";
				lostFocus += "var validar =  " + this._focuslost + "; ";
				lostFocus += "validar();})()";
				elementoInput.setAttribute("onblur",lostFocus);
			}
			ret = this._insertPicker = $(elementoInput);
		}
		return(ret);
	},
	editTemplate: function (value,item) {
		var ret = null;
		var lostFocus = "";
		var idElemento = "";
		var elementoInput = null;
		
		if(!value)
			value = "";
		
		idElemento = this.name + "_edt";
		
		elementoInput = document.createElement("input");
		elementoInput.setAttribute("id",idElemento);
		elementoInput.value = value;
		
		if(this.readOnly){
			elementoInput.setAttribute("disabled","");
			ret = this._editPicker = $(elementoInput);
		}
		else{
			if(this.hasOwnProperty("_focuslost")){
				lostFocus += "(function(){var _operacao = 'edt'; ";
				lostFocus += "var idValue = '" + idElemento + "';";
				lostFocus += "var idTela = '" + this._idtela + "'; ";
				lostFocus += "var validar =  " + this._focuslost + "; ";
				lostFocus += "validar();})()";
				elementoInput.setAttribute("onblur",lostFocus);
			}
			ret = this._editPicker = $(elementoInput);
		}
		return(ret);
	},
	insertValue: function() {
		var valor = null;

		valor = this._insertPicker[0].value;
		return(valor);
	},

	editValue: function() {
		var valor = null;
		
		valor = this._editPicker[0].value;
		return(valor);
	}
});

jsGrid.fields.campotexto = campoTexto;

/*
--------------------------------------------------------------
Customização para campo autocomplete
--------------------------------------------------------------
*/
campoAutoComplete = function (config) {
	jsGrid.Field.call(this, config);
};
/*-*/
campoAutoComplete.prototype = new jsGrid.Field({
	readOnly: false,
	
	sorter: function (vlr1, vlr2) {
		var ret = 0;
		
		if(vlr1 && vlr2){
			if(vlr1.label < vlr2.label) 
				ret = -1;   // return negative value when first is less than second
			else{
				if(vlr1.label == vlr2.label) 
					ret = 0;   // return zero if values are equal
				else{
					if(vlr1.label > vlr2.label) 
						ret = 1;    // return positive value when first is greater than second
				}
			}
		}
		
		return(ret);
	},
	itemTemplate: function (value,item) {
		var ret = "";
		
		if(value)
			ret = value.label;
		
		return(ret);
	},
	insertTemplate: function () {
		var divInput = null;
		var elementoInput = null;
		var onFocus = "";
		var lostFocus = "";
		var elementoID = this._id + "_ins";
		
		onFocus += "bindAutocomp("
		onFocus += "'" + this._controlid + "',";
		onFocus += "'" + this._namelayout + "',"; 
		onFocus += "'" + this._layoutid + "',";
		onFocus += "'" + this._titlemenu + "',"; 
		onFocus += "'" + this._containerid + "',";
		onFocus += "'" + this._id + "',";
		onFocus += "'" + this._propertyid + "',";
		onFocus += "'" + this._fill1propertyid + "',";
		onFocus += "'" + this._tabgenid + "'";
		onFocus += ")";
		
		lostFocus += "(function(){var _operacao = 'ins'; ";
		lostFocus += "var idLabel = '" + elementoID + "_autocomplete" + "'; ";
		lostFocus += "var idValue = '" + elementoID + "';";
		lostFocus += "var idTela = '" + this._idtela + "'; ";
		lostFocus += "var validar =  " + this._focuslost + "; ";
		lostFocus += "validar();})()"
		
		divInput = document.createElement("div")
			divInput.setAttribute("id",this._controlid + "_controlgroup");
			divInput.classList.add("control-group");
			elementoInput = document.createElement("input");
				if(this.readOnly)
					elementoInput.setAttribute("disabled",true);
				elementoInput.setAttribute("id",elementoID + "_autocomplete");
				elementoInput.setAttribute("localautocomplete",true);
				elementoInput.setAttribute("onfocus",onFocus);
				elementoInput.setAttribute("onblur",lostFocus);
				elementoInput.classList.add("autocomplete");
				elementoInput.classList.add("ui-autocomplete-input");
				elementoInput.value = "";
			divInput.appendChild(elementoInput);
			/*
			elementoInput = document.createElement("button");
				elementoInput.classList.add("btn");
				elementoInput.classList.add("btn-info");
				elementoInput.classList.add("btn-xs");
				elementoInput.classList.add("btn-round");
				elementoInput.style.paddingLeft = "6px";
				elementoInput.style.paddingRight = "6px";
				elementoInput.style.height = "20px";
				elementoInput.style.width = "20px";
			divInput.appendChild(elementoInput);
			*/
			elementoInput = document.createElement("input");
				if(this.readOnly)
					elementoInput.setAttribute("disabled",true);
				elementoInput.setAttribute("localautocomplete",true);
				elementoInput.setAttribute("id",elementoID);
				elementoInput.setAttribute("type","hidden");
				elementoInput.value = "";
			divInput.appendChild(elementoInput);
		
		ret = this._insertPicker = divInput;
		
		return(ret);
	},
	editTemplate: function (value,item) {
		var divInput = null;
		var elementoInput = null;
		var idItem = "";
		var labelItem = "";
		var onFocus = "";
		var lostFocus = "";
		var elementoID = this._id + "_edt";
		
		if(value){
			idItem = value.id;
			labelItem = value.label;
		};
		
		onFocus += "bindAutocomp("
		onFocus += "'" + this._controlid + "',";
		onFocus += "'" + this._namelayout + "',"; 
		onFocus += "'" + this._layoutid + "',";
		onFocus += "'" + this._titlemenu + "',"; 
		onFocus += "'" + this._containerid + "',";
		onFocus += "'" + this._id + "',";
		onFocus += "'" + this._propertyid + "',";
		onFocus += "'" + this._fill1propertyid + "',";
		onFocus += "'" + this._tabgenid + "'";
		onFocus += ")";
		
		lostFocus += "(function(){var _operacao = 'edt'; ";
		lostFocus += "var idLabel = '" + elementoID + "_autocomplete" + "'; ";
		lostFocus += "var idValue = '" + elementoID + "'; ";
		lostFocus += "var idTela = '" + this._idtela + "'; ";
		lostFocus += "var validar =  " + this._focuslost + "; ";
		lostFocus += "validar();})()"
		
		divInput = document.createElement("div")
			divInput.setAttribute("id",this._controlid + "_controlgroup");
			divInput.classList.add("control-group");
			elementoInput = document.createElement("input");
				elementoInput.setAttribute("value",labelItem);
				if(this.readOnly)
					elementoInput.setAttribute("disabled",true);
				elementoInput.setAttribute("id",elementoID +  "_autocomplete");
				elementoInput.setAttribute("localautocomplete",true);
				elementoInput.setAttribute("onfocus",onFocus);
				elementoInput.setAttribute("onblur",lostFocus);
				elementoInput.classList.add("autocomplete");
				elementoInput.classList.add("ui-autocomplete-input");
			divInput.appendChild(elementoInput);
			/*
			elementoInput = document.createElement("button");
				elementoInput.classList.add("btn");
				elementoInput.classList.add("btn-info");
				elementoInput.classList.add("btn-xs");
				elementoInput.classList.add("btn-round");
				elementoInput.style.paddingLeft = "6px";
				elementoInput.style.paddingRight = "6px";
				elementoInput.style.height = "20px";
				elementoInput.style.width = "10px";
			divInput.appendChild(elementoInput);
			*/
			elementoInput = document.createElement("input");
				elementoInput.setAttribute("id",elementoID);
				elementoInput.setAttribute("value",idItem);
				if(this.readOnly)
					elementoInput.setAttribute("disabled",true);
				elementoInput.setAttribute("localautocomplete",true);
				elementoInput.setAttribute("type","hidden");
			divInput.appendChild(elementoInput);
		
		ret = this._editPicker = divInput;
		
		return(ret);
	},
	insertValue: function() {
		var ret = null;
		
		if(this._insertPicker.children[0].value)
			ret = {"label" : this._insertPicker.children[0].value,"id" : this._insertPicker.children[1].value};
		else
			ret = {"label" : "","id" : ""};
			
		return(ret);
	},

	editValue: function() {
		var ret = null;
		
		if(this._editPicker.children[0].value)
			ret = {"label" : this._editPicker.children[0].value,"id" : this._editPicker.children[1].value};
		else
			ret = {"label" : "","id" : ""};
		return(ret);
	}
});

jsGrid.fields.autocomplete = campoAutoComplete;
