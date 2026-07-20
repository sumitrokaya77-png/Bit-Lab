// Global Scope Runtime Context Targets
let ActiveDoctorProfile = null;
let LinkedBookingRecord = null;
let globallySelectedTimestamp = null;
let currentViewContextMode = "active"; // Context options: "active" | "historic"

document.addEventListener("DOMContentLoaded", () => {
  resolveApplicationStateContext();
  generateHorizontalRibbonTrack();
  evaluateButtonVisibilityMatrix();
  registerInteractiveListeners();
  runCalculationAndValidationEngine();
});

/**
 * Grabs shared operational state parameters from localStorage
 */
function resolveApplicationStateContext() {
  const selectedDocData = localStorage.getItem("current_selected_doctor");
  const trackingMode = localStorage.getItem("profile_view_context_mode") || "active";
  
  currentViewContextMode = trackingMode;

  if (selectedDocData) {
    ActiveDoctorProfile = JSON.parse(selectedDocData);
  } else {
    // Structural production asset fallback trace
    ActiveDoctorProfile = {
      id: "DOC_XYZ_9921",
      name: "Dr. Sophia XYZ",
      specialization: "Gynecologist & Obstetrician",
      rating: "4.9 (142 reviews)",
      cost: 1200,
      contact: "+977-9851012345",
      hours: "09:00 AM - 05:00 PM",
      openMinutes: 540,
      closeMinutes: 1020,
      profilePic: "doctor-pic.png",
      verificationPic: "verification-pic.png"
    };
  }

  // Cross-reference existing bookings logs array values
  const appointments = JSON.parse(localStorage.getItem("doctor_appointments_registry") || "[]");
  LinkedBookingRecord = appointments.find(apt => apt.doctorId === ActiveDoctorProfile.id && apt.status !== "past");

  // DOM node value binding executions
  document.getElementById("header-doctor-title").innerText = ActiveDoctorProfile.name;
  document.getElementById("profile-name-text").innerText = ActiveDoctorProfile.name;
  document.getElementById("profile-spec-text").innerText = ActiveDoctorProfile.specialization;
  document.getElementById("profile-rating-display").innerText = `★ ${ActiveDoctorProfile.rating}`;
  document.getElementById("profile-rate-display").innerText = `Rs. ${ActiveDoctorProfile.cost.toLocaleString()} / hr`;
  document.getElementById("profile-contact-text").innerText = ActiveDoctorProfile.contact;
  document.getElementById("profile-avatar").src = ActiveDoctorProfile.profilePic;
  document.getElementById("profile-verification-cert").src = ActiveDoctorProfile.verificationPic;
  document.getElementById("cost-calculation-rule-label").innerText = `Based on Rs. ${(ActiveDoctorProfile.cost / 2).toLocaleString()} per 30-min window segment block`;

  // Hide calendar layout sections entirely if dealing with historical log lookups
  if (currentViewContextMode === "historic") {
    document.getElementById("scheduling-interactive-block").style.display = "none";
  }
}

/**
 * Evaluation Matrix for Problems 3.1, 3.2, and 3.3 State Configurations
 */
function evaluateButtonVisibilityMatrix() {
  const primaryBtn = document.getElementById("btn-primary-action-hub");
  const cancelBtn = document.getElementById("btn-secondary-action-hub");

  // Reset core element configurations
  primaryBtn.style.display = "none";
  primaryBtn.className = "action-btn-element btn-primary-action"; // reset classes
  cancelBtn.style.display = "none";

  // Configuration Category 1: Historic View Call Interceptions (Problem 3.2)
  if (currentViewContextMode === "historic") {
    primaryBtn.innerText = "Report Doctor";
    primaryBtn.classList.add("variant-report-mode");
    primaryBtn.style.display = "flex";
    return;
  }

  // Configuration Category 2: Active Timeline Verification Routes
  if (!LinkedBookingRecord) {
    // State A: Normal Booking Mode
    primaryBtn.innerText = "Set Appointment";
    primaryBtn.style.display = "flex";
  } else {
    // Call user-defined verification state function
    const isAccepted = doctorSideAcceptance(LinkedBookingRecord);

    if (!isAccepted) {
      // State B: Appointment Pending, Unaccepted (Problem 3.1 & 3.3)
      primaryBtn.innerText = "Edit Appointment";
      primaryBtn.style.display = "flex";
      
      cancelBtn.innerText = "Cancel Appointment";
      cancelBtn.style.display = "flex";
    } else {
      // State C: Appointment Formally Committed & Accepted
      primaryBtn.style.display = "none"; // Edit button disappears entirely
      
      cancelBtn.innerText = "Cancel Appointment";
      cancelBtn.style.display = "flex"; // Cancel remains active for penalty interception checks
    }
  }
}

