function onOpen(e) {
  createMenu();
}

function onEdit(e) {
  const range = e.range;
  const value = e.value;
  const sheet = range.getSheet();
  const row = e.range.getRow();
  const column = e.range.getColumn();
  const sheetName = sheet.getName(); 

  if (row != 1) {
    GASLibrary.addTimestampToUpdatedColumn(sheet,column,row);
  }

  if (value === "X Delete") {
    sheet.deleteRow(row);
  }
}
