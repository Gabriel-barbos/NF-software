const fs = require("fs");
const path = require("path");

// Mapa de conversão de nomes
const produtoMap = {
  // Chicotes
  "Teltonika Com Bloqueio + I-Button": ["Chicote Elétrico Padrão", "I-BUTTON PRETO", "LEITOR I-BUTTON"],
  "2G - Sem Bloqueio": ["Chicote Elétrico Padrão"],
  "2G - Com Bloqueio": ["Chicote Elétrico Padrão"],
  "2G - Com Bloqueio CAOA": ["Chicote Elétrico Padrão"],
  "2G - Com Bloqueio Padrão": ["Chicote Elétrico Padrão"],
  "2G - Com Bloqueio Padrão + RFID + Buzzer": ["Chicote Elétrico Padrão", "LEITOR DE CARTÃO RFID"],
  "2G - Com Bloqueio Padrão 24V": ["Chicote Elétrico Padrão"],
  "4G - Com Bloqueio + Buzzer": ["Chicote Elétrico Padrão"],
  "4G - Com Bloqueio Padrão": ["Chicote Elétrico Padrão"],
  "4G - Com Bloqueio Padrão 24V": ["Chicote Elétrico Padrão"],
  "4G - Com Bloqueio Unidas": ["Chicote Elétrico Padrão"],
  "4G - Com Bloqueio Unidas 24V": ["Chicote Elétrico Padrão"],
  "4G - Sem Bloqueio": ["Chicote Elétrico Padrão"],
  "4G - Sem Bloqueio + Buzzer": ["Chicote Elétrico Padrão"],
  "MHUB Com Bloqueio + Buzzer + RFID + Sensor Chuva - 12V": ["Chicote Elétrico Padrão", "LEITOR DE CARTÃO RFID", "CARTÃO RFID 2"],
  "MHUB Com Bloqueio + Buzzer + RFID + Sensor Chuva - 24V": ["Chicote Elétrico Padrão", "LEITOR DE CARTÃO RFID", "CARTÃO RFID 2"],
  "Sem Chicote": [],
  "Teltonika Com Bloqueio + 2 Buzzer + RFID": ["Chicote Elétrico Padrão", "LEITOR DE CARTÃO RFID"],
  "Teltonika Com Bloqueio + eCAM": ["Chicote Elétrico Padrão", "ECAN02HWL301"],
  "Teltonika Com Bloqueio + eCAM + I-Button + Buzzer": ["Chicote Elétrico Padrão", "ECAN02HWL301", "I-BUTTON PRETO"],
  "Teltonika Com Bloqueio + I-Button + Buzzer": ["Chicote Elétrico Padrão", "I-BUTTON PRETO", "LEITOR I-BUTTON"],
  "Teltonika Com Bloqueio + RFID": ["Chicote Elétrico Padrão", "LEITOR DE CARTÃO RFID"],
  "Teltonika Com Bloqueio + Sensor Combustível": ["Chicote Elétrico Padrão"],
  "Teltonika Com Bloqueio + Sensor Combustível + I-Button": ["Chicote Elétrico Padrão", "I-BUTTON PRETO"],
  "Teltonika SEM Bloqueio + I-Button + Buzzer": ["I-BUTTON PRETO", "LEITOR I-BUTTON"],
  "X3Tech Com Bloqueio Padrão": ["Chicote Elétrico Padrão"],
  "X3Tech Com Bloqueio Unidas": ["Chicote Elétrico Padrão"],

  // Dispositivos
  "GV50": ["QUECKLINK GV50"],
  "GV50CG": ["QUECKLINK GV50 4G"],
  "GV75": ["QUECKLINK GV75"],
  "MHUB 369": ["MHUB 369"],
  "Teltonika FMB130": ["TELTONIKA FMB130"],
  "Teltonika FMC130": ["TELTONIKA FMC130"],
  "Teltonika FMC150": ["TELTONIKA FMC150"],
  "Teltonika FMC150 + eCAM02": ["TELTONIKA FMC150", "ECAN02HWL301"],
  "X3Tech XT40": ["RASTREADOR XT40 - X3TECH"],

  // Acessórios
  "I-Button": ["I-BUTTON PRETO"],
  "eCAM2": ["ECAN02HWL301"],
  "Botão de Pânico": ["BOTÃO DE PÂNICO"],
  "Buzzer": [], 
  "Cartão RFID SGBrás": ["CARTÃO RFID 2"],
  "Chavinha CAOA": [], 
  "I-Button + Leitor": ["I-BUTTON PRETO", "Leitor I-BUTTON"],
  "I-Button - 2 por equipamento": ["I-BUTTON PRETO", "I-BUTTON PRETO"],
  "Leitor RFID": ["LEITOR DE CARTÃO RFID"],
  "Leitor RFID + Cartão": ["LEITOR DE CARTÃO RFID", "CARTÃO RFID 2"],
  "Leitor RFID SGBrás": ["LEITOR DE CARTÃO MAGNÉTICO DR102"],
  "Leitor RFID SGBrás + Cartão": ["LEITOR DE CARTÃO MAGNÉTICO DR102", "CARTÃO RFID 2"],
  "Mister S": ["SA MISTER S GV50"],
  "Scotchlock": [], 
  "Scotchlock (conector fio)": [], 
  "Sem Acessórios": [] 
};

