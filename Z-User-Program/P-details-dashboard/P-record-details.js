/**
 * Pink Cycle - System Application Logic Core Workspace
 * Standalone Context Model Handling Updates Dynamically
 */

// ==========================================================================
// 1. SYSTEM VARIABLE RUNTIME DICTIONARY DEFINITIONS
// ==========================================================================

// Global Period Flag Context Status Engine
let user_period = true; 

// Historical Log Multi-Day Data Array Mapping Collection
let period_record = {
  startDate: "2026-07-15", 
  days: {
    "Day 1": [
      { category: "Period and body", title: "Flow", level: 4 },
      { category: "Period and body", title: "Cramps", level: 5 },
      { category: "Mood", title: "Angry", level: 6 }
    ]
  }
};

// Current Session State Buffer for Shortlisted Items Inside Workspace
let currentActiveTrackedItems = [];

// Immutable Global Static Look-Up Catalog Schema Mapping
const SYMPTOM_DICTIONARY = {
  "flow": { title: "Flow", category: "Period and body", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3C9 7 6 10.5 6 14a6 6 0 0 0 12 0c0-3.5-3-7-6-11Z"/><path d="M9 12h6"/><path d="M8.5 15h7"/><path d="M10 18h4"/></svg>` },
  "cramps": { title: "Cramps", category: "Period and body", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 10c1.5 6 4 9 7 9s5.5-3 7-9"/><path d="M8 7c1.2 1.4 2.5 2 4 2s2.8-.6 4-2"/><path d="M12 11l-2 3h3l-2 3"/></svg>` },
  "blood-clots": { title: "Blood Clots", category: "Period and body", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3C9 7 6 10.5 6 14a6 6 0 0 0 12 0c0-3.5-3-7-6-11Z"/><circle cx="10" cy="14" r="1"/><circle cx="14" cy="16" r="1"/></svg>` },
  "spotting": { title: "Spotting", category: "Period and body", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 7c-2 2.7-3.5 4.6-3.5 6.6a3.5 3.5 0 0 0 7 0C15.5 11.6 14 9.7 12 7Z"/><path d="M5 10h.01"/><path d="M7 17h.01"/><path d="M18 9h.01"/><path d="M18 17h.01"/></svg>` },
  "back-pain": { title: "Back Pain", category: "Period and body", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 4c-2 2.2-3 5-3 8s1 5.8 3 8"/><path d="M14 4c2 2.2 3 5 3 8s-1 5.8-3 8"/><path d="M12 5v14"/><path d="M12 8h2"/><path d="M12 12h-2"/><path d="M12 16h2"/><path d="M19 9l2-1"/><path d="M19 12h3"/><path d="M19 15l2 1"/></svg>` },
  "headache": { title: "Headache", category: "Period and body", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18v-3.5A7 7 0 0 1 18.5 10c.8 1 1.5 2.4 1.5 4v4"/><path d="M6 18h4"/><path d="M16 18h4"/><path d="M13 4l-3 5h4l-3 5"/><path d="M4 11H2"/><path d="M22 11h-2"/></svg>` },
  "bloating": { title: "Bloating", category: "Symptoms", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 8c-2 1.8-3 4.2-3 7a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5c0-2.8-1-5.2-3-7"/><path d="M8 13H4"/><path d="M4 13l2-2"/><path d="M4 13l2 2"/><path d="M16 13h4"/><path d="M20 13l-2-2"/><path d="M20 13l-2 2"/></svg>` },
  "breast-tenderness": { title: "Breast Tenderness", category: "Symptoms", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 8c-2 2-3 4.5-3 7a4 4 0 0 0 8 0"/><path d="M17 8c2 2 3 4.5 3 7a4 4 0 0 1-8 0"/><path d="M12 8v7"/><path d="M6 5l-1-2"/><path d="M9 5V3"/><path d="M18 5l1-2"/><path d="M15 5V3"/></svg>` },
  "fatigue": { title: "Fatigue", category: "Symptoms", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 4a8 8 0 1 0 3 12c-5 1-9-3-8-8 0-1.5 1-3 5-4Z"/><path d="M8 14h2"/><path d="M13 14h2"/><path d="M10 17c1.2.7 2.8.7 4 0"/></svg>` },
  "acne": { title: "Acne", category: "Symptoms", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 11a6 6 0 0 1 12 0v3a6 6 0 0 1-12 0v-3Z"/><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c1.2.7 2.8.7 4 0"/><circle cx="16" cy="8" r="1"/><path d="M18 6l1-1"/><path d="M19 8h1"/></svg>` },
  "nausea": { title: "Nausea", category: "Symptoms", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 11a6 6 0 0 1 12 0v3a6 6 0 0 1-12 0v-3Z"/><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M9 17c1-1 5-1 6 0"/><path d="M10 7c2-2 6 1 3 3-2 1-1 3 2 3"/></svg>` },
  "food-cravings": { title: "Food Cravings", category: "Symptoms", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19s-6-3.8-6-8a3.2 3.2 0 0 1 6-1.6A3.2 3.2 0 0 1 18 11c0 4.2-6 8-6 8Z"/><path d="M4 4v6"/><path d="M2.5 4v3"/><path d="M5.5 4v3"/><path d="M4 10v9"/><path d="M20 4v15"/><path d="M18 4c0 3 2 4 2 6"/></svg>` },
  "happy": { title: "Happy", category: "Mood", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><path d="M8.5 10.5c.7.6 1.5.6 2.2 0"/><path d="M13.3 10.5c.7.6 1.5.6 2.2 0"/><path d="M8.5 14.5c1.5 2 5.5 2 7 0"/></svg>` },
  "calm": { title: "Calm", category: "Mood", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="6"/><path d="M8.5 12h2"/><path d="M13.5 12h2"/><path d="M10 16c1.2.7 2.8.7 4 0"/><path d="M15 5c2.8 0 4 1.2 4 4-2.8 0-4-1.2-4-4Z"/><path d="M15 9l4-4"/></svg>` },
  "sad": { title: "Sad", category: "Mood", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M9 16c1-1 5-1 6 0"/><path d="M16.5 12.5c-.8 1-.8 1.7 0 2.5.8-.8.8-1.5 0-2.5Z"/></svg>` },
  "angry": { title: "Angry", category: "Mood", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><path d="M8 9l3 1"/><path d="M16 9l-3 1"/><path d="M9 13h.01"/><path d="M15 13h.01"/><path d="M9 17c1.5-1 4.5-1 6 0"/></svg>` },
  "irritable": { title: "Irritable", category: "Mood", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="12" r="6"/><path d="M8.5 10.5h.01"/><path d="M13.5 10.5h.01"/><path d="M9 16c1.2-.7 2.8-.7 4 0"/><path d="M18 7l2 2-2 2 2 2"/></svg>` },
  "anxious": { title: "Anxious", category: "Mood", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><path d="M8 10c.8-.7 1.7-.7 2.5 0"/><path d="M13.5 10c.8-.7 1.7-.7 2.5 0"/><path d="M9 16c1-1 5-1 6 0"/><path d="M7 19h2l1-2 2 4 1-2h4"/></svg>` },
  "sleep": { title: "Sleep", category: "Lifestyle", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 4a8 8 0 1 0 3 12c-5 1-9-3-8-8 0-1.5 1-3 5-4Z"/><path d="M6 5v2"/><path d="M5 6h2"/></svg>` },
  "exercise": { title: "Exercise", category: "Lifestyle", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="14" cy="5" r="1.5"/><path d="M12 8l-2.5 4H13l2 3"/><path d="M13 9l3 2 3-1"/><path d="M10 12l-2 4-3 2"/><path d="M15 15l2 4h3"/></svg>` },
  "water-intake": { title: "Water Intake", category: "Lifestyle", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6"/><path d="M10 6h4"/><path d="M8 8c0-1.2.8-2 2-2h4c1.2 0 2 .8 2 2v11c0 1.2-.8 2-2 2h-4c-1.2 0-2-.8-2-2V8Z"/><path d="M12 11c-1.2 1.5-2 2.5-2 3.5a2 2 0 0 0 4 0c0-1-.8-2-2-3.5Z"/></svg>` },
  "energy-level": { title: "Energy Level", category: "Lifestyle", svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4V8Z"/><path d="M22 11v2"/><path d="M12 9l-3 4h3l-2 4"/></svg>` }
};

// ==========================================================================
// 2. DOM CACHE LAYER INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const chosenContentContainer = document.getElementById("chosenContentContainer");
  const menuDropdownTrigger = document.getElementById("menuDropdownTrigger");
  const dropdownMenuList = document.getElementById("dropdownMenuList");
  const symptomSearch = document.getElementById("symptomSearch");
  const btnStickyAddPromotion = document.getElementById("btnStickyAddPromotion");
  const actionAddPrevious = document.getElementById("actionAddPrevious");
  const actionDeleteAll = document.getElementById("actionDeleteAll");
  const allSymptomCards = document.querySelectorAll(".symptom-selectable-card");

  // Initial render pass displaying standard "No Details" empty condition
  renderChosenDetailsView();

  // ==========================================================================
  // 3. INTERACTION LISTENERS & FILTER LOGIC
  // ==========================================================================
  
  // Local card selector toggles
  allSymptomCards.forEach(card => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-selected");
    });
  });

  // Floating CTA execution engine
  btnStickyAddPromotion.addEventListener("click", () => {
    let advancedItemsPromoted = false;
    
    allSymptomCards.forEach(card => {
      if (card.classList.contains("is-selected")) {
        const id = card.getAttribute("data-symptom-id");
        const referenceMeta = SYMPTOM_DICTIONARY[id];
        
        const alreadyExists = currentActiveTrackedItems.some(item => item.id === id);
        if (!alreadyExists) {
          currentActiveTrackedItems.push({
            id: id,
            title: referenceMeta.title,
            category: referenceMeta.category,
            level: 4 // Initializes to standard central midpoint level
          });
          advancedItemsPromoted = true;
        }
        card.classList.remove("is-selected");
      }
    });

    if (advancedItemsPromoted) {
      renderChosenDetailsView();
    }
  });

  // Dynamic filter query search logic
  symptomSearch.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    allSymptomCards.forEach(card => {
      const titleText = card.querySelector(".card-label-text").textContent.toLowerCase();
      card.style.display = titleText.includes(query) ? "flex" : "none";
    });

    // Toggle segment headings conditionally based on search results
    document.querySelectorAll(".category-block-segment").forEach(segment => {
      const visibleCards = segment.querySelectorAll(".symptom-selectable-card[style='display: flex;']");
      const generalCards = segment.querySelectorAll(".symptom-selectable-card");
      
      if (query !== "" && visibleCards.length === 0 && generalCards.length > 0) {
        segment.style.display = "none";
      } else {
        segment.style.display = "block";
      }
    });
  });

  // Option dropdown menu hooks
  menuDropdownTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenuList.classList.toggle("show-menu");
  });

  document.addEventListener("click", () => {
    dropdownMenuList.classList.remove("show-menu");
  });

  actionDeleteAll.addEventListener("click", () => {
    currentActiveTrackedItems = [];
    renderChosenDetailsView();
  });

  // Population parser reading previous historical records out of core variables
  actionAddPrevious.addEventListener("click", () => {
    const completeDays = Object.keys(period_record.days);
    if (completeDays.length === 0) return;
    
    const lastDayKey = completeDays[completeDays.length - 1];
    const previousDayRecords = period_record.days[lastDayKey];

    currentActiveTrackedItems = [];
    
    previousDayRecords.forEach(record => {
      const mappedId = Object.keys(SYMPTOM_DICTIONARY).find(
        key => SYMPTOM_DICTIONARY[key].title === record.title
      );

      if (mappedId) {
        currentActiveTrackedItems.push({
          id: mappedId,
          title: record.title,
          category: record.category,
          level: record.level
        });
      }
    });

    renderChosenDetailsView();
  });

  // ==========================================================================
  // 4. CORE DATA INTERFACE RENDERING ENGINE
  // ==========================================================================
  function renderChosenDetailsView() {
    chosenContentContainer.innerHTML = "";

    if (currentActiveTrackedItems.length === 0) {
      chosenContentContainer.innerHTML = `<div class="empty-state-text">No Details</div>`;
      return;
    }

    currentActiveTrackedItems.forEach((item, index) => {
      const referenceMeta = SYMPTOM_DICTIONARY[item.id];
      const itemRowContainer = document.createElement("div");
      itemRowContainer.className = "chosen-line-item";

      // HTML markup handles inline injected SVG paths running with the 70% style expansion scales
      itemRowContainer.innerHTML = `
        <div class="line-item-meta">
          ${referenceMeta.svgIcon}
          <span class="line-item-title">${item.title}</span>
        </div>
        <div class="slider-axis-container">
          <input type="range" min="1" max="7" step="1" value="${item.level}" class="range-slider-7point" data-target-index="${index}">
          <div class="slider-labels-axis">
            <span class="${item.level <= 2 ? 'active-node' : ''}">Low</span>
            <span class="${item.level >= 3 && item.level <= 5 ? 'active-node' : ''}">Normal</span>
            <span class="${item.level >= 6 ? 'active-node' : ''}">High</span>
          </div>
        </div>
      `;

      // Interactive real-time event slider values input updates
      const rangeInputElement = itemRowContainer.querySelector(".range-slider-7point");
      rangeInputElement.addEventListener("input", (e) => {
        const value = parseInt(e.target.value);
        const itemIndex = parseInt(e.target.getAttribute("data-target-index"));
        currentActiveTrackedItems[itemIndex].level = value;

        const labelNodes = e.target.nextElementSibling.querySelectorAll("span");
        labelNodes[0].className = value <= 2 ? 'active-node' : '';
        labelNodes[1].className = (value >= 3 && value <= 5) ? 'active-node' : '';
        labelNodes[2].className = value >= 6 ? 'active-node' : '';
      });

      chosenContentContainer.appendChild(itemRowContainer);
    });

    // Embed standalone card block control execution actions
    const btnSaveContainerElement = document.createElement("button");
    btnSaveContainerElement.type = "button";
    btnSaveContainerElement.className = "btn-outline-save";
    btnSaveContainerElement.id = "btnSaveContainerElements";
    btnSaveContainerElement.textContent = "Save Detail";
    
    btnSaveContainerElement.addEventListener("click", () => {
      executeCyclePersistencePipeline();
    });

    chosenContentContainer.appendChild(btnSaveContainerElement);
  }

  // ==========================================================================
  // 5. TIMELINE DATA PERSISTENCE PIPELINE CONTEXT
  // ==========================================================================
  function executeCyclePersistencePipeline() {
    const today = new Date().toISOString().split('T')[0];

    const targetPayloadData = currentActiveTrackedItems.map(item => ({
      category: item.category,
      title: item.title,
      level: item.level
    }));

    if (user_period === true) {
      const establishedDayKeys = Object.keys(period_record.days);
      const activeDayCount = establishedDayKeys.length;
      const calculatedTargetKey = `Day ${activeDayCount === 0 ? 1 : activeDayCount}`;

      // Update state data dictionaries in place
      period_record.days[calculatedTargetKey] = targetPayloadData;
      
      console.log("Logged tracking parameters under active timeline index maps.", period_record);
      alert(`Details saved successfully for tracking timeline: ${calculatedTargetKey}`);
      
      dispatchNextDayAutomationAlert();
    } else {
      // Off-cycle entries drop down directly under absolute isolated string date elements
      period_record.days[today] = targetPayloadData;
      console.log("Independent instance applied to system logs cleanly.", period_record);
      alert(`Independent off-cycle records applied successfully for calendar coordinate: ${today}`);
    }
  }

  function dispatchNextDayAutomationAlert() {
    setTimeout(() => {
      alert("Pink Cycle Notification: A new recording workspace loop will automatically initialize tomorrow morning for your next cycle day tracking logs.");
    }, 800);
  }
});
