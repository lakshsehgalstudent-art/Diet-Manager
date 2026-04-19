/**
 * NOURISH — Personal Food Planner & Expense Tracker
 * Vanilla JS, localStorage persistence, IST timezone
 */

/* ─────────────────────────────────────────────
   COST CONSTANTS
───────────────────────────────────────────── */
const COSTS = {
  oats_per_g:       180 / 1000,       // ₹0.18/g
  milk_per_ml:      35 / 500,         // ₹0.07/ml
  bananas_3:        20,               // 3 bananas = ₹20
  banana_each:      20 / 3,
  canteen:          60,
  outside:          80,
  outside_yummy:    120,
  bread_10pack:     20,               // ₹2/slice
  bread_per_slice:  20 / 10,
  eggs_30pack:      185,
  egg_each:         185 / 30,
  coffee_sachet:    2,
  snack_chips:      10,
  chicken_250g:     60,
  salad:            30,               // cucumber + tomato
  honey_monthly:    50,
  honey_per_use:    50 / 30,          // spread over month
};

/* helpers */
function calcOatsBreakfast() {
  // 60g oats + 250ml milk + 2 bananas
  return +(COSTS.oats_per_g * 60 + COSTS.milk_per_ml * 250 + COSTS.banana_each * 2).toFixed(0);
}
function calcHoneyToastBreakfast() {
  // 2 bread slices + honey share + 250ml milk + 2 bananas
  return +(COSTS.bread_per_slice * 2 + COSTS.honey_per_use + COSTS.milk_per_ml * 250 + COSTS.banana_each * 2).toFixed(0);
}
function calcSnackWithCoffee() {
  // 250ml milk + coffee sachet + chips
  return +(COSTS.milk_per_ml * 250 + COSTS.coffee_sachet + COSTS.snack_chips).toFixed(0);
}
function calcSnackNoCoffee() {
  // 250ml milk + chips
  return +(COSTS.milk_per_ml * 250 + COSTS.snack_chips).toFixed(0);
}
function calcBreadOmelette() {
  // 4 bread + 3 eggs + 1 banana
  return +(COSTS.bread_per_slice * 4 + COSTS.egg_each * 3 + COSTS.banana_each).toFixed(0);
}
function calcChickenDinner() {
  // chicken 250g + salad
  return +(COSTS.chicken_250g + COSTS.salad).toFixed(0);
}

/* ─────────────────────────────────────────────
   INGREDIENT DEFINITIONS (normalized keys)
   Each ingredient: { key, label, qty, unit }
   key is used to merge duplicates
───────────────────────────────────────────── */

// Raw ingredient sets per meal type
const ING = {
  oatsBreakfast: [
    { key: 'oats',    label: 'Oats',    qty: 60,  unit: 'g'   },
    { key: 'milk',    label: 'Milk',    qty: 250, unit: 'ml'  },
    { key: 'bananas', label: 'Bananas', qty: 2,   unit: 'pcs' },
  ],
  honeyToastBreakfast: [
    { key: 'bread',   label: 'Bread',   qty: 2,   unit: 'slices' },
    { key: 'honey',   label: 'Honey',   qty: 1,   unit: 'use'  },
    { key: 'milk',    label: 'Milk',    qty: 250, unit: 'ml'   },
    { key: 'bananas', label: 'Bananas', qty: 2,   unit: 'pcs'  },
  ],
  snackCoffee: [
    { key: 'milk',          label: 'Milk',              qty: 250, unit: 'ml'   },
    { key: 'coffee_sachet', label: 'Coffee Sachet',      qty: 1,   unit: 'pc'   },
    { key: 'snack',         label: 'Snack (chips/namkeen)', qty: 1, unit: 'pack'},
  ],
  snackNoCoffee: [
    { key: 'milk',  label: 'Milk',                  qty: 250, unit: 'ml'   },
    { key: 'snack', label: 'Snack (chips/namkeen)',  qty: 1,   unit: 'pack' },
  ],
  breadOmelette: [
    { key: 'bread',   label: 'Bread',   qty: 4, unit: 'slices' },
    { key: 'eggs',    label: 'Eggs',    qty: 3, unit: 'pcs'   },
    { key: 'bananas', label: 'Bananas', qty: 1, unit: 'pcs'   },
  ],
  chickenDinner: [
    { key: 'chicken',  label: 'Chicken',  qty: 250, unit: 'g'   },
    { key: 'cucumber', label: 'Cucumber', qty: 1,   unit: 'pc'  },
    { key: 'tomato',   label: 'Tomato',   qty: 1,   unit: 'pc'  },
  ],
  canteen:  [], // no raw materials
  outside:  [], // no raw materials
  outsideYummy: [], // no raw materials
};