// Carregar JSON
function loadJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, file), "utf-8"));
}

function saveJSON(file, data) {
  fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data, null, 2));
}

// FUNÇÕES AUXILIARES
function aplicarConversao(nome) {
  if (!nome || nome.trim() === "") {
    return []; 
  }
  
  const valores = produtoMap[nome];
  if (!valores) {
    console.warn(`Produto não encontrado no mapa: ${nome}`);
    return [nome]; 
  }
  
  return valores.filter(v => v && v.trim() !== "");
}

function getDisplayValue(campo) {
  if (!campo) return '';
  return typeof campo === 'object' && campo.display_value 
    ? campo.display_value.trim() 
    : String(campo).trim();
}

function buscarProduto(apiProdNome, produtosCatalogo) {
  return produtosCatalogo.find(
    p => p["Descrição"].toUpperCase() === apiProdNome.toUpperCase()
  );
}

function padronizarCEP(cep) {
  return (cep || "").replace(/\D/g, "").padStart(8, "0");
}

function padronizarCPF(cpf) {
  return (cpf || "").replace(/\D/g, "").padStart(11, "0");
}

function padronizarCNPJ(cnpj) {
  return (cnpj || "").replace(/\D/g, "").padStart(14, "0");
}

function obterCodigoIBGE(cidade, uf) {
  const municipiosIBGE = loadJSON("ibge.json");
  
  if (!cidade || !uf) return "3550308";

  const cidadeNormalizada = cidade
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();

  const municipio = municipiosIBGE.find(m => {
    const nomeNormalizado = m.nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .trim();

    return nomeNormalizado === cidadeNormalizada;
  });

  if (municipio) {
    return municipio.codigo_ibge.toString();
  }

  const codigosUF = {
    "AC": 12, "AL": 17, "AP": 16, "AM": 13, "BA": 29, "CE": 23, "DF": 53,
    "ES": 32, "GO": 52, "MA": 21, "MT": 51, "MS": 50, "MG": 31, "PA": 15,
    "PB": 25, "PR": 41, "PE": 26, "PI": 22, "RJ": 33, "RN": 24, "RS": 43,
    "RO": 11, "RR": 14, "SC": 42, "SP": 35, "SE": 28, "TO": 17
  };

  const codigoUF = codigosUF[uf];
  if (codigoUF) {
    const capital = municipiosIBGE.find(m =>
      m.codigo_uf === codigoUF && m.capital === 1
    );
    if (capital) {
      return capital.codigo_ibge.toString();
    }
  }

  return "3550308";
}

function limparTextoNFe(texto) {
  if (!texto) return "";

  return texto
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^[\s-]+|[\s-]+$/g, "")
    || "";
}

function sanitizeFilename(str) {
  return str
    .normalize("NFD") // remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_"); // só letras, números, hífen e underline
}

module.exports = {
  produtoMap,
  loadJSON,
  saveJSON,
  aplicarConversao,
  getDisplayValue,
  buscarProduto,
  padronizarCEP,
  padronizarCPF,
  padronizarCNPJ,
  obterCodigoIBGE,
  limparTextoNFe,
  sanitizeFilename
};