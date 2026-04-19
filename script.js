/**
 * NOURISH — Personal Food Planner & Expense Tracker
 * Vanilla JS, localStorage persistence, IST timezone
 */

/* ─────────────────────────────────────────────
   DEFAULT MEAL PLAN DATA
───────────────────────────────────────────── */
const DEFAULT_MEAL_PLAN = {
  Monday: [
    {
      id: 'mon-b', name: 'Masala Oats', type: 'Breakfast', emoji: '🥣',
      time: '8:00 AM', cost: 40,
      ingredients: [
        { name: 'Rolled Oats', qty: 80, unit: 'g' },
        { name: 'Milk', qty: 200, unit: 'ml' },
        { name: 'Onion', qty: 1, unit: 'unit' },
        { name: 'Tomato', qty: 1, unit: 'unit' },
      ],
      notes: 'Add a pinch of turmeric and cumin seeds for flavour.'
    },
    {
      id: 'mon-l', name: 'Dal Rice Combo', type: 'Lunch', emoji: '🍚',
      time: '1:00 PM', cost: 70,
      ingredients: [
        { name: 'Toor Dal', qty: 100, unit: 'g' },
        { name: 'Basmati Rice', qty: 150, unit: 'g' },
        { name: 'Ghee', qty: 10, unit: 'ml' },
        { name: 'Tomato', qty: 1, unit: 'unit' },
      ],
      notes: 'Pressure cook dal for 3 whistles.'
    },
    {
      id: 'mon-s', name: 'Banana & Peanut Butter', type: 'Snack', emoji: '🍌',
      time: '4:30 PM', cost: 30,
      ingredients: [
        { name: 'Banana', qty: 2, unit: 'unit' },
        { name: 'Peanut Butter', qty: 30, unit: 'g' },
      ],
      notes: 'Quick energy snack before evening workout.'
    },
    {
      id: 'mon-d', name: 'Paneer Bhurji', type: 'Dinner', emoji: '🍳',
      time: '8:30 PM', cost: 95,
      ingredients: [
        { name: 'Paneer', qty: 200, unit: 'g' },
        { name: 'Onion', qty: 1, unit: 'unit' },
        { name: 'Capsicum', qty: 1, unit: 'unit' },
        { name: 'Eggs', qty: 2, unit: 'unit' },
        { name: 'Olive Oil', qty: 15, unit: 'ml' },
      ],
      notes: 'High protein dinner. Serve with rotis.'
    },
  ],
  Tuesday: [
    {
      id: 'tue-b', name: 'Poha', type: 'Breakfast', emoji: '🌾',
      time: '8:00 AM', cost: 35,
      ingredients: [
        { name: 'Flattened Rice', qty: 100, unit: 'g' },
        { name: 'Onion', qty: 1, unit: 'unit' },
        { name: 'Peas', qty: 50, unit: 'g' },
        { name: 'Mustard Seeds', qty: 5, unit: 'g' },
        { name: 'Curry Leaves', qty: 10, unit: 'g' },
      ],
      notes: 'Squeeze lemon before serving.'
    },
    {
      id: 'tue-l', name: 'Rajma Chawal', type: 'Lunch', emoji: '🫘',
      time: '1:00 PM', cost: 75,
      ingredients: [
        { name: 'Rajma (Kidney Beans)', qty: 100, unit: 'g' },
        { name: 'Basmati Rice', qty: 150, unit: 'g' },
        { name: 'Tomato', qty: 2, unit: 'unit' },
        { name: 'Onion', qty: 1, unit: 'unit' },
        { name: 'Ghee', qty: 10, unit: 'ml' },
      ],
      notes: 'Soak rajma overnight for best results.'
    },
    {
      id: 'tue-s', name: 'Mixed Fruit Bowl', type: 'Snack', emoji: '🍇',
      time: '4:30 PM', cost: 40,
      ingredients: [
        { name: 'Apple', qty: 1, unit: 'unit' },
        { name: 'Grapes', qty: 100, unit: 'g' },
        { name: 'Pomegranate', qty: 80, unit: 'g' },
      ],
      notes: ''
    },
    {
      id: 'tue-d', name: 'Vegetable Khichdi', type: 'Dinner', emoji: '🥘',
      time: '8:30 PM', cost: 60,
      ingredients: [
        { name: 'Moong Dal', qty: 80, unit: 'g' },
        { name: 'Basmati Rice', qty: 100, unit: 'g' },
        { name: 'Mixed Vegetables', qty: 150, unit: 'g' },
        { name: 'Ghee', qty: 15, unit: 'ml' },
      ],
      notes: 'Comfort food, easy on digestion.'
    },
  ],
  Wednesday: [
    {
      id: 'wed-b', name: 'Upma', type: 'Breakfast', emoji: '🌅',
      time: '8:00 AM', cost: 30,
      ingredients: [
        { name: 'Semolina', qty: 100, unit: 'g' },
        { name: 'Onion', qty: 1, unit: 'unit' },
        { name: 'Green Chilli', qty: 2, unit: 'unit' },
        { name: 'Curry Leaves', qty: 8, unit: 'g' },
        { name: 'Mustard Seeds', qty: 5, unit: 'g' },
      ],
      notes: 'Roast semolina well before cooking.'
    },
    {
      id: 'wed-l', name: 'Chole with Rice', type: 'Lunch', emoji: '🫙',
      time: '1:00 PM', cost: 80,
      ingredients: [
        { name: 'Chickpeas', qty: 120, unit: 'g' },
        { name: 'Basmati Rice', qty: 150, unit: 'g' },
        { name: 'Tomato', qty: 2, unit: 'unit' },
        { name: 'Onion', qty: 1, unit: 'unit' },
        { name: 'Ginger', qty: 15, unit: 'g' },
      ],
      notes: ''
    },
    {
      id: 'wed-s', name: 'Chai & Biscuits', type: 'Snack', emoji: '☕',
      time: '4:30 PM', cost: 20,
      ingredients: [
        { name: 'Milk', qty: 150, unit: 'ml' },
        { name: 'Tea Leaves', qty: 5, unit: 'g' },
        { name: 'Sugar', qty: 10, unit: 'g' },
        { name: 'Biscuits', qty: 4, unit: 'unit' },
      ],
      notes: 'Add cardamom for extra flavour.'
    },
    {
      id: 'wed-d', name: 'Fried Rice', type: 'Dinner', emoji: '🍳',
      time: '8:30 PM', cost: 85,
      ingredients: [
        { name: 'Basmati Rice', qty: 200, unit: 'g' },
        { name: 'Eggs', qty: 2, unit: 'unit' },
        { name: 'Mixed Vegetables', qty: 100, unit: 'g' },
        { name: 'Soy Sauce', qty: 20, unit: 'ml' },
        { name: 'Olive Oil', qty: 15, unit: 'ml' },
      ],
      notes: 'Use cold leftover rice for best texture.'
    },
  ],
  Thursday: [
    {
      id: 'thu-b', name: 'Egg Scramble Toast', type: 'Breakfast', emoji: '🍞',
      time: '8:00 AM', cost: 45,
      ingredients: [
        { name: 'Eggs', qty: 3, unit: 'unit' },
        { name: 'Bread', qty: 2, unit: 'unit' },
        { name: 'Butter', qty: 10, unit: 'g' },
        { name: 'Milk', qty: 30, unit: 'ml' },
      ],
      notes: 'Low heat for creamy scrambled eggs.'
    },
    {
      id: 'thu-l', name: 'Sambar Rice', type: 'Lunch', emoji: '🍲',
      time: '1:00 PM', cost: 65,
      ingredients: [
        { name: 'Toor Dal', qty: 80, unit: 'g' },
        { name: 'Basmati Rice', qty: 150, unit: 'g' },
        { name: 'Drumstick', qty: 100, unit: 'g' },
        { name: 'Tomato', qty: 2, unit: 'unit' },
        { name: 'Tamarind', qty: 20, unit: 'g' },
      ],
      notes: ''
    },
    {
      id: 'thu-s', name: 'Roasted Makhana', type: 'Snack', emoji: '🫙',
      time: '4:30 PM', cost: 35,
      ingredients: [
        { name: 'Fox Nuts (Makhana)', qty: 50, unit: 'g' },
        { name: 'Ghee', qty: 5, unit: 'ml' },
        { name: 'Black Pepper', qty: 3, unit: 'g' },
      ],
      notes: 'Light and protein-rich snack.'
    },
    {
      id: 'thu-d', name: 'Palak Paneer', type: 'Dinner', emoji: '🥬',
      time: '8:30 PM', cost: 105,
      ingredients: [
        { name: 'Spinach', qty: 200, unit: 'g' },
        { name: 'Paneer', qty: 150, unit: 'g' },
        { name: 'Cream', qty: 40, unit: 'ml' },
        { name: 'Onion', qty: 1, unit: 'unit' },
        { name: 'Ginger', qty: 15, unit: 'g' },
      ],
      notes: 'Blanch spinach quickly to preserve colour.'
    },
  ],
  Friday: [
    {
      id: 'fri-b', name: 'Idli & Sambar', type: 'Breakfast', emoji: '🫓',
      time: '8:00 AM', cost: 40,
      ingredients: [
        { name: 'Idli Batter', qty: 200, unit: 'g' },
        { name: 'Toor Dal', qty: 50, unit: 'g' },
        { name: 'Tomato', qty: 1, unit: 'unit' },
        { name: 'Curry Leaves', qty: 5, unit: 'g' },
        { name: 'Coconut Chutney', qty: 40, unit: 'g' },
      ],
      notes: 'Classic South Indian breakfast.'
    },
    {
      id: 'fri-l', name: 'Aloo Sabzi & Roti', type: 'Lunch', emoji: '🫓',
      time: '1:00 PM', cost: 55,
      ingredients: [
        { name: 'Potato', qty: 3, unit: 'unit' },
        { name: 'Whole Wheat Flour', qty: 150, unit: 'g' },
        { name: 'Onion', qty: 1, unit: 'unit' },
        { name: 'Ghee', qty: 10, unit: 'ml' },
      ],
      notes: ''
    },
    {
      id: 'fri-s', name: 'Sprouts Salad', type: 'Snack', emoji: '🥗',
      time: '4:30 PM', cost: 25,
      ingredients: [
        { name: 'Mixed Sprouts', qty: 100, unit: 'g' },
        { name: 'Tomato', qty: 1, unit: 'unit' },
        { name: 'Cucumber', qty: 1, unit: 'unit' },
        { name: 'Lemon', qty: 1, unit: 'unit' },
      ],
      notes: ''
    },
    {
      id: 'fri-d', name: 'Butter Chicken', type: 'Dinner', emoji: '🍗',
      time: '8:30 PM', cost: 130,
      ingredients: [
        { name: 'Chicken', qty: 300, unit: 'g' },
        { name: 'Butter', qty: 30, unit: 'g' },
        { name: 'Cream', qty: 60, unit: 'ml' },
        { name: 'Tomato', qty: 3, unit: 'unit' },
        { name: 'Onion', qty: 1, unit: 'unit' },
      ],
      notes: 'Friday treat! Marinate chicken overnight.'
    },
  ],
  Saturday: [
    {
      id: 'sat-b', name: 'Smoothie Bowl', type: 'Breakfast', emoji: '🥤',
      time: '9:00 AM', cost: 60,
      ingredients: [
        { name: 'Banana', qty: 2, unit: 'unit' },
        { name: 'Milk', qty: 200, unit: 'ml' },
        { name: 'Rolled Oats', qty: 40, unit: 'g' },
        { name: 'Honey', qty: 15, unit: 'ml' },
        { name: 'Chia Seeds', qty: 10, unit: 'g' },
      ],
      notes: 'Top with granola and fresh berries.'
    },
    {
      id: 'sat-l', name: 'Pav Bhaji', type: 'Lunch', emoji: '🫙',
      time: '1:30 PM', cost: 70,
      ingredients: [
        { name: 'Mixed Vegetables', qty: 300, unit: 'g' },
        { name: 'Butter', qty: 40, unit: 'g' },
        { name: 'Pav Buns', qty: 4, unit: 'unit' },
        { name: 'Onion', qty: 2, unit: 'unit' },
        { name: 'Tomato', qty: 2, unit: 'unit' },
      ],
      notes: 'Press the bhaji well while cooking.'
    },
    {
      id: 'sat-s', name: 'Lassi', type: 'Snack', emoji: '🥛',
      time: '4:30 PM', cost: 30,
      ingredients: [
        { name: 'Curd', qty: 200, unit: 'ml' },
        { name: 'Milk', qty: 100, unit: 'ml' },
        { name: 'Sugar', qty: 20, unit: 'g' },
        { name: 'Cardamom', qty: 2, unit: 'g' },
      ],
      notes: 'Sweet or salty — your choice!'
    },
    {
      id: 'sat-d', name: 'Chicken Biryani', type: 'Dinner', emoji: '🍖',
      time: '8:30 PM', cost: 140,
      ingredients: [
        { name: 'Basmati Rice', qty: 250, unit: 'g' },
        { name: 'Chicken', qty: 400, unit: 'g' },
        { name: 'Curd', qty: 100, unit: 'ml' },
        { name: 'Onion', qty: 2, unit: 'unit' },
        { name: 'Saffron', qty: 1, unit: 'g' },
      ],
      notes: 'Dum cook for 20 min on low flame.'
    },
  ],
  Sunday: [
    {
      id: 'sun-b', name: 'Pancakes', type: 'Breakfast', emoji: '🥞',
      time: '9:30 AM', cost: 55,
      ingredients: [
        { name: 'Flour', qty: 120, unit: 'g' },
        { name: 'Eggs', qty: 2, unit: 'unit' },
        { name: 'Milk', qty: 180, unit: 'ml' },
        { name: 'Butter', qty: 20, unit: 'g' },
        { name: 'Honey', qty: 30, unit: 'ml' },
      ],
      notes: 'Sunday indulgence — serve with maple syrup.'
    },
    {
      id: 'sun-l', name: 'Vegetable Pulao', type: 'Lunch', emoji: '🌿',
      time: '2:00 PM', cost: 75,
      ingredients: [
        { name: 'Basmati Rice', qty: 200, unit: 'g' },
        { name: 'Mixed Vegetables', qty: 200, unit: 'g' },
        { name: 'Ghee', qty: 20, unit: 'ml' },
        { name: 'Onion', qty: 1, unit: 'unit' },
        { name: 'Whole Spices', qty: 10, unit: 'g' },
      ],
      notes: 'Serve with raita.'
    },
    {
      id: 'sun-s', name: 'Chocolate Milkshake', type: 'Snack', emoji: '🍫',
      time: '5:00 PM', cost: 45,
      ingredients: [
        { name: 'Milk', qty: 300, unit: 'ml' },
        { name: 'Cocoa Powder', qty: 20, unit: 'g' },
        { name: 'Sugar', qty: 25, unit: 'g' },
        { name: 'Ice Cream', qty: 60, unit: 'g' },
      ],
      notes: ''
    },
    {
      id: 'sun-d', name: 'Mutton Curry & Rice', type: 'Dinner', emoji: '🍖',
      time: '8:30 PM', cost: 160,
      ingredients: [
        { name: 'Mutton', qty: 400, unit: 'g' },
        { name: 'Basmati Rice', qty: 200, unit: 'g' },
        { name: 'Onion', qty: 2, unit: 'unit' },
        { name: 'Tomato', qty: 3, unit: 'unit' },
        { name: 'Curd', qty: 80, unit: 'ml' },
      ],
      notes: 'Slow cook mutton for tender results.'
    },
  ],
};

