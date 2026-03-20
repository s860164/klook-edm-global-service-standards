// ===========================================
// Google Apps Script - EDM Review API
// ===========================================
// 1. Open: https://script.google.com
// 2. Create new project
// 3. Paste this code
// 4. Deploy > New deployment > Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy the deployment URL
// ===========================================

const SHEET_ID = '16BBVVR3EVfd_6cIezLzn3BK141g2bFprgvId95s3ZEQ';
const SHEET_NAME = 'Sheet1';

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  // Optional filter by language
  const lang = e.parameter.lang;
  const filtered = lang ? rows.filter(r => r.Language === lang) : rows;

  return ContentService
    .createTextOutput(JSON.stringify({ success: true, comments: filtered }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    const timestamp = new Date().toISOString();
    sheet.appendRow([
      timestamp,
      body.language || '',
      body.section || '',
      body.reviewer || 'Anonymous',
      body.comment || '',
      'Open'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, timestamp }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
