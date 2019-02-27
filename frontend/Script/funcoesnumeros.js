function formataNumero(valorFormatar, casasDecimais, separadorMilhar, separadorDecimal) {
    var retorno = "";
    var numeroFormatar = "";
    var retornoDecimais = "";
    var tamanhoNumero = 0;
    var modulos = 0;
    var contador = 0;
    var posicao = 0;

    try {
        if (isNaN(valorFormatar)) {
            retorno = "NaN";
        }
        else {
            if (typeof (valorFormatar) == "string")
                valor = parseFloat(valorFormatar);
            else
                valor = valorFormatar;

            numeroFormatar = valor.toFixed(casasDecimais);
            tamanhoNumero = numeroFormatar.length;
            retornoDecimais = separadorDecimal + numeroFormatar.substr(tamanhoNumero - casasDecimais);
            numeroFormatar = numeroFormatar.substr(0, tamanhoNumero - casasDecimais - 1)
            tamanhoNumero = numeroFormatar.length;

            modulos = tamanhoNumero % 3;
            if (modulos > 0) {
                numeroFormatar = (" ").repeat(3 - modulos) + numeroFormatar;
            }
            tamanhoNumero = numeroFormatar.length;
            modulos = tamanhoNumero / 3;

            retorno = "";
            posicao = 0;
            for (contador = 0; contador < modulos; contador++) {
                if (contador > 0)
                    retorno += separadorMilhar;
                retorno += numeroFormatar.substr(posicao, 3)
                posicao += 3;
            }

            retorno += retornoDecimais;

            retorno = retorno.trim();
        }
    }
    catch (err) {
        retorno = "eNaN";
        console.log("FormataNumero: " + err.message)
    }
    return (retorno);
}

function redistribuicaoValores(parametros){
	var i = 0;
	var cota = 0;
	var valorBase = 0;
	var valorAlterado = 0;
	var diferenca = 0;
	var totalItens = 0;
	var sinal = 1;
	var resposta = null;
	var itemModificado = -1;
	
	try{
		resposta = {
			status: 1,
			mensagem: [],
			itensNovos: null
		}
		itemModificado = parametros.itens.findIndex(function(value,index,array){return value["id"] == parametros.idItemModificado});
		valorAlterado = parseFloat(parametros.itens[itemModificado].valor);
		valorBase = parseFloat(parametros.valorBase);
		if(valorAlterado >= valorBase){
			resposta.status = 0;
			if(valorAlterado > valorBase){
				resposta.mensagem.push("O valor informado é superior ao saldo.");
			}
			else{
				if(parametros.itens.length > 1){
					resposta.mensagem.push("O valor informado é igual ao saldo, não permitindo o reajuste das outras parcelas.");
				}
			}
		}
		else{
			if(parametros.itens.length <= 1){
				resposta.status = 0;
				resposta.mensagem.push("O valor informado é menor que saldo total e não há parcelas para reajustar os valores.");
			}
		}
		if(resposta.status == 1){
			for(i = 0; i < parametros.itens.length; i++){
				totalItens += parseFloat(parametros.itens[i].valor);
			}
			
			diferenca = parametros.valorBase - totalItens
			if(diferenca < 0){
				sinal = -1
				diferenca = Math.abs(diferenca);
			}
			cota = Math.trunc(((diferenca * 100) / (parametros.itens.length - 1)));
			cota /= 100;
			
			resposta = {
				status: 1,
				mensagem: ["ok"],
				itensNovos: parametros.itens
			}
			
			while(diferenca > 0) {
				i = 0;
				while(i < resposta.itensNovos.length && diferenca > 0){
					if(resposta.itensNovos[i].id != parametros.idItemModificado){
						resposta.itensNovos[i].valor += (cota * sinal);
						diferenca -= cota;
						if(cota > diferenca)
							cota = diferenca;
					}
					i++;
				}
			}
		}
	}
	catch(err){
		resposta = {
			status: -1,
			mensagem: ["" + err],
			itensNovos: null
		}
	}
	
	return(resposta);
}