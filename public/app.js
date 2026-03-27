const form = document.getElementById("plan-form");
const summary = document.getElementById("summary");
const guardrail = document.getElementById("guardrail");
const resultControls = document.getElementById("result-controls");
const resultContext = document.getElementById("result-context");
const toggleViewButton = document.getElementById("toggle-view");
const spotlight = document.getElementById("spotlight");
const results = document.getElementById("results");
const statusNode = document.getElementById("status");
const regionEyebrow = document.getElementById("region-eyebrow");
const regionSubtitle = document.getElementById("region-subtitle");
const regionNotice = document.getElementById("region-notice");
const greenUpRow = document.getElementById("green-up-row");
const slider = form.elements.green_up;
const turfTypeSelect = form.elements.turf_type;
const zipInput = form.elements.zip_code;
const planTierSelect = form.elements.plan_tier;
const sliderOutput = document.getElementById("green-up-output");
const template = document.getElementById("line-item-template");

const storageKey = "greenward.v2.onboarding";
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

let submitTimer = null;
let showingFullPlan = false;
let latestPlan = null;

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function setStatus(text) {
  statusNode.textContent = text;
}

function saveForm() {
  const payload = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function loadForm() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return;
  }

  try {
    const payload = JSON.parse(raw);
    for (const [key, value] of Object.entries(payload)) {
      if (key in form.elements) {
        form.elements[key].value = String(value);
      }
    }
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function deriveRegion(zipCode) {
  if (/^(280|281|282)\d{2}$/.test(zipCode)) {
    return {
      name: "Charlotte Piedmont core",
      subtitle: "Warehouse-smart lawn planning for red clay, transition-zone turf, and HOA expectations.",
      notice: ""
    };
  }

  if (/^\d{5}$/.test(zipCode)) {
    return {
      name: "Outside Charlotte core",
      subtitle: "Plan remains generated from Charlotte Piedmont assumptions until region-specific agronomy is introduced.",
      notice: "This ZIP is outside the Charlotte core heuristic. Results are still Charlotte-tuned and should be reviewed before application."
    };
  }

  return {
    name: "Charlotte Piedmont lawn operations",
    subtitle: "Warehouse-smart lawn planning for red clay, transition-zone turf, and HOA expectations.",
    notice: ""
  };
}

function syncRegionDisplay() {
  const region = deriveRegion(zipInput.value.trim());
  regionEyebrow.textContent = region.name;
  regionSubtitle.textContent = region.subtitle;
  regionNotice.textContent = region.notice;
}

function scheduleSubmit() {
  if (submitTimer) {
    clearTimeout(submitTimer);
  }

  submitTimer = window.setTimeout(() => {
    form.requestSubmit();
  }, 120);
}

function syncTurfSpecificFields() {
  const isBermuda = turfTypeSelect.value === "Bermuda";
  greenUpRow.classList.toggle("hidden", !isBermuda);
  slider.disabled = !isBermuda;
}

function renderSummary(plan) {
  const metrics = [
    ["Visit count", String(plan.visit_count)],
    ["Annual cost", formatMoney(plan.annual_cost)],
    ["Savings vs pro", formatMoney(plan.savings_vs_pro)]
  ];

  summary.innerHTML = metrics.map(([label, value]) => `
    <article class="metric panel">
      <p class="metric-label">${label}</p>
      <p class="metric-value">${value}</p>
    </article>
  `).join("");
}

function renderGuardrail(plan) {
  const first = plan.line_items[0]?.guardrail;
  if (!first) {
    guardrail.innerHTML = "";
    return;
  }

  const cssClass = first.decision === "CLEAR" ? "guardrail-card clear" : "guardrail-card";
  guardrail.innerHTML = `
    <article class="${cssClass}">
      <p class="metric-label">Current directive</p>
      <h2>${first.decision.replaceAll("_", " ")}</h2>
      <p>${first.message}</p>
    </article>
  `;
}

function renderResults(plan) {
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthItems = plan.line_items.filter((item) => item.month === currentMonth);
  const prioritizedItems = currentMonthItems.length > 0
    ? currentMonthItems
    : [plan.line_items[0]].filter(Boolean);

  const activeItems = showingFullPlan ? plan.line_items : prioritizedItems;

  resultControls.classList.remove("hidden");
  resultContext.textContent = showingFullPlan
    ? "Showing full annual plan"
    : currentMonthItems.length > 0
      ? `Showing ${monthNames[currentMonth - 1]} actions first`
      : "No action this month; showing next upcoming action";
  toggleViewButton.textContent = showingFullPlan
    ? "Show month-first view"
    : "Show full annual plan";

  spotlight.innerHTML = "";
  results.innerHTML = "";

  for (const item of activeItems) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector(".line-month").textContent = monthNames[item.month - 1] ?? `Month ${item.month}`;
    node.querySelector(".line-task").textContent = item.task;
    node.querySelector(".line-source").textContent = item.source;
    node.querySelector(".line-product").textContent = item.product;
    node.querySelector(".line-stats").innerHTML = [
      `Bags: ${item.bags}`,
      `Line cost: ${formatMoney(item.line_cost)}`,
      `Coverage: ${item.coverage.toLocaleString()} sq ft`
    ].map((value) => `<span class="stat-pill">${value}</span>`).join("");
    node.querySelector(".line-guardrail").textContent = item.guardrail.message;
    if (showingFullPlan) {
      results.appendChild(node);
    } else {
      spotlight.appendChild(node);
    }
  }
}

toggleViewButton.addEventListener("click", () => {
  if (!latestPlan) {
    return;
  }
  showingFullPlan = !showingFullPlan;
  renderResults(latestPlan);
});

slider.addEventListener("input", () => {
  sliderOutput.textContent = `${slider.value}%`;
  if (!slider.disabled) {
    scheduleSubmit();
  }
});

turfTypeSelect.addEventListener("change", () => {
  syncTurfSpecificFields();
  scheduleSubmit();
});

planTierSelect.addEventListener("change", () => {
  scheduleSubmit();
});

zipInput.addEventListener("input", () => {
  syncRegionDisplay();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Building plan...");
  saveForm();

  const payload = {
    zip_code: form.elements.zip_code.value,
    sq_ft: Number(form.elements.sq_ft.value),
    turf_type: form.elements.turf_type.value,
    plan_tier: form.elements.plan_tier.value,
    rain_forecast: Number(form.elements.rain_forecast.value || 0),
    temp: Number(form.elements.temp.value || 75),
    forecast_window_hours: Number(form.elements.forecast_window_hours.value || 24)
  };

  if (payload.turf_type === "Bermuda") {
    payload.green_up = Number(form.elements.green_up.value || 50);
  }

  try {
    const response = await fetch("/plan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    latestPlan = data;
    renderSummary(data);
    renderGuardrail(data);
    renderResults(data);
    setStatus("Plan ready.");
  } catch (error) {
    summary.innerHTML = "";
    guardrail.innerHTML = "";
    resultControls.classList.add("hidden");
    spotlight.innerHTML = "";
    results.innerHTML = "";
    setStatus(error instanceof Error ? error.message : "Unknown error");
  }
});

loadForm();
sliderOutput.textContent = `${slider.value}%`;
syncTurfSpecificFields();
syncRegionDisplay();
form.requestSubmit();