/* ─────────────────────────────────────────────
   WEEKLY MEAL PLAN
───────────────────────────────────────────── */
const DEFAULT_MEAL_PLAN = {
  Monday: [
    {
      id: 'mon-b', name: 'Oats & Banana', type: 'Breakfast', emoji: '🥣',
      time: '8:00 AM', cost: calcOatsBreakfast(),
      ingredients: ING.oatsBreakfast,
      rawMaterials: ING.oatsBreakfast,
      notes: 'Oats 60g with warm milk and 2 bananas.',
    },
    {
      id: 'mon-l', name: 'Canteen Food', type: 'Lunch', emoji: '🏫',
      time: '1:00 PM', cost: COSTS.canteen,
      ingredients: [],
      rawMaterials: ING.canteen,
      notes: '',
    },
    {
      id: 'mon-s', name: 'Coffee & Snack', type: 'Snack', emoji: '☕',
      time: '4:30 PM', cost: calcSnackWithCoffee(),
      ingredients: ING.snackCoffee,
      rawMaterials: ING.snackCoffee,
      notes: 'Milk coffee + chips/namkeen/biscuit.',
    },
    {
      id: 'mon-d', name: 'Bread Omelette', type: 'Dinner', emoji: '🍳',
      time: '8:30 PM', cost: calcBreadOmelette(),
      ingredients: ING.breadOmelette,
      rawMaterials: ING.breadOmelette,
      notes: '4 bread slices, 3 eggs, 1 banana.',
    },
  ],
  Tuesday: [
    {
      id: 'tue-b', name: 'Honey Toast', type: 'Breakfast', emoji: '🍞',
      time: '8:00 AM', cost: calcHoneyToastBreakfast(),
      ingredients: ING.honeyToastBreakfast,
      rawMaterials: ING.honeyToastBreakfast,
      notes: 'Toast with honey, milk, and 2 bananas.',
    },
    {
      id: 'tue-l', name: 'Canteen Food', type: 'Lunch', emoji: '🏫',
      time: '1:00 PM', cost: COSTS.canteen,
      ingredients: [],
      rawMaterials: ING.canteen,
      notes: '',
    },
    {
      id: 'tue-s', name: 'Coffee & Snack', type: 'Snack', emoji: '☕',
      time: '4:30 PM', cost: calcSnackWithCoffee(),
      ingredients: ING.snackCoffee,
      rawMaterials: ING.snackCoffee,
      notes: 'Milk coffee + chips/namkeen/biscuit.',
    },
    {
      id: 'tue-d', name: 'Chicken & Salad', type: 'Dinner', emoji: '🍗',
      time: '8:30 PM', cost: calcChickenDinner(),
      ingredients: ING.chickenDinner,
      rawMaterials: ING.chickenDinner,
      notes: '250g chicken with cucumber-tomato salad.',
    },
  ],
  Wednesday: [
    {
      id: 'wed-b', name: 'Oats & Banana', type: 'Breakfast', emoji: '🥣',
      time: '8:00 AM', cost: calcOatsBreakfast(),
      ingredients: ING.oatsBreakfast,
      rawMaterials: ING.oatsBreakfast,
      notes: 'Oats 60g with warm milk and 2 bananas.',
    },
    {
      id: 'wed-l', name: 'Canteen Food', type: 'Lunch', emoji: '🏫',
      time: '1:00 PM', cost: COSTS.canteen,
      ingredients: [],
      rawMaterials: ING.canteen,
      notes: '',
    },
    {
      id: 'wed-s', name: 'Milk & Snack', type: 'Snack', emoji: '🥛',
      time: '4:30 PM', cost: calcSnackNoCoffee(),
      ingredients: ING.snackNoCoffee,
      rawMaterials: ING.snackNoCoffee,
      notes: 'Milk + chips/namkeen/biscuit.',
    },
    {
      id: 'wed-d', name: 'Bread Omelette', type: 'Dinner', emoji: '🍳',
      time: '8:30 PM', cost: calcBreadOmelette(),
      ingredients: ING.breadOmelette,
      rawMaterials: ING.breadOmelette,
      notes: '4 bread slices, 3 eggs, 1 banana.',
    },
  ],
  Thursday: [
    {
      id: 'thu-b', name: 'Honey Toast', type: 'Breakfast', emoji: '🍞',
      time: '8:00 AM', cost: calcHoneyToastBreakfast(),
      ingredients: ING.honeyToastBreakfast,
      rawMaterials: ING.honeyToastBreakfast,
      notes: 'Toast with honey, milk, and 2 bananas.',
    },
    {
      id: 'thu-l', name: 'Canteen Food', type: 'Lunch', emoji: '🏫',
      time: '1:00 PM', cost: COSTS.canteen,
      ingredients: [],
      rawMaterials: ING.canteen,
      notes: '',
    },
    {
      id: 'thu-s', name: 'Milk & Snack', type: 'Snack', emoji: '🥛',
      time: '4:30 PM', cost: calcSnackNoCoffee(),
      ingredients: ING.snackNoCoffee,
      rawMaterials: ING.snackNoCoffee,
      notes: 'Milk + chips/namkeen/biscuit.',
    },
    {
      id: 'thu-d', name: 'Bread Omelette', type: 'Dinner', emoji: '🍳',
      time: '8:30 PM', cost: calcBreadOmelette(),
      ingredients: ING.breadOmelette,
      rawMaterials: ING.breadOmelette,
      notes: '4 bread slices, 3 eggs, 1 banana.',
    },
  ],
  Friday: [
    {
      id: 'fri-b', name: 'Oats & Banana', type: 'Breakfast', emoji: '🥣',
      time: '8:00 AM', cost: calcOatsBreakfast(),
      ingredients: ING.oatsBreakfast,
      rawMaterials: ING.oatsBreakfast,
      notes: 'Oats 60g with warm milk and 2 bananas.',
    },
    {
      id: 'fri-l', name: 'Canteen Food', type: 'Lunch', emoji: '🏫',
      time: '1:00 PM', cost: COSTS.canteen,
      ingredients: [],
      rawMaterials: ING.canteen,
      notes: '',
    },
    {
      id: 'fri-s', name: 'Milk & Snack', type: 'Snack', emoji: '🥛',
      time: '4:30 PM', cost: calcSnackNoCoffee(),
      ingredients: ING.snackNoCoffee,
      rawMaterials: ING.snackNoCoffee,
      notes: 'Milk + chips/namkeen/biscuit.',
    },
    {
      id: 'fri-d', name: 'Bread Omelette', type: 'Dinner', emoji: '🍳',
      time: '8:30 PM', cost: calcBreadOmelette(),
      ingredients: ING.breadOmelette,
      rawMaterials: ING.breadOmelette,
      notes: '4 bread slices, 3 eggs, 1 banana.',
    },
  ],
  Saturday: [
    {
      id: 'sat-b', name: 'Honey Toast', type: 'Breakfast', emoji: '🍞',
      time: '8:00 AM', cost: calcHoneyToastBreakfast(),
      ingredients: ING.honeyToastBreakfast,
      rawMaterials: ING.honeyToastBreakfast,
      notes: 'Toast with honey, milk, and 2 bananas.',
    },
    {
      id: 'sat-l', name: 'Outside Food', type: 'Lunch', emoji: '🍽️',
      time: '1:00 PM', cost: COSTS.outside,
      ingredients: [],
      rawMaterials: ING.outside,
      notes: '',
    },
    {
      id: 'sat-s', name: 'Milk & Snack', type: 'Snack', emoji: '🥛',
      time: '4:30 PM', cost: calcSnackNoCoffee(),
      ingredients: ING.snackNoCoffee,
      rawMaterials: ING.snackNoCoffee,
      notes: 'Milk + chips/namkeen/biscuit.',
    },
    {
      id: 'sat-d', name: 'Chicken & Salad', type: 'Dinner', emoji: '🍗',
      time: '8:30 PM', cost: calcChickenDinner(),
      ingredients: ING.chickenDinner,
      rawMaterials: ING.chickenDinner,
      notes: '250g chicken with cucumber-tomato salad.',
    },
  ],
  Sunday: [
    {
      id: 'sun-b', name: 'Oats & Banana', type: 'Breakfast', emoji: '🥣',
      time: '9:00 AM', cost: calcOatsBreakfast(),
      ingredients: ING.oatsBreakfast,
      rawMaterials: ING.oatsBreakfast,
      notes: 'Oats 60g with warm milk and 2 bananas.',
    },
    {
      id: 'sun-l', name: 'Outside Food', type: 'Lunch', emoji: '🍽️',
      time: '1:30 PM', cost: COSTS.outside,
      ingredients: [],
      rawMaterials: ING.outside,
      notes: '',
    },
    {
      id: 'sun-s', name: 'Milk & Snack', type: 'Snack', emoji: '🥛',
      time: '4:30 PM', cost: calcSnackNoCoffee(),
      ingredients: ING.snackNoCoffee,
      rawMaterials: ING.snackNoCoffee,
      notes: 'Milk + chips/namkeen/biscuit.',
    },
    {
      id: 'sun-d', name: 'Yummy Outside Food', type: 'Dinner', emoji: '🌟',
      time: '8:30 PM', cost: COSTS.outside_yummy,
      ingredients: [],
      rawMaterials: ING.outsideYummy,
      notes: 'Treat yourself.',
    },
  ],
};

