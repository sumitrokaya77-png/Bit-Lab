// Global execution context application badge counter
let notificationCount = 0;

document.addEventListener("DOMContentLoaded", () => {
  initializeDashboardNavigation();
  initializeHamburgerMenuTrigger();
  updateNotificationBadge(); // Run update check on system sequence boot
});

/**
 * Updates DOM state presentation for the notification indicator badge
 */
function updateNotificationBadge() {
  const badge = document.getElementById("notif-badge");
  if (!badge) return;

  if (notificationCount > 0) {
    badge.textContent = notificationCount;
    badge.style.display = "flex";
  } else {
    badge.textContent = "";
    badge.style.display = "none";
  }
}

/**
 * Global API: Increments the notification count limit engine values
 * Usage inside any script or child sub-iframe: window.parent.notification_number(5);
 */
window.notification_number = function(amount = 1) {
  const parsedAmount = typeof amount === "number" && !isNaN(amount) ? amount : 1;
  notificationCount += parsedAmount;
  updateNotificationBadge();
};

/**
 * Global API: Decrements notification metrics down, preventing negative states
 * Usage inside any script or child sub-iframe: window.parent.checked_notification();
 */
window.checked_notification = function(amount = 1) {
  const parsedAmount = typeof amount === "number" && !isNaN(amount) ? amount : 1;
  notificationCount -= parsedAmount;
  if (notificationCount < 0) {
    notificationCount = 0;
  }
  updateNotificationBadge();
};

/**
 * Orchestrates Master View Transitions inside the bottom tab bar tracking layouts
 */
function initializeDashboardNavigation() {
  const navButtons = document.querySelectorAll(".nav-item");

  navButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const targetButton = e.currentTarget;
      
      // Update UI active tab state highlights
      document.querySelector(".nav-item.active")?.classList.remove("active");
      targetButton.classList.add("active");

      // Extract destination ID marker tag attributes
      const screenId = targetButton.getAttribute("data-target");
      switchViewContext(screenId);
    });
  });

  // ==========================================================================
  // URL QUERY ROUTER ENGINE (DEEP LINKING RECOVERY MECHANISM)
  // ==========================================================================
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get("tab")?.toLowerCase();
  
  // Maps target query values to the exact structural data-targets in your HTML
  const targetRouteMap = {
    "home": "DH1",
    "period": "DD1",
    "chat": "DC1",
    "notification": "DN0",
    "notifications": "DN0"
  };

  // Base production fallback setting defaults straight to Home
  let defaultBootTarget = "DH1";

  // When a routing state parameter is detected, alter the initial layout parameters
  if (tabParam && targetRouteMap[tabParam]) {
    defaultBootTarget = targetRouteMap[tabParam];
    
    // Find the matching button structure dynamically inside the DOM
    const targetButton = document.querySelector(`.nav-item[data-target="${defaultBootTarget}"]`);
    if (targetButton) {
      // Clear the hardcoded 'active' class declaration from the Home element
      document.querySelector(".nav-item.active")?.classList.remove("active");
      // Append highlight rules onto the targeted subview indicator frame
      targetButton.classList.add("active");
    }
  }

  // Initial Boot Sequence: Mount the designated target screen layout viewport frame
  switchViewContext(defaultBootTarget);
}

/**
 * Loads selected screen modules safely inside the iframe viewport canvas frame
 */
function switchViewContext(screenId) {
  const viewSpace = document.getElementById("dashboard-view-space");
  
  // Standard full width/height responsive styles frame config parameters
  const iframeStyle = `width:100%; height:100%; border:none; display:block;`;

  switch(screenId) {
    case "DH1":
      // Injects your responsive home content dashboard track dynamically
      viewSpace.innerHTML = `<iframe src="../D-home/D-home.html" style="${iframeStyle}"></iframe>`;
      break;
      
    case "DD1":
      // Injects Period & Pregnancy growth parameters track hub details dashboard page
      viewSpace.innerHTML = `<iframe src="../P-details-dashboard/Button-Details.html" style="${iframeStyle}"></iframe>`;
      break;
      
    case "DC1":
      // Injects the unified chat module application framework dashboard matrix
      viewSpace.innerHTML = `<iframe src="../D-chat/D-chat.html" style="${iframeStyle}"></iframe>`;
      break;
      
    case "DN0":
      // Injects the push configuration notification alerts hub center layout dashboard
      viewSpace.innerHTML = `<iframe src="../D-notification/D-notification.html" style="${iframeStyle}"></iframe>`;
      break;
      
    default:
      // Canonical fallback framework handling configurations logs safety errors
      viewSpace.innerHTML = `<div style="padding: 120px 20px; text-align:center; color:#6F6F6F;">Screen Context Layer Unavailable: ${screenId}</div>`;
  }
}

/**
 * Wire-up triggers handles to safely route viewport maps directly down to main configuration spaces
 */
function initializeHamburgerMenuTrigger() {
  const menuIcon = document.querySelector(".menu-icon");
  
  if (menuIcon) {
    menuIcon.style.cursor = "pointer"; // Ensure it shows a touch/pointer feedback
    
    menuIcon.addEventListener("click", () => {
      // Route out of the Dashboard folder and into the menu folder
      window.location.href = "../menu/M-3line.html";
    });
  }
}
