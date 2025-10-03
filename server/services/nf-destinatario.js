const {
  padronizarCEP,
  padronizarCPF,
  padronizarCNPJ,
  obterCodigoIBGE,
  limparTextoNFe
} = require('./utils');

/**
 * Monta a estrutura do destinatário para a NF-e
 * @param {Object} d - Dados do destinatário
 * @param {Object} defaults - Configurações padrão
 * @returns {Object} Estrutura do destinatário formatada
 */
function montarDestinatario(d, defaults) {
  // Tratar telefone
  let telefone = (d.Telefone || d.Celular || "").replace(/\D/g, "");
  if (telefone.length < 6) telefone = "1133334444";
  if (telefone.length > 14) telefone = telefone.slice(0, 14);

  // Obter código IBGE
  const codigoMunicipio = obterCodigoIBGE(d.Cidade, d.Estado);

  // Determinar tipo de pessoa
  const cnpjLimpo = (d.CNPJ || "").replace(/\D/g, "");
  const cpfLimpo = (d.CPF || "").replace(/\D/g, "");
  const isEmpresa = cnpjLimpo && cnpjLimpo !== "00000000000000" && cnpjLimpo.length === 14;

  // Lógica de Indicador de IE
  let indIEDest, ieDestinatario;
  
  if (!isEmpresa) {
    // CPF: sempre não contribuinte
    indIEDest = 9;
    ieDestinatario = undefined;
  } else {
    // CNPJ: verificar IE
    const ieNumeros = (d.IE || "").replace(/\D/g, "");
    
    if (ieNumeros && ieNumeros.length >= 2 && ieNumeros.length <= 14) {
      indIEDest = 1; // Contribuinte
      ieDestinatario = ieNumeros;
    } else {
      indIEDest = 9; // Não contribuinte
      ieDestinatario = undefined;
    }
  }

  return {
    CPF: isEmpresa ? undefined : padronizarCPF(cpfLimpo),
    CNPJ: isEmpresa ? padronizarCNPJ(cnpjLimpo) : undefined,
    xNome: limparTextoNFe(d.Nome || d["﻿Nome/Razão Social"]),
    indIEDest,
    IE: ieDestinatario,
    enderDest: {
      xLgr: limparTextoNFe(d.Endereco || d.Endereço || d.Rua),
      nro: limparTextoNFe(d.Numero || d.Número) || "s/n",
      xCpl: limparTextoNFe(d.Complemento) || undefined,
      xBairro: limparTextoNFe(d.Bairro),
      cMun: parseInt(codigoMunicipio),
      xMun: limparTextoNFe(d.Cidade),
      UF: d.Estado,
      CEP: padronizarCEP(d.CEP),
      cPais: 1058,
      xPais: "BRASIL",
      fone: telefone
    }
  };
}

module.exports = { montarDestinatario };