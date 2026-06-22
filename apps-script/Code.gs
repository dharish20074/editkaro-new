/**
 * EDITKARO.IN — Google Apps Script backend
 * ------------------------------------------------------------
 * Stores BOTH the homepage email subscribe form and the Contact
 * Us form into two tabs of one Google Sheet:
 *   - "Subscribers"  (Timestamp, Email, Source)
 *   - "Contacts"      (Timestamp, Name, Email, Phone, Message)
 *
 * SETUP (also covered in README.md, section 4):
 *  1. Create a new Google Sheet (any name, e.g. "Editkaro Leads").
 *  2. In the Sheet, open Extensions → Apps Script.
 *  3. Delete any starter code in Code.gs and paste in this whole file.
 *  4. Click Deploy → New deployment → select type "Web app".
 *       - Execute as: Me
 *       - Who has access: Anyone
 *  5. Click Deploy, authorize the permissions Google asks for.
 *  6. Copy the resulting Web app URL.
 *  7. Paste that URL into CONFIG.SHEETS_ENDPOINT in js/main.js.
 *
 * NOTE on CORS: browsers send a JSON POST as `text/plain` here on
 * purpose (see js/main.js -> postToSheet) to dodge the CORS
 * preflight that Apps Script doesn't handle by default. doPost()
 * below still parses it as JSON either way.
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
