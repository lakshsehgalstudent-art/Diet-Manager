/**
 * NOURISH — Personal Food Planner & Expense Tracker
 * Vanilla JS, localStorage persistence, IST timezone
 *
 * BUDGET MODEL
 * ─────────────────────────────────────────────────
 * MONTHLY_BUDGET = ₹6300, resets on 1st of every month.
 *
 * Each day is independent:
 *   - "Spent"  = consumed meals + extra expenses logged TODAY only
 *   - "Fund"   = missed meal costs TODAY only (isolated, does not carry over)
 *
 * Monthly Left = MONTHLY_BUDGET − (all past days' real spending this month) − today's spending
 * Budget can go negative (overspend). Shown in red when negative.
 *
 * End-of-day rollover (midnight IST):
 *   Any unused daily fund is silently dropped — it was never deducted
 *   from MONTHLY_BUDGET, so the budget naturally benefits from missed meals.
 *
 * Month resets on the 1st.
 */

/* ─────────────────────────────────────────────
   COST CONSTANTS
───────────────────────────────────────────── */
const COSTS = {
  oats_per_g:      180 / 1000,
  milk_per_ml:     35 / 500,
  banana_each:     20 / 3,
  canteen:         60,
  outside:         80,
  outside_yummy:   120,
  bread_per_slice: 20 / 10,
  egg_each:        185 / 30,
  coffee_sachet:   2,
  snack_chips:     10,
  chicken_250g:    60,
  salad:           30,
  honey_per_use:   50 / 30,
};

function calcOatsBreakfast()      { return Math.round(COSTS.oats_per_g*60 + COSTS.milk_per_ml*250 + COSTS.banana_each*2); }
function calcHoneyToastBreakfast(){ return Math.round(COSTS.bread_per_slice*2 + COSTS.honey_per_use + COSTS.milk_per_ml*250 + COSTS.banana_each*2); }
function calcSnackWithCoffee()    { return Math.round(COSTS.milk_per_ml*250 + COSTS.coffee_sachet + COSTS.snack_chips); }
function calcSnackNoCoffee()      { return Math.round(COSTS.milk_per_ml*250 + COSTS.snack_chips); }
function calcBreadOmelette()      { return Math.round(COSTS.bread_per_slice*4 + COSTS.egg_each*3 + COSTS.banana_each); }
function calcChickenDinner()      { return Math.round(COSTS.chicken_250g + COSTS.salad); }

/* ─────────────────────────────────────────────
   INGREDIENT DEFINITIONS
───────────────────────────────────────────── */
const ING = {
  oatsBreakfast:       [{ key:'oats',    label:'Oats',    qty:60,  unit:'g'      }, { key:'milk', label:'Milk', qty:250, unit:'ml' }, { key:'bananas', label:'Bananas', qty:2, unit:'pcs' }],
  honeyToastBreakfast: [{ key:'bread',   label:'Bread',   qty:2,   unit:'slices' }, { key:'honey', label:'Honey', qty:1, unit:'use' }, { key:'milk', label:'Milk', qty:250, unit:'ml' }, { key:'bananas', label:'Bananas', qty:2, unit:'pcs' }],
  snackCoffee:         [{ key:'milk',    label:'Milk',    qty:250, unit:'ml'     }, { key:'coffee_sachet', label:'Coffee Sachet', qty:1, unit:'pc' }, { key:'snack', label:'Snack (chips/namkeen)', qty:1, unit:'pack' }],
  snackNoCoffee:       [{ key:'milk',    label:'Milk',    qty:250, unit:'ml'     }, { key:'snack', label:'Snack (chips/namkeen)', qty:1, unit:'pack' }],
  breadOmelette:       [{ key:'bread',   label:'Bread',   qty:4,   unit:'slices' }, { key:'eggs', label:'Eggs', qty:3, unit:'pcs' }, { key:'bananas', label:'Bananas', qty:1, unit:'pcs' }],
  chickenDinner:       [{ key:'chicken', label:'Chicken', qty:250, unit:'g'      }, { key:'cucumber', label:'Cucumber', qty:1, unit:'pc' }, { key:'tomato', label:'Tomato', qty:1, unit:'pc' }],
  canteen:      [],
  outside:      [],
  outsideYummy: [],
};

