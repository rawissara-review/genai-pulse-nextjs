/**
 * GenAI Pulse Survey — Google Apps Script
 *
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet
 * 2. Extensions → Apps Script
 * 3. Paste this entire file (replacing any existing code)
 * 4. Save (Ctrl+S)
 * 5. Click "Deploy" → "New deployment"
 * 6. Type: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone   ← IMPORTANT (not "Anyone with Google")
 * 9. Click Deploy → copy the Web App URL
 * 10. Set that URL as SHEETS_URL in Vercel environment variables
 *     (or update the hardcoded fallback in api/survey.ts)
 *
 * SHEET SETUP:
 * - The script will auto-create a sheet named "Responses"
 * - Headers are written automatically on first submission
 */

var SHEET_NAME = 'Responses';

var HEADERS = [
  'id', 'submittedAt', 'email', 'role', 'isAdvocate',
  'tools', 'frequency', 'promptCount',
  'confidence', 'efficiency', 'prompt', 'teamSupport', 'avgScore',
  'timeSaved', 'barriers', 'freeText', 'followUp',
];

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;

  if (action === 'write') {
    try {
      var data = JSON.parse(e.parameter.data);
      appendRow(data);
      return makeResponse({ ok: true, id: data.id });
    } catch (err) {
      return makeResponse({ ok: false, error: String(err) });
    }
  }

  if (action === 'clearAll') {
    try {
      clearAllData();
      return makeResponse({ ok: true });
    } catch (err) {
      return makeResponse({ ok: false, error: String(err) });
    }
  }

  // Default: return all responses
  try {
    var responses = getAllResponses();
    return makeResponse({ ok: true, responses: responses });
  } catch (err) {
    return makeResponse({ ok: false, error: String(err) });
  }
}

function makeResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendRow(data) {
  var sheet = getOrCreateSheet();
  var row = HEADERS.map(function(h) {
    var val = data[h];
    return val === undefined || val === null ? '' : val;
  });
  sheet.appendRow(row);
}

function getAllResponses() {
  var sheet = getOrCreateSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  var data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  return data.map(function(row) {
    var obj = {};
    HEADERS.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  });
}

function clearAllData() {
  var sheet = getOrCreateSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
}
