//@OnlyCurrentDoc

// Note: A weekly trigger already runs `checkForNewEpisodes()` every Sunday between 02:00 and 03:00

function createMenu() {
  const ui = SpreadsheetApp.getUi();
  let customMenu = ui
    .createMenu('Custom')
    .addItem('Backup Spreadsheet', 'backupSpreadsheet')
    .addItem('Reset Filter', 'resetFilter')
    .addItem('Reset Last Run Date', 'resetLastRunDate')
    .addItem('Sort Sheet', 'sortActiveSheet')
    .addSeparator()
    .addItem('Backfill Last 7 Days', 'runBackfillLast7Days');
  /*
  .addSubMenu(ui.createMenu('Update Data Source(s)')
    .addItem('Update All', 'updateAllDataSources')
    .addItem('Data Source 1','updateFunction1')
    .addItem('Data Source 2','updateFunction2'));
  */
  customMenu.addToUi();
}

/**
 * Manual helper to run entry point function in case of error with time-triggered version.
 */
const LAST_RUN_DATE_PROP = 'LAST_RUN_DATE';
const INITIAL_LAST_RUN_DATE_LOCAL = new Date('2026-06-28T02:48:00');

function runBackfillLast7Days() {
  checkForNewEpisodes(7, true);
}

function getLastRunDate() {
  const props = PropertiesService.getScriptProperties();
  const stored = props.getProperty(LAST_RUN_DATE_PROP);

  if (stored) {
    const parsed = new Date(stored);
    if (!isNaN(parsed.getTime())) {
      Logger.log(`Using stored last run date: ${parsed.toISOString()}`);
      return parsed;
    }
    Logger.log(`Stored last run date invalid: ${stored}`);
  }

  const initialDate = new Date(INITIAL_LAST_RUN_DATE_LOCAL);
  if (!isNaN(initialDate.getTime())) {
    props.setProperty(LAST_RUN_DATE_PROP, initialDate.toISOString());
    Logger.log(`Initialized ${LAST_RUN_DATE_PROP} to ${initialDate.toISOString()}`);
    return initialDate;
  }

  const fallback = new Date();
  fallback.setDate(fallback.getDate() - 7);
  Logger.log(`Fallback last run date used: ${fallback.toISOString()}`);
  return fallback;
}

function resetLastRunDate() {
  const initialDate = new Date(INITIAL_LAST_RUN_DATE_LOCAL);
  if (isNaN(initialDate.getTime())) {
    throw new Error('Invalid initial last run date');
  }
  setLastRunDate(initialDate);
  SpreadsheetApp.getUi().alert(`Last run date reset to ${initialDate.toISOString()}`);
}

function setLastRunDate(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return;
  }
  PropertiesService.getScriptProperties().setProperty(LAST_RUN_DATE_PROP, date.toISOString());
  Logger.log(`Updated ${LAST_RUN_DATE_PROP} to ${date.toISOString()}`);
}

// ======================================================================
// 1️⃣ Entry Points (Top of file) “What runs?”
// ======================================================================

/**
 * Main entry point — checks for new podcast episodes since the last run.
 */