/* ─────────────────────────────────────────────
   STATE & CONSTANTS
───────────────────────────────────────────── */
const BUDGET = 300; // Daily budget in ₹
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

let state = {
  mealStatuses: {},   // { mealId: 'consumed' | 'missed' | 'pending' }
  extraExpenses: [],  // [{ id, name, amount, timestamp }]
  lastResetDate: ''
};

/* ─────────────────────────────────────────────
   PERSISTENCE
───────────────────────────────────────────── */
function saveState() {
  localStorage.setItem('nourish_state', JSON.stringify(state));
}

function loadState() {
  try {
    const saved = localStorage.getItem('nourish_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset state if a new day has started
      const todayKey = getTodayKey();
      if (parsed.lastResetDate !== todayKey) {
        console.log('New day detected — resetting daily state');
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
  const s = ist.getSeconds();
  document.getElementById('liveClock').textContent = formatTime12(h, m);

  const day = DAYS[ist.getDay()];
  document.getElementById('dayName').textContent = day;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('dateStr').textContent =
    `${ist.getDate()} ${months[ist.getMonth()]} ${ist.getFullYear()}`;

  document.getElementById('todayLabel').textContent = day;
}

/* ─────────────────────────────────────────────
   TODAY'S MEALS
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

  // Extra Food Fund = missed meals budget
  let fund = missedTotal;

  // Deduct extra expenses from fund
  const totalExtra = state.extraExpenses.reduce((acc, e) => acc + e.amount, 0);
  fund -= totalExtra;

  // Add overspend from meals to spent
  const mealOverspend = Math.max(0, spent - BUDGET);

  return {
    budget: BUDGET,
    spent,
    fund,
    mealOverspend,
    totalExtra
  };
}

/* ─────────────────────────────────────────────
   UPDATE OVERVIEW CARD
───────────────────────────────────────────── */
function updateOverview() {
  const { budget, spent, fund } = calcFinance();

  const budgetEl = document.getElementById('metricBudget');
  const spentEl  = document.getElementById('metricSpent');
  const fundEl   = document.getElementById('metricFund');
  const barEl    = document.getElementById('spendBar');

  animateValue(budgetEl, `₹${budget}`);
  animateValue(spentEl,  `₹${spent}`);
  animateValue(fundEl,   fund < 0 ? `-₹${Math.abs(fund)}` : `₹${fund}`);

  // Fund colour
  fundEl.style.color = fund < 0 ? 'var(--red)' : 'var(--green)';

  // Spend bar
  const pct = Math.min((spent / budget) * 100, 100);
  barEl.style.width = `${pct}%`;
  barEl.style.background = pct > 85
    ? 'linear-gradient(90deg, var(--red), #f09060)'
    : 'linear-gradient(90deg, var(--accent2), var(--accent))';
}

function animateValue(el, newText) {
  if (el.textContent === newText) return;
  el.classList.remove('pulse');
  void el.offsetWidth; // reflow
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
          <div class="meal-status-badge">
            ${status === 'consumed' ? 'Eaten' : status === 'missed' ? 'Missed' : ''}
          </div>
        </div>
      </div>
    `;

    attachSwipe(card, meal);
    card.addEventListener('click', (e) => {
      // Only open drawer if not swiping
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

    // Ignore if more vertical than horizontal
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

    if (dx > THRESHOLD) {
      markMeal(meal.id, 'consumed');
    } else if (dx < -THRESHOLD) {
      markMeal(meal.id, 'missed');
    }

    setTimeout(() => { card._swiping = false; }, 50);
  }

  card.addEventListener('touchstart', onStart, { passive: true });
  card.addEventListener('touchmove',  onMove,  { passive: false });
  card.addEventListener('touchend',   onEnd);

  // Mouse fallback for desktop testing
  card.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', (e) => { if (active) onMove(e); });
  window.addEventListener('mouseup',   (e) => { if (active) onEnd(e); });
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
  ingList.innerHTML = meal.ingredients.map(i => `
    <li class="drawer-ingredient-item">
      <span>${i.name}</span>
      <span>${i.qty} ${i.unit}</span>
    </li>
  `).join('');

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
  if (e.target === document.getElementById('drawerOverlay')) {
    document.getElementById('drawerOverlay').classList.add('hidden');
  }
});

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

  // After 3 PM: show tomorrow's aggregated ingredients
  lockEl.classList.add('hidden');
  contentEl.classList.remove('hidden');

  const tomorrowMeals = getTomorrowMeals();
  const merged = {};

  tomorrowMeals.forEach(meal => {
    meal.ingredients.forEach(ing => {
      const key = `${ing.name}__${ing.unit}`;
      if (merged[key]) {
        merged[key].qty += ing.qty;
      } else {
        merged[key] = { name: ing.name, qty: ing.qty, unit: ing.unit };
      }
    });
  });

  const items = Object.values(merged).sort((a,b) => a.name.localeCompare(b.name));

  ingList.innerHTML = items.map(i => `
    <li class="ingredient-item">
      <span class="ingredient-name">${i.name}</span>
      <span class="ingredient-qty">${i.qty} ${i.unit}</span>
    </li>
  `).join('');
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

  const expense = {
    id: Date.now(),
    name: nameEl.value.trim() || 'Expense',
    amount,
    timestamp: new Date().toISOString()
  };

  state.extraExpenses.push(expense);
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
   MAIN TICK (every second)
───────────────────────────────────────────── */
let lastMinute = -1;

function tick() {
  updateClock();
  const ist = getIST();
  const currentMinute = ist.getMinutes();

  // Update prep card when minute changes (or on 3 PM boundary)
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