/**
 * Core validation rule check requested in Problem 3.1
 */
function doctorSideAcceptance(appointmentObj) {
  if (!appointmentObj) return false;
  return appointmentObj.status === "accepted";
}

/**
 * Problem 3.3 Penalty Hook Stub Definition
 */
function processAppointmentCancellationPenalty() {
  // Enforce code constraints: Function intentionally left blank for developer formula insertion
}

/**
 * Primary Actions Redirection Routing Dispatch Hub
 */
function handlePrimaryButtonExecution() {
  if (currentViewContextMode === "historic") {
    launchReportingInterface();
    return;
  }

  if (!LinkedBookingRecord) {
    executeSetAppointmentWorkflow();
  } else {
    executeEditAppointmentWorkflow();
  }
}

/**
 * Problem 3.3 Cancellation Operational Flow Engine Interception
 */
function handleCancelButtonExecution() {
  if (!LinkedBookingRecord) return;

  let appointments = JSON.parse(localStorage.getItem("doctor_appointments_registry") || "[]");
  const isAccepted = doctorSideAcceptance(LinkedBookingRecord);

  if (!isAccepted) {
    // Flow Scenario A: Free instant structural cancellation routing
    appointments = appointments.filter(apt => apt.id !== LinkedBookingRecord.id);
    localStorage.setItem("doctor_appointments_registry", JSON.stringify(appointments));
    
    injectSystemNotification("Doctor Appointment", `Cancelled pending session reservation track with ${ActiveDoctorProfile.name}.`);
    
    // Refresh structural visual container coordinates dynamically
    LinkedBookingRecord = null;
    evaluateButtonVisibilityMatrix();
    runCalculationAndValidationEngine();
    alert("Appointment successfully removed from booking timelines.");
  } else {
    // Flow Scenario B: Committed tracking slot intercept penalty engine hooks
    processAppointmentCancellationPenalty();
    
    // Simulate standard system tracking validation alert messages
    const confirmChoice = confirm("This booking was formally confirmed. Cancelling invokes penalty deductions. Proceed with partial recovery tracking return operations?");
    if (confirmChoice) {
      appointments = appointments.filter(apt => apt.id !== LinkedBookingRecord.id);
      localStorage.setItem("doctor_appointments_registry", JSON.stringify(appointments));
      
      injectSystemNotification("Doctor Appointment", `Cancelled accepted session track (Penalty applied) for ${ActiveDoctorProfile.name}.`);
      
      LinkedBookingRecord = null;
      evaluateButtonVisibilityMatrix();
      runCalculationAndValidationEngine();
    }
  }
}

function executeSetAppointmentWorkflow() {
  if (!runCalculationAndValidationEngine()) return;

  const startVal = document.getElementById("time-start").value;
  const endVal = document.getElementById("time-end").value;
  const costVal = document.getElementById("total-cost-output").innerText;
  const chosenDate = new Date(globallySelectedTimestamp).toISOString().split('T')[0];

  const newAppointment = {
    id: "APT_" + Date.now(),
    doctorId: ActiveDoctorProfile.id,
    doctorName: ActiveDoctorProfile.name,
    specialization: ActiveDoctorProfile.specialization,
    date: chosenDate,
    timeWindow: `${startVal} - ${endVal}`,
    cost: costVal,
    status: "pending"
  };

  const appointments = JSON.parse(localStorage.getItem("doctor_appointments_registry") || "[]");
  appointments.push(newAppointment);
  localStorage.setItem("doctor_appointments_registry", JSON.stringify(appointments));

  injectSystemNotification("Doctor Appointment", `(Doctor Appointment) your appointment is set to the doctor ${ActiveDoctorProfile.name} at ${startVal} time.`);
  
  window.location.href = "Select-doctor.html";
}

function executeEditAppointmentWorkflow() {
  if (!runCalculationAndValidationEngine()) return;

  const startVal = document.getElementById("time-start").value;
  const endVal = document.getElementById("time-end").value;
  const costVal = document.getElementById("total-cost-output").innerText;
  const chosenDate = new Date(globallySelectedTimestamp).toISOString().split('T')[0];

  const appointments = JSON.parse(localStorage.getItem("doctor_appointments_registry") || "[]");
  const target = appointments.find(apt => apt.id === LinkedBookingRecord.id);

  if (target) {
    target.date = chosenDate;
    target.timeWindow = `${startVal} - ${endVal}`;
    target.cost = costVal;
    localStorage.setItem("doctor_appointments_registry", JSON.stringify(appointments));
    
    injectSystemNotification("Doctor Appointment", `Modified booking session details tracking for ${ActiveDoctorProfile.name} to ${chosenDate}.`);
    alert("Appointment parameters recalculated and saved successfully.");
    window.location.href = "Select-doctor.html";
  }
}

