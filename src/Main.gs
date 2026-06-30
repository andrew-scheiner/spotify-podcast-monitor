/**
 * Vanilla Google Apps Script template entry point.
 * Replace or extend this file with your project's functions.
 */
function onOpen(e) {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Template')
        .addItem('Say Hello', 'sayHello')
        .addToUi();
}

function sayHello() {
    SpreadsheetApp.getUi().alert('Hello from the GAS template!');
}
