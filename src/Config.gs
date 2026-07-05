const {ZZZ_KMS_ID} = GASConfigLibrary.getFolderIds();

// Email addresses mapped to listener codes
const EMAILS_BY_LISTENER = {
  AAS: 'andrew.scheiner@gmail.com',
  HRS: 'helen.sender@gmail.com'
};


const SORT_CONFIGS = {
  Cpi: {
    sortColumns: [
      { column: 2, ascending: true },
      { column: 3, ascending: true }
    ],
    headerRows: 1
  },
  Podcasts: {
    sortColumns: [
      { column: 5, ascending: true },
      { column: 2, ascending: true }
    ],
    headerRows: 1
  },
};
