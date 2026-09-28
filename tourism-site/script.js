/* =====================
   Dropdown Panel Logic
===================== */
const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
const dropdownBackdrop = document.getElementById('dropdownBackdrop');

function setPanelTop(panel) {
  const nav = document.querySelector('.site-header');
  const navHeight = nav ? nav.offsetHeight : 64;
  panel.style.top = `${navHeight + 8}px`;
}

dropdownTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const targetId = trigger.getAttribute('data-target');
    const target = document.querySelector(targetId);
    const isOpen = target.getAttribute('aria-hidden') === 'false';

    closeAllDropdowns();

    if (!isOpen) {
      setPanelTop(target);
      target.setAttribute('aria-hidden', 'false');
      dropdownBackdrop.classList.add('show');
    }
  });
});

document.querySelectorAll('.dropdown-close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-close');
    document.querySelector(targetId).setAttribute('aria-hidden', 'true');
    dropdownBackdrop.classList.remove('show');
  });
});

dropdownBackdrop.addEventListener('click', () => {
  closeAllDropdowns();
});

function closeAllDropdowns() {
  document.querySelectorAll('.fullscreen-dropdown').forEach(dd => {
    dd.setAttribute('aria-hidden', 'true');
  });
  dropdownBackdrop.classList.remove('show');
}

/* =====================
   Weather Widget
===================== */
const API_KEY = '4ff248f21df0d1e66029211dd19486f5'; // Replace with your actual key
const weatherTemp = document.querySelector('.weather-temp');
const weatherLocation = document.querySelector('.weather-location');
const weatherDesc = document.querySelector('.weather-desc');
const weatherIcon = document.querySelector('.weather-icon i');

function fetchWeather(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
      weatherLocation.textContent = data.name;
      weatherDesc.textContent = data.weather[0].description;

      const iconCode = data.weather[0].icon;
      weatherIcon.className = `bi`; // reset
      if (iconCode.includes('01')) weatherIcon.classList.add('bi-brightness-high');
      else if (iconCode.includes('02') || iconCode.includes('03')) weatherIcon.classList.add('bi-cloud-sun');
      else if (iconCode.includes('04')) weatherIcon.classList.add('bi-cloudy');
      else if (iconCode.includes('09') || iconCode.includes('10')) weatherIcon.classList.add('bi-cloud-rain');
      else if (iconCode.includes('11')) weatherIcon.classList.add('bi-cloud-lightning');
      else if (iconCode.includes('13')) weatherIcon.classList.add('bi-snow');
      else weatherIcon.classList.add('bi-cloud');
    })
    .catch(() => {
      weatherLocation.textContent = 'Unable to fetch weather';
    });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    pos => {
      fetchWeather(pos.coords.latitude, pos.coords.longitude);
    },
    () => {
      // Fallback: New Delhi
      fetchWeather(28.6139, 77.2090);
    }
  );
} else {
  fetchWeather(28.6139, 77.2090);
}

/* =====================
   Back to Top Button
===================== */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.style.display = 'flex';
  } else {
    backToTop.style.display = 'none';
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =====================
   Newsletter Form → Save to Backend
===================== */
const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterMsg = document.getElementById("newsletterMsg");

newsletterForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = newsletterEmail.value.trim();
  if (!email) {
    newsletterMsg.textContent = "⚠️ Please enter a valid email.";
    newsletterMsg.style.color = "yellow";
    return;
  }

  try {
    // Dynamic API URL: same origin in production, localhost:5000 in local dev
    const isLocalDev =
      window.location.protocol === "file:" ||
      ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && window.location.port !== "5000");

    const endpoint = window.TOURISM_API_URL || (isLocalDev
      ? "http://localhost:5000/api/newsletter/subscribe"
      : "/api/newsletter/subscribe");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      newsletterMsg.textContent = data.message || "✅ Subscribed successfully!";
      newsletterMsg.style.color = "lightgreen";
      newsletterForm.reset();
    } else {
      newsletterMsg.textContent = data.message || "❌ Subscription failed.";
      newsletterMsg.style.color = "red";
    }
  } catch (err) {
    newsletterMsg.textContent = "⚠️ Server error. Try again later.";
    newsletterMsg.style.color = "orange";
    console.error(err);
  }
});


/* =====================
   Footer Year
===================== */
document.getElementById('yearNow').textContent = new Date().getFullYear();

document.getElementById('yearNow').textContent = new Date().getFullYear();


// =====================
// Smart Travel Planner (UPDATED)
// =====================

// Travel Data (States → Cities)
const travelData = {
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Ajmer", "Pushkar"],
  "Kerala": ["Munnar", "Alleppey", "Kochi"],
  "Himachal Pradesh": ["Manali", "Shimla", "Dharamshala"],
  "Goa": ["North Goa", "South Goa"],
  "Uttarakhand": ["Rishikesh", "Haridwar", "Mussoorie"]
};


// =====================
// AI Recommendation
// =====================
function getRecommendation() {
  let budget = document.getElementById("budget").value;
  let type = document.getElementById("type").value;

  let state = "";
  let cities = [];

  // Select state based on type
  if (type === "spiritual") {
    state = "Rajasthan";
  } 
  else if (type === "adventure") {
    state = "Himachal Pradesh";
  } 
  else if (type === "relax") {
    state = "Kerala";
  } 
  else {
    state = "Rajasthan"; // fallback
  }

  cities = travelData[state];

  // Dynamic itinerary (max 4 days)
  let plan = "";
  let maxDays = Math.min(4, cities.length);

  for (let i = 0; i < maxDays; i++) {
    plan += `Day ${i + 1}: ${cities[i]} sightseeing <br>`;
  }

  // Output
  document.getElementById("result").innerHTML = `
    <h5>${state} Tour</h5>

    <b>Cities Covered:</b><br>
    ${cities.join(", ")} <br><br>

    <b>Suggested Plan:</b><br>
    ${plan}
  `;
}



// =====================
// Budget Estimator
// =====================
function calculateBudget() {
  let days = parseInt(document.getElementById("days").value);
  let hotel = parseInt(document.getElementById("hotel").value);

  if (!days || days <= 0) {
    document.getElementById("costResult").style.display = "block";
    document.getElementById("costResult").innerHTML = "⚠️ Please enter valid number of days";
    return;
  }

  // Costs
  let foodPerDay = 800;
  let transportPerDay = 700;

  let stayCost = days * hotel;
  let foodCost = days * foodPerDay;
  let travelCost = days * transportPerDay;

  let total = stayCost + foodCost + travelCost;

  // Fill UI values (IMPORTANT: matches your updated HTML)
  document.getElementById("resDays").innerText = days + " Day(s)";
  document.getElementById("resHotel").innerText = "₹" + hotel + "/day";
  document.getElementById("resStay").innerText = stayCost;
  document.getElementById("resFood").innerText = foodCost;
  document.getElementById("resTransport").innerText = travelCost;
  document.getElementById("resTotal").innerText = total;

  // Show result box
  document.getElementById("costResult").style.display = "block";
}