/**
 * Problem 3.2 Reporting Target Dispatch Flow Pipeline
 */
function submitProfessionalAbuseReport() {
  const cause = document.getElementById("report-cause-select").value;
  const textRemarks = document.getElementById("report-remarks-textarea").value;

  if (!textRemarks.trim()) {
    alert("Please fill out contextual details logs before submitting documentation file packets.");
    return;
  }

  // Gather structural packaging metadata info profiles
  const doctorDetails = {
    id: ActiveDoctorProfile.id,
    name: ActiveDoctorProfile.name,
    specialization: ActiveDoctorProfile.specialization
  };

  // Call user requested programmatic tracking engine hook
  reportDoctor(doctorDetails, `${cause} | Details: ${textRemarks}`);
}

function reportDoctor(doctorDetails, causeOfReport) {
  const historicalReports = JSON.parse(localStorage.getItem("doctor_abuse_reports_log") || "[]");
  
  const reportPayload = {
    reportId: "REP_" + Date.now(),
    doctor: doctorDetails,
    cause: causeOfReport,
    timestamp: new Date().toISOString()
  };

  historicalReports.unshift(reportPayload);
  localStorage.setItem("doctor_abuse_reports_log", JSON.stringify(historicalReports));

  injectSystemNotification("System Safety", `Submitted professional review report file packet regarding ${doctorDetails.name}.`);
  
  alert("Report successfully processed and routed straight to system review pipelines.");
  dismissReportingInterface();
  window.location.href = "Select-doctor.html";
}

/* UI Modal Overlay Management */
function launchReportingInterface() {
  document.getElementById("report-modal-doc-name").innerText = ActiveDoctorProfile.name;
  document.getElementById("report-modal").style.display = "flex";
}

function dismissReportingInterface() {
  document.getElementById("report-modal").style.display = "none";
}

function injectSystemNotification(category, message) {
  const notifications = JSON.parse(localStorage.getItem("dashboard_notifications_registry") || "[]");
  notifications.unshift({ id: "NOTIF_" + Date.now(), category, message });
  localStorage.setItem("dashboard_notifications_registry", JSON.stringify(notifications));
}

/**
 * Pricing Estimation Matrix Computations Framework
 */
function runCalculationAndValidationEngine() {
  if (currentViewContextMode === "historic") return true;

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

  // Static reference check limits or dynamic registry fallbacks
  const openMin = doc.openMinutes || 540;
  const closeMin = doc.closeMinutes || 1020;

  if (startMin < openMin || endMin > closeMin || duration <= 0) {
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

function generateHorizontalRibbonTrack() {
  if (currentViewContextMode === "historic") return;
  const track = document.getElementById("date-scroll-track");
  const monthsShort = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const baseDate = new Date();

  for (let i = 0; i < 11; i++) {
    const loopDate = new Date();
    loopDate.setDate(baseDate.getDate() + i);

    const pill = document.createElement("div");
    pill.className = "date-pill";
    pill.dataset.timestamp = loopDate.getTime();

    pill.innerHTML = `
      <span class="pill-month">${monthsShort[loopDate.getMonth()]}</span>
      <span class="pill-daynum">${loopDate.getDate()}</span>
    `;

    pill.addEventListener("click", () => {
      const options = track.getElementsByClassName("date-pill");
      for(let p of options) p.classList.remove("selected");
      pill.classList.add("selected");
      globallySelectedTimestamp = parseInt(pill.dataset.timestamp);
      runCalculationAndValidationEngine();
    });

    track.appendChild(pill);
  }

  // Pre-select current day index coordinates automatically
  if (track.children.length > 0) {
    // If updating coordinates match target database parameters explicitly
    if (LinkedBookingRecord) {
      const matchTime = new Date(LinkedBookingRecord.date).getTime();
      globallySelectedTimestamp = matchTime;
    } else {
      track.children[0].classList.add("selected");
      globallySelectedTimestamp = parseInt(track.children[0].dataset.timestamp);
    }
  }
}

function registerInteractiveListeners() {
  document.getElementById("btn-back-nav").addEventListener("click", () => {
    window.location.href = "Select-doctor.html";
  });
  document.getElementById("btn-primary-action-hub").addEventListener("click", handlePrimaryButtonExecution);
  document.getElementById("btn-secondary-action-hub").addEventListener("click", handleCancelButtonExecution);
  document.getElementById("time-start").addEventListener("input", runCalculationAndValidationEngine);
  document.getElementById("time-end").addEventListener("input", runCalculationAndValidationEngine);
  
  // Reporting UI Specific Overlay Handlers
  document.getElementById("btn-close-report-modal").addEventListener("click", dismissReportingInterface);
  document.getElementById("btn-dispatch-report-trigger").addEventListener("click", submitProfessionalAbuseReport);
}
