function backupSpreadsheet() {
  GASLibrary.copySpreadsheetToDrive(ZZZ_KMS_ID, "Backup");
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
