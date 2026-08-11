/**
 * MARMORARIA CENTRAL | Recebimento de leads da Landing Page
 * Google Apps Script vinculado a uma planilha do Google Sheets.
 *
 * COMO INSTALAR
 * 1. Crie uma planilha nova no Google Sheets (ex.: "Leads Marmoraria Central").
 * 2. Menu Extensões > Apps Script. Apague o conteúdo e cole este arquivo.
 * 3. Ajuste ABA e, se quiser, EMAIL_NOTIFICACAO abaixo.
 * 4. Salve. Clique em Implantar > Nova implantação.
 *    Tipo: App da Web
 *    Executar como: Eu
 *    Quem pode acessar: Qualquer pessoa
 * 5. Autorize o acesso quando o Google pedir.
 * 6. Copie a URL gerada (termina em /exec) e cole em js/main.js na constante ENDPOINT.
 *
 * OBSERVAÇÃO: a LP envia em modo no-cors com Content-Type text/plain,
 * por isso os dados chegam em e.postData.contents como JSON.
 */

var ABA = 'Leads';
var EMAIL_NOTIFICACAO = ''; // deixe vazio para não enviar aviso por e-mail

var COLUNAS = [
  ['data', 'Data e hora'],
  ['nome', 'Nome'],
  ['whatsapp', 'WhatsApp'],
  ['cidade', 'Cidade'],
  ['tipo', 'Tipo de projeto'],
  ['ambiente', 'Ambiente'],
  ['material', 'Material de interesse'],
  ['projeto', 'Possui projeto arquitetônico'],
  ['prazo', 'Prazo desejado'],
  ['mensagem', 'Mensagem'],
  ['origem', 'Origem']
];

function doPost(e) {
  var trava = LockService.getScriptLock();
  trava.waitLock(20000);
  try {
    var dados = {};
    if (e && e.postData && e.postData.contents) {
      dados = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      dados = e.parameter;
    }

    var aba = pegarAba_();
    var linha = COLUNAS.map(function (c) {
      if (c[0] === 'data') {
        return dados.data || Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss');
      }
      return dados[c[0]] || '';
    });
    aba.appendRow(linha);

    notificar_(dados);
    return resposta_({ ok: true });
  } catch (erro) {
    console.error(erro);
    return resposta_({ ok: false, erro: String(erro) });
  } finally {
    trava.releaseLock();
  }
}

function doGet() {
  return resposta_({ ok: true, servico: 'Leads Marmoraria Central' });
}

function pegarAba_() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
  }
  if (aba.getLastRow() === 0) {
    var titulos = COLUNAS.map(function (c) { return c[1]; });
    aba.appendRow(titulos);
    var cabecalho = aba.getRange(1, 1, 1, titulos.length);
    cabecalho.setFontWeight('bold').setBackground('#080A0D').setFontColor('#FFFFFF');
    aba.setFrozenRows(1);
    aba.setColumnWidth(1, 150);
    aba.setColumnWidth(2, 200);
    aba.setColumnWidth(10, 320);
  }
  return aba;
}

function notificar_(dados) {
  if (!EMAIL_NOTIFICACAO) return;
  var corpo = COLUNAS.map(function (c) {
    return c[1] + ': ' + (dados[c[0]] || '');
  }).join('\n');
  MailApp.sendEmail({
    to: EMAIL_NOTIFICACAO,
    subject: 'Novo lead do site: ' + (dados.nome || 'sem nome'),
    body: corpo
  });
}

function resposta_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Roda uma vez no editor para testar sem precisar do site. */
function testar() {
  doPost({
    postData: {
      contents: JSON.stringify({
        nome: 'Teste Marmoraria',
        whatsapp: '(41) 9 7980 0740',
        cidade: 'Curitiba',
        tipo: 'Residencial',
        ambiente: 'Cozinha',
        material: 'Quartzito',
        projeto: 'Sim',
        prazo: 'Em até 30 dias',
        mensagem: 'Lead de teste',
        origem: 'Teste manual'
      })
    }
  });
}
