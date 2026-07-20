/* ═══════════════════════════════════════════════════════════
   date-picker.js
   Full-screen period date picker.
   Used by: date-picker.html
   Returns to: log-calender.html (history.back)
   Shared storage key: 'pc_period'

   localStorage format (MUST match log-calender.js):
   {
     pStart:       { y, m, d },   ← first day of period
     pEnd:         { y, m, d },   ← last day of period
     periodLength: Number,        ← days (pEnd - pStart + 1)
     logged:       Boolean        ← true = log-calender shows stateLogged
   }

   On Confirm → saves dates with logged: false → history.back()
                (log-calender.js sets logged: true when "Log period" is tapped)
   On Cancel  → history.back() without saving
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══ CONSTANTS ══ */
  var STORAGE_KEY    = 'pc_period';
  var LOG_URL        = 'log-calender.html';  /* fallback if no history */
  var DEF_PERIOD_LEN = 5;
  var MAX_PAST_DAYS  = 15;
  var ITEM_H         = 40;
  var YR_START       = 2018;
  var YR_END         = 2035;

  var MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  var SHORT = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  /* ══ PERIOD VARIABLES ══ */
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var periodStart  = null;   /* { y, m, d } selection start */
  var periodEnd    = null;   /* { y, m, d } selection end   */
  var periodLength = 0;      /* days in range               */

  /* period_length: user's preferred default period length used by
     the "Today" quick-button. null → falls back to DEF_PERIOD_LEN (5). */
  var period_length = null;

  /* Picker navigation state */
  var pickerMonth = today.getMonth();
  var pickerYear  = today.getFullYear();

  /* ══ HELPERS ══ */
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

  function daysInMonth(y, m)  { return new Date(y, m + 1, 0).getDate(); }
  function firstWeekday(y, m) { return new Date(y, m, 1).getDay(); }

  function isStart(y, m, d) {
    return periodStart &&
      periodStart.y === y &&
      periodStart.m === m &&
      periodStart.d === d;
  }

  function isEnd(y, m, d) {
    return periodEnd &&
      periodEnd.y === y &&
      periodEnd.m === m &&
      periodEnd.d === d;
  }

  function isInRange(y, m, d) {
    if (!periodStart || !periodEnd) return false;
    var t = ts(y, m, d);
    return t >= ts(periodStart.y, periodStart.m, periodStart.d) &&
           t <= ts(periodEnd.y,   periodEnd.m,   periodEnd.d);
  }

  /* ══ 15-DAY VALIDATION ══
     Period end date must not be more than MAX_PAST_DAYS ago.
  ══ */
  function getValidationError() {
    if (!periodStart || !periodEnd) return null;
    var endDate = new Date(periodEnd.y, periodEnd.m, periodEnd.d);
    var daysAgo = Math.round((today.getTime() - endDate.getTime()) / 86400000);
    if (daysAgo > MAX_PAST_DAYS) {
      return 'Period end date is ' + daysAgo + ' days ago. ' +
             'Please select a date within the last ' + MAX_PAST_DAYS + ' days.';
    }
    return null;
  }

  function isDayTooOld(y, m, d) {
    return Math.round((today.getTime() - ts(y, m, d)) / 86400000) > MAX_PAST_DAYS;
  }

  /* ══ UI STATE: error message + confirm button ══ */
  function updateControls() {
    var errEl = document.getElementById('valError');
    var btn   = document.getElementById('btnConfirm');
    var err   = getValidationError();
    var valid = !!periodStart && !err;

    /* Error box */
    if (err) {
      errEl.textContent   = err;
      errEl.style.display = 'block';
    } else {
      errEl.style.display = 'none';
    }

    /* Confirm button */
    btn.disabled      = !valid;
    btn.style.opacity = valid ? '1' : '0.38';
  }

  /* ══ RANGE INFO TEXT ══ */
  function updateRangeInfo() {
    var el = document.getElementById('rangeInfo');
    if (!periodStart || !periodEnd) {
      el.textContent = 'Tap a date to begin';
      return;
    }
    var s   = new Date(periodStart.y, periodStart.m, periodStart.d);
    var e   = new Date(periodEnd.y,   periodEnd.m,   periodEnd.d);
    periodLength = Math.round((e - s) / 86400000) + 1;
    el.textContent =
      fmtShort(s) + ' — ' + fmtShort(e) +
      ' (' + periodLength + ' day' + (periodLength === 1 ? '' : 's') + ')';
  }

  /* ══ DATE CLICK — extend / shrink range with auto gap-fill ══
     Rules:
     - First tap         → set start = end = tapped day
     - Tap before start  → extend start backward (gap fills automatically)
     - Tap after end     → extend end forward   (gap fills automatically)
     - Tap on start only → deselect if single day; else shrink from start
     - Tap on end        → shrink from end
     - Tap inside range  → reset to new single-day selection
  ══ */
  function onDayClick(y, m, d) {
    var clicked = ts(y, m, d);

    if (!periodStart) {
      periodStart = { y:y, m:m, d:d };
      periodEnd   = { y:y, m:m, d:d };

    } else {
      var s = ts(periodStart.y, periodStart.m, periodStart.d);
      var e = ts(periodEnd.y,   periodEnd.m,   periodEnd.d);

      if (clicked < s) {
        /* Extend backward */
        periodStart = { y:y, m:m, d:d };

      } else if (clicked > e) {
        /* Extend forward — any skipped days auto-fill */
        periodEnd = { y:y, m:m, d:d };

      } else if (clicked === s && s === e) {
        /* Single day selected → tap again to deselect */
        periodStart  = null;
        periodEnd    = null;
        periodLength = 0;

      } else if (clicked === s) {
        /* Shrink from start: move start forward 1 day */
        var nd = addDays(new Date(y, m, d), 1);
        periodStart = { y: nd.getFullYear(), m: nd.getMonth(), d: nd.getDate() };

      } else if (clicked === e) {
        /* Shrink from end: move end back 1 day */
        var pd = addDays(new Date(y, m, d), -1);
        periodEnd = { y: pd.getFullYear(), m: pd.getMonth(), d: pd.getDate() };

      } else {
        /* Inside range → reset to this day */
        periodStart = { y:y, m:m, d:d };
        periodEnd   = { y:y, m:m, d:d };
      }
    }

    renderPickerGrid();
    updateRangeInfo();
    updateControls();
  }

  /* ══ RENDER PICKER GRID ══ */
  function renderPickerGrid() {
    var grid  = document.getElementById('pdGrid');
    grid.innerHTML = '';

    var fd    = firstWeekday(pickerYear, pickerMonth);
    var dim   = daysInMonth(pickerYear, pickerMonth);
    var total = Math.ceil((fd + dim) / 7) * 7;
    var tKey  = ts(today.getFullYear(), today.getMonth(), today.getDate());

    for (var i = 0; i < total; i++) {
      var cell = document.createElement('div');

      if (i < fd || i >= fd + dim) {
        /* Empty spacer outside current month */
        cell.className = 'pd-cell em';

      } else {
        var day    = i - fd + 1;
        var y      = pickerYear;
        var m      = pickerMonth;
        var d      = day;
        var tooOld = isDayTooOld(y, m, d);

        cell.className =
          'pd-cell' +
          (isStart(y,m,d) ? ' sel-start' :
           isEnd(y,m,d)   ? ' sel-end'   :
           isInRange(y,m,d)? ' sel-mid'  : '') +
          (ts(y,m,d) === tKey ? ' td'      : '') +
          (tooOld             ? ' invalid' : '');

        cell.textContent = day;

        if (!tooOld) {
          /* Closure to capture correct y/m/d for each cell */
          (function (yy, mm, dd) {
            cell.addEventListener('click', function () {
              onDayClick(yy, mm, dd);
            });
          })(y, m, d);
        }
      }

      grid.appendChild(cell);
    }
  }

  /* ══ MONTH LABEL ══ */
  function updateMonthLabel() {
    document.getElementById('mnLabel').textContent =
      MONTHS[pickerMonth] + ' ' + pickerYear;
  }

  /* ══ YEAR WHEEL ══ */
  function syncWheel() {
    var wheel = document.getElementById('yrWheel');
    wheel.scrollTop = (pickerYear - YR_START) * ITEM_H;
    wheel.querySelectorAll('.yr-item').forEach(function (el) {
      var isAct = parseInt(el.dataset.year, 10) === pickerYear;
      el.classList.toggle('yr-active', isAct);
      el.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });
  }

  function buildYearWheel() {
    var wheel = document.getElementById('yrWheel');
    wheel.innerHTML = '';

    /* Top padding so first item can center */
    var pad1 = document.createElement('div');
    pad1.style.height = ITEM_H + 'px';
    wheel.appendChild(pad1);

    for (var y = YR_START; y <= YR_END; y++) {
      var item = document.createElement('div');
      item.className    = 'yr-item' + (y === pickerYear ? ' yr-active' : '');
      item.textContent  = y;
      item.dataset.year = y;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', y === pickerYear ? 'true' : 'false');
      wheel.appendChild(item);
    }

    /* Bottom padding so last item can center */
    var pad2 = document.createElement('div');
    pad2.style.height = ITEM_H + 'px';
    wheel.appendChild(pad2);

    /* Scroll to current year */
    wheel.scrollTop = (pickerYear - YR_START) * ITEM_H;

    /* Scroll event → update year */
    var scrollTimer;
    wheel.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var idx = Math.round(wheel.scrollTop / ITEM_H);
        var yr  = Math.min(Math.max(YR_START + idx, YR_START), YR_END);
        if (yr === pickerYear) return;
        pickerYear = yr;
        syncWheel();
        updateMonthLabel();
        renderPickerGrid();
        updateControls();
      }, 80);
    });
  }

  /* ══ MONTH NAV BUTTONS ══ */
  document.getElementById('mnPrev').addEventListener('click', function () {
    pickerMonth--;
    if (pickerMonth < 0) { pickerMonth = 11; pickerYear--; syncWheel(); }
    updateMonthLabel();
    renderPickerGrid();
  });

  document.getElementById('mnNext').addEventListener('click', function () {
    pickerMonth++;
    if (pickerMonth > 11) { pickerMonth = 0; pickerYear++; syncWheel(); }
    updateMonthLabel();
    renderPickerGrid();
  });

  /* ══ TODAY BUTTON ══
     Resets selection to today → today + DEF_PERIOD_LEN - 1
  ══ */
  document.getElementById('btnToday').addEventListener('click', function () {
    var len = (period_length == null) ? DEF_PERIOD_LEN : period_length;
    var end = addDays(today, len - 1);
    periodStart = { y: today.getFullYear(), m: today.getMonth(), d: today.getDate() };
    periodEnd   = { y: end.getFullYear(),   m: end.getMonth(),   d: end.getDate()   };
    pickerYear  = today.getFullYear();
    pickerMonth = today.getMonth();
    syncWheel();
    updateMonthLabel();
    renderPickerGrid();
    updateRangeInfo();
    updateControls();
  });

  /* ══ RESET BUTTON ══
     Clears all selected dates.
  ══ */
  document.getElementById('btnReset').addEventListener('click', function () {
    periodStart  = null;
    periodEnd    = null;
    periodLength = 0;
    renderPickerGrid();
    updateRangeInfo();
    updateControls();
  });

  /* ══ CANCEL BUTTON ══
     Go back without saving — logged state unchanged.
  ══ */
  document.getElementById('btnCancel').addEventListener('click', function () {
    goBack();
  });

  /* ══ CONFIRM BUTTON ══
     Validates, saves to localStorage with logged: true,
     then navigates back to log-calender.html.
     Setting logged: true causes log-calender to show
     stateLogged automatically on return.
  ══ */
  document.getElementById('btnConfirm').addEventListener('click', function () {
    if (!periodStart || !periodEnd) return;
    var err = getValidationError();
    if (err) return;

    /* Recalculate period length before saving */
    var s = new Date(periodStart.y, periodStart.m, periodStart.d);
    var e = new Date(periodEnd.y,   periodEnd.m,   periodEnd.d);
    periodLength = Math.round((e - s) / 86400000) + 1;

    /* Save selected dates only. logged stays false here — the mini
       calendar on log-calender.html must show this new range and wait
       for an explicit tap on "Log period" before stateLogged appears.
       (log-calender.js owns the transition to logged: true.) */
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      pStart       : periodStart,
      pEnd         : periodEnd,
      periodLength : periodLength,
      logged       : false
    }));

    goBack();
  });

  /* ══ NAVIGATION ══ */
  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      /* Fallback if no browser history (e.g. opened directly) */
      window.location.href = LOG_URL;
    }
  }

  /* ══ LOAD EXISTING DATA ══
     Pre-populate picker if user already has a period logged.
     Reads the same pStart / pEnd keys as log-calender.js.
  ══ */
  function loadExisting() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);

      if (saved && saved.pStart) {
        periodStart  = saved.pStart;
        periodEnd    = saved.pEnd;
        periodLength = saved.periodLength || 0;
        pickerYear   = periodStart.y;
        pickerMonth  = periodStart.m;
      }
    } catch (e) {
      /* Ignore parse errors — start fresh */
    }
  }

  /* ══ INIT ══ */
  loadExisting();
  buildYearWheel();
  updateMonthLabel();
  renderPickerGrid();
  updateRangeInfo();
  updateControls();

})();
