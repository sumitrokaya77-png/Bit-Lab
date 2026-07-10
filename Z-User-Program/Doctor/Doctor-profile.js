// State Tracking Container Coordinated via Selection Pipelines
let ActiveDoctorProfile = null;
let profileViewMode = "active"; // "active" (Standard booking/editing) or "historic" (Reporting context)
let globallySelectedTimestamp = null;
let targetedActiveBookingObject = null;

document.addEventListener("DOMContentLoaded", () => {
  unpackSharedStateContext();
  evaluateBookingConstraints();
  registerInteractionListeners();
});

/**
 * Reads local cached variables shared out from selection actions
 */
function unpackSharedStateContext() {
  const doctorData = localStorage.getItem("current_selected_doctor");
  const modeData = localStorage.getItem("doctor_profile_mode");

  if (doctorData) {
    ActiveDoctorProfile = JSON.parse(doctorData);
  } else {
    // Structural developer template fallback safety
    ActiveDoctorProfile = {
      id: "DOC_XYZ_9921",
      name: "Dr. Sophia XYZ",
      specialization: "Gynecologist & Obstetrician",
      contact: "+977-9851012345",
      cost: 1200,
      hours: "09:00 AM - 05:00 PM",
      openMinutes: 540,
      closeMinutes: 1020,
      profilePic: "doctor-pic.png",
      verificationPic: "verification-pic.png"
    };
  }

  profileViewMode = modeData || "active";

  // Bind parameters cleanly straight into document targets
  const doc = ActiveDoctorProfile;
  document.getElementById("header-doctor-title").innerText = doc.name;
  document.getElementById("profile-name-text").innerText = doc.name;
  document.getElementById("profile-spec-text").innerText = doc.specialization;
  document.getElementById("profile-contact-text").innerText = doc.contact;
  document.getElementById("profile-rate-display").innerText = `Rs. ${doc.cost.toLocaleString()} / hr`;
  document.getElementById("cost-calculation-rule-label").innerText = `Based on Rs. ${(doc.cost / 2).toLocaleString()} per 30-min block`;

  document.getElementById("profile-avatar-img").src = doc.profilePic;
  document.getElementById("profile-cert-trigger").src = doc.verificationPic;
}

/**
 * Handles appointment status evaluation (Problem 3.1 & 3.2 logic states)
 */
function evaluateBookingConstraints() {
  const appointments = JSON.parse(localStorage.getItem("doctor_appointments_registry") || "[]");
  
  // Locate if an active booking matches the profile's doctor id
  targetedActiveBookingObject = appointments.find(apt => apt.doctorId === ActiveDoctorProfile.id && apt.status !== "past");

  const schedulingBlock = document.getElementById("scheduling-interactive-block");
  const submitBtn = document.getElementById("btn-submit-appointment");
  const reportBtn = document.getElementById("btn-trigger-report");

  // Phase 1: Handle Problem 3.2 Past Historic Reporting Mode Check
  if (profileViewMode === "historic") {
    schedulingBlock.style.display = "none";
    submitBtn.style.display = "none";
    reportBtn.style.display = "block";
    return;
  }

  // Phase 2: Handle Standard Active Scheduling View Mode States
  reportBtn.style.display = "none";
  schedulingBlock.style.display = "block";

  if (targetedActiveBookingObject) {
    // An appointment already exists. Read the internal acceptance state string.
    const doctorSideAcceptance = (targetedActiveBookingObject.status === "accepted");

    if (doctorSideAcceptance) {
      // Condition B: Doctor has accepted -> Completely hide the action modification buttons
      submitBtn.style.display = "none";
    } else {
      // Condition A: Doctor hasn't accepted yet -> Transform into 'Edit Appointment'
      submitBtn.style.display = "block";
      submitBtn.innerText = "Edit Appointment";
      submitBtn.className = "primary-action-btn variant-alert"; // Visual change state indicator

      // Autofill inputs to show current parameters
      document.getElementById("time-start").value = targetedActiveBookingObject.timeWindow.split(" - ")[0] || "09:00";
      document.getElementById("time-end").value = targetedActiveBookingObject.timeWindow.split(" - ")[1] || "10:00";
    }
  } else {
    // Default Base State: No booking exists -> Standard configuration layout
    submitBtn.style.display = "block";
    submitBtn.innerText = "Set Appointment";
    submitBtn.className = "primary-action-btn";
  }

  // Populate horizontal date selection strips
  generateHorizontalRibbonTrack();
  runCalculationAndValidationEngine();
}

/**
 * Generates interactive horizontal scrollable date items
 */
