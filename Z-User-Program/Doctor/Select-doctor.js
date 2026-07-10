// 1. Core Unified Doctor Registry Storage Ledger 
window.DoctorDatabaseRegistry = [
  { 
    id: "DOC_XYZ_9921", 
    name: "Dr. Sophia XYZ", 
    specialization: "Gynecologist", 
    rating: "4.9 (142 reviews)", 
    cost: 1200,
    contact: "+977-9851012345",
    openMinutes: 540,   // 09:00 AM
    closeMinutes: 1020, // 05:00 PM
    profilePic: "doctor-pic.png",
    verificationPic: "verification-pic.png"
  },
  { 
    id: "DOC_ABC_1102", 
    name: "Dr. Rohan Sharma", 
    specialization: "Pediatrician", 
    rating: "4.7 (98 reviews)", 
    cost: 1000,
    contact: "+977-9841998877",
    openMinutes: 600,   // 10:00 AM
    closeMinutes: 960,  // 04:00 PM
    profilePic: "doctor-pic.png", 
    verificationPic: "verification-pic.png"
  },
  { 
    id: "DOC_KPL_4829", 
    name: "Dr. Kabita Thapa", 
    specialization: "Dermatologist", 
    rating: "4.8 (115 reviews)", 
    cost: 1500,
    contact: "+977-9811223344",
    openMinutes: 540,   // 09:00 AM
    closeMinutes: 1020, // 05:00 PM
    profilePic: "doctor-pic.png",
    verificationPic: "verification-pic.png"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  verifyAndSeedMockAppointments();
  renderDoctorCardsGrid();
  renderAppointmentsDrawerLines();
  registerControlListeners();
});

/**
 * Ensures system has mock items to track and test Conditions 1, 2 (Accepted, and Pending) from doctor side
 */
function verifyAndSeedMockAppointments() {
  const appointments = JSON.parse(localStorage.getItem("doctor_appointments_registry") || "[]");
  if (appointments.length === 0) {
    const defaultDataSeed = [
      {
        id: "APT_MOCK_01",
        doctorId: "DOC_ABC_1102",
        doctorName: "Dr. Rohan Sharma",
        specialization: "Pediatrician",
        date: "2026-07-15",
        timeWindow: "10:30 - 11:30",
        cost: "Rs. 1,000",
        status: "pending" // Test State for Problem 3.1 & 3.2 (Shows Edit Button)
      },
      {
        id: "APT_MOCK_02",
        doctorId: "DOC_KPL_4829",
        doctorName: "Dr. Kabita Thapa",
        specialization: "Dermatologist",
        date: "2026-07-18",
        timeWindow: "14:00 - 15:00",
        cost: "Rs. 1,500",
        status: "accepted" // Test State for Problem 3.1 & 3.2 (Button Disappears)
      },
      {
        id: "APT_MOCK_03",
        doctorId: "DOC_XYZ_9921",
        doctorName: "Dr. Sophia XYZ",
        specialization: "Gynecologist",
        date: "2026-05-10",
        timeWindow: "09:30 - 10:30",
        cost: "Rs. 1,200",
        status: "past" // Test State for Problem 3.2 Condition 2 (Triggers Report mode)
      }
    ];
    localStorage.setItem("doctor_appointments_registry", JSON.stringify(defaultDataSeed));
  }
}

/**
 * Problem 1:primary doctor data matrix using a clear Box/Block layout grid
 */
function renderDoctorCardsGrid() {
  const gridContainer = document.getElementById("doctors-list-wrapper");
  const query = document.getElementById("search-input").value.toLowerCase();
  const sortCriteria = document.getElementById("filter-select").value;

  gridContainer.innerHTML = "";

  // Apply basic filtering parameters 
  let dataset = window.DoctorDatabaseRegistry.filter(doc => 
    doc.name.toLowerCase().includes(query) || doc.specialization.toLowerCase().includes(query)
  );

  // Evaluate Sorting Criteria
  if (sortCriteria === "price-low") {
    dataset.sort((a, b) => a.cost - b.cost);
  } else if (sortCriteria === "price-high") {
    dataset.sort((a, b) => b.cost - a.cost);
  } else if (sortCriteria === "rating-high") {
    dataset.sort((a, b) => b.rating.localeCompare(a.rating));
  }

  // Inject Box Items elements loop
  dataset.forEach(doctor => {
    const cardBlock = document.createElement("div");
    cardBlock.className = "doctor-block-card";
    
    cardBlock.innerHTML = `
      <div class="card-avatar-frame">
        <img src="${doctor.profilePic}" alt="${doctor.name}">
      </div>
      <h3 class="card-title-name">${doctor.name}</h3>
      <span class="card-spec-label">${doctor.specialization}</span>
      <div class="card-metrics-row">
        <span>★ ${doctor.rating}</span>
        <span>Rate: <span class="metric-accent">Rs. ${doctor.cost}</span>/hr</span>
      </div>
      <button class="btn-card-action-profile">View Profile</button>
    `;

    // Problem 3.1: Clicking anywhere on the block/box or button routes to profile setup in active mode
    cardBlock.addEventListener("click", () => executeNavigationHandoff(doctor, "active"));
    cardBlock.querySelector(".btn-card-action-profile").addEventListener("click", (e) => {
      e.stopPropagation(); // Prevents bubbling redundancies
      executeNavigationHandoff(doctor, "active");
    });

    gridContainer.appendChild(cardBlock);
  });
}

