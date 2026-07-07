document.addEventListener("DOMContentLoaded", () => {
  initializeNavigationBridges();
});

/**
 * Top-Level Breakout Router Actions
 * Uses window.top to safely bypass parent frame encapsulation limits,
 * allowing child components to launch cleanly into full-screen views.
 */
function initializeNavigationBridges() {
  
  // Food Suggestions Click Routings
  document.getElementById("btn-food-suggestion").addEventListener("click", () => {
    console.log("Launching Food Suggestion Portal Context...");
    // window.top.location.href = "../Suggestions/Food-suggestions.html"; 
  });

  // Sanitation Suggestions Click Routings
  document.getElementById("btn-sanitation-suggestion").addEventListener("click", () => {
    console.log("Launching Sanitation Suggestion Portal Context...");
    // window.top.location.href = "../Suggestions/Sanitation-suggestions.html";
  });

  // Medical Interactivity Click Routings
  document.getElementById("btn-doctor-contact").addEventListener("click", () => {
    console.log("Launching Secure Tele-Health Link...");
    // window.top.location.href = "../Doctor/Contact-channels.html";
  });
}