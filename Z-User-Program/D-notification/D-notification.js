/**
 * Pink Cycle - Clean Component Level Notification Engine
 * Manages polymorphic item configurations, internal sorting metrics, 
 * navigation path targets, and mobile micro-interaction swipes.
 */

// Global state tracking — Defaults directly to LIFO (Recent) time-based rendering
let notification_sortby = null; 

// ==========================================================================
// 1. SPECIFIED COMPONENT SCHEMAS (Functions kept exactly as requested)
// ==========================================================================

function new_user(user_name) {
  return {
    id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    category: 'other',
    headline: 'Welcome to Pink Cycle',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    routeTarget: '../MyProfile/MyProfile.html',
    message: `Hi ${user_name}, welcome to our period tracking family! We are thrilled to guide you on this journey toward self-care, wellness, and body literacy. Thank you for trusting us.`,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
  };
}

function period_alert(user_name, reminder_day) {
  return {
    id: `prd-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    category: 'period',
    headline: 'Cycle Update',
    timestamp: new Date(Date.now() - 1000 * 60 * 22), // 22 minutes ago
    routeTarget: '../HealthTrackerAndCycleLogs/HealthTrackerAndCycleLogs.html',
    message: `Dear ${user_name}, this is a friendly tracking update that your upcoming menstrual cycle is anticipated to begin within ${reminder_day} days. Stay prepared!`,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
  };
}

function period_details_reminder(period_day) {
  return {
    id: `prd-det-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    category: 'other',
    headline: 'Log Your Symptoms',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    routeTarget: '../HealthTrackerAndCycleLogs/HealthTrackerAndCycleLogs.html',
    message: `Keep your history accurate! You can now fill up your period detail parameters for day ${period_day} of your active cycle.`,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`
  };
}

function doctor_appointment_set(dr_name, appointment_time, appointment_date) {
  return {
    id: `apt-set-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    category: 'appointment',
    headline: 'Appointment Confirmed',
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
    routeTarget: '../HelpAndSupport/HelpAndSupport.html',
    message: `Your appointment is successfully set with ${dr_name} at ${appointment_time} on ${appointment_date}. Please check in on time.`,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
  };
}

function doctor_appointment_accepted(dr_name, appointment_time, appointment_date) {
  return {
    id: `apt-acc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    category: 'appointment',
    headline: 'Request Accepted',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    routeTarget: '../HelpAndSupport/HelpAndSupport.html',
    message: `Great news! Your clinical consultation request has been accepted with ${dr_name} at ${appointment_time} on ${appointment_date}.`,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
  };
}

function doctor_appointment_canceled(dr_name, appointment_time, appointment_date) {
  return {
    id: `apt-can-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    category: 'appointment',
    headline: 'Appointment Canceled',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
    routeTarget: '../HelpAndSupport/HelpAndSupport.html',
    message: `Attention: Your appointment was canceled with ${dr_name} at ${appointment_time} on ${appointment_date}. Please rebook if necessary.`,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
  };
}