/* ─────────────────────────────────────────────
   WEEKLY MEAL PLAN
───────────────────────────────────────────── */
const DEFAULT_MEAL_PLAN = {
  Monday: [
    { id:'mon-b', name:'Oats & Banana',   type:'Breakfast', emoji:'🥣', time:'8:00 AM', cost:calcOatsBreakfast(),       ingredients:ING.oatsBreakfast,       rawMaterials:ING.oatsBreakfast,       notes:'Oats 60g with warm milk and 2 bananas.' },
    { id:'mon-l', name:'Canteen Food',    type:'Lunch',     emoji:'🏫', time:'1:00 PM', cost:COSTS.canteen,             ingredients:[],                      rawMaterials:ING.canteen,             notes:'' },
    { id:'mon-s', name:'Coffee & Snack',  type:'Snack',     emoji:'☕', time:'4:30 PM', cost:calcSnackWithCoffee(),     ingredients:ING.snackCoffee,         rawMaterials:ING.snackCoffee,         notes:'Milk coffee + chips/namkeen/biscuit.' },
    { id:'mon-d', name:'Bread Omelette',  type:'Dinner',    emoji:'🍳', time:'8:30 PM', cost:calcBreadOmelette(),       ingredients:ING.breadOmelette,       rawMaterials:ING.breadOmelette,       notes:'4 bread slices, 3 eggs, 1 banana.' },
  ],
  Tuesday: [
    { id:'tue-b', name:'Honey Toast',     type:'Breakfast', emoji:'🍞', time:'8:00 AM', cost:calcHoneyToastBreakfast(), ingredients:ING.honeyToastBreakfast, rawMaterials:ING.honeyToastBreakfast, notes:'Toast with honey, milk, and 2 bananas.' },
    { id:'tue-l', name:'Canteen Food',    type:'Lunch',     emoji:'🏫', time:'1:00 PM', cost:COSTS.canteen,             ingredients:[],                      rawMaterials:ING.canteen,             notes:'' },
    { id:'tue-s', name:'Coffee & Snack',  type:'Snack',     emoji:'☕', time:'4:30 PM', cost:calcSnackWithCoffee(),     ingredients:ING.snackCoffee,         rawMaterials:ING.snackCoffee,         notes:'Milk coffee + chips/namkeen/biscuit.' },
    { id:'tue-d', name:'Chicken & Salad', type:'Dinner',    emoji:'🍗', time:'8:30 PM', cost:calcChickenDinner(),       ingredients:ING.chickenDinner,       rawMaterials:ING.chickenDinner,       notes:'250g chicken with cucumber-tomato salad.' },
  ],
  Wednesday: [
    { id:'wed-b', name:'Oats & Banana',   type:'Breakfast', emoji:'🥣', time:'8:00 AM', cost:calcOatsBreakfast(),       ingredients:ING.oatsBreakfast,       rawMaterials:ING.oatsBreakfast,       notes:'Oats 60g with warm milk and 2 bananas.' },
    { id:'wed-l', name:'Canteen Food',    type:'Lunch',     emoji:'🏫', time:'1:00 PM', cost:COSTS.canteen,             ingredients:[],                      rawMaterials:ING.canteen,             notes:'' },
    { id:'wed-s', name:'Milk & Snack',    type:'Snack',     emoji:'🥛', time:'4:30 PM', cost:calcSnackNoCoffee(),       ingredients:ING.snackNoCoffee,       rawMaterials:ING.snackNoCoffee,       notes:'Milk + chips/namkeen/biscuit.' },
    { id:'wed-d', name:'Bread Omelette',  type:'Dinner',    emoji:'🍳', time:'8:30 PM', cost:calcBreadOmelette(),       ingredients:ING.breadOmelette,       rawMaterials:ING.breadOmelette,       notes:'4 bread slices, 3 eggs, 1 banana.' },
  ],
  Thursday: [
    { id:'thu-b', name:'Honey Toast',     type:'Breakfast', emoji:'🍞', time:'8:00 AM', cost:calcHoneyToastBreakfast(), ingredients:ING.honeyToastBreakfast, rawMaterials:ING.honeyToastBreakfast, notes:'Toast with honey, milk, and 2 bananas.' },
    { id:'thu-l', name:'Canteen Food',    type:'Lunch',     emoji:'🏫', time:'1:00 PM', cost:COSTS.canteen,             ingredients:[],                      rawMaterials:ING.canteen,             notes:'' },
    { id:'thu-s', name:'Milk & Snack',    type:'Snack',     emoji:'🥛', time:'4:30 PM', cost:calcSnackNoCoffee(),       ingredients:ING.snackNoCoffee,       rawMaterials:ING.snackNoCoffee,       notes:'Milk + chips/namkeen/biscuit.' },
    { id:'thu-d', name:'Bread Omelette',  type:'Dinner',    emoji:'🍳', time:'8:30 PM', cost:calcBreadOmelette(),       ingredients:ING.breadOmelette,       rawMaterials:ING.breadOmelette,       notes:'4 bread slices, 3 eggs, 1 banana.' },
  ],
  Friday: [
    { id:'fri-b', name:'Oats & Banana',   type:'Breakfast', emoji:'🥣', time:'8:00 AM', cost:calcOatsBreakfast(),       ingredients:ING.oatsBreakfast,       rawMaterials:ING.oatsBreakfast,       notes:'Oats 60g with warm milk and 2 bananas.' },
    { id:'fri-l', name:'Canteen Food',    type:'Lunch',     emoji:'🏫', time:'1:00 PM', cost:COSTS.canteen,             ingredients:[],                      rawMaterials:ING.canteen,             notes:'' },
    { id:'fri-s', name:'Milk & Snack',    type:'Snack',     emoji:'🥛', time:'4:30 PM', cost:calcSnackNoCoffee(),       ingredients:ING.snackNoCoffee,       rawMaterials:ING.snackNoCoffee,       notes:'Milk + chips/namkeen/biscuit.' },
    { id:'fri-d', name:'Bread Omelette',  type:'Dinner',    emoji:'🍳', time:'8:30 PM', cost:calcBreadOmelette(),       ingredients:ING.breadOmelette,       rawMaterials:ING.breadOmelette,       notes:'4 bread slices, 3 eggs, 1 banana.' },
  ],
  Saturday: [
    { id:'sat-b', name:'Honey Toast',     type:'Breakfast', emoji:'🍞', time:'8:00 AM', cost:calcHoneyToastBreakfast(), ingredients:ING.honeyToastBreakfast, rawMaterials:ING.honeyToastBreakfast, notes:'Toast with honey, milk, and 2 bananas.' },
    { id:'sat-l', name:'Outside Food',    type:'Lunch',     emoji:'🍽️', time:'1:00 PM', cost:COSTS.outside,            ingredients:[],                      rawMaterials:ING.outside,             notes:'' },
    { id:'sat-s', name:'Milk & Snack',    type:'Snack',     emoji:'🥛', time:'4:30 PM', cost:calcSnackNoCoffee(),       ingredients:ING.snackNoCoffee,       rawMaterials:ING.snackNoCoffee,       notes:'Milk + chips/namkeen/biscuit.' },
    { id:'sat-d', name:'Chicken & Salad', type:'Dinner',    emoji:'🍗', time:'8:30 PM', cost:calcChickenDinner(),       ingredients:ING.chickenDinner,       rawMaterials:ING.chickenDinner,       notes:'250g chicken with cucumber-tomato salad.' },
  ],
  Sunday: [
    { id:'sun-b', name:'Oats & Banana',      type:'Breakfast', emoji:'🥣', time:'9:00 AM', cost:calcOatsBreakfast(),      ingredients:ING.oatsBreakfast,  rawMaterials:ING.oatsBreakfast,  notes:'Oats 60g with warm milk and 2 bananas.' },
    { id:'sun-l', name:'Outside Food',       type:'Lunch',     emoji:'🍽️', time:'1:30 PM', cost:COSTS.outside,            ingredients:[],                 rawMaterials:ING.outside,        notes:'' },
    { id:'sun-s', name:'Milk & Snack',       type:'Snack',     emoji:'🥛', time:'4:30 PM', cost:calcSnackNoCoffee(),      ingredients:ING.snackNoCoffee,  rawMaterials:ING.snackNoCoffee,  notes:'Milk + chips/namkeen/biscuit.' },
    { id:'sun-d', name:'Yummy Outside Food', type:'Dinner',    emoji:'🌟', time:'8:30 PM', cost:COSTS.outside_yummy,      ingredients:[],                 rawMaterials:ING.outsideYummy,   notes:'Treat yourself.' },
  ],
};

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const MONTHLY_BUDGET = 6300;
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/* ─────────────────────────────────────────────
   STATE SHAPE
   ─────────────────────────────────────────────
   state.today = {
     dateKey,        // 'YYYY-M-D'  — used to detect day rollover
     mealStatuses,   // { mealId: 'consumed' | 'missed' }
     extraExpenses,  // [{ id, name, amount, timestamp }]
   }
   state.monthKey   = 'YYYY-M'  — used to detect month rollover
   state.monthSpent = cumulative REAL spending of completed days this month
                      (consumed meals + extra expenses from closed days only)
                      Today's live spending is computed on top of this.
───────────────────────────────────────────── */
let state = {
  today: { dateKey:'', mealStatuses:{}, extraExpenses:[] },
  monthKey:   '',
  monthSpent: 0,
};