function checkForNewEpisodes(forceBackfillDays = null, forceSendAll = false) {
  // Guard against GAS time trigger passing event object as first argument
  if (typeof forceBackfillDays !== 'number') {
    forceBackfillDays = null;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Podcasts');
  const data = sheet.getDataRange().getValues();

  const header = data[0];
  const rows = data.slice(1);

  const COL_SHOW_ID = header.indexOf('Spotify Show ID');
  const COL_NAME = header.indexOf('Podcast Name');
  const COL_LAST_DATE = header.indexOf('Last Episode Date');
  const COL_LISTENER = header.indexOf('Listener');

  if (COL_SHOW_ID === -1 || COL_NAME === -1 || COL_LAST_DATE === -1) {
    throw new Error('Missing required columns in Podcasts sheet');
  }

  let allListeners = new Set();
  let episodesByListener = {};

  rows.forEach((row, index) => {
    // ✅ CLEAN INPUTS (CRITICAL FIX)
    let showIdRaw = row[COL_SHOW_ID];
    let showId = showIdRaw ? String(showIdRaw).trim() : '';

    const name = row[COL_NAME];
    const lastDateRaw = row[COL_LAST_DATE];
    Logger.log(
      `${showId} | lastDateRaw type: ${typeof lastDateRaw} | value: ${lastDateRaw} | isDate: ${lastDateRaw instanceof Date}`
    );
    const listenerCode = row[COL_LISTENER];

    if (!showId) {
      Logger.log(`Row ${index + 2} skipped — empty showId`);
      return;
    }

    // =========================================================
    // ✅ FINAL: BULLETPROOF DATE PARSING + FULL DEBUG
    // =========================================================
    let lastDate = null;
    let parseSource = typeof lastDateRaw;

    try {
      if (lastDateRaw instanceof Date) {
        const t = lastDateRaw.getTime();
        if (!isNaN(t)) {
          lastDate = new Date(t);
          parseSource = 'Date';
        }
      } else if (typeof lastDateRaw === 'number' && lastDateRaw > 0) {
        // Google Sheets serial → JS Date
        const d = new Date((lastDateRaw - 25569) * 86400 * 1000);
        const adjusted = new Date(d.getTime() + d.getTimezoneOffset() * 60000);

        if (!isNaN(adjusted.getTime())) {
          lastDate = adjusted;
          parseSource = 'number(serial)';
        }
      } else if (typeof lastDateRaw === 'string') {
        const trimmed = lastDateRaw.trim();

        if (trimmed) {
          const d = new Date(trimmed);
          if (!isNaN(d.getTime())) {
            lastDate = d;
            parseSource = 'string';
          }
        }
      }
    } catch (err) {
      Logger.log(`${showId} | ERROR parsing date: ${err}`);
      lastDate = null;
    }

    // 🚨 CRITICAL: enforce validity AFTER parsing
    const isValid =
      lastDate instanceof Date && !isNaN(lastDate.getTime()) && lastDate.getFullYear() > 2000; // guard against garbage dates

    if (!isValid) {
      Logger.log(
        `${showId} | INVALID lastDateRaw: ${lastDateRaw} (type: ${typeof lastDateRaw}) → parsed: ${lastDate}`
      );

      lastDate = null;
    } else {
      Logger.log(`${showId} | OK lastDate: ${lastDate} (from ${parseSource})`);
    }

    // =========================================================
    // ✅ FORCE SAFE cutoffDate
    // =========================================================
    let cutoffDate;

    if (forceBackfillDays !== null && forceBackfillDays !== undefined) {
      cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - forceBackfillDays);
    } else {
      cutoffDate = getLastRunDate();
    }

    // =========================================================
    // ✅ FINAL GUARANTEE (CRITICAL)
    // =========================================================
    if (!cutoffDate || isNaN(cutoffDate.getTime())) {
      Logger.log(`Invalid lastDate for show ${showId} — forcing fallback`);
      cutoffDate = new Date('2026-01-01');
    }

    // 🔒 FINAL HARD GUARD
    if (isNaN(cutoffDate.getTime())) {
      Logger.log(`🚨 STILL invalid cutoffDate for show ${showId}`);
      return;
    }

    Logger.log(`Processing ${showId} | cutoff: ${cutoffDate.toISOString()}`);

    // =========================================================
    // Fetch episodes
    // =========================================================
    const newEpisodes = getNewEpisodesForShow(showId, cutoffDate);

    if (!newEpisodes || newEpisodes.length === 0) return;

    // =========================================================
    // Assign to listeners
    // =========================================================
    const listeners = listenerCode
      ? String(listenerCode)
          .split(',')
          .map((s) => s.trim())
      : [];

    listeners.forEach((code) => {
      if (!code) return;

      allListeners.add(code);

      if (!episodesByListener[code]) {
        episodesByListener[code] = [];
      }

      episodesByListener[code].push({
        showName: name,
        episodes: newEpisodes,
      });
    });

    // =========================================================
    // Update last episode date
    // =========================================================
    try {
      const latestDate = newEpisodes[0].published;

      sheet.getRange(index + 2, COL_LAST_DATE + 1).setValue(new Date(latestDate));
    } catch (err) {
      Logger.log(`Failed updating date for ${showId}: ${err.message}`);
    }
  });

  // =========================================================
  // EMAIL DELIVERY
  // =========================================================
  if (!forceSendAll && allListeners.size === 0) {
    Logger.log('No new episodes found');
    setLastRunDate(new Date());
    return;
  }

  allListeners.forEach((listenerCode) => {
    const emailAddress = EMAILS_BY_LISTENER[listenerCode];

    if (!emailAddress) {
      Logger.log(`No email for listener ${listenerCode}`);
      return;
    }

    const content = episodesByListener[listenerCode] || [];

    if (!forceSendAll && content.length === 0) return;

    const emailBody = generateEmailContent(
      content.map((item) => ({
        podcastName: item.showName,
        episodes: item.episodes,
      })),
      []
    );

    MailApp.sendEmail({
      to: emailAddress,
      subject: '🎧 New Podcast Episodes',
      htmlBody: emailBody,
    });

    Logger.log(`✅ Email sent to ${listenerCode}`);
  });

  setLastRunDate(new Date());
}

