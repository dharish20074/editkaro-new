/**
 * EDITKARO.IN — Google Apps Script backend
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var timestamp = new Date();

    if (data.formType === 'contact') {
      var contactSheet = getOrCreateSheet(ss, 'Contacts', ['Timestamp', 'Name', 'Email', 'Phone', 'Message']);
      contactSheet.appendRow([timestamp, data.name || '', data.email || '', data.phone || '', data.message || '']);
    } else {
      // default: treat anything else (formType === 'subscriber' or missing) as a newsletter signup
      var subSheet = getOrCreateSheet(ss, 'Subscribers', ['Timestamp', 'Email', 'Source']);
      subSheet.appendRow([timestamp, data.email || '', data.source || 'home-newsletter']);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Simple health check — visiting the deployed URL in a browser (GET) should show this.
function doGet(e) {
  return ContentService
    .createTextOutput('Editkaro.in form endpoint is live. POST only.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet(ss, name, headerRow) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headerRow);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