/* ─────────────────────────────────────────────
   IST UTILS
───────────────────────────────────────────── */
function getIST() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
}
function getISTHours() { return getIST().getHours(); }
function getTodayKey() { const d = getIST(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
function getMonthKey() { const d = getIST(); return `${d.getFullYear()}-${d.getMonth()}`; }
function formatTime12(h, m) { return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`; }

/* ─────────────────────────────────────────────
   PERSISTENCE
───────────────────────────────────────────── */
function saveState() {
  localStorage.setItem('nourish_state_v3', JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem('nourish_state_v3');
    if (raw) state = JSON.parse(raw);
  } catch(e) { console.warn('State load failed:', e); }
  reconcileState();
}

/**
 * reconcileState — handles day and month rollovers.
 * Called on init and every minute in the tick loop.
 *
 * Day rollover logic:
 *   1. Calculate real spending from the closing day (consumed + extra expenses).
 *   2. Add it to monthSpent (the running monthly total).
 *   3. Unused fund (missed meal savings) is simply dropped —
 *      since it was never subtracted from monthSpent, the monthly
 *      budget automatically benefits. No extra logic needed.
 *   4. Open a fresh today object.
 */
function reconcileState() {
  const todayKey = getTodayKey();
  const monthKey = getMonthKey();
  let dirty = false;

  // Month rollover (1st of new month)
  if (state.monthKey !== monthKey) {
    state.monthKey   = monthKey;
    state.monthSpent = 0;
    dirty = true;
  }

  // Day rollover (midnight IST)
  if (state.today.dateKey !== todayKey) {
    // Close out the previous day — commit its real spending to monthSpent
    if (state.today.dateKey) {
      state.monthSpent += calcDayRealSpent(state.today);
    }
    // Open fresh today
    state.today = { dateKey: todayKey, mealStatuses: {}, extraExpenses: [] };
    dirty = true;
  }

  if (dirty) saveState();
}

/**
 * calcDayRealSpent — sums consumed meal costs + extra expenses for a day snapshot.
 * Missed meals are NOT included (they are savings, not spending).
 */
function calcDayRealSpent(daySnap) {
  const [y, mo, d] = daySnap.dateKey.split('-').map(Number);
  const dayName = DAYS[new Date(y, mo, d).getDay()];
  const meals   = DEFAULT_MEAL_PLAN[dayName] || [];
  let total = 0;
  meals.forEach(m => { if (daySnap.mealStatuses[m.id] === 'consumed') total += m.cost; });
  (daySnap.extraExpenses || []).forEach(e => { total += e.amount; });
  return total;
}

/* ─────────────────────────────────────────────
   MEALS
───────────────────────────────────────────── */
function getTodayMeals()    { return DEFAULT_MEAL_PLAN[DAYS[getIST().getDay()]] || []; }
function getTomorrowMeals() { return DEFAULT_MEAL_PLAN[DAYS[(getIST().getDay()+1)%7]] || []; }

/* ─────────────────────────────────────────────
   FINANCE CALCULATIONS
───────────────────────────────────────────── */
function calcFinance() {
  const meals = getTodayMeals();
  let todaySpent = 0;
  let todayFund  = 0;

  meals.forEach(meal => {
    const s = state.today.mealStatuses[meal.id];
    if (s === 'consumed') todaySpent += meal.cost;
    if (s === 'missed')   todayFund  += meal.cost;
  });
  state.today.extraExpenses.forEach(e => { todaySpent += e.amount; });

  // Monthly Left = full budget minus all closed days minus today's live spending
  const monthLeft = MONTHLY_BUDGET - state.monthSpent - todaySpent;

  return { monthLeft, todaySpent, todayFund };
}

/* ─────────────────────────────────────────────
   UPDATE OVERVIEW CARD
───────────────────────────────────────────── */
function updateOverview() {
  const { monthLeft, todaySpent, todayFund } = calcFinance();

  const budgetEl = document.getElementById('metricBudget');
  const spentEl  = document.getElementById('metricSpent');
  const fundEl   = document.getElementById('metricFund');
  const barEl    = document.getElementById('spendBar');

  // Monthly Left (can go negative)
  animateValue(budgetEl, monthLeft < 0 ? `-₹${Math.abs(monthLeft)}` : `₹${monthLeft}`);
  budgetEl.style.color = monthLeft < 0 ? 'var(--red)' : 'var(--text)';

  // Today's spend
  animateValue(spentEl, `₹${todaySpent}`);
  spentEl.style.color = 'var(--accent)';

  // Today's fund (missed savings, today only)
  animateValue(fundEl, `₹${todayFund}`);
  fundEl.style.color = todayFund > 0 ? 'var(--green)' : 'var(--text2)';

  // Spend bar against daily slice (₹6300 / 30 ≈ ₹210/day)
  const dailySlice = MONTHLY_BUDGET / 30;
  const pct = Math.min((todaySpent / dailySlice) * 100, 100);
  barEl.style.width = `${pct}%`;
  barEl.style.background = pct > 85
    ? 'linear-gradient(90deg, var(--red), #f09060)'
    : 'linear-gradient(90deg, var(--accent2), var(--accent))';

  // Relabel "Budget" → "Monthly Left"
  const lbl = budgetEl.closest('.metric-block')?.querySelector('.metric-label');
  if (lbl && lbl.textContent !== 'Monthly Left') lbl.textContent = 'Monthly Left';
}

function animateValue(el, newText) {
  if (el.textContent === newText) return;
  el.classList.remove('pulse');
  void el.offsetWidth;
  el.classList.add('pulse');
  el.textContent = newText;
}

/* ─────────────────────────────────────────────
   CLOCK & DATE
───────────────────────────────────────────── */
function updateClock() {
  const ist = getIST();
  document.getElementById('liveClock').textContent = formatTime12(ist.getHours(), ist.getMinutes());
  const day = DAYS[ist.getDay()];
  document.getElementById('dayName').textContent = day;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('dateStr').textContent  = `${ist.getDate()} ${months[ist.getMonth()]} ${ist.getFullYear()}`;
  document.getElementById('todayLabel').textContent = day;
}

/* ─────────────────────────────────────────────
   RENDER MEALS TIMELINE
───────────────────────────────────────────── */
function renderMeals() {
  const container = document.getElementById('mealsTimeline');
  const meals = getTodayMeals();
  container.innerHTML = '';

  meals.forEach(meal => {
    const status = state.today.mealStatuses[meal.id] || 'pending';
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
            <button class="status-chip chip-consumed ${status==='consumed'?'active':''}"
              data-meal="${meal.id}" data-action="consumed">✓</button>
            <button class="status-chip chip-missed ${status==='missed'?'active':''}"
              data-meal="${meal.id}" data-action="missed">✕</button>
          </div>
        </div>
      </div>
    `;

    card.querySelectorAll('.status-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        markMeal(meal.id, btn.dataset.action);
      });
    });

    attachSwipe(card, meal);
    card.addEventListener('click', () => { if (!card._swiping) openDrawer(meal); });
    container.appendChild(card);
  });
}