// ======================================================================
// 2️⃣ Orchestration / Engines “How the process flows”
// ======================================================================

function processSheetWithRules(config) {
  validateConfig(config);

  const { sheet, beforeAll, beforeEach, processRow, afterEach, afterAll } = config;

  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return;

  const header = rows.shift();

  const context = {
    errors: [],
    retries: [],
    auditLogs: [], // ✅ NEW
  };

  if (beforeAll) beforeAll(context);

  rows.forEach((row, index) => {
    const rowObj = GASLibrary.rowToObject(header, row);

    try {
      if (beforeEach) beforeEach(rowObj, index, context);

      if (!context.skipRow && processRow) {
        processRow(rowObj, index, context);
      }

      if (afterEach) afterEach(rowObj, index, context);
    } catch (error) {
      const errorRecord = {
        rowIndex: index,
        rowData: rowObj,
        message: error.message,
        stack: error.stack,
      };

      context.errors.push(errorRecord);

      // ✅ Audit log error
      context.auditLogs.push({
        level: 'ERROR',
        message: error.message,
        rowIndex: index,
        context: rowObj,
      });

      if (config.enableRetry) {
        context.retries.push({
          rowIndex: index,
          rowObj,
        });
      }
    }
  });

  if (afterAll) {
    afterAll({ sheet, header }, context);
  }
}

function validateConfig(config) {
  if (!config) throw new Error('Config is required');

  if (!config.sheet) {
    throw new Error('Config must include a sheet');
  }

  if (typeof config.processRow !== 'function') {
    throw new Error('Config must include a processRow function');
  }
}

function retryFailedRows(config, retries, context) {
  retries.forEach(({ rowIndex, rowObj }) => {
    try {
      config.processRow(rowObj, context);
    } catch (err) {
      Logger.log(`Retry failed for row ${rowIndex}: ${err.message}`);
    }
  });
}

// ======================================================================
// 3️⃣ Domain Logic “What this script actually does”
// ======================================================================

/**
 * Fetches ALL new episodes from Spotify published after a given date.
 * - Pagination-safe
 * - Hard stops at cutoff (no historical backfill)
 * - Minimal, targeted logging
 */
