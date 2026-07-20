// ==================== GLOBAL STORAGE VARIABLES ====================

// 1. Login Phase Variables
let loginIdentity = "";
let loginPassword = "";

// 2. Account Creation Phase Variables
let registrationPhone = "";
let registrationPassword = "";
let verificationOTP = "";
let verificationDOB = "";

// 3. Q&A Profile Storage Schema Object Box
const userData = {
    name: "",                  // Q1  — String
    lastPeriodDate: "",        // Q2  — String (YYYY-MM-DD)
    periodLength: 5,           // Q3  — Number
    cycleLength: 28,           // Q4  — Number
    regularity: "",            // Q5  — String
    flow: "",                  // Q6  — String
    pain: "",                  // Q7  — String
    ageGroup: "",              // Q8  — String
    isMarried: ""              // Q9  — String ("Yes" / "No")
};

// Global Interactive State Framework Control Trackers
let resendTimerInstance = null;
let currentQuestionIndex = 0;
let temporarySelectedOption = "";

// Comprehensive Questionnaire Dataset Matrix Map
const validationSurveyDeck = [
    { id: "name", text: "What is your name?", type: "text", mandatory: true, placeholder: "e.g., Sara" },
    { id: "lastPeriodDate", text: "What was the first day of your last period?", type: "date", mandatory: true },
    { id: "periodLength", text: "How many days does your period usually last?", type: "number", mandatory: true, min: 1, max: 14, default: 5 },
    { id: "cycleLength", text: "How long is your usual cycle? (Count from Day 1 of one period to Day 1 of the next period)", type: "number", mandatory: true, min: 15, max: 45, default: 28 },
    { id: "regularity", text: "Are your periods usually regular or irregular?", type: "select", mandatory: false, options: ["Regular (same dates every month)", "Slightly irregular (±1 week difference)", "Very irregular / unpredictable"] },
    { id: "flow", text: "How would you describe your usual flow?", type: "select", mandatory: false, options: ["Light", "Moderate", "Heavy", "Very heavy"] },
    { id: "pain", text: "Do you experience pain during your period?", type: "select", mandatory: false, options: ["No pain at all", "Mild (doesn't affect my day)", "Moderate (slows me down)", "Severe (need painkillers or rest)"] },
    { id: "ageGroup", text: "What is your age group?", type: "select", mandatory: false, options: ["Under 18", "18–25", "26–35", "36–45", "45+"] },
    { id: "isMarried", text: "Are you married?", type: "select", mandatory: false, options: ["Yes", "No"] }
];

// ==================== INTERACTION FLOW CONTROLLERS ====================

/**
 * Directly logs the user into the system, bypassing questionnaire configurations
 */
function handleLogin(event) {
    event.preventDefault();
    
    // Save credentials into variables
    loginIdentity = document.getElementById('login-identity').value.trim();
    loginPassword = document.getElementById('login-password').value;

    console.log("Login captured for identity:", loginIdentity);
    console.log("Redirecting directly to Dashboard tracking view...");
    
    // Smooth bypass route directly out of setup architecture files
    window.location.href = "../Dashboard/Dashboard.html"; 
}

/**
 * Saves initial registration entry keys and proceeds to OTP verification steps
 */
function handleRegistration(event) {
    event.preventDefault();
    const passwordField = document.getElementById('reg-password').value;
    const confirmPasswordField = document.getElementById('reg-confirm-password').value;
    const warningBox = document.getElementById('password-warning');

    const regexRequirements = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    
    if (!regexRequirements.test(passwordField) || passwordField !== confirmPasswordField) {
        warningBox.classList.remove('hidden');
        warningBox.textContent = (passwordField !== confirmPasswordField) ? "Password fields do not match." : "Password must contain letters and numbers.";
        return;
    }

    // Save signup input data into variables
    registrationPhone = document.getElementById('reg-phone').value.trim();
    registrationPassword = passwordField;

    warningBox.classList.add('hidden');
    navigateTo('l3'); // Forward path onto verification panel
}

/**
 * Saves verification payload values and triggers the dynamic profile questionnaire setup cards
 */
function handleVerification(event) {
    event.preventDefault();
    
    // Save code verification tokens into variables
    verificationOTP = document.getElementById('verification-otp').value.trim();
    verificationDOB = document.getElementById('verification-dob').value;

    console.log("Verification completed successfully. Launching configuration questionnaire setup card maps...");
    navigateTo('lQ1'); // New signups securely route to build their personalized profile data card
}

// ==================== CORE UI ENGINE MECHANICAL UTILITIES ====================

/**
 * Masked password text presentation visibility utility switcher
 */
function togglePasswordVisibility(inputFieldId, triggerButtonRef) {
    const inputField = document.getElementById(inputFieldId);
    if (!inputField) return;

    const openEyeIcon = triggerButtonRef.querySelector('.eye-icon.open');
    const closedEyeIcon = triggerButtonRef.querySelector('.eye-icon.closed');

    if (inputField.type === "password") {
        inputField.type = "text";
        openEyeIcon.classList.add('hidden');
        closedEyeIcon.classList.remove('hidden');
    } else {
        inputField.type = "password";
        closedEyeIcon.classList.add('hidden');
        openEyeIcon.classList.remove('hidden');
    }
}

