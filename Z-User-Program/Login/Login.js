// Global Application Runtime Framework Instances
let resendTimerInstance = null;
let currentQuestionIndex = 0;
let temporarySelectedOption = "";

/**
 * Unified Core Parameter Storage Schema Object Box
 * Safely aggregates and captures structural entries across all fields
 */
const userData = {
    name: "",                  // Q1  — String
    lastPeriodDate: "",        // Q2  — Date (YYYY-MM-DD)
    periodLength: 5,           // Q3  — Number (default: 5)
    cycleLength: 28,           // Q4  — Number (default: 28)
    regularity: "",            // Q5  — String
    flow: "",                  // Q6  — String
    pain: "",                  // Q7  — String
    ageGroup: "",              // Q8  — String
    isMarried: ""              // Q9  — String ("Yes" / "No")
};

// Comprehensive Dynamic Validation Questionnaire Deck Matrix Map
const validationSurveyDeck = [
    { id: "name", text: "What is your name?", type: "text", mandatory: true, placeholder: "e.g., Sara" },
    { id: "lastPeriodDate", text: "What was the first day of your last period?", type: "date", mandatory: true },
    { id: "periodLength", text: "How many days does your period usually last?", type: "number", mandatory: true, min: 1, max: 14, default: 5 },
    { id: "cycleLength", text: "How long is your usual cycle? (Count from Day 1 of one period to Day 1 of the next period)", type: "number", mandatory: true, min: 15, max: 45, default: 28 },
    { id: "regularity", text: "Are your periods usually regular or irregular?", type: "select", mandatory: false, options: ["Regular (same dates every month)", "Slightly irregular (1 week difference only)", "Very irregular / unpredictable"] },
    { id: "flow", text: "How would you describe your usual flow?", type: "select", mandatory: false, options: ["Light", "Moderate", "Heavy", "Very heavy"] },
    { id: "pain", text: "Do you experience pain during your period?", type: "select", mandatory: false, options: ["No pain at all", "Mild (doesn't affect my day)", "Moderate (slows me down)", "Severe (need painkillers or rest)"] },
    { id: "ageGroup", text: "What is your age group?", type: "select", mandatory: false, options: ["Under 18", "18–25", "26–35", "36–45", "45+"] },
    { id: "isMarried", text: "Are you married?", type: "select", mandatory: false, options: ["Yes", "No"] }
];

/**
 * Masked structural password clarity visibility switcher router logic
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
 * Handles core localized display viewport rendering routing states
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

    // Launch question generator initialization routines upon accessing panel target view state
    if (screenId === 'lQ1') {
        renderQuestionState();
    }
}

function handleLogin(event) {
    event.preventDefault();
    console.log("Log in successful. Redirecting directly to profile setup steps...");
    navigateTo('lQ1'); 
}

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
    warningBox.classList.add('hidden');
    navigateTo('l3');
}

/**
 * Transition link method executed via verification view completion actions
 */
function handleVerification(event) {
    event.preventDefault();
    console.log("Identity confirmed via OTP dashboard routing panel sequence.");
    navigateTo('lQ1'); 
}

/**
 * Dynamic Interactive Display Engine layout generator for internal box spaces
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

    // Structural component type branch manager selection tree loops
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
 * Internally mounted button tracker validation and navigation execution handler
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
        alert("This selection field is required to establish core system analytics metrics.");
        return;
    }

    if (questionConfig.type === "number" && currentExtractedValue) {
        const structuralNumericValue = parseInt(currentExtractedValue, 10);
        if (structuralNumericValue < questionConfig.min || structuralNumericValue > questionConfig.max) {
            alert(`Value boundaries constraint violation detected. Range: (${questionConfig.min}-${questionConfig.max})`);
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

function advanceQuestionNavigator() {
    currentQuestionIndex++;
    if (currentQuestionIndex < validationSurveyDeck.length) {
        renderQuestionState();
    } else {
        console.log("Questionnaire mapping completed successfully. Finalized data profile matrix array package summaries:", userData);
        
        // Break out of onboarding and launch the primary Dashboard shell frame
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