/* ─────────────────────────────────────────────
   STATE & CONSTANTS
───────────────────────────────────────────── */
const BUDGET = 300; // Daily budget in ₹
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

let state = {
  mealStatuses: {},   // { mealId: 'consumed' | 'missed' }
  extraExpenses: [],  // [{ id, name, amount, timestamp }]
  lastResetDate: ''
};

/* ─────────────────────────────────────────────
   PERSISTENCE
───────────────────────────────────────────── */
function saveState() {
  localStorage.setItem('nourish_state_v2', JSON.stringify(state));
}

function loadState() {
  try {
    const saved = localStorage.getItem('nourish_state_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      const todayKey = getTodayKey();
      if (parsed.lastResetDate !== todayKey) {
        // New day — reset daily tracking
        state.lastResetDate = todayKey;
        saveState();
      } else {
        state = parsed;
      }
    } else {
      state.lastResetDate = getTodayKey();
      saveState();
    }
  } catch(e) {
    console.warn('Failed to load state:', e);
  }
}

function getTodayKey() {
  const now = getIST();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

/* ─────────────────────────────────────────────
   IST TIME UTILS
───────────────────────────────────────────── */
function getIST() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
}

function getISTHours() {
  return getIST().getHours();
}

function formatTime12(h, m) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2,'0')} ${period}`;
}

/* ─────────────────────────────────────────────
   CLOCK & DATE
───────────────────────────────────────────── */
function updateClock() {
  const ist = getIST();
  const h = ist.getHours();
  const m = ist.getMinutes();
  document.getElementById('liveClock').textContent = formatTime12(h, m);

  const day = DAYS[ist.getDay()];
  document.getElementById('dayName').textContent = day;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('dateStr').textContent =
    `${ist.getDate()} ${months[ist.getMonth()]} ${ist.getFullYear()}`;

  document.getElementById('todayLabel').textContent = day;
}

/* ─────────────────────────────────────────────
   TODAY'S / TOMORROW'S MEALS
───────────────────────────────────────────── */
function getTodayMeals() {
  const day = DAYS[getIST().getDay()];
  return DEFAULT_MEAL_PLAN[day] || [];
}

function getTomorrowMeals() {
  const ist = getIST();
  const nextDay = DAYS[(ist.getDay() + 1) % 7];
  return DEFAULT_MEAL_PLAN[nextDay] || [];
}

/* ─────────────────────────────────────────────
   FINANCE CALCULATIONS
───────────────────────────────────────────── */
function calcFinance() {
  const meals = getTodayMeals();
  let spent = 0;
  let missedTotal = 0;

  meals.forEach(meal => {
    const status = state.mealStatuses[meal.id];
    if (status === 'consumed') spent += meal.cost;
    if (status === 'missed')   missedTotal += meal.cost;
  });

  // Extra Food Fund = missed meals savings minus extra expenses logged
  const totalExtra = state.extraExpenses.reduce((acc, e) => acc + e.amount, 0);
  const fund = missedTotal - totalExtra;

  return { budget: BUDGET, spent, fund, totalExtra };
}

/* ─────────────────────────────────────────────
   UPDATE OVERVIEW CARD
───────────────────────────────────────────── */
function updateOverview() {
  const { budget, spent, fund } = calcFinance();

  animateValue(document.getElementById('metricBudget'), `₹${budget}`);
  animateValue(document.getElementById('metricSpent'),  `₹${spent}`);
  animateValue(document.getElementById('metricFund'),   fund < 0 ? `-₹${Math.abs(fund)}` : `₹${fund}`);

  document.getElementById('metricFund').style.color = fund < 0 ? 'var(--red)' : 'var(--green)';

  const pct = Math.min((spent / budget) * 100, 100);
  const bar = document.getElementById('spendBar');
  bar.style.width = `${pct}%`;
  bar.style.background = pct > 85
    ? 'linear-gradient(90deg, var(--red), #f09060)'
    : 'linear-gradient(90deg, var(--accent2), var(--accent))';
}

function animateValue(el, newText) {
  if (el.textContent === newText) return;
  el.classList.remove('pulse');
  void el.offsetWidth;
  el.classList.add('pulse');
  el.textContent = newText;
}

/* ─────────────────────────────────────────────
   RENDER MEALS TIMELINE
───────────────────────────────────────────── */
function renderMeals() {
  const container = document.getElementById('mealsTimeline');
  const meals = getTodayMeals();
  container.innerHTML = '';

  meals.forEach(meal => {
    const status = state.mealStatuses[meal.id] || 'pending';
    const card = document.createElement('div');
    card.className = `meal-card ${status !== 'pending' ? status : ''}`;
    card.dataset.id = meal.id;

    card.innerHTML = `
      <div class="swipe-action left-action">✅</div>
      <div class="swipe-action right-action">❌</div>
      <div class="meal-card-inner">
        <div class="meal-tag">${meal.emoji}</div>
        <div class="meal-info">
          <div class="meal-name">${meal.name}</div>
          <div class="meal-time">${meal.type} · ${meal.time}</div>
        </div>
        <div class="meal-right">
          <div class="meal-cost">₹${meal.cost}</div>
          <div class="meal-status-chips">
            <button class="status-chip chip-consumed ${status === 'consumed' ? 'active' : ''}"
              data-meal="${meal.id}" data-action="consumed">✓</button>
            <button class="status-chip chip-missed ${status === 'missed' ? 'active' : ''}"
              data-meal="${meal.id}" data-action="missed">✕</button>
          </div>
        </div>
      </div>
    `;

    // Status chip tap — stop propagation so drawer doesn't open
    card.querySelectorAll('.status-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        markMeal(meal.id, btn.dataset.action);
      });
    });

    attachSwipe(card, meal);
    card.addEventListener('click', () => {
      if (!card._swiping) openDrawer(meal);
    });

    container.appendChild(card);
  });
}

/* ─────────────────────────────────────────────
   SWIPE GESTURE HANDLER
───────────────────────────────────────────── */
function attachSwipe(card, meal) {
  let startX = 0, startY = 0, dx = 0;
  let active = false;
  const THRESHOLD = 80;

  function onStart(e) {
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
    dx = 0;
    active = true;
    card._swiping = false;
  }

  function onMove(e) {
    if (!active) return;
    const touch = e.touches ? e.touches[0] : e;
    dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    if (Math.abs(dy) > Math.abs(dx) * 1.2) { active = false; return; }
    if (Math.abs(dx) > 6) {
      card._swiping = true;
      e.preventDefault();
    }
    card.classList.toggle('swiping-right', dx > 20);
    card.classList.toggle('swiping-left',  dx < -20);
    card.style.transform = `translateX(${dx * 0.35}px)`;
  }

  function onEnd() {
    if (!active) return;
    active = false;
    card.classList.remove('swiping-right', 'swiping-left');
    card.style.transform = '';
    if (dx > THRESHOLD)       markMeal(meal.id, 'consumed');
    else if (dx < -THRESHOLD) markMeal(meal.id, 'missed');
    setTimeout(() => { card._swiping = false; }, 50);
  }

  card.addEventListener('touchstart', onStart, { passive: true });
  card.addEventListener('touchmove',  onMove,  { passive: false });
  card.addEventListener('touchend',   onEnd);
  card.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', (e) => { if (active) onMove(e); });
  window.addEventListener('mouseup',   ()  => { if (active) onEnd();  });
}

/* ─────────────────────────────────────────────
   MEAL STATUS UPDATE
───────────────────────────────────────────── */
function markMeal(mealId, status) {
  // Toggle off if same status tapped again
  if (state.mealStatuses[mealId] === status) {
    delete state.mealStatuses[mealId];
  } else {
    state.mealStatuses[mealId] = status;
  }
  saveState();
  renderMeals();
  updateOverview();
}

/* ─────────────────────────────────────────────
   MEAL DETAIL DRAWER
───────────────────────────────────────────── */
function openDrawer(meal) {
  document.getElementById('drawerTag').textContent   = meal.emoji;
  document.getElementById('drawerTitle').textContent = meal.name;
  document.getElementById('drawerMeta').textContent  = `${meal.type} · ${meal.time} · ₹${meal.cost}`;

  const ingList = document.getElementById('drawerIngredients');
  // Show rawMaterials if available and non-empty, else ingredients
  const displayItems = (meal.rawMaterials && meal.rawMaterials.length)
    ? meal.rawMaterials
    : meal.ingredients;

  if (displayItems.length === 0) {
    ingList.innerHTML = '<li class="drawer-ingredient-item"><span style="color:var(--text3)">No raw materials needed</span><span></span></li>';
  } else {
    ingList.innerHTML = displayItems.map(i => `
      <li class="drawer-ingredient-item">
        <span>${i.label || i.name}</span>
        <span>${i.qty} ${i.unit}</span>
      </li>
    `).join('');
  }

  const notesSection = document.getElementById('drawerNotesSection');
  const notesEl = document.getElementById('drawerNotes');
  if (meal.notes) {
    notesEl.textContent = meal.notes;
    notesSection.classList.remove('hidden');
  } else {
    notesSection.classList.add('hidden');
  }

  document.getElementById('drawerOverlay').classList.remove('hidden');
}

document.getElementById('drawerClose').addEventListener('click', () => {
  document.getElementById('drawerOverlay').classList.add('hidden');
});
document.getElementById('drawerOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('drawerOverlay'))
    document.getElementById('drawerOverlay').classList.add('hidden');
});

/* ─────────────────────────────────────────────
   RAW MATERIAL AGGREGATION
   Merges ingredients by normalized key, sums quantities.
   Skips meals with empty rawMaterials (canteen/outside).
───────────────────────────────────────────── */
function aggregateRawMaterials(meals) {
  const merged = {}; // key → { label, qty, unit }

  meals.forEach(meal => {
    (meal.rawMaterials || []).forEach(ing => {
      if (merged[ing.key]) {
        merged[ing.key].qty += ing.qty;
      } else {
        merged[ing.key] = { label: ing.label, qty: ing.qty, unit: ing.unit };
      }
    });
  });

  return Object.values(merged).sort((a, b) => a.label.localeCompare(b.label));
}

/* ─────────────────────────────────────────────
   PREP CARD
───────────────────────────────────────────── */
function updatePrepCard() {
  const h = getISTHours();
  const lockEl    = document.getElementById('prepLock');
  const contentEl = document.getElementById('prepContent');
  const ingList   = document.getElementById('prepIngredients');

  if (h < 15) {
    lockEl.classList.remove('hidden');
    contentEl.classList.add('hidden');
    return;
  }

  lockEl.classList.add('hidden');
  contentEl.classList.remove('hidden');

  const tomorrowMeals = getTomorrowMeals();
  const items = aggregateRawMaterials(tomorrowMeals);

  if (items.length === 0) {
    ingList.innerHTML = '<li class="ingredient-item"><span class="ingredient-name">Nothing needed — all meals outside.</span><span></span></li>';
    return;
  }

  ingList.innerHTML = items.map(i => {
    // Format quantity nicely
    const qty = Number.isInteger(i.qty) ? i.qty : +i.qty.toFixed(0);
    return `
      <li class="ingredient-item">
        <span class="ingredient-name">${i.label}</span>
        <span class="ingredient-qty">${qty} ${i.unit}</span>
      </li>
    `;
  }).join('');
}

/* ─────────────────────────────────────────────
   ADD EXPENSE MODAL
───────────────────────────────────────────── */
document.getElementById('addExpenseBtn').addEventListener('click', () => {
  document.getElementById('expenseAmount').value = '';
  document.getElementById('expenseName').value = '';
  document.getElementById('modalOverlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('expenseAmount').focus(), 300);
});

document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});
document.getElementById('modalConfirm').addEventListener('click', submitExpense);
document.getElementById('expenseAmount').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitExpense();
});

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

function submitExpense() {
  const amountEl = document.getElementById('expenseAmount');
  const nameEl   = document.getElementById('expenseName');
  const amount   = parseFloat(amountEl.value);

  if (!amount || amount <= 0) {
    amountEl.style.borderColor = 'var(--red)';
    setTimeout(() => amountEl.style.borderColor = '', 800);
    return;
  }

  state.extraExpenses.push({
    id: Date.now(),
    name: nameEl.value.trim() || 'Expense',
    amount,
    timestamp: new Date().toISOString()
  });

  saveState();
  closeModal();
  renderExpenseLog();
  updateOverview();
}

/* ─────────────────────────────────────────────
   EXPENSE LOG
───────────────────────────────────────────── */
function renderExpenseLog() {
  const container = document.getElementById('expenseLog');
  container.innerHTML = '';
  if (state.extraExpenses.length === 0) return;

  state.extraExpenses.slice().reverse().forEach(exp => {
    const item = document.createElement('div');
    item.className = 'expense-item';
    item.innerHTML = `
      <div class="expense-item-left">
        <div class="expense-dot"></div>
        <span class="expense-label">${exp.name}</span>
      </div>
      <span class="expense-amount">-₹${exp.amount}</span>
    `;
    container.appendChild(item);
  });
}

/* ─────────────────────────────────────────────
   MAIN TICK
───────────────────────────────────────────── */
let lastMinute = -1;

function tick() {
  updateClock();
  const ist = getIST();
  const currentMinute = ist.getMinutes();
  if (currentMinute !== lastMinute) {
    lastMinute = currentMinute;
    updatePrepCard();
  }
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
function init() {
  loadState();
  renderMeals();
  updateOverview();
  renderExpenseLog();
  updatePrepCard();
  tick();
  setInterval(tick, 1000);
}

document.addEventListener('DOMContentLoaded', init);
