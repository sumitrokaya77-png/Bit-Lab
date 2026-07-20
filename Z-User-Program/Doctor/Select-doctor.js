// Central Shared Doctors Mock Database Engine
const SPECIALISTS_DATABASE = [
  {
    id: "DOC_NPL_001",
    name: "Dr. Anjali Sharma",
    specialization: "Gynecologist & Obstetrician",
    rating: "4.8 (192 reviews)",
    cost: 1500,
    contact: "+977-9851011111",
    openMinutes: 540,  // 09:00 AM
    closeMinutes: 1020, // 05:00 PM
    profilePic: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    verificationPic: "verification-sample.png"
  },
  {
    id: "DOC_NPL_002",
    name: "Dr. Rohan Bikram Shah",
    specialization: "Reproductive Endocrinologist",
    rating: "4.9 (114 reviews)",
    cost: 2000,
    contact: "+977-9841022222",
    openMinutes: 600,  // 10:00 AM
    closeMinutes: 1080, // 06:00 PM
    profilePic: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    verificationPic: "verification-sample.png"
  },
  {
    id: "DOC_NPL_003",
    name: "Dr. Priety Joshi",
    specialization: "Women's Health Specialist",
    rating: "4.7 (86 reviews)",
    cost: 1200,
    contact: "+977-9811033333",
    openMinutes: 480,  // 08:00 AM
    closeMinutes: 960,  // 04:00 PM
    profilePic: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300",
    verificationPic: "verification-sample.png"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  seedHistoricalLogsFallback();
  renderDoctorBoxCatalog(SPECIALISTS_DATABASE);
  renderAppointmentsLineDrawer();
  initializeUserInterfaceListeners();
});

/**
 * Seeding historical records into device memory loop tracking
 * Allows immediate evaluation of Problem 3.2 historic layout switching rules
 */
function seedHistoricalLogsFallback() {
  const currentRegistry = localStorage.getItem("doctor_appointments_registry");
  if (!currentRegistry) {
    const historicalSeeds = [
      {
        id: "APT_SEED_001",
        doctorId: "DOC_NPL_003",
        doctorName: "Dr. Priety Joshi",
        specialization: "Women's Health Specialist",
        date: "2026-07-02",
        timeWindow: "10:30 - 11:30",
        cost: "Rs. 1,200",
        status: "past" // Explicit past history tag
      }
    ];
    localStorage.setItem("doctor_appointments_registry", JSON.stringify(historicalSeeds));
  }
}

/**
 * Problem 1: Grid-Based Box/Block Card List Renderer
 */
function renderDoctorBoxCatalog(catalogArray) {
  const container = document.getElementById("doctor-catalog-grid");
  const counterLabel = document.getElementById("catalog-count-label");
  
  container.innerHTML = "";
  counterLabel.innerText = `${catalogArray.length} listed`;

  if (catalogArray.length === 0) {
    container.innerHTML = `<div class="empty-state-notice">No medical specialists match your search guidelines.</div>`;
    return;
  }

  catalogArray.forEach(doctor => {
    const card = document.createElement("div");
    card.className = "doctor-block-card";

    card.innerHTML = `
      <div class="card-main-identity-row">
        <div class="card-avatar-frame">
          <img src="${doctor.profilePic}" alt="${doctor.name}">
        </div>
        <div class="card-meta-details-stack">
          <h3 class="doc-name-headline">${doctor.name}</h3>
          <span class="doc-spec-subtext">${doctor.specialization}</span>
          <div class="doc-rating-summary">★ ${doctor.rating}</div>
        </div>
      </div>
      <div class="card-secondary-pricing-row">
        <span class="pricing-metric-label">Consultation standard</span>
        <strong class="pricing-value-output">Rs. ${doctor.cost.toLocaleString()} / hr</strong>
      </div>
      <button class="btn-launch-profile-card" data-doc-id="${doctor.id}">View Profile</button>
    `;

    // Problem 3.1: Selection capture routing hand-off intercepts
    card.querySelector(".btn-launch-profile-card").addEventListener("click", () => {
      routeToDoctorProfile(doctor, "active");
    });

    container.appendChild(card);
  });
}

/**
 * Problem 2 & 3.2: Chronological Multi-Zone Line List Drawer Engine
 */