function getNewEpisodesForShow(showId, cutoffDate) {
  try {
    // 🔒 HARD GUARD (important)
    if (!showId || typeof showId !== 'string') {
      Logger.log(`Invalid showId: ${showId}`);
      return [];
    }

    if (!(cutoffDate instanceof Date) || isNaN(cutoffDate.getTime())) {
      Logger.log(`Invalid cutoffDate for show ${showId}`);
      return [];
    }

    const token = getSpotifyToken();

    let url = `https://api.spotify.com/v1/shows/${showId}/episodes?market=US&limit=50`;
    const options = {
      method: 'get',
      headers: { Authorization: 'Bearer ' + token },
    };

    let allNewEpisodes = [];
    let pageCount = 0;

    while (url) {
      pageCount++;

      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response.getContentText());

      if (!data.items || !Array.isArray(data.items)) {
        Logger.log(`Invalid API response for show ${showId}`);
        break;
      }

      for (let i = 0; i < data.items.length; i++) {
        const ep = data.items[i];

        if (!ep || !ep.release_date) continue;

        const releaseDate = new Date(ep.release_date);
        releaseDate.setHours(23, 59, 59, 999);

        // 🚨 HARD STOP — stop pagination when we hit older content
        if (releaseDate <= cutoffDate) {
          Logger.log(
            `${showId} | stopping pagination | episode: "${ep.name}" | release: ${ep.release_date} | cutoff: ${cutoffDate.toISOString()}`
          );

          return allNewEpisodes.sort((a, b) => new Date(b.published) - new Date(a.published));
        }

        // ✅ Only add NEW episodes
        allNewEpisodes.push({
          title: ep.name || 'Untitled',
          link: ep.external_urls?.spotify || '',
          published: ep.release_date,
        });
      }

      // 👉 Move pagination OUTSIDE the loop
      url = data.next;

      // Safety guard
      if (pageCount >= 10) {
        Logger.log(`Pagination safety stop for show ${showId}`);
        break;
      }
    }

    return allNewEpisodes.sort((a, b) => new Date(b.published) - new Date(a.published));
  } catch (error) {
    Logger.log(`Error fetching episodes for show ${showId}: ${error}`);
    return [];
  }
}

/**
 * Builds the HTML email content.
 */
function generateEmailContent(newEpisodesByPodcast, noNewPodcasts = []) {
  const styles = {
    container: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 10px;',
    mainTitle: 'color: #333; margin-bottom: 10px;',
    podcastSection: 'margin-bottom: 10px;',
    podcastTitle: 'color: #333; margin-bottom: 5px;',
    episodeCard: 'margin-bottom: 5px; border: 1px solid #ddd; padding: 8px; border-radius: 4px;',
    episodeTitle: 'color: #1DB954; text-decoration: none; font-weight: bold; font-size: 14px;',
    publishDate: 'color: #666; margin: 3px 0; font-size: 12px;',
    footer: 'margin-top: 20px; font-size: 12px; color: #666;',
  };

  let html = `<div style="${styles.container}">
    <h1 style="${styles.mainTitle}">New Podcast Episodes 🎙</h1>`;

  if (newEpisodesByPodcast.length > 0) {
    newEpisodesByPodcast.forEach(({ podcastName, episodes }) => {
      html += `<div style="${styles.podcastSection}">
        <h2 style="${styles.podcastTitle}">${podcastName}</h2>`;
      episodes.forEach((ep) => {
        html += `<div style="${styles.episodeCard}">
            <a href="${ep.link}" style="${styles.episodeTitle}">${ep.title}</a>
            <p style="${styles.publishDate}">Published: ${ep.published}</p>
          </div>`;
      });
      html += `</div>`;
    });
  } else {
    html += `<p style="${styles.publishDate}">No new episodes this time.</p>`;
  }

  if (noNewPodcasts.length > 0) {
    html += `
      <details style="margin-top: 15px;">
        <summary style="font-weight: bold; color: #333;">No new podcasts released</summary>
        <ul style="margin-top: 8px; padding-left: 20px; color: #555;">
          ${noNewPodcasts.map((name) => `<li>${name}</li>`).join('')}
        </ul>
      </details>
    `;
  }

  html += `
    <p style="${styles.footer}">
      View full log in 
      <a href="https://docs.google.com/spreadsheets/d/1yhGobh8qWhmuq5CFZSRmrnZd_wG8dMbC6BC_Bo29Tu0/edit?gid=0#gid=0"
         style="color: #1DB954; text-decoration: none; font-weight: bold;">
        Monitor Spotify Podcast Updates
      </a>
    </p></div>`;

  return html;
}

