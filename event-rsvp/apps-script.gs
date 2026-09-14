/**
 * Send Network KC — RSVP collector
 * Serves BOTH pages from one deployment:
 *   • /lunch-rsvp/  → monthly planter lunch   (tabs: Sheet1, Events)
 *   • /event-rsvp/  → one-off big events      (tabs: Event RSVPs, Event Details)
 *
 * The two pages never touch each other's tabs or saved settings. Lunch behavior
 * below is unchanged from the original script.
 *
 * SETUP (one time):
 * 1. In the RSVP Google Sheet: Extensions → Apps Script. Replace the whole file
 *    with this one.
 * 2. Deploy → Manage deployments → edit the existing Web app deployment →
 *    Version: New version → Deploy.  (Keep the SAME deployment so the lunch page's
 *    existing URL keeps working.)
 * 3. Paste that same Web app URL into ENDPOINT in BOTH index.html files.
 * 4. Project Settings → Script properties already has ADMIN_PASSWORD. Both pages
 *    use it.
 *
 * The "Event RSVPs" and "Event Details" tabs are created automatically the first
 * time an event is saved or an RSVP comes in. Nothing to set up by hand.
 *
 * Redeploy after editing this code (Deploy → Manage deployments → edit → new version).
 */

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

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

/* Shown on /event-rsvp/ until staff saves a real event. */
var DEFAULT_BIG_EVENT = {
  title: "Our Next Big Event",
  kicker: "SendKC",
  date: "2026-12-31",
  startTime: "18:00",
  endTime: "20:00",
  place: "Neighborhood Church",
  address: "8600 W 91st Terrace, Overland Park, KS 66212",
  rsvpBy: "2026-12-29",
  paragraph: "Tap the gear icon and enter the team password to set up this event.",
  question: "",
  contact: "Questions? Text Dave Partin at (913) 901-7581.",
};

var BIG_EVENT_KEY = "BIG_EVENT_CONFIG";

/* ------------------------------------------------------------------ */
/* Web app entry points                                                */
/* ------------------------------------------------------------------ */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var isBigEvent = String(data.kind || "") === "event";

    if (data.action === "updateEvent") {
      return isBigEvent ? updateBigEvent_(data) : updateEvent_(data);
    }

    if (isBigEvent) {
      appendBigEventRsvp_(data);
    } else {
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
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "event") {
    var isBigEvent = String(e.parameter.kind || "") === "event";
    var config = isBigEvent ? getBigEvent_() : getEvent_();
    return jsonOutput_({ ok: true, event: config }, e.parameter.callback);
  }
  if (e && e.parameter && e.parameter.action === "verifyPassword") {
    var expected = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
    var ok = !!(expected && String(e.parameter.password || "") === expected);
    return jsonOutput_({ ok: ok }, e.parameter.callback);
  }
  return ContentService.createTextOutput("SendKC RSVP collector is running.");
}

/* ------------------------------------------------------------------ */
/* Planter lunch  (unchanged)                                          */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Big events  (/event-rsvp/)                                          */
/* ------------------------------------------------------------------ */

function getBigEvent_() {
  var saved = PropertiesService.getScriptProperties().getProperty(BIG_EVENT_KEY);
  if (!saved) return DEFAULT_BIG_EVENT;
  try {
    return validateBigEvent_(JSON.parse(saved));
  } catch (err) {
    return DEFAULT_BIG_EVENT;
  }
}

function updateBigEvent_(data) {
  var properties = PropertiesService.getScriptProperties();
  var expectedPassword = properties.getProperty("ADMIN_PASSWORD");
  if (!expectedPassword || String(data.password || "") !== expectedPassword) {
    return jsonOutput_({ ok: false, error: "Unauthorized" });
  }

  var event = validateBigEvent_(data.event || {});
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    properties.setProperty(BIG_EVENT_KEY, JSON.stringify(event));
    upsertBigEventRow_(event);
  } finally {
    lock.releaseLock();
  }
  return jsonOutput_({ ok: true, event: event });
}

function validateBigEvent_(event) {
  var datePattern = /^\d{4}-\d{2}-\d{2}$/;
  var timePattern = /^\d{2}:\d{2}$/;
  var clean = {
    title: String(event.title || "").trim().slice(0, 120),
    kicker: String(event.kicker || "").trim().slice(0, 40),
    date: String(event.date || "").slice(0, 10),
    startTime: String(event.startTime || "").slice(0, 5),
    endTime: String(event.endTime || "").slice(0, 5),
    place: String(event.place || "").trim().slice(0, 100),
    address: String(event.address || "").trim().slice(0, 180),
    rsvpBy: String(event.rsvpBy || "").slice(0, 10),
    paragraph: String(event.paragraph || "").trim().slice(0, 800),
    question: String(event.question || "").trim().slice(0, 120),
    contact: String(event.contact || "").trim().slice(0, 160),
  };
  if (!clean.title || !datePattern.test(clean.date) || !datePattern.test(clean.rsvpBy)
      || !timePattern.test(clean.startTime) || !timePattern.test(clean.endTime)
      || !clean.place || !clean.address || clean.startTime >= clean.endTime
      || clean.rsvpBy > clean.date) {
    throw new Error("Invalid event details");
  }
  return clean;
}

/** "fall-festival-2026-10-25" — groups every RSVP for one event together. */
function bigEventId_(event) {
  var slug = String(event.title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  if (!slug) slug = "event";
  return slug + "-" + String(event.date || "").slice(0, 10);
}

function getBigEventRsvpSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Event RSVPs");
  if (!sheet) {
    sheet = ss.insertSheet("Event RSVPs");
    sheet.appendRow([
      "Timestamp",
      "EventId",
      "Event",
      "Name",
      "Coming",
      "Count",
      "Answer",
      "Phone",
      "Note",
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getBigEventDetailsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Event Details");
  if (!sheet) {
    sheet = ss.insertSheet("Event Details");
    sheet.appendRow([
      "EventId",
      "UpdatedAt",
      "Title",
      "Kicker",
      "Date",
      "StartTime",
      "EndTime",
      "Place",
      "Address",
      "RsvpBy",
      "Paragraph",
      "Question",
      "Contact",
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendBigEventRsvp_(data) {
  getBigEventRsvpSheet_().appendRow([
    new Date(),
    String(data.event || "").slice(0, 80),
    String(data.eventTitle || "").slice(0, 120),
    String(data.name || "").slice(0, 80),
    String(data.coming || ""),
    Number(data.count || 0),
    String(data.answer || "").slice(0, 200),
    String(data.phone || "").slice(0, 30),
    String(data.note || "").slice(0, 300),
  ]);
}

/** Keeps one row per event on the Event Details tab, so past events stay listed. */
function upsertBigEventRow_(event) {
  var sheet = getBigEventDetailsSheet_();
  var eventId = bigEventId_(event);
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
    event.kicker,
    event.date,
    event.startTime,
    event.endTime,
    event.place,
    event.address,
    event.rsvpBy,
    event.paragraph,
    event.question,
    event.contact,
  ];
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
}

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

function jsonOutput_(payload, callback) {
  var json = JSON.stringify(payload);
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$.]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