function renderAppointmentsLineDrawer() {
  const currentListContainer = document.getElementById("current-appointments-line-list");
  const historicListContainer = document.getElementById("historic-appointments-line-list");
  const badgeCounter = document.getElementById("drawer-counter-badge");

  const appointments = JSON.parse(localStorage.getItem("doctor_appointments_registry") || "[]");
  badgeCounter.innerText = appointments.length;

  currentListContainer.innerHTML = "";
  historicListContainer.innerHTML = "";

  const activeBookings = appointments.filter(apt => apt.status !== "past");
  const historicBookings = appointments.filter(apt => apt.status === "past");

  // Populate Section A: Active Bookings Lines
  if (activeBookings.length === 0) {
    currentListContainer.innerHTML = `<div class="empty-state-notice">No current active reservations logged.</div>`;
  } else {
    activeBookings.forEach(apt => {
      const row = createAppointmentRowElement(apt, "active");
      currentListContainer.appendChild(row);
    });
  }

  // Populate Section B: Historic Logs Lines
  if (historicBookings.length === 0) {
    historicListContainer.innerHTML = `<div class="empty-state-notice">No past medical interactions found.</div>`;
  } else {
    historicBookings.forEach(apt => {
      const row = createAppointmentRowElement(apt, "historic");
      historicListContainer.appendChild(row);
    });
  }
}

/**
 * Factory Generator for Space-Efficient Row Units
 */
function createAppointmentRowElement(appointmentObj, routeContextMode) {
  const row = document.createElement("div");
  row.className = "appointment-line-item";

  row.innerHTML = `
    <div class="line-info-block">
      <div class="line-doc-name">${appointmentObj.doctorName}</div>
      <div class="line-time-window">
        Date: <span>${appointmentObj.date}</span> | Time: <span>${appointmentObj.timeWindow}</span>
      </div>
      <span class="status-pill-badge badge-${appointmentObj.status}">${appointmentObj.status}</span>
    </div>
    <button class="btn-drawer-line-view">View</button>
  `;

  // Problem 3.2 View Button Handling Matrix Routing (Condition 1 vs Condition 2)
  row.querySelector(".btn-drawer-line-view").addEventListener("click", () => {
    // Locate match reference profile data payload inside mock database entries
    const linkedDoctor = SPECIALISTS_DATABASE.find(doc => doc.id === appointmentObj.doctorId) || {
      id: appointmentObj.doctorId,
      name: appointmentObj.doctorName,
      specialization: appointmentObj.specialization,
      rating: "0.0 (0 reviews)",
      cost: 0,
      contact: "Unavailable",
      profilePic: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
      verificationPic: "verification-sample.png"
    };
    
    routeToDoctorProfile(linkedDoctor, routeContextMode);
  });

  return row;
}

/**
 * State Serialization Mechanism requested across all parameters
 */
function routeToDoctorProfile(doctorObj, contextMode) {
  localStorage.setItem("current_selected_doctor", JSON.stringify(doctorObj));
  localStorage.setItem("profile_view_context_mode", contextMode);
  window.location.href = "Doctor-profile.html";
}

/**
 * Search filtering algorithm executions
 */
function handleCatalogSearchFilter(event) {
  const query = event.target.value.toLowerCase().trim();
  const matchedOutput = SPECIALISTS_DATABASE.filter(doctor => 
    doctor.name.toLowerCase().includes(query) || 
    doctor.specialization.toLowerCase().includes(query)
  );
  renderDoctorBoxCatalog(matchedOutput);
}

/**
 * UI Event Mapping Frameworks
 */
function initializeUserInterfaceListeners() {
  const searchInput = document.getElementById("search-input");
  const toggleBtn = document.getElementById("btn-toggle-drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const drawerElement = document.getElementById("appointments-drawer");

  searchInput.addEventListener("input", handleCatalogSearchFilter);

  // Drawer Toggle Animation Interactions
  const openAction = () => {
    drawerOverlay.style.display = "block";
    drawerElement.classList.add("drawer-open");
  };

  const closeAction = () => {
    drawerOverlay.style.display = "none";
    drawerElement.classList.remove("drawer-open");
  };

  toggleBtn.addEventListener("click", () => {
    if (drawerElement.classList.contains("drawer-open")) {
      closeAction();
    } else {
      openAction();
    }
  });

  drawerOverlay.addEventListener("click", closeAction);
}
