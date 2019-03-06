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
		var vlr1 = ""; var vlr2 = ""; var ret = 0; var data = [];
		
		data = data1.split("/");
		vlr1 = data[2] + data[1] + data[0];
		data = data2.split("/");
		vlr2 = data[2] + data[1] + data[0];
		
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
		var ret = null;
		
		if(this.readOnly){
			ret = this._insertPicker = $("<input disabled value = ''>");
		}
		else{
			ret = this._insertPicker = $("<input value = ''>").datetimepicker({
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
		
		if(value){
			dataAux = new Date(value.substring(0,4),parseInt(value.substring(5,7)) - 1,value.substring(8,10));
			data = new Date(dataAux).toLocaleDateString();
		}
		if(this.readOnly){
			ret = this._editPicker = $("<input disabled value = '" + data+ "'>");
		}
		else{
			ret = this._editPicker = $("<input value = '" +  data + "'>").datetimepicker({
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
		return(vlr1 - vlr2);
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
		
		if(this.readOnly){
			ret = this._insertPicker = $("<input disabled value = ''>")
		}
		else{
			ret = this._insertPicker = $("<input value = ''>").mask(this.mascara, {
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
		}
		return(ret);
	},
	editTemplate: function (value,item) {
		var campo = "";
		
		if(value){
			if(isNaN(value))
				value = 0;
		}
		else
			value = 0;
			
		if(this.readOnly)
			campo = "<input disabled value = " + formataNumero(value,this.decimais,".",",") + ">"
		else
			campo = "<input value = " + formataNumero(value,this.decimais,".",",") + ">"
		
		ret = this._editPicker = $(campo).mask(this.mascara, {
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
		
		valor = parseFloat(this._insertPicker[0].value.replace(/\./g,"").replace(",", "."));
		return(valor);
	},

	editValue: function() {
		var valor = null;
		
		valor = parseFloat(this._editPicker[0].value.replace(/\./g,"").replace(",", "."));
		return(valor);
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
		return(vlr1 - vlr2);
	},
	itemTemplate: function (value,item) {
		if(!value)
			value = "";
		return(value);
	},
	insertTemplate: function () {
		var ret = null;
		
		if(this.readOnly){
			ret = this._insertPicker = $("<input disabled value = ''>")
		}
		else{
			ret = this._insertPicker = $("<input value = ''>")
		}
		return(ret);
	},
	editTemplate: function (value,item) {
		var campo = "";
		
		if(!value)
			value = "";
			
		if(this.readOnly)
			campo = "<input disabled value = '" + value + "'>"
		else
			campo = "<input value = '" + value + "'>"
		
		ret = this._editPicker = $(campo);
		
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
		
		divInput = document.createElement("div")
			divInput.setAttribute("id",this._controlid + "_controlgroup");
			divInput.classList.add("control-group");
			elementoInput = document.createElement("input");
				if(this.readOnly)
					elementoInput.setAttribute("disabled",true);
				elementoInput.setAttribute("id",elementoID + "_autocomplete");
				elementoInput.setAttribute("localautocomplete",true);
				elementoInput.setAttribute("onfocus",onFocus);
				elementoInput.classList.add("autocomplete");
				elementoInput.classList.add("ui-autocomplete-input");
			divInput.append(elementoInput);
			/*-*/
			elementoInput = document.createElement("input");
				if(this.readOnly)
					elementoInput.setAttribute("disabled",true);
				elementoInput.setAttribute("localautocomplete",true);
				elementoInput.setAttribute("id",elementoID);
				elementoInput.setAttribute("type","hidden");
			divInput.append(elementoInput);
		
		ret = this._insertPicker = divInput;
		
		return(ret);
	},
	editTemplate: function (value,item) {
		var divInput = null;
		var elementoInput = null;
		var idItem = "";
		var labelItem = "";
		var onFocus = "";
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
				elementoInput.classList.add("autocomplete");
				elementoInput.classList.add("ui-autocomplete-input");
			divInput.append(elementoInput);
			/*-*/
			elementoInput = document.createElement("input");
				elementoInput.setAttribute("id",elementoID);
				elementoInput.setAttribute("value",idItem);
				if(this.readOnly)
					elementoInput.setAttribute("disabled",true);
				elementoInput.setAttribute("localautocomplete",true);
				elementoInput.setAttribute("type","hidden");
			divInput.append(elementoInput);
		
		ret = this._editPicker = divInput;
		
		return(ret);
	},
	insertValue: function() {
		var ret = null;
		
		if(this._editPicker.children[0].value)
			ret = {"label" : this._editPicker.children[0].value,"id" : this._editPicker.children[1].value};
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
