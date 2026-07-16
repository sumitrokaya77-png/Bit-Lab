document.addEventListener("DOMContentLoaded", () => {
  initializeDashboardNavigation();
});

/**
 * Orchestrates Master View Transitions inside the viewport track
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

  // Initial Boot Sequence: Mount the Home Screen Sub-layout instantly
  switchViewContext("DH1");
}

/**
 * Loads selected screen modules safely inside the iframe viewport
 */
function switchViewContext(screenId) {
  const viewSpace = document.getElementById("dashboard-view-space");

  if (screenId === "DH1") {
    // Injects your responsive home content dashboard track dynamically
    viewSpace.innerHTML = `<iframe src="../D-home/D-home.html" style="width:100%; height:100%; border:none; display:block;"></iframe>`;
  } else {
    // Canvas clearance placeholder path rules for secondary screens (DD1, DC1, etc.)
    viewSpace.innerHTML = `<div style="padding: 120px 20px; text-align:center; color:#6F6F6F;">Screen Context Layer: ${screenId}</div>`;
  }
}

  document.addEventListener("DOMContentLoaded", () => {
    // Target the menu icon by its existing class name
    const menuIcon = document.querySelector(".menu-icon");
    
    if (menuIcon) {
      menuIcon.style.cursor = "pointer"; // Ensure it shows a touch/pointer feedback
      
      menuIcon.addEventListener("click", () => {
        // Route out of the Dashboard folder and into the menu folder
        window.location.href = "../menu/M-3line.html";
      });
    }
  });