function generateHorizontalRibbonTrack() {
  const track = document.getElementById("date-scroll-track");
  track.innerHTML = "";
  const monthsShort = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const baseDate = new Date();

  for (let i = 0; i < 13; i++) {
    const loopDate = new Date();
    loopDate.setDate(baseDate.getDate() + i);

    const pill = document.createElement("div");
    pill.className = "date-pill";
    pill.dataset.timestamp = loopDate.getTime();
    pill.dataset.deltaDays = i;

    pill.innerHTML = `
      <span class="pill-month">${monthsShort[loopDate.getMonth()]}</span>
      <span class="pill-daynum">${loopDate.getDate()}</span>
    `;

    pill.addEventListener("click", () => {
      pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });

    track.appendChild(pill);
  }

  const viewport = document.getElementById("date-picker-viewport");
  viewport.addEventListener("scroll", debounceScrollCalculations);
  
  // Set initial default focus assignment parameters safely
  setTimeout(() => {
    let initialTarget = track.children[0];
    
    // If editing, find matching pill node if visible inside range parameters
    if (targetedActiveBookingObject) {
      const match = Array.from(track.children).find(p => {
        const d = new Date(parseInt(p.dataset.timestamp)).toISOString().split('T')[0];
        return d === targetedActiveBookingObject.date;
      });
      if(match) initialTarget = match;
    }

    if(initialTarget) {
      initialTarget.classList.add("selected");
      globallySelectedTimestamp = parseInt(initialTarget.dataset.timestamp);
      initialTarget.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
  }, 100);
}

let scrollTimeoutId = null;
function debounceScrollCalculations() {
  clearTimeout(scrollTimeoutId);
  scrollTimeoutId = setTimeout(evaluateCenteredPillNode, 40);
}

function evaluateCenteredPillNode() {
  const viewport = document.getElementById("date-picker-viewport");
  const track = document.getElementById("date-scroll-track");
  const pills = track.getElementsByClassName("date-pill");
  const viewportCenter = viewport.getBoundingClientRect().left + (viewport.offsetWidth / 2);

  let closestPill = null;
  let minimumDistance = Infinity;

  for (let pill of pills) {
    const pillCenter = pill.getBoundingClientRect().left + (pill.offsetWidth / 2);
    const currentDistance = Math.abs(viewportCenter - pillCenter);

    if (currentDistance < minimumDistance) {
      minimumDistance = currentDistance;
      closestPill = pill;
    }
  }

  if (closestPill && !closestPill.classList.contains("selected")) {
    for (let pill of pills) pill.classList.remove("selected");
    closestPill.classList.add("selected");
    globallySelectedTimestamp = parseInt(closestPill.dataset.timestamp);
    runCalculationAndValidationEngine();
  }
}

/**
 * Core validation engine logic block calculations
 */
function runCalculationAndValidationEngine() {
  if (profileViewMode === "historic") return false;

  const doc = ActiveDoctorProfile;
  const startVal = document.getElementById("time-start").value;
  const endVal = document.getElementById("time-end").value;

  const dateError = document.getElementById("date-error-label");
  const timeError = document.getElementById("time-error-label");
  const priceDisplay = document.getElementById("total-cost-output");

  let isFormValid = true;

  if (globallySelectedTimestamp) {
    const selectedDate = new Date(globallySelectedTimestamp);
    selectedDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);

    const deltaDays = Math.round((selectedDate - today) / (1000 * 60 * 60 * 24));
    if (deltaDays > 10 || deltaDays < 0) {
      dateError.style.display = "block";
      isFormValid = false;
    } else {
      dateError.style.display = "none";
    }
  }

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return -1;
    const [h, m] = timeStr.split(":").map(Number);
    return (h * 60) + m;
  };

  const startMin = parseTimeToMinutes(startVal);
  const endMin = parseTimeToMinutes(endVal);
  const duration = endMin - startMin;

  // Verify operating constraints bounds match clinical availability
  if (startMin < doc.openMinutes || endMin > doc.closeMinutes || duration <= 0) {
    timeError.style.display = "block";
    priceDisplay.innerText = "Rs. 0";
    isFormValid = false;
  } else {
    timeError.style.display = "none";
    const blockRate = doc.cost / 2;
    const billableBlocks = Math.ceil(duration / 30);
    const dynamicCost = billableBlocks * blockRate;
    priceDisplay.innerText = `Rs. ${dynamicCost.toLocaleString()}`;
  }

  return isFormValid;
}

/**
 * Processes unified appointment updates or submissions
 */