/* ─────────────────────────────────────────────
   SWIPE GESTURE HANDLER
───────────────────────────────────────────── */
function attachSwipe(card, meal) {
  let startX=0, startY=0, dx=0, active=false;
  const THRESHOLD = 80;

  function onStart(e) {
    const t = e.touches?e.touches[0]:e;
    startX=t.clientX; startY=t.clientY; dx=0; active=true; card._swiping=false;
  }
  function onMove(e) {
    if (!active) return;
    const t = e.touches?e.touches[0]:e;
    dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dy) > Math.abs(dx)*1.2) { active=false; return; }
    if (Math.abs(dx) > 6) { card._swiping=true; e.preventDefault(); }
    card.classList.toggle('swiping-right', dx>20);
    card.classList.toggle('swiping-left',  dx<-20);
    card.style.transform = `translateX(${dx*0.35}px)`;
  }
  function onEnd() {
    if (!active) return;
    active=false;
    card.classList.remove('swiping-right','swiping-left');
    card.style.transform='';
    if (dx > THRESHOLD)       markMeal(meal.id,'consumed');
    else if (dx < -THRESHOLD) markMeal(meal.id,'missed');
    setTimeout(()=>{ card._swiping=false; },50);
  }

  card.addEventListener('touchstart', onStart, {passive:true});
  card.addEventListener('touchmove',  onMove,  {passive:false});
  card.addEventListener('touchend',   onEnd);
  card.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', (e)=>{ if(active) onMove(e); });
  window.addEventListener('mouseup',   ()  =>{ if(active) onEnd();  });
}

