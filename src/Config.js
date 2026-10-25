
const EMAILS_BY_LISTENER = Object.freeze({
  AAS: 'andrew.scheiner@gmail.com',
  HRS: 'helen.sender@gmail.com',
});

const SORT_CONFIGS = {
  Podcasts: {
    sortColumns: [
      { column: 5, ascending: true },
      { column: 6, ascending: true },
      { column: 2, ascending: true }
    ],
    headerRows: 1
  },
  Sheet1: {
    sortColumns: [{ column: 3, ascending: true }]
  }
};