function doctor_appointment_report(dr_name, appointment_time, appointment_date) {
  return {
    id: `apt-rep-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    category: 'appointment',
    headline: 'Reports Dispatched',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    routeTarget: '../HelpAndSupport/HelpAndSupport.html',
    message: `Your diagnostic evaluation and appointment reports were securely sent to the developer with ${dr_name} at ${appointment_time} on ${appointment_date}.`,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
  };
}

// ==========================================================================
// 2. DATA POOL STATE
// ==========================================================================
let databaseNotifications = [
  new_user("Sneha"),
  period_alert("Sneha", 3),
  period_details_reminder(2),
  doctor_appointment_set("Dr. Alisha Shrestha", "10:30 AM", "July 24, 2026"),
  doctor_appointment_accepted("Dr. Rohan Thapa", "2:15 PM", "July 26, 2026"),
  doctor_appointment_canceled("Dr. Bikram Shah", "09:00 AM", "July 19, 2026"),
  doctor_appointment_report("Dr. Priya Sharma", "4:00 PM", "July 20, 2026")
];

// Time Relative Label Generator
function calculateTimeAgo(pastDate) {
  const msDifference = Date.now() - new Date(pastDate).getTime();
  const minutes = Math.floor(msDifference / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ==========================================================================
// 3. CORE DOM RENDERING FLOW
// ==========================================================================
function renderNotificationFeed() {
  const container = document.getElementById('notification-feed-container');
  if (!container) return;

  container.innerHTML = '';
  let processingQueue = [...databaseNotifications];

  // Internal Sorting Engine Rules Execution
  if (notification_sortby === 'priority') {
    const priorityWeight = { 'appointment': 1, 'period': 2, 'other': 3 };
    processingQueue.sort((a, b) => {
      if (priorityWeight[a.category] !== priorityWeight[b.category]) {
        return priorityWeight[a.category] - priorityWeight[b.category];
      }
      return new Date(b.timestamp) - new Date(a.timestamp); // Tie-breaker: Newer items first
    });
  } else {
    // Default LIFO (Last In, First Out) Chronological Matrix
    processingQueue.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  processingQueue.forEach(item => {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = `notification-item-container cat-${item.category}`;
    cardWrapper.dataset.id = item.id;

    cardWrapper.innerHTML = `
      <div class="delete-action-underlay">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </div>
      <div class="notification-card-foreground">
        <div class="icon-avatar-badge">
          ${item.iconSvg}
        </div>
        <div class="card-content-column">
          <div class="card-header-row">
            <h4 class="notification-headline-title">${item.headline}</h4>
            <span class="notification-time-stamp">${calculateTimeAgo(item.timestamp)}</span>
          </div>
          <p class="notification-message-body">${item.message}</p>
        </div>
      </div>
    `;

    initializeCardInteraction(cardWrapper, item.routeTarget);
    container.appendChild(cardWrapper);
  });
}

// ==========================================================================
// 4. TOUCH SWIPE & EVENT DELEGATION
// ==========================================================================
function initializeCardInteraction(containerElement, routeTarget) {
  const foreground = containerElement.querySelector('.notification-card-foreground');
  const underlay = containerElement.querySelector('.delete-action-underlay');
  
  let touchStartX = 0;
  let touchCurrentX = 0;

  // Address-holding page router logic trigger
  foreground.addEventListener('click', () => {
    // Blocks redirect if the user was sliding the item open or if it's currently open
    if (Math.abs(touchCurrentX - touchStartX) > 10 || foreground.classList.contains('swiped-left')) {
      if (foreground.classList.contains('swiped-left')) {
        foreground.classList.remove('swiped-left');
      }
      return;
    }
    window.location.href = routeTarget;
  });

  // Touch tracking matrices
  foreground.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  foreground.addEventListener('touchmove', (e) => {
    touchCurrentX = e.touches[0].clientX;
    let displacement = touchCurrentX - touchStartX;

    // Track move drag boundary constraints
    if (displacement < 0 && displacement > -100) {
      foreground.style.transform = `translateX(${displacement}px)`;
    }
  }, { passive: true });

  foreground.addEventListener('touchend', () => {
    let finalDisplacement = touchCurrentX - touchStartX;
    foreground.style.transform = ''; // Release inline styling manipulation mechanics back to pure CSS transitions

    if (finalDisplacement < -50) {
      foreground.classList.add('swiped-left');
    } else {
      foreground.classList.remove('swiped-left');
    }
    touchStartX = 0;
    touchCurrentX = 0;
  });

  // Structural Removal Animation trigger
  underlay.addEventListener('click', () => {
    const itemKey = containerElement.dataset.id;
    containerElement.classList.add('purged-collapsed');
    
    setTimeout(() => {
      databaseNotifications = databaseNotifications.filter(n => n.id !== itemKey);
      renderNotificationFeed();
    }, 300);
  });
}

// Global Initialization Bootloader
document.addEventListener('DOMContentLoaded', renderNotificationFeed);
