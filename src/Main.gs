function onOpen() {
  SpreadsheetApp.getUi().createMenu('Template').addItem('Run sample', 'runSample').addToUi();
}

function runSample() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange('A1').setValue('Hello from GAS template!');
}
