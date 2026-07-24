/**
 * Send Network KC — Planter Lunch RSVP collector
 *
 * SETUP (one time, ~4 minutes):
 * 1. Create a Google Sheet named exactly:  Planter Lunch RSVPs
 *    Put these headers in row 1 of the first tab:  Timestamp | Event | Name | Coming | Count | Phone | Note
 * 2. In that Sheet: Extensions → Apps Script. Delete the sample code, paste this file.
 * 3. Click Deploy → New deployment → type: Web app.
 *      - Execute as: Me
 *      - Who has access: Anyone          <-- this is what makes "no sign-in" work
 * 4. Copy the Web app URL and paste it into ENDPOINT in lunch-rsvp/index.html (ministrybag1).
 *
 * 5. In Project Settings → Script properties, add ADMIN_PASSWORD with the team password.
 *
 * RSVP submissions append one row on the first tab.
 * Staff can update lunch details (title, when, where, paragraph) from the public page with the password.
 * Each save also upserts a row on an "Events" tab so the sheet shows the current / past lunches.
 *
 * Redeploy after editing this code (Deploy → Manage deployments → edit → new version).
 */

var DEFAULT_EVENT = {
  title: "SendKC Planter Lunch — July",
  date: "2026-07-23",
  startTime: "11:30",
  endTime: "13:00",
  place: "Neighborhood Church",
  address: "8600 W 91st Terrace, Overland Park, KS 66212",
  rsvpBy: "2026-07-21",
  paragraph: "Monthly Send Network KC planter lunch — fellowship, a shared meal, a short talk, table discussion, and prayer. Spouses welcome.",
};

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.action === "updateEvent") return updateEvent_(data);

    var sheet = getRsvpSheet_();
    sheet.appendRow([
      new Date(),
      String(data.event || ""),
      String(data.name || "").slice(0, 80),
      String(data.coming || ""),
      Number(data.count || 0),
      String(data.phone || "").slice(0, 30),
      String(data.note || "").slice(0, 300),
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "event") {
    return jsonOutput_({ ok: true, event: getEvent_() }, e.parameter.callback);
  }
  if (e && e.parameter && e.parameter.action === "verifyPassword") {
    var expected = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
    var ok = !!(expected && String(e.parameter.password || "") === expected);
    return jsonOutput_({ ok: ok }, e.parameter.callback);
  }
  return ContentService.createTextOutput("Planter Lunch RSVP collector is running.");
}

function getEvent_() {
  var saved = PropertiesService.getScriptProperties().getProperty("EVENT_CONFIG");
  if (!saved) return DEFAULT_EVENT;
  try {
    return validateEvent_(JSON.parse(saved));
  } catch (err) {
    return DEFAULT_EVENT;
  }
}

function updateEvent_(data) {
  var properties = PropertiesService.getScriptProperties();
  var expectedPassword = properties.getProperty("ADMIN_PASSWORD");
  if (!expectedPassword || String(data.password || "") !== expectedPassword) {
    return jsonOutput_({ ok: false, error: "Unauthorized" });
  }

  var event = validateEvent_(data.event || {});
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    properties.setProperty("EVENT_CONFIG", JSON.stringify(event));
    upsertEventRow_(event);
  } finally {
    lock.releaseLock();
  }
  return jsonOutput_({ ok: true, event: event });
}

function validateEvent_(event) {
  var datePattern = /^\d{4}-\d{2}-\d{2}$/;
  var timePattern = /^\d{2}:\d{2}$/;
  var date = String(event.date || "").slice(0, 10);
  var monthName = "";
  try {
    monthName = Utilities.formatDate(
      new Date(date + "T12:00:00"),
      "America/Chicago",
      "MMMM"
    );
  } catch (err) {
    monthName = "";
  }
  var defaultTitle = monthName
    ? "SendKC Planter Lunch — " + monthName
    : "SendKC Planter Lunch";
  var clean = {
    title: String(event.title || "").trim().slice(0, 120) || defaultTitle,
    date: date,
    startTime: String(event.startTime || "").slice(0, 5),
    endTime: String(event.endTime || "").slice(0, 5),
    place: String(event.place || "").trim().slice(0, 100),
    address: String(event.address || "").trim().slice(0, 180),
    rsvpBy: String(event.rsvpBy || "").slice(0, 10),
    paragraph: String(event.paragraph || "").trim().slice(0, 800),
  };
  if (!datePattern.test(clean.date) || !datePattern.test(clean.rsvpBy)
      || !timePattern.test(clean.startTime) || !timePattern.test(clean.endTime)
      || !clean.place || !clean.address || clean.startTime >= clean.endTime
      || clean.rsvpBy > clean.date) {
    throw new Error("Invalid event details");
  }
  return clean;
}

function eventIdFromDate_(date) {
  return "planter-lunch-" + String(date).slice(0, 7);
}

function getRsvpSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1")
      || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function getEventsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Events");
  if (!sheet) {
    sheet = ss.insertSheet("Events");
    sheet.appendRow([
      "EventId",
      "UpdatedAt",
      "Title",
      "Date",
      "StartTime",
      "EndTime",
      "Place",
      "Address",
      "RsvpBy",
      "Paragraph",
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Upsert the lunch details on the Events tab so staff can see each month's event in the sheet. */
function upsertEventRow_(event) {
  var sheet = getEventsSheet_();
  var eventId = eventIdFromDate_(event.date);
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === eventId) {
      rowIndex = i + 1;
      break;
    }
  }
  var row = [
    eventId,
    new Date(),
    event.title,
    event.date,
    event.startTime,
    event.endTime,
    event.place,
    event.address,
    event.rsvpBy,
    event.paragraph,
  ];
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
}

function jsonOutput_(payload, callback) {
  var json = JSON.stringify(payload);
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$.]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
