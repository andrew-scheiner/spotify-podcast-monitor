//@OnlyCurrentDoc

// Note: A weekly trigger already runs `checkForNewEpisodes()` every Sunday between 02:00 and 03:00

function createMenu() {
  const ui = SpreadsheetApp.getUi();
  let customMenu = ui
    .createMenu('Custom')
    .addItem('Backup Spreadsheet', 'backupSpreadsheet')
    .addItem('Reset Filter', 'resetFilter')
    .addItem('Reset Last Run Date', 'resetLastRunDate')
    .addItem('Run Check for New Episodes', 'checkForNewEpisodes')
    .addItem('Set Priority and Status Dropdown Lists', 'setPriorityAndStatusDropdownLists')
    .addItem('Sort Sheet', 'sortActiveSheet')
    .addSeparator()
    .addItem('Backfill Last 7 Days', 'runBackfillLast7Days');
  /*
  .addSubMenu(ui.createMenu('Update Data Source(s)')
    .addItem('Update All', 'updateAllDataSources')
    .addItem('Data Source 1','updateFunction1')
    .addItem('Data Source 2','updateFunction2'));
  */
  customMenu.addToUi();
}
function onOpen(e) {
  createMenu();
}