/* ─────────────────────────────────────────────
   MEAL STATUS UPDATE
───────────────────────────────────────────── */
function markMeal(mealId, status) {
  if (state.today.mealStatuses[mealId] === status) {
    delete state.today.mealStatuses[mealId];
  } else {
    state.today.mealStatuses[mealId] = status;
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

  const ingList    = document.getElementById('drawerIngredients');
  const items      = (meal.rawMaterials && meal.rawMaterials.length) ? meal.rawMaterials : meal.ingredients;
  ingList.innerHTML = items.length === 0
    ? '<li class="drawer-ingredient-item"><span style="color:var(--text3)">No raw materials needed</span><span></span></li>'
    : items.map(i=>`<li class="drawer-ingredient-item"><span>${i.label||i.name}</span><span>${i.qty} ${i.unit}</span></li>`).join('');

  const notesSection = document.getElementById('drawerNotesSection');
  if (meal.notes) {
    document.getElementById('drawerNotes').textContent = meal.notes;
    notesSection.classList.remove('hidden');
  } else {
    notesSection.classList.add('hidden');
  }
  document.getElementById('drawerOverlay').classList.remove('hidden');
}

document.getElementById('drawerClose').addEventListener('click', ()=>{ document.getElementById('drawerOverlay').classList.add('hidden'); });
document.getElementById('drawerOverlay').addEventListener('click', (e)=>{ if(e.target===document.getElementById('drawerOverlay')) document.getElementById('drawerOverlay').classList.add('hidden'); });

/* ─────────────────────────────────────────────
   RAW MATERIAL AGGREGATION
───────────────────────────────────────────── */
function aggregateRawMaterials(meals) {
  const merged = {};
  meals.forEach(meal => {
    (meal.rawMaterials||[]).forEach(ing => {
      if (merged[ing.key]) merged[ing.key].qty += ing.qty;
      else merged[ing.key] = { label:ing.label, qty:ing.qty, unit:ing.unit };
    });
  });
  return Object.values(merged).sort((a,b)=>a.label.localeCompare(b.label));
}

/* ─────────────────────────────────────────────
   PREP CARD
───────────────────────────────────────────── */
function updatePrepCard() {
  const lockEl    = document.getElementById('prepLock');
  const contentEl = document.getElementById('prepContent');
  const ingList   = document.getElementById('prepIngredients');

  if (getISTHours() < 15) {
    lockEl.classList.remove('hidden');
    contentEl.classList.add('hidden');
    return;
  }
  lockEl.classList.add('hidden');
  contentEl.classList.remove('hidden');

  const items = aggregateRawMaterials(getTomorrowMeals());
  if (items.length === 0) {
    ingList.innerHTML = '<li class="ingredient-item"><span class="ingredient-name">Nothing needed — all meals outside.</span><span></span></li>';
    return;
  }
  ingList.innerHTML = items.map(i=>`
    <li class="ingredient-item">
      <span class="ingredient-name">${i.label}</span>
      <span class="ingredient-qty">${Number.isInteger(i.qty)?i.qty:Math.round(i.qty)} ${i.unit}</span>
    </li>`).join('');
}

/* ─────────────────────────────────────────────
   ADD EXPENSE MODAL
───────────────────────────────────────────── */
document.getElementById('addExpenseBtn').addEventListener('click', ()=>{
  document.getElementById('expenseAmount').value='';
  document.getElementById('expenseName').value='';
  document.getElementById('modalOverlay').classList.remove('hidden');
  setTimeout(()=>document.getElementById('expenseAmount').focus(), 300);
});
document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e)=>{ if(e.target===document.getElementById('modalOverlay')) closeModal(); });
document.getElementById('modalConfirm').addEventListener('click', submitExpense);
document.getElementById('expenseAmount').addEventListener('keydown', (e)=>{ if(e.key==='Enter') submitExpense(); });