/**
 * Structural view states layout manager router
 */
function navigateTo(screenId) {
    document.querySelectorAll('.auth-screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }

    if (screenId === 'l3') {
        initializeOTPTimer(120);
    } else {
        clearInterval(resendTimerInstance);
    }

    if (screenId === 'lQ1') {
        renderQuestionState();
    }
}

/**
 * Dynamic content generator engine building inside the unified question card box
 */
function renderQuestionState() {
    const questionConfig = validationSurveyDeck[currentQuestionIndex];
    const questionLabel = document.getElementById("question-text");
    const workspaceCanvas = document.getElementById("dynamic-workspace");
    const skipButton = document.getElementById("skip-btn");

    temporarySelectedOption = "";
    questionLabel.textContent = questionConfig.text;

    if (questionConfig.mandatory) {
        skipButton.classList.add("hidden");
    } else {
        skipButton.classList.remove("hidden");
    }

    workspaceCanvas.innerHTML = "";

    switch (questionConfig.type) {
        case "text":
            workspaceCanvas.innerHTML = `<input type="text" id="target-input-node" placeholder="${questionConfig.placeholder || ''}" value="${userData[questionConfig.id]}">`;
            break;
        case "date":
            workspaceCanvas.innerHTML = `<input type="date" id="target-input-node" value="${userData[questionConfig.id]}">`;
            break;
        case "number":
            const explicitVal = userData[questionConfig.id] || questionConfig.default;
            workspaceCanvas.innerHTML = `<input type="number" id="target-input-node" min="${questionConfig.min}" max="${questionConfig.max}" value="${explicitVal}">`;
            break;
        case "select":
            const choicesStackContainer = document.createElement("div");
            choicesStackContainer.className = "options-stack";

            questionConfig.options.forEach(optionText => {
                const pillButton = document.createElement("button");
                pillButton.type = "button";
                pillButton.className = "option-pill";
                pillButton.textContent = optionText;

                if (userData[questionConfig.id] === optionText) {
                    pillButton.classList.add("active-selected");
                    temporarySelectedOption = optionText;
                }

                pillButton.onclick = () => {
                    document.querySelectorAll(".option-pill").forEach(pill => pill.classList.remove("active-selected"));
                    pillButton.classList.add("active-selected");
                    temporarySelectedOption = optionText;
                };
                choicesStackContainer.appendChild(pillButton);
            });
            workspaceCanvas.appendChild(choicesStackContainer);
            break;
    }
}

/**
 * Internal progression button validation tracker
 */
function handleQuestionNext() {
    const questionConfig = validationSurveyDeck[currentQuestionIndex];
    const inputNode = document.getElementById("target-input-node");
    let currentExtractedValue = "";

    if (questionConfig.type === "select") {
        currentExtractedValue = temporarySelectedOption;
    } else if (inputNode) {
        currentExtractedValue = inputNode.value.trim();
    }

    if (questionConfig.mandatory && !currentExtractedValue) {
        alert("This selection field is required.");
        return;
    }

    if (questionConfig.type === "number" && currentExtractedValue) {
        const structuralNumericValue = parseInt(currentExtractedValue, 10);
        if (structuralNumericValue < questionConfig.min || structuralNumericValue > questionConfig.max) {
            alert(`Value boundary constraint error. Allowed range: (${questionConfig.min}-${questionConfig.max})`);
            return;
        }
        currentExtractedValue = structuralNumericValue;
    }

    if (currentExtractedValue !== "") {
        userData[questionConfig.id] = currentExtractedValue;
    }

    advanceQuestionNavigator();
}

function handleSkip() {
    const questionConfig = validationSurveyDeck[currentQuestionIndex];
    if (!questionConfig.mandatory) {
        userData[questionConfig.id] = "";
    }
    advanceQuestionNavigator();
}

/**
 * Directs sequential questionnaire matrix operations forward to dashboard landing maps
 */
function advanceQuestionNavigator() {
    currentQuestionIndex++;
    if (currentQuestionIndex < validationSurveyDeck.length) {
        renderQuestionState();
    } else {
        console.log("New Account Profile complete! Ready to load tracker dashboards. Summary profiles mapping structures:", userData);
        
        // Pass setup profiles parameters cleanly forward into tracking dashboard files
        window.location.href = "../Dashboard/Dashboard.html";
    }
}

function initializeOTPTimer(totalSecondsDuration) {
    clearInterval(resendTimerInstance);
    const displayElement = document.getElementById('countdown-timer');
    let timeRemaining = totalSecondsDuration;

    function renderTickUpdate() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        displayElement.textContent = `Re-send in ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')} sec`;

        if (timeRemaining <= 0) {
            clearInterval(resendTimerInstance);
            displayElement.textContent = "Resend OTP";
        }
        timeRemaining--;
    }
    renderTickUpdate();
    resendTimerInstance = setInterval(renderTickUpdate, 1000);
}
