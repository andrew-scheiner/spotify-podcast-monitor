function backupSpreadsheet() {
  GASLibrary.copySpreadsheetToDrive("1xYfve3NSLGCUoO0SbGMtvU17MwZ7Zs0E", "Backup"); // _20nn KMS
}

function hideDoneActions() {
  GASLibrary.hideDoneActions();
}

function resetFilter(){
  GASLibrary.resetFilter();
}

function sortActiveSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  GASLibrary.sortSheetByConfig(ss, SORT_CONFIGS);
}