/**
 * Sends the formatted HTML email to the listener.
 */
function sendNotificationEmail(recipient, htmlContent) {
  MailApp.sendEmail({
    to: recipient,
    subject: 'New Podcast Episodes 🎙',
    htmlBody: htmlContent,
  });
}

// ======================================================================
// 4️⃣ External Services / APIs “Talking to the outside world”
// ======================================================================

/**
 * Retrieves and caches a Spotify API access token.
 */
function getSpotifyToken() {
  const props = PropertiesService.getScriptProperties();
  const clientId = props.getProperty('SPOTIFY_CLIENT_ID');
  const clientSecret = props.getProperty('SPOTIFY_CLIENT_SECRET');
  if (!clientId || !clientSecret) throw new Error('Spotify credentials missing');

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const options = {
    method: 'post',
    payload: { grant_type: 'client_credentials' },
    headers: { Authorization: 'Basic ' + Utilities.base64Encode(clientId + ':' + clientSecret) },
  };
  const response = UrlFetchApp.fetch(tokenUrl, options);
  return JSON.parse(response.getContentText()).access_token;
}

// ======================================================================
// 5️⃣ Utilities / Helpers “Reusable building blocks”
// ======================================================================

function getOrCreateAuditSheet(ss) {
  const sheetName = 'AuditLog';
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(['Timestamp', 'Level', 'Message', 'Row Index', 'Context']);
  }

  return sheet;
}

function writeAuditLogs(sheet, logs) {
  if (!logs || logs.length === 0) return;

  const values = logs.map((log) => [
    new Date(),
    log.level || 'INFO',
    log.message || '',
    log.rowIndex ?? '',
    log.context ? JSON.stringify(log.context) : '',
  ]);

  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
}

/**
 * Batch writes multiple row updates to a sheet using a row-centric structure.
 *
 * Each update represents a row and a set of columnName → value mappings.
 * This function efficiently groups updates by column and writes them in batches.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 *   The target sheet.
 *
 * @param {string[]} header
 *   Array of column names (header row).
 *
 * @param {Array<{rowIndex: number, values: Object}>} updates
 *   Array of updates in the form:
 *     {
 *       rowIndex: 0,
 *       values: {
 *         'Status': 'Done',
 *         'Score': 95
 *       }
 *     }
 *
 * @returns {void}
 *
 * @example
 * batchSetRowValues(sheet, header, [
 *   { rowIndex: 0, values: { Status: 'Done', Score: 95 } },
 *   { rowIndex: 1, values: { Status: 'Pending' } }
 * ]);
 *
 * @notes
 * - Groups writes by column to minimise calls to setValues()
 * - Assumes rowIndex is zero-based relative to data rows
 * - Header is row 1, so data starts at row 2
 */
function batchSetRowValues(sheet, header, updates) {
  if (!updates || updates.length === 0) return;

  const colMap = header.reduce((map, name, i) => {
    map[name] = i;
    return map;
  }, {});

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  updates.forEach(({ rowIndex, values: rowValues }) => {
    Object.entries(rowValues).forEach(([columnName, value]) => {
      const colIndex = colMap[columnName];
      if (colIndex === undefined) return;

      values[rowIndex + 1][colIndex] = value;
    });
  });

  dataRange.setValues(values);
}