function closeModal() { document.getElementById('modalOverlay').classList.add('hidden'); }

function submitExpense() {
  const amountEl = document.getElementById('expenseAmount');
  const nameEl   = document.getElementById('expenseName');
  const amount   = parseFloat(amountEl.value);
  if (!amount || amount <= 0) {
    amountEl.style.borderColor='var(--red)';
    setTimeout(()=>amountEl.style.borderColor='',800);
    return;
  }
  state.today.extraExpenses.push({ id:Date.now(), name:nameEl.value.trim()||'Expense', amount, timestamp:new Date().toISOString() });
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
  if (!state.today.extraExpenses.length) return;
  state.today.extraExpenses.slice().reverse().forEach(exp=>{
    const item = document.createElement('div');
    item.className = 'expense-item';
    item.innerHTML = `
      <div class="expense-item-left">
        <div class="expense-dot"></div>
        <span class="expense-label">${exp.name}</span>
      </div>
      <span class="expense-amount">-₹${exp.amount}</span>`;
    container.appendChild(item);
  });
}

/* ─────────────────────────────────────────────
   MAIN TICK (every second)
───────────────────────────────────────────── */
let lastMinute = -1;

function tick() {
  updateClock();
  const currentMinute = getIST().getMinutes();
  if (currentMinute !== lastMinute) {
    lastMinute = currentMinute;
    reconcileState(); // silently handles day/month rollovers
    updatePrepCard();
    updateOverview();
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
