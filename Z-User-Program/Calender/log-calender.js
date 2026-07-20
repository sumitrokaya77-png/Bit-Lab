/* ═══════════════════════════════════════════════════════════
   log-calender.js
   JavaScript for the log period mini-calendar component.
   Used by: log-calender.html
   Connects to: date-picker.html (page navigation)
   Shared storage key: 'pc_period'

   localStorage format (MUST match date-picker.js):
   {
     pStart:       { y, m, d },   ← first day of period
     pEnd:         { y, m, d },   ← last day of period
     periodLength: Number,        ← days (pEnd - pStart + 1)
     logged:       Boolean        ← true = show stateLogged
   }
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══ CONSTANTS ══ */
  var STORAGE_KEY = 'pc_period';
  var PICKER_URL  = 'date-picker.html';   /* same folder */
  var CYCLE_DAYS  = 28;

  var SHORT = ['Jan','Feb','Mar','Apr','May','Jun',
               'Jul','Aug','Sep','Oct','Nov','Dec'];

  /* ══ PERIOD VARIABLES ══
     These mirror what is stored in localStorage.
     pStart / pEnd / periodLength / logged
  ══ */
  var pStart       = null;   /* { y, m, d } first day of period  */
  var pEnd         = null;   /* { y, m, d } last day of period   */
  var periodLength = 0;      /* total days in period              */
  var logged       = false;  /* true = stateLogged is shown       */

  /* user_period: true when *today* falls inside the logged pStart–pEnd
     range. Recomputed on every loadData()/render() pass. */
  var user_period = false;

  /* period_length: user's preferred default period length, used by
     date-picker.js's "Today" quick-button. null → default 5.
     (Stored/edited on the picker page; mirrored here for reference.) */
  var period_length = null;

  /* period_cycle_details: history of every period logged since account
     creation — [{ start:{y,m,d}, end:{y,m,d}, length:Number }, ...].
     Appended to whenever "Log period" is tapped. */
  var period_cycle_details = [];

  /* cycle_length: days used to predict the next period's start/end.
     null → default 28 (CYCLE_DAYS). */
  var cycle_length = null;

  /* ══ HELPERS ══ */
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  function ts(y, m, d) {
    return new Date(y, m, d).getTime();
  }

  function addDays(date, n) {
    var d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }

  function fmtShort(d) {
    return SHORT[d.getMonth()] + ' ' + d.getDate();
  }

  function ordinal(n) {
    var s = ['th', 'st', 'nd', 'rd'];
    var v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function daysInMonth(y, m)  { return new Date(y, m + 1, 0).getDate(); }
  function firstWeekday(y, m) { return new Date(y, m, 1).getDay(); }

  function isInPeriod(y, m, d) {
    if (!pStart || !pEnd) return false;
    var t = ts(y, m, d);
    return t >= ts(pStart.y, pStart.m, pStart.d) &&
           t <= ts(pEnd.y,   pEnd.m,   pEnd.d);
  }

  /* ══ PERSISTENCE ══ */

  /**
   * loadData()
   * Reads localStorage and populates pStart, pEnd,
   * periodLength, logged. Safe — won't crash if data is
   * missing or malformed.
   */
  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        pStart = pEnd = null;
        periodLength = 0;
        logged = false;
        period_length = null;
        period_cycle_details = [];
        cycle_length = null;
        user_period = false;
        return;
      }
      var d        = JSON.parse(raw);
      pStart       = d.pStart       || null;
      pEnd         = d.pEnd         || null;
      periodLength = d.periodLength || 0;
      logged       = d.logged       || false;

      period_length         = (typeof d.period_length === 'number') ? d.period_length : null;
      period_cycle_details  = d.period_cycle_details || [];
      cycle_length          = (typeof d.cycle_length === 'number') ? d.cycle_length : null;

      /* user_period is derived, not stored — recompute from pStart/pEnd */
      user_period = false;
      if (pStart && pEnd) {
        var tNow = today.getTime();
        var tS   = ts(pStart.y, pStart.m, pStart.d);
        var tE   = ts(pEnd.y,   pEnd.m,   pEnd.d);
        user_period = (tNow >= tS && tNow <= tE);
      }
    } catch (e) {
      pStart = pEnd = null;
      periodLength = 0;
      logged = false;
      period_length = null;
      period_cycle_details = [];
      cycle_length = null;
      user_period = false;
    }
  }

  /**
   * saveData()
   * Writes current variables back to localStorage.
   */
  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      pStart               : pStart,
      pEnd                 : pEnd,
      periodLength         : periodLength,
      logged               : logged,
      period_length        : period_length,
      period_cycle_details : period_cycle_details,
      cycle_length         : cycle_length
    }));
  }

  /* ══ RENDER: MINI CALENDAR ══ */

  function renderMiniCal() {
    var lbl  = document.getElementById('miniLbl');
    var grid = document.getElementById('miniGrid');
    grid.innerHTML = '';

    /* Use period start month, or current month if no data */
    var refY = pStart ? pStart.y : today.getFullYear();
    var refM = pStart ? pStart.m : today.getMonth();

    lbl.textContent = SHORT[refM] + ' ' + refY;

    var fd    = firstWeekday(refY, refM);
    var dim   = daysInMonth(refY, refM);
    var total = Math.ceil((fd + dim) / 7) * 7;
    var tKey  = ts(today.getFullYear(), today.getMonth(), today.getDate());

    for (var i = 0; i < total; i++) {
      var c = document.createElement('div');

      if (i < fd || i >= fd + dim) {
        /* Empty cell — outside current month */
        c.className = 'mc em';
      } else {
        var day = i - fd + 1;
        c.className =
          'mc' +
          (isInPeriod(refY, refM, day) ? ' pd' : '') +
          (ts(refY, refM, day) === tKey ? ' td' : '');
        c.textContent = day;
      }

      grid.appendChild(c);
    }
  }

  /* ══ RENDER: LOGGED BOX ══ */

  function renderLoggedBox() {
    var box     = document.getElementById('loggedBox');
    var todayTs = today.getTime();
    var s = new Date(pStart.y, pStart.m, pStart.d);
    var e = new Date(pEnd.y,   pEnd.m,   pEnd.d);
    var cLen = (cycle_length == null) ? CYCLE_DAYS : cycle_length;

    if (user_period) {
      /* ── Period is happening right now ── */
      var dayNum  = Math.round((todayTs - s.getTime()) / 86400000) + 1;
      var dLeft   = Math.round((e.getTime() - todayTs) / 86400000);
      var leftTxt = dLeft === 0
        ? 'Last day'
        : dLeft + ' day' + (dLeft === 1 ? '' : 's') + ' left';

      box.innerHTML =
        '<p class="lg-period">Period</p>'               +
        '<p class="lg-day">'  + ordinal(dayNum) + ' day</p>' +
        '<p class="lg-left">' + leftTxt         + '</p>' +
        '<p class="lg-range">' + fmtShort(s) + ' to ' + fmtShort(e) + '</p>';

    } else if (todayTs < s.getTime()) {
      /* ── Period hasn't started yet ── */
      var dUntil = Math.round((s.getTime() - todayTs) / 86400000);

      box.innerHTML =
        '<p class="up-days">'  + dUntil + '</p>'                   +
        '<p class="up-label">days until your period</p>'           +
        '<p class="up-range">' + fmtShort(s) + ' to ' + fmtShort(e) + '</p>';

    } else {
      /* ── Period has ended — predict next cycle ──
         nextStart = pStart + CYCLE_DAYS
         nextEnd   = pEnd   + CYCLE_DAYS            */
      var nextStart = addDays(s, cLen);
      var nextEnd   = addDays(e, cLen);
      var dNext     = Math.max(
        0,
        Math.round((nextStart.getTime() - todayTs) / 86400000)
      );

      box.innerHTML =
        '<p class="up-days">'  + dNext + '</p>'                         +
        '<p class="up-label">days until your next period</p>'           +
        '<p class="up-range">'                                           +
          'Predicted ' + fmtShort(nextStart) + ' to ' + fmtShort(nextEnd) +
          '<br>'                                                          +
          '<small style="font-size:12px;color:#FF62C3;font-weight:600;">' +
            'Based on ' + periodLength + '-day period · '                +
            cLen + '-day cycle'                                           +
          '</small>'                                                      +
        '</p>';
    }
  }

  /* ══ MAIN RENDER ══
     Decides which state to show based on `logged` flag.
  ══ */

  function render() {
    var stateReady  = document.getElementById('stateReady');
    var stateLogged = document.getElementById('stateLogged');
    var btnLog      = document.getElementById('btnLog');

    if (logged && pStart) {
      /* ── Show logged state: prediction text + edit button ── */
      stateReady.style.display  = 'none';
      stateLogged.style.display = 'block';
      renderLoggedBox();

    } else {
      /* ── Show ready state: mini calendar + log button ── */
      stateReady.style.display  = 'block';
      stateLogged.style.display = 'none';
      renderMiniCal();

      /* btnLog stays clickable at all times:
         - no dates selected  → tap routes to the picker (see click handler)
         - dates selected     → tap logs the period
         Only the visual "muted" look changes with hasDates; the button
         itself must never be natively disabled or its click won't fire. */
      var hasDates = !!pStart;
      btnLog.disabled      = false;
      btnLog.style.opacity = hasDates ? '1' : '0.6';
      btnLog.style.cursor  = 'pointer';
    }
  }

  /* ══ OPEN PICKER ══
     Navigate to date-picker.html (same folder).
     On return, visibilitychange re-renders.
  ══ */

  function openPicker() {
    window.top.location.href ="../Calender/date-picker.html";
  }

  /* ══ EVENTS ══ */

  /* Tapping the mini calendar → open picker */
  var miniCal = document.getElementById('miniCal');
  miniCal.addEventListener('click', openPicker);
  miniCal.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  });

  /* Log Period button */
  document.getElementById('btnLog').addEventListener('click', function () {
    if (!pStart) {
      /* No dates selected yet → open picker first */
      openPicker();
      return;
    }
    /* Record this period in the history log, then mark as logged
       → show stateLogged */
    period_cycle_details.push({
      start  : pStart,
      end    : pEnd,
      length : periodLength
    });
    logged = true;
    saveData();
    render();
  });

  /* Edit Period button → go back to picker */
  document.getElementById('btnEdit').addEventListener('click', openPicker);

  /* ══ AUTO-SYNC ══
     When user navigates back from date-picker.html,
     visibilitychange fires → re-read localStorage → re-render.
  ══ */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      loadData();
      render();
    }
  });

  /* Also catch storage events if the page is open in multiple tabs */
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) {
      loadData();
      render();
    }
  });

  /* ══ INIT ══ */
  loadData();
  render();
  
})();