/**
 * Problem 2: Splits and builds compact horizontal line layout rows inside the trigger drawer
 */
function renderAppointmentsDrawerLines() {
  const activeStack = document.getElementById("current-appointments-list");
  const pastStack = document.getElementById("past-appointments-list");
  const activeCounterBadge = document.getElementById("active-appointments-badge");

  activeStack.innerHTML = "";
  pastStack.innerHTML = "";

  const appointments = JSON.parse(localStorage.getItem("doctor_appointments_registry") || "[]");
  let activeCounter = 0;

  appointments.forEach(appointment => {
    const lineRow = document.createElement("div");
    lineRow.className = "appointment-line-row";

    lineRow.innerHTML = `
      <div class="line-left-details-block">
        <span class="line-doc-name">${appointment.doctorName}</span>
        <span class="line-schedule-meta">${appointment.date} • ${appointment.timeWindow}</span>
        <span class="status-indicator-tag ${appointment.status}">${appointment.status}</span>
      </div>
      <button class="btn-line-action-view">View</button>
    `;

    // Locate matching database template entry object reference safely to pull missing assets
    const linkedDoctorData = window.DoctorDatabaseRegistry.find(d => d.id === appointment.doctorId) || {
      id: appointment.doctorId,
      name: appointment.doctorName,
      specialization: appointment.specialization,
      contact: "+977-9800000000",
      cost: parseInt(appointment.cost.replace(/[^0-9]/g, '')) || 1000,
      openMinutes: 540, closeMinutes: 1020,
      profilePic: "doctor-pic.png", verificationPic: "verification-pic.png"
    };

    // Problem 3.2: Attach dynamic routing variants based on current/past chronological condition splits
    const viewButton = lineRow.querySelector(".btn-line-action-view");

    if (appointment.status === "past") {
      // Condition 2: Historic past log context target -> Route in 'historic' presentation mode
      viewButton.addEventListener("click", () => executeNavigationHandoff(linkedDoctorData, "historic"));
      pastStack.appendChild(lineRow);
    } else {
      // Condition 1: Active/Upcoming context target -> Route in standard 'active' editing mode
      activeCounter++;
      viewButton.addEventListener("click", () => executeNavigationHandoff(linkedDoctorData, "active"));
      activeStack.appendChild(lineRow);
    }
  });

  // Keep bottom navigation status counters synchronized
  activeCounterBadge.innerText = activeCounter;
}

/**
 * Consolidated State Hand-off Mechanism across Problem 3 files pipelines
 */
function executeNavigationHandoff(doctorObject, profileUIMode) {
  localStorage.setItem("current_selected_doctor", JSON.stringify(doctorObject));
  localStorage.setItem("doctor_profile_mode", profileUIMode);
  window.location.href = "Doctor-profile.html";
}

function registerControlListeners() {
  // Realtime search and sorting mutation hooks
  document.getElementById("search-input").addEventListener("input", renderDoctorCardsGrid);
  document.getElementById("filter-select").addEventListener("change", renderDoctorCardsGrid);

  // Core overlay drawer toggle animations listeners
  document.getElementById("btn-toggle-appointments").addEventListener("click", () => {
    document.getElementById("appointments-drawer").style.display = "flex";
  });
  document.getElementById("btn-close-drawer").addEventListener("click", () => {
    document.getElementById("appointments-drawer").style.display = "none";
  });

  // Standard frame navigation fallbacks
  document.getElementById("btn-header-back").addEventListener("click", () => {
    window.location.href = "../Dashboard/Dashboard.html";
  });
}