function processAppointmentSubmission() {
  const isValid = runCalculationAndValidationEngine();
  if (!isValid) return;

  const doc = ActiveDoctorProfile;
  const startVal = document.getElementById("time-start").value;
  const endVal = document.getElementById("time-end").value;
  const totalCost = document.getElementById("total-cost-output").innerText;
  const formattedDate = new Date(globallySelectedTimestamp).toISOString().split('T')[0];

  let appointments = JSON.parse(localStorage.getItem("doctor_appointments_registry") || "[]");

  if (targetedActiveBookingObject) {
    // Updating an existing appointment slot parameters map
    appointments = appointments.map(apt => {
      if (apt.id === targetedActiveBookingObject.id) {
        apt.date = formattedDate;
        apt.timeWindow = `${startVal} - ${endVal}`;
        apt.cost = totalCost;
      }
      return apt;
    });
    injectNotificationLog("Doctor Appointment", `Updated parameters for ${doc.name} to ${formattedDate} @ ${startVal}.`);
  } else {
    // Clean entry instantiation deployment profile
    const payload = {
      id: "APT_" + Date.now(),
      doctorId: doc.id,
      doctorName: doc.name,
      specialization: doc.specialization,
      date: formattedDate,
      timeWindow: `${startVal} - ${endVal}`,
      cost: totalCost,
      status: "pending"
    };
    appointments.push(payload);
    injectNotificationLog("Doctor Appointment", `(Doctor Appointment) your appointment is set to the doctor ${doc.name} at ${startVal} time.`);
  }

  localStorage.setItem("doctor_appointments_registry", JSON.stringify(appointments));
  window.location.href = "Select-doctor.html";
}

/**
 * Problem 3.2 Custom Diagnostic Misconduct Reporting Function
 */
function reportDoctor(doctorDetails, causeOfReport, extendedRemarks) {
  const abuseReportPayload = {
    reportId: "REP_" + Date.now(),
    timestamp: new Date().toISOString(),
    reportedDoctorId: doctorDetails.id,
    reportedDoctorName: doctorDetails.name,
    reportedDoctorSpecialization: doctorDetails.specialization,
    cause: causeOfReport,
    remarks: extendedRemarks
  };

  // Pull down ledger array or instantiate new data block
  const trackingLedger = JSON.parse(localStorage.getItem("doctor_abuse_reports_log") || "[]");
  trackingLedger.unshift(abuseReportPayload);
  localStorage.setItem("doctor_abuse_reports_log", JSON.stringify(trackingLedger));

  // Push confirmation logs to dashboard tracks
  injectNotificationLog("System Warning", `Official misconduct report filed against ${doctorDetails.name}. Incident recorded under ID: ${abuseReportPayload.reportId}.`);

  alert(`Thank you. Your incident report tracking ID (${abuseReportPayload.reportId}) has been logged for administrative investigation.`);
  
  // Return user back safely to primary selection layout view screen matrix
  window.location.href = "Select-doctor.html";
}

function handleReportModalSubmission() {
  const causeSelection = document.getElementById("report-reason-select").value;
  const userRemarks = document.getElementById("report-details-input").value.trim();

  if (userRemarks === "") {
    alert("Please provide clear statement remarks regarding your dispute.");
    return;
  }

  // Pass details directly down processing pipelines
  reportDoctor(ActiveDoctorProfile, causeSelection, userRemarks);
}

function injectNotificationLog(category, message) {
  const notifications = JSON.parse(localStorage.getItem("dashboard_notifications_registry") || "[]");
  notifications.unshift({ id: "NOTIF_" + Date.now(), category, message });
  localStorage.setItem("dashboard_notifications_registry", JSON.stringify(notifications));
}

function registerInteractionListeners() {
  document.getElementById("btn-back-nav").addEventListener("click", () => {
    window.location.href = "Select-doctor.html";
  });
  
  document.getElementById("time-start").addEventListener("input", runCalculationAndValidationEngine);
  document.getElementById("time-end").addEventListener("input", runCalculationAndValidationEngine);
  document.getElementById("btn-submit-appointment").addEventListener("click", processAppointmentSubmission);

  // Lightbox Triggers
  document.getElementById("profile-avatar-trigger").addEventListener("click", () => launchLightbox(ActiveDoctorProfile.profilePic));
  document.getElementById("profile-cert-trigger").addEventListener("click", () => launchLightbox(ActiveDoctorProfile.verificationPic));

  // Reporting Triggers
  document.getElementById("btn-trigger-report").addEventListener("click", () => {
    document.getElementById("report-modal").style.display = "flex";
  });
  document.getElementById("btn-close-report-modal").addEventListener("click", () => {
    document.getElementById("report-modal").style.display = "none";
  });
  document.getElementById("btn-confirm-report-submit").addEventListener("click", handleReportModalSubmission);
}

function launchLightbox(imgSrc) {
  const modal = document.getElementById("lightbox-modal");
  document.getElementById("lightbox-target-image").src = imgSrc;
  modal.style.display = "flex";
}

function dismissLightbox() {
  document.getElementById("lightbox-modal").style.display = "none";
}
