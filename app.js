let pricingState = window.pricingData || null;
let holidays = [];

let pricingIndex = {};
let renderOrder = [];

const state = {
  season: "offSeason",
  activeCategory: null,
  activeGroup: {},
  selections: {},
  period: "weekday",
  dateInfo: {},
  splitCount: 1
};

const DEFAULT_LODGING_GROUP = "기타";
const LODGING_TYPE_PLACEHOLDER = "펜션 타입을 선택하면 상세 설명이 표시됩니다.";

// 대분류별 독립적인 상태 관리
const lodgingStates = {};

// 현재 선택된 대분류 (기본값: 대분류1)
let currentLodgingCategory = "대분류1";

// 대분류별 기본 상태 생성 함수
function createLodgingState() {
  return {
    date: null,
    guests: 4,
    skiers: 0, // 리프트+렌탈권 선택에서 자동 계산
    nonSkiers: 0, // 총 숙박 인원 - 스키 인원으로 자동 계산
    selectedTypeId: null,
    selectedTypeGroup: null,
    noLodging: true, // 숙박 없음 체크 여부 (기본값: true)
    autoSeason: true,
    manualSeason: "offSeason",
    resolvedSeason: "offSeason",
    resolvedPeriod: "weekday",
    holidayLabel: null,
    nights: 1, // 숙박 박수 (1박, 2박, 3박)
    checkoutDate: null, // 체크아웃 날짜 (박수에 따라 자동 계산)
    selectedLiftId: "", // 하위 호환성을 위해 유지
    liftSelections: {
      first: {},  // { "liftId": { adult: 0, child: 0 }, ... }
      second: {}, // { "liftId": { adult: 0, child: 0 }, ... }
      third: {}   // { "liftId": { adult: 0, child: 0 }, ... }
    },
    bbqGuests: 0,
    bbqPrice: 0,
    // 각 날짜별 독립적인 날짜 선택 및 계산
    dates: {
      first: null,  // 첫째날 날짜
      second: null, // 둘째날 날짜
      third: null   // 셋째날 날짜
    },
    activeDay: null // 현재 활성화된 날짜 버튼 (null, 'first', 'second', 'third')
  };
}

// 현재 선택된 대분류의 상태 가져오기
function getCurrentLodgingState() {
  if (!lodgingStates[currentLodgingCategory]) {
    lodgingStates[currentLodgingCategory] = createLodgingState();
  }
  return lodgingStates[currentLodgingCategory];
}

// 대분류별 상태 초기화
function initializeLodgingState(categoryName) {
  if (!lodgingStates[categoryName]) {
    lodgingStates[categoryName] = createLodgingState();
  }
  return lodgingStates[categoryName];
}

let lodgingLiftOptions = [];

const categoryNavEl = document.getElementById("category-nav");
const groupNavEl = document.getElementById("group-nav");
const itemGridEl = document.getElementById("item-grid");
const summaryListEl = document.getElementById("selection-list");
const grandTotalEl = document.getElementById("grand-total");
const seasonLabelEl = document.getElementById("season-label");
const dateLabelEl = document.getElementById("date-label");
const timeLabelEl = document.getElementById("time-label");
const resetBtn = document.getElementById("reset-btn");
const seasonButtons = Array.from(document.querySelectorAll(".season-btn"));
const toggleViewBtn = document.getElementById("toggle-view-btn");
const posPanelEl = document.querySelector(".pos-panel");
const periodPillEl = document.getElementById("current-period-pill");
const splitDecreaseBtn = document.getElementById("split-decrease");
const splitIncreaseBtn = document.getElementById("split-increase");
const splitCountInput = document.getElementById("split-count");
const splitAmountEl = document.getElementById("split-amount");
const lodgingPanelEl = document.getElementById("lodging-panel");
const lodgingDateInput = document.getElementById("lodging-date");

// 대분류별 DOM 요소를 가져오는 헬퍼 함수들
function getLodgingElement(selector, category = null) {
  const cat = category || currentLodgingCategory;
  if (selector.includes('id=') || selector.startsWith('#')) {
    // ID 선택자인 경우
    const id = selector.replace('#', '').replace('id=', '');
    if (id.includes('-대분류')) {
      return document.getElementById(id);
    }
    return document.querySelector(`[data-category="${cat}"] ${selector}`) || 
           document.querySelector(`${selector}[data-category="${cat}"]`) ||
           document.getElementById(id);
  }
  // 클래스나 속성 선택자인 경우
  return document.querySelector(`[data-category="${cat}"] ${selector}`) || 
         document.querySelector(`${selector}[data-category="${cat}"]`);
}

function getLodgingElements(selector, category = null) {
  const cat = category || currentLodgingCategory;
  return Array.from(document.querySelectorAll(`[data-category="${cat}"] ${selector}, ${selector}[data-category="${cat}"]`));
}

// 하위 호환성을 위한 기존 변수들 (대분류1용)
const lodgingTypeSelect = document.getElementById("lodging-type-대분류1");
const lodgingGuestsInput = document.querySelector('[data-category="대분류1"].lodging-guests');
const lodgingGuestsDecrease = document.querySelector('[data-category="대분류1"].lodging-guests-dec');
const lodgingGuestsIncrease = document.querySelector('[data-category="대분류1"].lodging-guests-inc');
const lodgingSeasonButtons = Array.from(document.querySelectorAll("[data-lodging-season]"));
const lodgingSeasonAutoInput = document.querySelector('[data-category="대분류1"].lodging-season-auto');
const lodgingTotalEl = document.querySelector('[data-category="대분류1"].lodging-total');
const lodgingPerPersonEl = null; // 하위 호환성 유지
const lodgingPerPersonListEl = document.querySelector('[data-category="대분류1"].lodging-per-person-list');
const lodgingExtraInfoEl = document.querySelector('[data-category="대분류1"].lodging-result__meta');
const lodgingBadgesEl = document.querySelector('[data-category="대분류1"].lodging-badges');
const lodgingGuestLimitNoteEl = document.querySelector('[data-category="대분류1"].lodging-guest-limit-note');
const lodgingTypeDetailEl = document.querySelector('[data-category="대분류1"].lodging-type-detail');
const lodgingReservationBtn = document.querySelector('[data-category="대분류1"].lodging-reservation-btn');
const lodgingLiftSelectionsEl = document.querySelector('[data-category="대분류1"].lodging-lift-selections');
const lodgingLiftTotalEl = document.querySelector('[data-category="대분류1"].lodging-lift-total');
const lodgingBarbecueTotalEl = document.querySelector('[data-category="대분류1"].lodging-bbq-total');
const lodgingDateSelectEl = document.getElementById("lodging-date-select-대분류1");
const lodgingBbqFieldEl = document.querySelector('[data-category="대분류1"].lodging-bbq-field');
const lodgingBbqLabelEl = document.querySelector('[data-category="대분류1"].lodging-bbq-label');
const lodgingBbqNoteEl = document.querySelector('[data-category="대분류1"].lodging-bbq-note');
// 스키 인원은 리프트+렌탈권 선택에서 자동 계산됨
const lodgingSkiersInput = null;
const lodgingSkiersDecrease = null;
const lodgingSkiersIncrease = null;
const lodgingNonSkiersInput = null;
const lodgingNonSkiersDecrease = null;
const lodgingNonSkiersIncrease = null;
const liftTimerEl = document.getElementById("lift-timer-display");
const lodgingTypeGroupsEl = document.getElementById("lodging-type-groups");
const bbqGuestsInput = document.getElementById("bbq-guests");
const bbqGuestsDecrease = document.getElementById("bbq-guests-dec");
const bbqGuestsIncrease = document.getElementById("bbq-guests-inc");
const manualDateInput = document.getElementById("manual-date");
const generateQuoteBtn = document.getElementById("generate-quote-btn");
const lodgingCategoryButtonsEl = document.getElementById("lodging-category-buttons");
const isPhoneMode = document.body.classList.contains("phone-page");

function formatCurrency(value) {
  return value.toLocaleString("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0
  });
}

function buildPricingIndex(categories) {
  pricingIndex = {};
  renderOrder = [];
  categories.forEach((category) => {
    if (category.groups?.length) {
      category.groups.forEach((group) => {
        group.items.forEach((item) => {
          pricingIndex[item.id] = {
            ...item,
            category: category.name,
            groupName: group.name
          };
          renderOrder.push(item.id);
        });
      });
    } else {
      category.items.forEach((item) => {
        pricingIndex[item.id] = {
          ...item,
          category: category.name
        };
        renderOrder.push(item.id);
      });
    }
  });
}

function getLodgingTypes() {
  return pricingState?.lodgingPackages?.types || [];
}

function getActiveLodgingType() {
  const currentState = getCurrentLodgingState();
  // 숙박 없음이 체크되어 있으면 null 반환
  if (currentState.noLodging) {
    return null;
  }
  const types = getLodgingTypes();
  return types.find((type) => type.id === currentState.selectedTypeId) || null;
}

function getActiveMaxGuests(typeOverride) {
  const target = typeOverride || getActiveLodgingType();
  if (!target) return null;
  const max = Number(target.maxGuests);
  return Number.isFinite(max) && max > 0 ? max : null;
}

function getLodgingGroups() {
  const types = getLodgingTypes();
  const groups = Array.from(
    new Set(types.map((type) => type.group || DEFAULT_LODGING_GROUP))
  );
  return groups;
}

function ensureLodgingDefaults() {
  const currentState = getCurrentLodgingState();
  // 박수 초기화
  if (!currentState.nights) {
    currentState.nights = 1;
  }
  
  if (!currentState.date) {
    // 현장 상담 페이지는 항상 오늘 날짜 사용
    if (!isPhoneMode) {
      currentState.date = getLocalDateString(new Date());
    } else {
      currentState.date = state.dateInfo?.iso || getLocalDateString(new Date());
    }
  } else if (!isPhoneMode) {
    // 현장 상담 페이지에서는 날짜가 이미 설정되어 있어도 오늘 날짜로 강제 업데이트
    const today = getLocalDateString(new Date());
    currentState.date = today;
    if (lodgingDateInput) {
      lodgingDateInput.value = today;
    }
  }
  const types = getLodgingTypes();
  if (types.length) {
    if (!currentState.selectedTypeId || !types.some((type) => type.id === currentState.selectedTypeId)) {
      currentState.selectedTypeId = types[0].id;
    }
    const currentType = types.find((type) => type.id === currentState.selectedTypeId);
    const groups = getLodgingGroups();
    if (
      !currentState.selectedTypeGroup ||
      (groups.length && !groups.includes(currentState.selectedTypeGroup))
    ) {
      currentState.selectedTypeGroup = currentType?.group || groups[0] || DEFAULT_LODGING_GROUP;
    }
  } else {
    currentState.selectedTypeId = null;
    currentState.selectedTypeGroup = null;
  }
  if (currentState.bbqGuests == null) {
    currentState.bbqGuests = 0;
  }
  // 현재 대분류의 바베큐 인원 입력 필드 업데이트
  const bbqGuestsInputEl = document.querySelector(`[data-category="${currentLodgingCategory}"].bbq-guests`);
  if (bbqGuestsInputEl) {
    bbqGuestsInputEl.value = currentState.bbqGuests;
  }
  // 숙박 없음 기본값 설정
  if (currentState.noLodging == null) {
    currentState.noLodging = true;
  }
  // 스키 인원은 리프트+렌탈권 선택에서 자동 계산됨
  // 초기값은 0으로 설정
  if (currentState.skiers == null) {
    currentState.skiers = 0;
  }
  if (currentState.nonSkiers == null) {
    currentState.nonSkiers = 0;
  }
  
  // 체크아웃 날짜 업데이트
  if (currentState.date && currentState.nights) {
    updateCheckoutDateFromNights();
  }
  
  rebalanceSkiDistribution();
}

function isLodgingCategory(category) {
  return category?.name === "숙박 패키지";
}

function getLodgingLiftStructure() {
  if (!pricingState) return [];
  const currentState = getCurrentLodgingState();
  
  // 활성화된 날짜 버튼의 날짜를 사용, 없으면 기존 날짜 사용
  const activeDate = currentState.activeDay && currentState.dates[currentState.activeDay] 
    ? currentState.dates[currentState.activeDay] 
    : currentState.date;
  
  // 활성화된 날짜를 기준으로 시즌, 주중/주말 판정
  let seasonKey = "offSeason";
  let period = "weekday";
  
  if (activeDate) {
    const resolvedSeason = resolveSeasonByDate(activeDate);
    const periodInfo = resolvePeriodAndHoliday(activeDate);
    seasonKey = currentState.autoSeason ? resolvedSeason : currentState.manualSeason;
    period = periodInfo.period || "weekday";
  } else {
    seasonKey = currentState.resolvedSeason || "offSeason";
    period = currentState.resolvedPeriod || "weekday";
  }
  const seasonData = pricingState[seasonKey];
  if (!seasonData?.categories) return [];
  const category = seasonData.categories.find((cat) => cat.name === "리프트 + 렌탈권");
  if (!category) return [];

  const useWeekend = period === "weekend";
  const groupSource = useWeekend ? category.weekendGroups : category.groups;
  if (groupSource?.length) {
    return groupSource.map((group) => ({
      name: group.name,
      items: group.items || []
    }));
  }

  const items = useWeekend ? category.weekendItems : category.items;
  if (!items?.length) return [];
  return [{ name: category.name, items }];
}

function resolveSeasonByDate(dateString) {
  if (!dateString) return "offSeason";
  const calendar = pricingState?.seasonCalendar || [];
  const target = new Date(`${dateString}T00:00:00`);
  // Ensure valid date
  if (Number.isNaN(target.getTime())) return "offSeason";
  for (const entry of calendar) {
    if (!entry.start || !entry.end) continue;
    const start = new Date(`${entry.start}T00:00:00`);
    const end = new Date(`${entry.end}T23:59:59`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) continue;
    if (start <= end) {
      if (target >= start && target <= end) {
        return entry.season || "offSeason";
      }
    } else {
      // Range wraps year (e.g., 12월~2월)
      if (target >= start || target <= end) {
        return entry.season || "offSeason";
      }
    }
  }
  return "offSeason";
}

function resolvePeriodAndHoliday(dateString) {
  if (!dateString) {
    return { period: "weekday", holidayLabel: null };
  }
  const parsed = new Date(`${dateString}T00:00:00`);
  const isWeekend = parsed.getDay() === 0 || parsed.getDay() === 6;
  const holidayMatch = holidays.find((holiday) => holiday.date === dateString);
  return {
    period: holidayMatch || isWeekend ? "weekend" : "weekday",
    holidayLabel: holidayMatch?.label || null
  };
}

function getLodgingRateKey(dateString, resolvedPeriod = "weekday") {
  if (!dateString) return "weekday";
  if (resolvedPeriod === "weekend") return "weekend";
  const parsed = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "weekday";
  return parsed.getDay() === 5 ? "friday" : "weekday";
}

function getLodgingPeriodLabel(periodKey) {
  if (periodKey === "weekend") return "주말·공휴일";
  if (periodKey === "friday") return "금요일";
  return "주중";
}

function getAppliedLodgingRateKey(dateString, resolvedPeriod = "weekday") {
  if (!dateString) {
    return resolvedPeriod === "weekend" ? "weekend" : "weekday";
  }
  let rateKey = getLodgingRateKey(dateString, resolvedPeriod);
  const nextDate = getNextDate(dateString);
  if (!nextDate) {
    return rateKey;
  }
  const { period: nextPeriod } = resolvePeriodAndHoliday(nextDate);
  if (rateKey === "weekend" && nextPeriod === "weekday") {
    // 다음 날이 주중이면 주중 금액 적용
    return "weekday";
  }
  if (rateKey !== "weekend" && nextPeriod === "weekend") {
    // 다음 날이 주말/공휴일이면 금요일 금액 적용
    return "friday";
  }
  return rateKey;
}

function getNextDate(dateString) {
  if (!dateString) return null;
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function updateLodgingBadges() {
  const currentState = getCurrentLodgingState();
  const lodgingBadgesEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-badges`);
  if (!lodgingBadgesEl) return;
  lodgingBadgesEl.innerHTML = "";
  
  // 활성화된 날짜 버튼의 날짜를 사용, 없으면 기존 날짜 사용
  const activeDate = currentState.activeDay && currentState.dates[currentState.activeDay] 
    ? currentState.dates[currentState.activeDay] 
    : currentState.date;
  
  if (!activeDate) return;

  // 활성화된 날짜를 기준으로 시즌, 주중/주말 판정
  const resolvedSeason = resolveSeasonByDate(activeDate);
  const { period, holidayLabel } = resolvePeriodAndHoliday(activeDate);
  const finalSeason = currentState.autoSeason ? resolvedSeason : currentState.manualSeason;

  const dateBadge = document.createElement("span");
  dateBadge.className = "lodging-badge";
  dateBadge.textContent = new Date(activeDate).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short"
  });
  lodgingBadgesEl.appendChild(dateBadge);

  const seasonBadge = document.createElement("span");
  seasonBadge.className = "lodging-badge";
  seasonBadge.textContent = finalSeason === "peakSeason" ? "성수기" : "비수기";
  lodgingBadgesEl.appendChild(seasonBadge);

  const periodBadge = document.createElement("span");
  periodBadge.className = "lodging-badge";
  const lodgingPeriodKey = getAppliedLodgingRateKey(activeDate, period);
  periodBadge.textContent = getLodgingPeriodLabel(lodgingPeriodKey);
  lodgingBadgesEl.appendChild(periodBadge);

  if (holidayLabel) {
    const holidayBadge = document.createElement("span");
    holidayBadge.className = "lodging-badge";
    holidayBadge.textContent = holidayLabel;
    lodgingBadgesEl.appendChild(holidayBadge);
  }
}

function updateLodgingSeasonControls() {
  const currentState = getCurrentLodgingState();
  // 활성화된 날짜 버튼의 날짜를 사용, 없으면 기존 날짜 사용
  const activeDate = currentState.activeDay && currentState.dates[currentState.activeDay] 
    ? currentState.dates[currentState.activeDay] 
    : currentState.date;
  
  // 활성화된 날짜를 기준으로 시즌 판정
  let currentSeason = currentState.resolvedSeason || "offSeason";
  if (activeDate) {
    const resolvedSeason = resolveSeasonByDate(activeDate);
    currentSeason = currentState.autoSeason ? resolvedSeason : currentState.manualSeason;
  }
  
  const lodgingSeasonButtons = getLodgingElements('[data-lodging-season]');
  lodgingSeasonButtons.forEach((button) => {
    if (button.dataset.category === currentLodgingCategory) {
      const matches = button.dataset.lodgingSeason === currentSeason;
      button.classList.toggle("active", matches);
      button.disabled = currentState.autoSeason;
    }
  });
  const lodgingSeasonAutoInput = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-season-auto`);
  if (lodgingSeasonAutoInput) {
    lodgingSeasonAutoInput.checked = currentState.autoSeason;
  }
}

function setLodgingDate(dateString) {
  const currentState = getCurrentLodgingState();
  // 현장 상담 페이지는 항상 오늘 날짜 사용
  if (!isPhoneMode) {
    const today = new Date();
    dateString = getLocalDateString(today);
    currentState.date = dateString;
    if (lodgingDateInput) {
      lodgingDateInput.value = dateString;
    }
  } else {
    currentState.date = dateString || null;
  }
  
  // 체크인 날짜가 변경되면 체크아웃 날짜 재계산
  if (currentState.date && currentState.nights) {
    updateCheckoutDateFromNights();
  }
  
  const resolvedSeason = resolveSeasonByDate(currentState.date);
  const { period, holidayLabel } = resolvePeriodAndHoliday(currentState.date);
  currentState.resolvedPeriod = period;
  currentState.holidayLabel = holidayLabel;
  if (currentState.autoSeason) {
    currentState.resolvedSeason = resolvedSeason;
  } else {
    currentState.resolvedSeason = currentState.manualSeason;
  }
  updateLodgingSeasonControls();
  updateLodgingBadges();
  calculateLodgingQuote();
  renderLodgingLiftOptions();
}

function setLodgingNights(nights) {
  const currentState = getCurrentLodgingState();
  currentState.nights = nights;
  updateCheckoutDateFromNights();
  calculateLodgingQuote();
}

function updateCheckoutDateFromNights() {
  const currentState = getCurrentLodgingState();
  if (!currentState.date || !currentState.nights) {
    currentState.checkoutDate = null;
    return;
  }
  
  const checkInDate = new Date(`${currentState.date}T00:00:00`);
  const checkoutDate = new Date(checkInDate);
  checkoutDate.setDate(checkoutDate.getDate() + currentState.nights);
  currentState.checkoutDate = getLocalDateString(checkoutDate);
}


function setLodgingManualSeason(seasonKey) {
  const currentState = getCurrentLodgingState();
  currentState.manualSeason = seasonKey;
  if (!currentState.autoSeason) {
    currentState.resolvedSeason = seasonKey;
    updateLodgingSeasonControls();
    updateLodgingBadges();
    calculateLodgingQuote();
    renderLodgingLiftOptions();
  }
}

function refreshLodgingTypeOptions() {
  // 현재 대분류의 펜션 타입 select 요소 찾기
  const lodgingTypeSelectEl = document.getElementById(`lodging-type-${currentLodgingCategory}`);
  if (!lodgingTypeSelectEl) return;
  
  const currentState = getCurrentLodgingState();
  const allTypes = getLodgingTypes();
  const currentGroup = currentState.selectedTypeGroup || DEFAULT_LODGING_GROUP;
  let filtered = allTypes.filter(
    (type) => (type.group || DEFAULT_LODGING_GROUP) === currentGroup
  );
  if (!filtered.length) {
    filtered = allTypes;
    if (filtered.length) {
      currentState.selectedTypeGroup =
        filtered[0].group || DEFAULT_LODGING_GROUP;
    }
  }

  lodgingTypeSelectEl.innerHTML = "";
  if (!filtered.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "등록된 펜션 타입이 없습니다.";
    lodgingTypeSelectEl.appendChild(option);
    lodgingTypeSelectEl.disabled = true;
    updateLodgingTypeMeta(null);
    return;
  }

  lodgingTypeSelectEl.disabled = false;
  filtered.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.name;
    lodgingTypeSelectEl.appendChild(option);
  });

  if (
    !currentState.selectedTypeId ||
    !filtered.some((type) => type.id === currentState.selectedTypeId)
  ) {
    currentState.selectedTypeId = filtered[0].id;
  }

  lodgingTypeSelectEl.value = currentState.selectedTypeId;
  clampGuestsToMax();
  rebalanceSkiDistribution();
  updateLodgingTypeMeta();
  renderLodgingLiftOptions();
}

function setLodgingGuests(value) {
  const currentState = getCurrentLodgingState();
  const parsed = Math.max(1, Number(value) || 1);
  const maxGuests = getActiveMaxGuests();
  const limited = maxGuests ? Math.min(parsed, maxGuests) : parsed;
  
  // 현재 활성화된 날짜의 리프트 인원보다 작아지지 않도록 제한
  // 다른 날짜의 리프트 인원은 고려하지 않음
  const totalLiftGuests = getTotalLiftGuests();
  const finalValue = Math.max(limited, totalLiftGuests);
  
  currentState.guests = finalValue;
  
  // 현재 대분류의 총 숙박 인원 입력 필드 업데이트
  const lodgingGuestsInputEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-guests`);
  if (lodgingGuestsInputEl) {
    lodgingGuestsInputEl.value = finalValue;
  }
  
  rebalanceSkiDistribution();
  calculateLodgingQuote();
}

function handleLodgingGuestsDelta(delta) {
  const currentState = getCurrentLodgingState();
  // 현재 활성화된 날짜의 리프트 인원만 고려 (다른 날짜의 리프트 인원은 고려하지 않음)
  const totalLiftGuests = getTotalLiftGuests();
  const currentGuests = currentState.guests || 1;
  
  // 감소 시 현재 활성화된 날짜의 리프트 인원보다 작아지지 않도록 제한
  if (delta < 0 && currentGuests + delta < totalLiftGuests) {
    // 현재 활성화된 날짜의 리프트 인원보다 작아질 수 없으므로 변경하지 않음
    return;
  }
  
  setLodgingGuests(currentGuests + delta);
}

// 스키 인원 입력 필드가 제거되어 더 이상 필요 없음
function updateSkiInputs() {
  // 스키 인원은 리프트+렌탈권 선택에서 자동 계산됨
}

function updateLodgingTypeMeta(explicitType) {
  const currentState = getCurrentLodgingState();
  const activeType = explicitType || getActiveLodgingType();
  const maxGuests = getActiveMaxGuests(activeType);

  const lodgingTypeDetailEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-type-detail`);
  if (lodgingTypeDetailEl) {
    if (activeType?.description) {
      lodgingTypeDetailEl.textContent = activeType.description;
      lodgingTypeDetailEl.classList.remove("is-placeholder");
    } else {
      lodgingTypeDetailEl.textContent = LODGING_TYPE_PLACEHOLDER;
      lodgingTypeDetailEl.classList.add("is-placeholder");
    }
  }

  const lodgingReservationBtn = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-reservation-btn`);
  if (lodgingReservationBtn) {
    if (activeType?.reservationUrl) {
      lodgingReservationBtn.href = activeType.reservationUrl;
      lodgingReservationBtn.hidden = false;
    } else {
      lodgingReservationBtn.hidden = true;
    }
  }

  const lodgingGuestsInput = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-guests`);
  if (lodgingGuestsInput) {
    lodgingGuestsInput.max = maxGuests || "";
  }
  const lodgingGuestLimitNoteEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-guest-limit-note`);
  if (lodgingGuestLimitNoteEl) {
    const baseText = "기준 인원 초과 시 추가 요금이 적용됩니다.";
    lodgingGuestLimitNoteEl.textContent = maxGuests
      ? `${baseText} 최대 ${maxGuests}명까지 입력 가능합니다.`
      : baseText;
  }

  // Update BBQ field visibility and price based on bbqPrice
  const bbqPrice = activeType?.bbqPrice || 0;
  if (lodgingBbqFieldEl) {
    if (bbqPrice > 0) {
      lodgingBbqFieldEl.hidden = false;
      if (lodgingBbqLabelEl) {
        lodgingBbqLabelEl.textContent = `무제한 바베큐 인원 (1인 ${formatCurrency(bbqPrice)})`;
      }
      if (lodgingBbqNoteEl) {
        lodgingBbqNoteEl.textContent = `바베큐 인원 수 × ${formatCurrency(bbqPrice)}이 추가됩니다.`;
      }
      currentState.bbqPrice = bbqPrice;
    } else {
      lodgingBbqFieldEl.hidden = true;
      currentState.bbqGuests = 0;
      // 현재 대분류의 바베큐 인원 입력 필드 업데이트
      const bbqGuestsInputEl = document.querySelector(`[data-category="${currentLodgingCategory}"].bbq-guests`);
      if (bbqGuestsInputEl) bbqGuestsInputEl.value = 0;
      currentState.bbqPrice = 0;
    }
    updateBarbecueTotal();
  }

  // Update BBQ summary visibility
  const bbqSummaryEl = document.querySelector(".lodging-bbq-summary");
  if (bbqSummaryEl) {
    bbqSummaryEl.hidden = bbqPrice === 0;
  }
}

function rebalanceSkiDistribution() {
  const currentState = getCurrentLodgingState();
  // 스키 인원은 리프트+렌탈권 선택에서 자동 계산됨
  updateSkiersFromLiftSelections();
  const totalGuests = Math.max(1, currentState.guests || 1);
  const skiers = Math.max(0, currentState.skiers || 0);
  currentState.nonSkiers = Math.max(0, totalGuests - skiers);
}

function clampGuestsToMax() {
  const currentState = getCurrentLodgingState();
  const maxGuests = getActiveMaxGuests();
  if (maxGuests && currentState.guests > maxGuests) {
    currentState.guests = maxGuests;
    if (lodgingGuestsInput) lodgingGuestsInput.value = maxGuests;
  }
}

// 스키 인원 입력 필드가 제거되어 다음 함수들은 더 이상 사용되지 않음
// 스키 인원은 리프트+렌탈권 선택에서 자동 계산됨
function setSkiers(value) {
  const currentState = getCurrentLodgingState();
  const totalGuests = Math.max(1, currentState.guests || 1);
  const parsed = Math.min(Math.max(0, Number(value) || 0), totalGuests);
  currentState.skiers = parsed;
  currentState.nonSkiers = Math.max(0, totalGuests - parsed);
  calculateLodgingQuote();
}

function handleSkiersDelta(delta) {
  const currentState = getCurrentLodgingState();
  setSkiers((currentState.skiers || 0) + delta);
}

function setNonSkiers(value) {
  const currentState = getCurrentLodgingState();
  const totalGuests = Math.max(1, currentState.guests || 1);
  const parsed = Math.min(Math.max(0, Number(value) || 0), totalGuests);
  currentState.nonSkiers = parsed;
  currentState.skiers = Math.max(0, totalGuests - parsed);
  calculateLodgingQuote();
}

function handleNonSkiersDelta(delta) {
  const currentState = getCurrentLodgingState();
  setNonSkiers((currentState.nonSkiers || 0) + delta);
}

function setBbqGuests(value) {
  const currentState = getCurrentLodgingState();
  const parsed = Math.max(0, Number(value) || 0);
  currentState.bbqGuests = parsed;
  
  // 현재 대분류의 바베큐 인원 입력 필드 업데이트
  const bbqGuestsInputEl = document.querySelector(`[data-category="${currentLodgingCategory}"].bbq-guests`);
  if (bbqGuestsInputEl) {
    bbqGuestsInputEl.value = parsed;
  }
  
  calculateLodgingQuote();
}

function handleBbqGuestsDelta(delta) {
  const currentState = getCurrentLodgingState();
  setBbqGuests((currentState.bbqGuests || 0) + delta);
}

function calculateBarbecueTotal() {
  const currentState = getCurrentLodgingState();
  const bbqPrice = currentState.bbqPrice || 0;
  return (currentState.bbqGuests || 0) * bbqPrice;
}

function updateBarbecueTotal() {
  const lodgingBarbecueTotalEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-bbq-total`);
  if (lodgingBarbecueTotalEl) {
    lodgingBarbecueTotalEl.textContent = formatCurrency(calculateBarbecueTotal());
  }
}

function extractDurationHours(meta) {
  if (!meta) return null;
  if (meta.durationHours) return meta.durationHours;
  const match = /(\d+(?:\.\d+)?)\s*시간/.exec(meta.name || "");
  if (match) {
    const hours = Number(match[1]);
    if (!Number.isNaN(hours)) return hours;
  }
  const idMatch = /_(\d+)h/i.exec(meta.id || "");
  if (idMatch) {
    const hours = Number(idMatch[1]);
    if (!Number.isNaN(hours)) return hours;
  }
  return null;
}

function formatKoreanTime(date) {
  return date.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true });
}

function applyMaintenanceWindow(start, durationHours) {
  const durationMs = durationHours * 60 * 60 * 1000;
  let displayStart = new Date(start);
  let displayEnd = new Date(start.getTime() + durationMs);
  const maintenanceStart = new Date(start);
  maintenanceStart.setHours(17, 0, 0, 0);
  const maintenanceEnd = new Date(start);
  maintenanceEnd.setHours(18, 30, 0, 0);
  let paused = false;

  if (displayEnd <= maintenanceStart || displayStart >= maintenanceEnd) {
    return { start: displayStart, end: displayEnd, paused };
  }

  paused = true;
  const maintenanceDuration = maintenanceEnd.getTime() - maintenanceStart.getTime();

  if (displayStart < maintenanceStart && displayEnd > maintenanceStart) {
    displayEnd = new Date(displayEnd.getTime() + maintenanceDuration);
  } else if (displayStart >= maintenanceStart && displayStart < maintenanceEnd) {
    const shift = maintenanceEnd.getTime() - displayStart.getTime();
    displayStart = new Date(displayStart.getTime() + shift);
    displayEnd = new Date(displayEnd.getTime() + shift);
  }

  return { start: displayStart, end: displayEnd, paused };
}

function updateLiftTimerDisplay(meta) {
  if (!liftTimerEl || !meta) return;
  const targetCategories = ["리프트 + 렌탈권", "리프트권"];
  if (!targetCategories.includes(meta.category)) return;
  const duration = extractDurationHours(meta);
  if (!duration) return;
  const now = new Date();
  const { start, end, paused } = applyMaintenanceWindow(now, duration);
  const mainText = `${meta.name} · ${formatKoreanTime(start)} ~ ${formatKoreanTime(end)}`;
  if (paused) {
    liftTimerEl.innerHTML = `${mainText}<br>정설시간(17:00~18:30) 제외`;
  } else {
    liftTimerEl.textContent = mainText;
  }
  liftTimerEl.hidden = false;
}

function resetLiftTimerDisplay() {
  if (!liftTimerEl) return;
  liftTimerEl.textContent = "리프트 시간권을 선택하지 않았습니다.";
  liftTimerEl.hidden = false;
}

function renderLodgingLiftOptions() {
  const currentState = getCurrentLodgingState();
  // 현재 대분류의 리프트 선택 영역 찾기
  const lodgingLiftSelectionsEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-lift-selections`);
  if (!lodgingLiftSelectionsEl) return;
  
  // 활성화된 날짜가 없으면 첫째날을 기본으로 사용
  const activeDay = currentState.activeDay || "first";
  
  // 활성화된 날짜의 리프트 선택 가져오기
  if (!currentState.liftSelections[activeDay]) {
    currentState.liftSelections[activeDay] = {};
  }
  const activeLiftSelections = currentState.liftSelections[activeDay];
  
  const structures = getLodgingLiftStructure();
  
  // 대인/소인 그룹 분리
  const adultGroups = structures.filter((group) => group.name?.includes("대인"));
  const childGroups = structures.filter((group) => group.name?.includes("소인"));
  
  // 모든 리프트권 아이템 수집 (대인 기준으로 시간권 목록 생성)
  const adultItems = adultGroups.flatMap((group) => group.items || []).filter(Boolean);
  const childItemsMap = new Map();
  childGroups.forEach((group) => {
    group.items?.forEach((item) => {
      // 소인 아이템을 대인 아이템과 매칭 (이름 기반)
      const matchingAdult = adultItems.find((adult) => {
        // 시간 정보 추출 (예: "2시간", "3시간" 등)
        const adultTime = adult.name.match(/(\d+)시간/)?.[1];
        const childTime = item.name.match(/(\d+)시간/)?.[1];
        return adultTime && childTime && adultTime === childTime;
      });
      if (matchingAdult) {
        childItemsMap.set(matchingAdult.id, item);
      }
    });
  });

  lodgingLiftOptions = adultItems;
  lodgingLiftSelectionsEl.innerHTML = "";

  if (adultItems.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "리프트권 정보를 불러올 수 없습니다.";
    emptyMsg.style.color = "var(--text-muted)";
    lodgingLiftSelectionsEl.appendChild(emptyMsg);
    return;
  }

  // 각 시간권별로 대인/소인 인원 입력 UI 생성
  adultItems.forEach((adultItem) => {
    if (!activeLiftSelections[adultItem.id]) {
      activeLiftSelections[adultItem.id] = { adult: 0, child: 0 };
    }
    const selection = activeLiftSelections[adultItem.id];
    const childItem = childItemsMap.get(adultItem.id);
    
    const liftCard = document.createElement("div");
    liftCard.className = "lodging-lift-card";
    liftCard.innerHTML = `
      <div class="lodging-lift-card__header">
        <div class="lodging-lift-card__info">
          <span class="lodging-lift-card__name">${adultItem.name}</span>
          <div>
            <span class="lodging-lift-card__price">대인 ${formatCurrency(adultItem.price)}</span>
            ${childItem ? `<span class="lodging-lift-card__price-child">소인 ${formatCurrency(childItem.price)}</span>` : '<span class="lodging-lift-card__price-child">소인 가격 정보 없음</span>'}
          </div>
        </div>
      </div>
      <div class="lodging-lift-card__controls">
        <div class="lodging-lift-control">
          <label>대인</label>
          <div class="lodging-number">
            <button type="button" class="lodging-lift-dec" data-lift-id="${adultItem.id}" data-type="adult" aria-label="대인 감소">-</button>
            <input type="number" class="lodging-lift-count" data-lift-id="${adultItem.id}" data-type="adult" min="0" value="${selection.adult || 0}" aria-label="대인 인원" />
            <button type="button" class="lodging-lift-inc" data-lift-id="${adultItem.id}" data-type="adult" aria-label="대인 증가">+</button>
          </div>
        </div>
        <div class="lodging-lift-control">
          <label>소인</label>
          <div class="lodging-number">
            <button type="button" class="lodging-lift-dec" data-lift-id="${adultItem.id}" data-type="child" aria-label="소인 감소">-</button>
            <input type="number" class="lodging-lift-count" data-lift-id="${adultItem.id}" data-type="child" min="0" value="${selection.child || 0}" aria-label="소인 인원" />
            <button type="button" class="lodging-lift-inc" data-lift-id="${adultItem.id}" data-type="child" aria-label="소인 증가">+</button>
          </div>
        </div>
      </div>
    `;
    lodgingLiftSelectionsEl.appendChild(liftCard);
  });

  // 각 대분류별로 독립적인 이벤트 리스너 추가
  // 기존 리스너 제거 후 새로 추가 (중복 방지)
  const newEl = lodgingLiftSelectionsEl.cloneNode(true);
  lodgingLiftSelectionsEl.parentNode.replaceChild(newEl, lodgingLiftSelectionsEl);
  const updatedEl = newEl;
  
  // 이벤트 리스너 추가
  updatedEl.addEventListener("click", handleLodgingLiftButtonClick);
  updatedEl.addEventListener("input", handleLodgingLiftInput);
  
  updateLodgingLiftTotal();
  updateSkiersFromLiftSelections();
}

function handleLodgingLiftButtonClick(e) {
  const btn = e.target.closest(".lodging-lift-inc, .lodging-lift-dec");
  if (!btn) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  // 클릭된 버튼이 속한 대분류 찾기
  const liftSelectionsEl = btn.closest('.lodging-lift-selections');
  if (liftSelectionsEl && liftSelectionsEl.dataset.category) {
    currentLodgingCategory = liftSelectionsEl.dataset.category;
  }
  
  const liftId = btn.dataset.liftId;
  const type = btn.dataset.type;
  if (!liftId || !type) return;
  
  const delta = btn.classList.contains("lodging-lift-inc") ? 1 : -1;
  handleLodgingLiftCountChange(liftId, type, delta);
}

function handleLodgingLiftInput(e) {
  const input = e.target;
  if (!input || !input.classList.contains("lodging-lift-count")) return;
  
  // 입력 필드가 속한 대분류 찾기
  const liftSelectionsEl = input.closest('.lodging-lift-selections');
  if (liftSelectionsEl && liftSelectionsEl.dataset.category) {
    currentLodgingCategory = liftSelectionsEl.dataset.category;
  }
  
  const liftId = input.dataset.liftId;
  const type = input.dataset.type;
  if (!liftId || !type) return;
  
  const value = Math.max(0, parseInt(input.value) || 0);
  setLodgingLiftCount(liftId, type, value);
}

function handleLodgingLiftCountChange(liftId, type, delta) {
  const currentState = getCurrentLodgingState();
  // 활성화된 날짜가 없으면 첫째날을 기본으로 사용
  const activeDay = currentState.activeDay || "first";
  
  if (!currentState.liftSelections[activeDay]) {
    currentState.liftSelections[activeDay] = {};
  }
  if (!currentState.liftSelections[activeDay][liftId]) {
    currentState.liftSelections[activeDay][liftId] = { adult: 0, child: 0 };
  }
  const current = currentState.liftSelections[activeDay][liftId][type] || 0;
  const newValue = Math.max(0, current + delta);
  setLodgingLiftCount(liftId, type, newValue);
}

function getTotalLiftGuests() {
  const currentState = getCurrentLodgingState();
  // 활성화된 날짜가 없으면 첫째날을 기본으로 사용
  const activeDay = currentState.activeDay || "first";
  let total = 0;
  // 현재 활성화된 날짜의 리프트 선택만 합산
  const activeDaySelections = currentState.liftSelections[activeDay];
  if (activeDaySelections && typeof activeDaySelections === 'object') {
    Object.values(activeDaySelections).forEach((selection) => {
      if (selection && typeof selection === 'object') {
        total += (selection.adult || 0) + (selection.child || 0);
      }
    });
  }
  return total;
}

function setLodgingLiftCount(liftId, type, value) {
  const currentState = getCurrentLodgingState();
  // 활성화된 날짜가 없으면 첫째날을 기본으로 사용
  const activeDay = currentState.activeDay || "first";
  
  if (!currentState.liftSelections[activeDay]) {
    currentState.liftSelections[activeDay] = {};
  }
  if (!currentState.liftSelections[activeDay][liftId]) {
    currentState.liftSelections[activeDay][liftId] = { adult: 0, child: 0 };
  }
  
  // 현재 값 저장
  const currentValue = currentState.liftSelections[activeDay][liftId][type] || 0;
  
  // 현재 활성화된 날짜의 총 리프트 인원만 계산 (다른 날짜의 리프트 인원은 고려하지 않음)
  // 현재 변경하려는 값을 제외하고 계산한 후 새 값을 더함
  let totalLiftGuests = 0;
  const activeDaySelections = currentState.liftSelections[activeDay];
  if (activeDaySelections && typeof activeDaySelections === 'object') {
    Object.values(activeDaySelections).forEach((selection) => {
      if (selection && typeof selection === 'object') {
        totalLiftGuests += (selection.adult || 0) + (selection.child || 0);
      }
    });
  }
  // 현재 변경하려는 값을 제외하고 계산한 후 새 값을 더함
  totalLiftGuests = totalLiftGuests - currentValue + value;
  
  // 총 숙박 인원보다 많아지지 않도록 제한 (현재 활성화된 날짜의 리프트 인원만 고려)
  const totalGuests = Math.max(1, currentState.guests || 1);
  if (totalLiftGuests > totalGuests) {
    // 최대 허용 가능한 값 계산 (현재 활성화된 날짜의 리프트 인원 기준만)
    // 다른 날짜의 리프트 인원은 전혀 고려하지 않음
    const currentActiveDayTotal = totalLiftGuests - value + currentValue; // 현재 변경 전 총 인원
    const maxAllowedValue = currentValue + (totalGuests - currentActiveDayTotal);
    value = Math.max(0, maxAllowedValue);
    totalLiftGuests = totalGuests;
  }
  
  currentState.liftSelections[activeDay][liftId][type] = value;
  
  // 입력 필드 업데이트 (input 타입의 요소만 찾기)
  const lodgingLiftSelectionsEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-lift-selections`);
  const input = lodgingLiftSelectionsEl?.querySelector(`input.lodging-lift-count[data-lift-id="${liftId}"][data-type="${type}"]`);
  if (input) {
    input.value = value;
  }
  
  // 총 리프트 인원이 총 숙박 인원보다 많으면 총 숙박 인원 자동 증가
  if (totalLiftGuests > totalGuests) {
    setLodgingGuests(totalLiftGuests);
  }
  
  updateLodgingLiftTotal();
  
  // 스키 타는 인원 자동 계산
  updateSkiersFromLiftSelections();
  
  calculateLodgingQuote();
}

function updateSkiersFromLiftSelections() {
  const currentState = getCurrentLodgingState();
  let totalSkiers = 0;
  // 활성화된 날짜의 리프트 선택만 합산 (날짜별로 독립적으로 계산)
  const activeDay = currentState.activeDay || "first";
  const activeDaySelections = currentState.liftSelections[activeDay];
  if (activeDaySelections && typeof activeDaySelections === 'object') {
    Object.values(activeDaySelections).forEach((selection) => {
      if (selection && typeof selection === 'object') {
        totalSkiers += (selection.adult || 0) + (selection.child || 0);
      }
    });
  }
  
  currentState.skiers = totalSkiers;
  // nonSkiers는 총 숙박 인원에서 자동 계산
  const totalGuests = Math.max(1, currentState.guests || 1);
  currentState.nonSkiers = Math.max(0, totalGuests - totalSkiers);
}

function calculateLodgingLiftTotal() {
  const currentState = getCurrentLodgingState();
  let total = 0;
  const structures = getLodgingLiftStructure();
  const adultGroups = structures.filter((group) => group.name?.includes("대인"));
  const childGroups = structures.filter((group) => group.name?.includes("소인"));
  const adultItems = adultGroups.flatMap((group) => group.items || []).filter(Boolean);
  const childItemsMap = new Map();
  childGroups.forEach((group) => {
    group.items?.forEach((item) => {
      const matchingAdult = adultItems.find((adult) => {
        const adultTime = adult.name.match(/(\d+)시간/)?.[1];
        const childTime = item.name.match(/(\d+)시간/)?.[1];
        return adultTime && childTime && adultTime === childTime;
      });
      if (matchingAdult) {
        childItemsMap.set(matchingAdult.id, item);
      }
    });
  });

  // 선택한 날짜(첫째날)의 리프트 선택만 계산
  const firstDaySelections = currentState.liftSelections.first;
  if (firstDaySelections && typeof firstDaySelections === 'object') {
    Object.entries(firstDaySelections).forEach(([liftId, selection]) => {
      const adultItem = adultItems.find((item) => item.id === liftId);
      if (adultItem && selection && typeof selection === 'object') {
        const adultCount = selection.adult || 0;
        total += adultItem.price * adultCount;
        
        const childItem = childItemsMap.get(liftId);
        if (childItem) {
          const childCount = selection.child || 0;
          total += childItem.price * childCount;
        }
      }
    });
  }

  return total;
}

function updateLodgingLiftTotal() {
  const lodgingLiftTotalEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-lift-total`);
  if (lodgingLiftTotalEl) {
    lodgingLiftTotalEl.textContent = formatCurrency(calculateLodgingLiftTotal());
  }
}

function updateLodgingPerPersonList(lodgingPerPerson) {
  const lodgingPerPersonListEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-per-person-list`);
  if (!lodgingPerPersonListEl) return [];
  
  const currentState = getCurrentLodgingState();
  const structures = getLodgingLiftStructure();
  const adultGroups = structures.filter((group) => group.name?.includes("대인"));
  const childGroups = structures.filter((group) => group.name?.includes("소인"));
  const adultItems = adultGroups.flatMap((group) => group.items || []).filter(Boolean);
  const childItemsMap = new Map();
  childGroups.forEach((group) => {
    group.items?.forEach((item) => {
      const matchingAdult = adultItems.find((adult) => {
        const adultTime = adult.name.match(/(\d+)시간/)?.[1];
        const childTime = item.name.match(/(\d+)시간/)?.[1];
        return adultTime && childTime && adultTime === childTime;
      });
      if (matchingAdult) {
        childItemsMap.set(matchingAdult.id, item);
      }
    });
  });

  // 리프트권별 인당 금액 계산 (첫째날만 사용)
  const perPersonItems = [];
  const isNoLodging = currentState.noLodging;
  
  // 날짜 포맷팅 함수 (예: "2025-11-20" → "11월 20일")
  const formatDateForLabel = (dateString) => {
    if (!dateString) return "";
    const date = new Date(`${dateString}T00:00:00`);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };
  
  // 현재 대분류의 선택된 날짜 가져오기
  const selectedDate = currentState.dates.first;
  const datePrefix = selectedDate ? `${formatDateForLabel(selectedDate)} ` : "";
  
  // 선택한 날짜(첫째날)의 리프트 선택만 처리
  const firstDaySelections = currentState.liftSelections.first;
  if (firstDaySelections && typeof firstDaySelections === 'object') {
    Object.entries(firstDaySelections).forEach(([liftId, selection]) => {
      const adultItem = adultItems.find((item) => item.id === liftId);
      if (!adultItem || !selection || typeof selection !== 'object') return;
      
      const adultCount = selection.adult || 0;
      const childCount = selection.child || 0;
      const childItem = childItemsMap.get(liftId);
      
      // 리프트권 이름에서 "시간" 추출 (예: "2시간" → "2시간")
      const liftName = adultItem.name;
      
      // 대인 선택한 경우
      if (adultCount > 0) {
        const adultPerPerson = isNoLodging ? adultItem.price : adultItem.price + lodgingPerPerson;
        const adultLabelBase = isNoLodging 
          ? `대인 리프트${liftName}` 
          : `대인 리프트${liftName}+숙박`;
        const adultLabel = datePrefix + adultLabelBase;
        
        perPersonItems.push({
          label: adultLabel,
          count: adultCount,
          perPerson: adultPerPerson,
          total: adultPerPerson * adultCount
        });
      }
      
      // 소인 선택한 경우
      if (childCount > 0 && childItem) {
        const childPerPerson = isNoLodging ? childItem.price : childItem.price + lodgingPerPerson;
        const childLabelBase = isNoLodging 
          ? `소인 리프트${liftName}` 
          : `소인 리프트${liftName}+숙박`;
        const childLabel = datePrefix + childLabelBase;
        
        perPersonItems.push({
          label: childLabel,
          count: childCount,
          perPerson: childPerPerson,
          total: childPerPerson * childCount
        });
      }
    });
  }
  
  // 숙박 없음이 아닌 경우에만 "숙박만" 항목 표시
  if (!isNoLodging) {
    // 리프트권을 선택하지 않은 인원 계산 (첫째날 기준)
    let totalLiftGuests = 0;
    if (firstDaySelections && typeof firstDaySelections === 'object') {
      Object.values(firstDaySelections).forEach((selection) => {
        if (selection && typeof selection === 'object') {
          totalLiftGuests += (selection.adult || 0) + (selection.child || 0);
        }
      });
    }
    const guestCount = Math.max(1, currentState.guests);
    const nonLiftGuests = Math.max(0, guestCount - totalLiftGuests);
    
    if (nonLiftGuests > 0) {
      perPersonItems.push({
        label: datePrefix + "숙박만",
        count: nonLiftGuests,
        perPerson: lodgingPerPerson,
        total: lodgingPerPerson * nonLiftGuests
      });
    }
  }
  
  // 무제한바베큐 인원 추가
  const bbqGuests = currentState.bbqGuests || 0;
  if (bbqGuests > 0) {
    const bbqPrice = currentState.bbqPrice || 35000; // 기본값 35,000원
    perPersonItems.push({
      label: datePrefix + "무제한바베큐",
      count: bbqGuests,
      perPerson: bbqPrice,
      total: bbqPrice * bbqGuests
    });
  }
  
  // UI 업데이트
  if (perPersonItems.length === 0) {
    lodgingPerPersonListEl.innerHTML = `
      <div>
        <p class="lodging-result__label">인당 금액</p>
        <strong>₩0</strong>
      </div>
    `;
    return perPersonItems;
  }
  
  let html = '';
  perPersonItems.forEach((item) => {
    html += `
      <div>
        <p class="lodging-result__label">${item.label} (${item.count}명)</p>
        <strong>${formatCurrency(item.perPerson)}</strong>
      </div>
    `;
  });
  
  lodgingPerPersonListEl.innerHTML = html;
  
  return perPersonItems;
}


function calculateLodgingQuote() {
  const currentState = getCurrentLodgingState();
  const lodgingTotalEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-total`);
  if (!lodgingTotalEl) return;
  const activeType = getActiveLodgingType();

  // 숙박패키지 선택 항목 초기화 (현재 대분류의 항목만)
  // lodging_per_person_으로 시작하는 항목 모두 제거
  Object.keys(state.selections).forEach(key => {
    if (key.startsWith(`lodging_per_person_${currentLodgingCategory}_`)) {
      delete state.selections[key];
    }
  });
  
  // renderOrder에서도 현재 대분류의 lodging_per_person_ 항목 제거
  const filteredRenderOrder = renderOrder.filter(id => !id.startsWith(`lodging_per_person_${currentLodgingCategory}_`));
  renderOrder.length = 0;
  renderOrder.push(...filteredRenderOrder);

  // 숙박 없음이 체크되어 있으면 숙박 금액을 0으로 처리
  if (currentState.noLodging) {
    const liftTotal = calculateLodgingLiftTotal();
    const bbqTotal = calculateBarbecueTotal();
    const combinedTotal = liftTotal + bbqTotal;
    
    lodgingTotalEl.textContent = formatCurrency(combinedTotal);
    
    // 리프트권별 인당 금액 계산 및 표시 (perPersonItems 반환받음)
    const perPersonItems = updateLodgingPerPersonList(0);
    
    updateLodgingLiftTotal();
    updateBarbecueTotal();
    updateLodgingTypeMeta(null);
    
    // 숙박패키지 선택 항목 추가 (updateLodgingPerPersonList에서 계산한 결과 사용)
    perPersonItems.forEach((item, index) => {
      const id = `lodging_per_person_${currentLodgingCategory}_${index}`;
      if (!renderOrder.includes(id)) renderOrder.push(id);
      state.selections[id] = {
        id: id,
        name: `${item.label} (${item.count}명)`,
        category: "숙박 패키지",
        price: item.perPerson,
        quantity: item.count,
        subtotal: item.total,
        unit: "1인당"
      };
    });
    
    updateSummary();
    return;
  }
  
  const lodgingExtraInfoEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-result__meta`);
  if (!activeType) {
    lodgingTotalEl.textContent = "₩0";
    if (lodgingExtraInfoEl) {
      lodgingExtraInfoEl.textContent = "숙박 패키지 설정을 추가해 주세요.";
    }
    updateLodgingLiftTotal();
    updateBarbecueTotal();
    updateLodgingTypeMeta(null);
    updateSummary();
    return;
  }

  const seasonKey = currentState.resolvedSeason || "offSeason";
  
  // 선택한 날짜(첫째날)에 대해서만 요금 계산
  let basePrice = 0;
  let resolvedPeriodKey = currentState.resolvedPeriod || "weekday";
  let appliedLodgingPeriodKey = resolvedPeriodKey;
  
  // 첫째날 날짜만 사용하여 계산
  const selectedDate = currentState.dates.first;
  if (selectedDate && activeType.sharedRates) {
    const { period } = resolvePeriodAndHoliday(selectedDate);
    resolvedPeriodKey = period || "weekday";
    const lodgingPeriodKey = getAppliedLodgingRateKey(selectedDate, resolvedPeriodKey);
    appliedLodgingPeriodKey = lodgingPeriodKey;
    basePrice = activeType.sharedRates?.[lodgingPeriodKey] ?? 0;
  } else if (currentState.date && activeType.sharedRates) {
    resolvedPeriodKey = currentState.resolvedPeriod || "weekday";
    appliedLodgingPeriodKey = getAppliedLodgingRateKey(currentState.date, resolvedPeriodKey);
    basePrice = activeType.sharedRates?.[appliedLodgingPeriodKey] ?? 0;
  } else if (activeType.sharedRates) {
    basePrice = activeType.sharedRates?.[appliedLodgingPeriodKey] ?? 0;
  }
  
  const baseGuests = Math.max(1, activeType.baseGuests ?? 1);
  const extraFee = activeType.extraGuestFee ?? 0;
  const extraCount = Math.max(0, currentState.guests - baseGuests);
  const lodgingOnlyTotal = basePrice + extraCount * extraFee;
  const guestCount = Math.max(1, currentState.guests);
  
  // 숙박 인당 금액 (총 숙박 금액 / 총 인원) - 천 단위 올림 처리
  const lodgingPerPersonRaw = guestCount > 0 ? lodgingOnlyTotal / guestCount : 0;
  const lodgingPerPerson = lodgingPerPersonRaw > 0 ? Math.ceil(lodgingPerPersonRaw / 1000) * 1000 : 0;
  
  // 올림된 숙박 인당 금액 기준으로 총 숙박 금액 재계산
  const adjustedLodgingTotal = lodgingPerPerson * guestCount;
  
  const liftTotal = calculateLodgingLiftTotal();
  const bbqTotal = calculateBarbecueTotal();
  
  // 총 패키지 금액 (올림된 숙박 인당 금액 기준)
  const combinedTotal = adjustedLodgingTotal + liftTotal + bbqTotal;
  
  lodgingTotalEl.textContent = formatCurrency(combinedTotal);
  
  // 리프트권별 인당 금액 계산 및 표시 (perPersonItems 반환받음)
  const perPersonItems = updateLodgingPerPersonList(lodgingPerPerson);
  
  updateLodgingLiftTotal();
  updateBarbecueTotal();
  updateLodgingTypeMeta(activeType);

  // 숙박패키지 선택 항목 추가
  const seasonLabel = seasonKey === "peakSeason" ? "성수기" : "비수기";
  const periodLabel = getLodgingPeriodLabel(appliedLodgingPeriodKey);
  
  // 1인당 금액 항목들을 선택 항목에 추가 (updateLodgingPerPersonList에서 계산한 결과 사용)
  perPersonItems.forEach((item, index) => {
    const id = `lodging_per_person_${currentLodgingCategory}_${index}`;
    if (!renderOrder.includes(id)) renderOrder.push(id);
    state.selections[id] = {
      id: id,
      name: `${item.label} (${item.count}명)`,
      category: "숙박 패키지",
      price: item.perPerson,
      quantity: item.count,
      subtotal: item.total,
      unit: "1인당"
    };
  });

  if (lodgingExtraInfoEl) {
    const liftText = liftTotal > 0 ? ` · 리프트/렌탈 ${formatCurrency(liftTotal)} 포함` : "";
    const bbqText = bbqTotal > 0 ? ` · 바베큐 ${formatCurrency(bbqTotal)} 포함` : "";
    const skiText = ` · 스키 ${currentState.skiers || 0}명`;
    const nonSkiText = currentState.nonSkiers > 0 ? ` / 미이용 ${currentState.nonSkiers}명` : "";
    lodgingExtraInfoEl.textContent = `${activeType.name} · 기준 ${baseGuests}명 / 추가 1인 ${formatCurrency(
      extraFee
    )} · 적용: ${seasonLabel}, ${periodLabel}${liftText}${bbqText}${skiText}${nonSkiText}`;
  }

  updateSummary();
}

// 대분류별 정보를 수집하는 헬퍼 함수
function getCategoryQuoteInfo(category) {
  const originalCategory = currentLodgingCategory;
  currentLodgingCategory = category;
  
  const categoryState = initializeLodgingState(category);
  const types = getLodgingTypes();
  const activeType = categoryState.noLodging ? null : (types.find((type) => type.id === categoryState.selectedTypeId) || null);
  
  if (!activeType && !categoryState.noLodging) {
    currentLodgingCategory = originalCategory;
    return null;
  }
  
  const seasonKey = categoryState.resolvedSeason || "offSeason";
  const selectedDate = categoryState.dates?.first || categoryState.date;
  let basePrice = 0;
  let resolvedPeriodKey = categoryState.resolvedPeriod || "weekday";
  let appliedLodgingPeriodKey = resolvedPeriodKey;
  
  // 선택한 날짜(첫째날)에 대해서만 요금 계산
  if (selectedDate && activeType?.sharedRates) {
    const { period } = resolvePeriodAndHoliday(selectedDate);
    resolvedPeriodKey = period || "weekday";
    const lodgingPeriodKey = getAppliedLodgingRateKey(selectedDate, resolvedPeriodKey);
    appliedLodgingPeriodKey = lodgingPeriodKey;
    basePrice = activeType.sharedRates?.[lodgingPeriodKey] ?? 0;
  } else if (categoryState.date && activeType?.sharedRates) {
    resolvedPeriodKey = categoryState.resolvedPeriod || "weekday";
    appliedLodgingPeriodKey = getAppliedLodgingRateKey(categoryState.date, resolvedPeriodKey);
    basePrice = activeType.sharedRates?.[appliedLodgingPeriodKey] ?? 0;
  } else if (activeType?.sharedRates) {
    basePrice = activeType.sharedRates?.[appliedLodgingPeriodKey] ?? 0;
  }
  
  const baseGuests = Math.max(1, activeType?.baseGuests ?? 1);
  const extraFee = activeType?.extraGuestFee ?? 0;
  const extraCount = Math.max(0, categoryState.guests - baseGuests);
  const lodgingOnlyTotal = basePrice + extraCount * extraFee;
  const guestCount = Math.max(1, categoryState.guests);
  
  const isNoLodging = categoryState.noLodging;
  let lodgingPerPerson = 0;
  let adjustedLodgingTotal = 0;
  
  if (!isNoLodging && activeType) {
    const lodgingPerPersonRaw = guestCount > 0 ? lodgingOnlyTotal / guestCount : 0;
    lodgingPerPerson = lodgingPerPersonRaw > 0 ? Math.ceil(lodgingPerPersonRaw / 1000) * 1000 : 0;
    adjustedLodgingTotal = lodgingPerPerson * guestCount;
  }
  
  // 리프트 총액 계산 (대분류별)
  let liftTotal = 0;
  const structures = getLodgingLiftStructure();
  const adultGroups = structures.filter((group) => group.name?.includes("대인"));
  const childGroups = structures.filter((group) => group.name?.includes("소인"));
  const adultItems = adultGroups.flatMap((group) => group.items || []).filter(Boolean);
  const childItemsMap = new Map();
  childGroups.forEach((group) => {
    group.items?.forEach((item) => {
      const matchingAdult = adultItems.find((adult) => {
        const adultTime = adult.name.match(/(\d+)시간/)?.[1];
        const childTime = item.name.match(/(\d+)시간/)?.[1];
        return adultTime && childTime && adultTime === childTime;
      });
      if (matchingAdult) {
        childItemsMap.set(matchingAdult.id, item);
      }
    });
  });
  
  const firstDaySelections = categoryState.liftSelections?.first || {};
  if (firstDaySelections && typeof firstDaySelections === 'object') {
    Object.entries(firstDaySelections).forEach(([liftId, selection]) => {
      const adultItem = adultItems.find((item) => item.id === liftId);
      if (adultItem && selection && typeof selection === 'object') {
        const adultCount = selection.adult || 0;
        liftTotal += adultItem.price * adultCount;
        const childItem = childItemsMap.get(liftId);
        if (childItem) {
          const childCount = selection.child || 0;
          liftTotal += childItem.price * childCount;
        }
      }
    });
  }
  
  const bbqTotal = (categoryState.bbqGuests || 0) * (categoryState.bbqPrice || 0);
  const combinedTotal = adjustedLodgingTotal + liftTotal + bbqTotal;
  
  // 0원이면 null 반환
  if (combinedTotal === 0) {
    currentLodgingCategory = originalCategory;
    return null;
  }
  
  // 인당 금액 항목들 가져오기
  const perPersonItems = updateLodgingPerPersonList(lodgingPerPerson);
  
  const dateForDisplay = selectedDate || categoryState.date;
  const dateObj = dateForDisplay ? new Date(dateForDisplay + "T00:00:00") : new Date();
  const dateFormatted = dateObj.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });
  
  const seasonLabel = seasonKey === "peakSeason" ? "성수기" : "비수기";
  const periodLabel = getLodgingPeriodLabel(appliedLodgingPeriodKey);
  
  // 카테고리 이름 매핑
  const categoryNameMap = {
    "대분류1": "첫째날",
    "대분류2": "둘째날",
    "대분류3": "셋째날"
  };
  const displayCategory = categoryNameMap[category] || category;
  
  currentLodgingCategory = originalCategory;
  
  return {
    category: displayCategory,
    activeType,
    categoryState,
    dateFormatted,
    seasonLabel,
    periodLabel,
    guestCount,
    skiers: categoryState.skiers || 0,
    perPersonItems,
    combinedTotal,
    baseGuests,
    periodKey
  };
}

function generateQuoteImage() {
  if (!window.html2canvas) {
    alert("이미지 변환 기능을 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.");
    return;
  }

  // 모든 대분류에서 정보 수집
  const categories = ["대분류1", "대분류2", "대분류3"];
  const quoteInfos = [];
  
  for (const category of categories) {
    const info = getCategoryQuoteInfo(category);
    if (info) {
      quoteInfos.push(info);
    }
  }
  
  if (quoteInfos.length === 0) {
    alert("견적서를 생성할 정보가 없습니다. 최소 하나의 대분류에서 총 패키지 금액이 0원이 아니어야 합니다.");
    return;
  }
  
  // 총 패키지 금액 합계
  const totalCombinedAmount = quoteInfos.reduce((sum, info) => sum + info.combinedTotal, 0);
  
  // 모든 인당 금액 항목 수집
  const allPerPersonItems = [];
  quoteInfos.forEach(info => {
    allPerPersonItems.push(...info.perPersonItems);
  });
  
  // 첫 번째 대분류의 날짜를 메인 날짜로 사용
  const mainDateFormatted = quoteInfos[0].dateFormatted;

  // 견적서 HTML 생성
  const quoteHTML = `
    <div class="quote-container" style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif;
      background: #1a1f3a;
      color: #ffffff;
      padding: 2.5rem;
      border-radius: 20px;
      max-width: 600px;
      margin: 0 auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    ">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h1 style="
          font-size: 1.75rem;
          font-weight: 700;
          color: #06b6d4;
          margin: 0 0 0.5rem;
        ">월드스키 숙박 패키지 견적서</h1>
        <p style="color: #94a3b8; margin: 0; font-size: 0.95rem;">${mainDateFormatted}</p>
      </div>

      ${quoteInfos.map((info, infoIndex) => `
      <div style="
        background: rgba(30, 41, 59, 0.8);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(148, 163, 184, 0.2);
      ">
        <h2 style="
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        "><span style="color: #ef4444; font-size: 1.5rem;">📍</span> ${info.category} 기본 정보</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${info.activeType ? `
          <tr>
            <td style="padding: 0.5rem 0; color: #cbd5e1; width: 40%;">펜션 타입</td>
            <td style="padding: 0.5rem 0; font-weight: 600; color: #ffffff;">${info.activeType.name}</td>
          </tr>
          ${info.activeType.description ? `
          <tr>
            <td style="padding: 0.5rem 0; color: #cbd5e1;">상세 설명</td>
            <td style="padding: 0.5rem 0; color: #ffffff;">${info.activeType.description}</td>
          </tr>
          ` : ''}
          ` : ''}
          <tr>
            <td style="padding: 0.5rem 0; color: #cbd5e1;">이용 날짜</td>
            <td style="padding: 0.5rem 0; font-weight: 600; color: #ffffff;">${info.dateFormatted}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem 0; color: #cbd5e1;">시즌</td>
            <td style="padding: 0.5rem 0;">
              <span style="
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 999px;
                background: ${info.seasonLabel === "성수기" ? "rgba(239, 68, 68, 0.3)" : "rgba(59, 130, 246, 0.3)"};
                color: ${info.seasonLabel === "성수기" ? "#fca5a5" : "#93c5fd"};
                font-weight: 600;
                font-size: 0.9rem;
              ">${info.seasonLabel}</span>
              <span style="
                display: inline-block;
                margin-left: 0.5rem;
                padding: 0.25rem 0.75rem;
                border-radius: 999px;
                background: rgba(148, 163, 184, 0.3);
                color: #cbd5e1;
                font-weight: 600;
                font-size: 0.9rem;
              ">${info.periodLabel}</span>
            </td>
          </tr>
        </table>
      </div>

      <div style="
        background: rgba(30, 41, 59, 0.8);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(148, 163, 184, 0.2);
      ">
        <h2 style="
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        "><span style="color: #a78bfa; font-size: 1.5rem;">👥</span> ${info.category} 인원 정보</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 0.5rem 0; color: #cbd5e1; width: 40%;">총 숙박 인원</td>
            <td style="padding: 0.5rem 0; font-weight: 600; color: #ffffff;">${info.guestCount}명</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem 0; color: #cbd5e1;">스키 타는 인원</td>
            <td style="padding: 0.5rem 0; font-weight: 600; color: #ffffff;">${info.skiers}명</td>
          </tr>
        </table>
      </div>
      `).join('')}

      <div style="
        background: rgba(30, 41, 59, 0.8);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(148, 163, 184, 0.2);
      ">
        <h2 style="
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        "><span style="color: #fbbf24; font-size: 1.5rem;">💰</span> 요금 상세</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${allPerPersonItems.length > 0 ? allPerPersonItems.map((item, index) => `
          <tr>
            <td style="padding: 0.75rem 0.5rem 0.75rem 0; color: #cbd5e1; border-bottom: 1px solid rgba(148, 163, 184, 0.2); word-wrap: break-word; word-break: break-word; text-align: left;">${item.label}</td>
            <td style="padding: 0.75rem 0 0.75rem 0.5rem; border-bottom: 1px solid rgba(148, 163, 184, 0.2); text-align: right; white-space: nowrap;">
              <strong style="font-weight: 600; color: #ffffff;">${formatCurrency(item.perPerson)}(${item.count}명)</strong>
            </td>
          </tr>
          `).join('') : `
          <tr>
            <td colspan="2" style="padding: 0.75rem 0; color: #cbd5e1; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">요금 정보 없음 ₩0</td>
          </tr>
          `}
        </table>
      </div>

      <div style="
        background: rgba(59, 130, 246, 0.3);
        border-radius: 16px;
        padding: 2rem;
        border: 1px solid rgba(59, 130, 246, 0.5);
      ">
        <div>
          <span style="font-size: 1.5rem; font-weight: 700; color: #ffffff; display: block; margin-bottom: 0.5rem;">총 패키지 금액</span>
          <span style="font-size: 2rem; font-weight: 700; color: #ffffff; display: block; text-align: right;">${formatCurrency(totalCombinedAmount)}</span>
        </div>
      </div>

      <div style="
        text-align: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(148, 163, 184, 0.2);
        color: #ffffff;
        font-size: 0.875rem;
      ">
        <p style="margin: 0;">월드스키 카운터 계산기로 생성된 견적서입니다.</p>
        <p style="margin: 0.5rem 0 0;">문의: 월드스키 카운터 033-263-0075</p>
      </div>
    </div>
  `;

  // 임시 컨테이너 생성
  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = quoteHTML;
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px";
  tempContainer.style.top = "0";
  document.body.appendChild(tempContainer);

  const quoteElement = tempContainer.querySelector(".quote-container");

  // 버튼 비활성화
  if (generateQuoteBtn) {
    generateQuoteBtn.disabled = true;
    generateQuoteBtn.textContent = "⏳ 생성 중...";
  }

  // html2canvas로 이미지 생성
  html2canvas(quoteElement, {
    backgroundColor: null,
    scale: 2,
    logging: false,
    useCORS: true,
    width: quoteElement.offsetWidth,
    height: quoteElement.offsetHeight
  })
    .then((canvas) => {
      // Canvas를 Blob으로 변환
      canvas.toBlob((blob) => {
        if (!blob) {
          alert("이미지 생성에 실패했습니다.");
          document.body.removeChild(tempContainer);
          if (generateQuoteBtn) {
            generateQuoteBtn.disabled = false;
            generateQuoteBtn.textContent = "📋 견적서 이미지 복사";
          }
          return;
        }

        // Clipboard API로 복사
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard
          .write([item])
          .then(() => {
            alert("견적서 이미지가 클립보드에 복사되었습니다!\n문자나 카카오톡에서 붙여넣기(Ctrl+V) 하면 됩니다.");
            document.body.removeChild(tempContainer);
            if (generateQuoteBtn) {
              generateQuoteBtn.disabled = false;
              generateQuoteBtn.textContent = "📋 견적서 이미지 복사";
            }
          })
          .catch((err) => {
            console.error("클립보드 복사 실패:", err);
            // 대체 방법: 다운로드
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `월드스키_견적서_${currentState.date || "날짜"}_${activeType.name}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert("클립보드 복사에 실패했습니다. 대신 파일을 다운로드했습니다.");
            document.body.removeChild(tempContainer);
            if (generateQuoteBtn) {
              generateQuoteBtn.disabled = false;
              generateQuoteBtn.textContent = "📋 견적서 이미지 복사";
            }
          });
      }, "image/png");
    })
    .catch((err) => {
      console.error("이미지 생성 오류:", err);
      alert("견적서 이미지 생성 중 오류가 발생했습니다.");
      document.body.removeChild(tempContainer);
      if (generateQuoteBtn) {
        generateQuoteBtn.disabled = false;
        generateQuoteBtn.textContent = "📋 견적서 이미지 복사";
      }
    });
}

function renderLodgingPanel() {
  if (!lodgingPanelEl) return;
  lodgingPanelEl.classList.add("is-active");
  lodgingPanelEl.removeAttribute("aria-hidden");
  
  ensureLodgingDefaults();
  renderLodgingCategoryButtons();
  renderLodgingGroupFilters();
  refreshLodgingTypeOptions();
  
  // 기존 단일 날짜 입력 필드는 숨김 (각 날짜별 입력 필드 사용)
  if (lodgingDateInput && isPhoneMode) {
    lodgingDateInput.closest(".lodging-field")?.style.setProperty("display", "none");
  }
  
  // 활성화된 날짜를 기준으로 날짜 정보, 시즌, 리프트+렌탈권 업데이트
  updateLodgingBadges();
  updateLodgingSeasonControls();
  
  rebalanceSkiDistribution();
  renderLodgingLiftOptions();
  updateBarbecueTotal();
}

function renderLodgingCategoryButtons() {
  if (!lodgingCategoryButtonsEl) return;
  
  // 초기 선택이 없으면 첫 번째 버튼(대분류1)을 기본 선택
  if (!currentLodgingCategory) {
    currentLodgingCategory = "대분류1";
    initializeLodgingState(currentLodgingCategory);
  }
  
  const buttons = lodgingCategoryButtonsEl.querySelectorAll(".lodging-category-btn");
  buttons.forEach((button) => {
    const category = button.dataset.category;
    const isActive = currentLodgingCategory === category;
    button.classList.toggle("active", isActive);
    
    // 기존 이벤트 리스너 제거 후 새로 추가
    button.replaceWith(button.cloneNode(true));
  });
  
  // 새로 추가된 버튼들에 이벤트 리스너 추가
  const newButtons = lodgingCategoryButtonsEl.querySelectorAll(".lodging-category-btn");
  newButtons.forEach((button) => {
    button.addEventListener("click", handleLodgingCategoryButtonClick);
  });
}

function handleLodgingCategoryButtonClick(event) {
  const button = event.target.closest(".lodging-category-btn");
  if (!button) return;
  
  const category = button.dataset.category;
  if (!category) return;
  
  // 대분류 변경
  currentLodgingCategory = category;
  const categoryState = initializeLodgingState(category);
  
  // 모든 대분류 섹션 숨기기
  const allSections = document.querySelectorAll('.lodging-category-content');
  allSections.forEach(section => {
    section.hidden = true;
  });
  
  // 선택된 대분류 섹션만 표시
  const selectedSection = document.getElementById(`lodging-content-${category}`);
  if (selectedSection) {
    selectedSection.hidden = false;
  }
  
  // 해당 대분류의 날짜 입력 필드를 해당 대분류의 상태로 업데이트
  const lodgingDateSelectEl = document.getElementById(`lodging-date-select-${category}`);
  if (lodgingDateSelectEl) {
    // 해당 대분류의 날짜가 있으면 사용, 없으면 상담 날짜 사용
    let dateToSet = categoryState.dates.first;
    if (!dateToSet) {
      if (manualDateInput && manualDateInput.value) {
        dateToSet = manualDateInput.value;
      } else if (state.dateInfo?.iso) {
        dateToSet = state.dateInfo.iso;
      } else {
        dateToSet = getLocalDateString(new Date());
      }
      categoryState.dates.first = dateToSet;
    }
    lodgingDateSelectEl.value = dateToSet;
  }
  
  // UI 업데이트
  renderLodgingCategoryButtons();
  
  // 현재 대분류의 바베큐 인원 입력 필드 업데이트
  const bbqGuestsInputEl = document.querySelector(`[data-category="${category}"].bbq-guests`);
  if (bbqGuestsInputEl) {
    bbqGuestsInputEl.value = categoryState.bbqGuests || 0;
  }
  
  // 현재 대분류의 UI 업데이트
  updateLodgingBadges();
  updateLodgingSeasonControls();
  renderLodgingLiftOptions();
  refreshLodgingTypeOptions();
  renderLodgingGroupFilters();
  rebalanceSkiDistribution();
  updateBarbecueTotal();
  calculateLodgingQuote();
}

function hideLodgingPanel() {
  if (lodgingPanelEl) {
    lodgingPanelEl.classList.remove("is-active");
    lodgingPanelEl.setAttribute("aria-hidden", "true");
  }
  if (itemGridEl) {
    itemGridEl.hidden = false;
  }
}

function ensureActiveCategory(categories) {
  if (!categories.length) {
    state.activeCategory = null;
    return;
  }

  // 현장 상담 모드에서는 숙박 패키지 카테고리 제외
  const filteredCategories = isPhoneMode 
    ? categories 
    : categories.filter((category) => !isLodgingCategory(category));

  if (!filteredCategories.length) {
    state.activeCategory = null;
    return;
  }

  const exists = filteredCategories.some((category) => category.name === state.activeCategory);
  if (!exists) {
    state.activeCategory = filteredCategories[0].name;
  }
}

function ensureActiveGroup(category) {
  const groups = category.groups || [];
  if (!groups.length) {
    delete state.activeGroup[category.name];
    return;
  }

  const current = state.activeGroup[category.name];
  const exists = groups.some((group) => group.name === current);
  if (!exists) {
    state.activeGroup[category.name] = groups[0].name;
  }
}

function renderCategoryNav(categories) {
  if (!categoryNavEl) return;
  categoryNavEl.innerHTML = "";

  // 현장 상담 모드에서는 숙박 패키지 카테고리 제외
  const filteredCategories = isPhoneMode 
    ? categories 
    : categories.filter((category) => !isLodgingCategory(category));

  if (filteredCategories.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "표시할 카테고리가 없습니다.";
    emptyMsg.style.color = "#94a3b8";
    emptyMsg.style.padding = "1rem";
    categoryNavEl.appendChild(emptyMsg);
    return;
  }

  // 현장 상담 모드에서 현재 활성 카테고리가 숙박 패키지인 경우 다른 카테고리로 변경
  if (!isPhoneMode && isLodgingCategory({ name: state.activeCategory })) {
    const firstCategory = filteredCategories[0];
    if (firstCategory) {
      state.activeCategory = firstCategory.name;
    }
  }

  filteredCategories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `category-btn${category.name === state.activeCategory ? " active" : ""}`;
    button.textContent = category.name;
    button.addEventListener("click", () => {
      state.activeCategory = category.name;
      ensureActiveGroup(category);
      renderCategoryNav(categories);
      renderItemGrid(categories);
    });
    categoryNavEl.appendChild(button);
  });
  
  // 카테고리 네비게이션 표시
  categoryNavEl.hidden = false;
}

function renderItemGrid(categories) {
  if (!itemGridEl) return;
  hideLodgingPanel();
  const activeCategory = categories.find((category) => category.name === state.activeCategory);
  if (groupNavEl) {
    groupNavEl.innerHTML = "";
    groupNavEl.hidden = true;
  }
  itemGridEl.innerHTML = "";
  itemGridEl.hidden = false;

  if (!activeCategory) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "표시할 상품이 없습니다.";
    emptyMessage.style.color = "#94a3b8";
    emptyMessage.style.padding = "1rem";
    itemGridEl.appendChild(emptyMessage);
    return;
  }

  // 현장 상담 모드에서는 숙박 패키지 카테고리 접근 차단
  if (isLodgingCategory(activeCategory)) {
    if (!isPhoneMode) {
      // 현장 상담 모드에서는 숙박 패키지를 표시하지 않음
      const filteredCategories = categories.filter((category) => !isLodgingCategory(category));
      const firstCategory = filteredCategories[0];
      if (firstCategory) {
        state.activeCategory = firstCategory.name;
        renderCategoryNav(categories);
        renderItemGrid(categories);
        return;
      }
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "표시할 상품이 없습니다.";
      emptyMessage.style.color = "#94a3b8";
      itemGridEl.appendChild(emptyMessage);
      return;
    }
    // 전화 상담 모드: 1박/2박/3박 버튼 표시
    if (itemGridEl) {
      itemGridEl.innerHTML = "";
      itemGridEl.hidden = false;
    }
    
    // 초기 날짜 설정: 첫째날은 상담 날짜, 둘째날은 첫째날+1일, 셋째날은 둘째날+1일
    const initializeDayDates = (forceUpdate = false) => {
      // 상담 날짜 가져오기 (manualDateInput 또는 state.dateInfo 또는 오늘 날짜)
      let baseDate = null;
      if (manualDateInput && manualDateInput.value) {
        baseDate = manualDateInput.value;
      } else if (state.dateInfo?.iso) {
        baseDate = state.dateInfo.iso;
      } else {
        baseDate = getLocalDateString(new Date());
      }
      
      // 첫째날 날짜가 없거나 강제 업데이트인 경우 상담 날짜로 설정
      const currentState = getCurrentLodgingState();
      if (!currentState.dates.first || forceUpdate) {
        currentState.dates.first = baseDate;
      }
      
      // 둘째날 날짜가 없거나 강제 업데이트인 경우 첫째날 + 1일로 설정
      if ((!currentState.dates.second || forceUpdate) && currentState.dates.first) {
        const firstDate = new Date(`${currentState.dates.first}T00:00:00`);
        const secondDate = new Date(firstDate);
        secondDate.setDate(secondDate.getDate() + 1);
        currentState.dates.second = getLocalDateString(secondDate);
      }
      
      // 셋째날 날짜가 없거나 강제 업데이트인 경우 둘째날 + 1일로 설정
      if ((!currentState.dates.third || forceUpdate) && currentState.dates.second) {
        const secondDate = new Date(`${currentState.dates.second}T00:00:00`);
        const thirdDate = new Date(secondDate);
        thirdDate.setDate(thirdDate.getDate() + 1);
        currentState.dates.third = getLocalDateString(thirdDate);
      }
    };
    
    initializeDayDates();
    
    // 첫째날을 기본 선택으로 설정
    let currentState = getCurrentLodgingState();
    currentState.activeDay = "first";
    
    // itemGridEl은 숙박 패키지에서는 사용하지 않음 (날짜 입력 칸은 lodging-panel에 있음)
    if (itemGridEl) {
      itemGridEl.innerHTML = "";
      itemGridEl.hidden = true;
    }
    
    // 각 대분류별 lodging-date-select 입력 칸 초기화 및 이벤트 리스너 설정
    const categories = ["대분류1", "대분류2", "대분류3"];
    categories.forEach((category) => {
      const lodgingDateSelectEl = document.getElementById(`lodging-date-select-${category}`);
      if (!lodgingDateSelectEl) return;
      
      // 기존 이벤트 리스너 제거 (중복 방지)
      const newEl = lodgingDateSelectEl.cloneNode(true);
      lodgingDateSelectEl.parentNode.replaceChild(newEl, lodgingDateSelectEl);
      const dateSelectEl = newEl;
      
      // 해당 대분류의 상태 가져오기
      const categoryState = initializeLodgingState(category);
      
      // 초기 날짜 설정: 해당 대분류의 날짜가 있으면 사용, 없으면 상담 날짜 사용
      let initialDate = categoryState.dates.first;
      if (!initialDate) {
        if (manualDateInput && manualDateInput.value) {
          initialDate = manualDateInput.value;
        } else if (state.dateInfo?.iso) {
          initialDate = state.dateInfo.iso;
        } else {
          initialDate = getLocalDateString(new Date());
        }
        categoryState.dates.first = initialDate;
      }
      
      // 해당 대분류의 날짜 입력 필드에 해당 대분류의 날짜만 표시
      dateSelectEl.value = initialDate;
      
      // 대분류1의 초기 날짜가 설정되면 대분류2, 대분류3에도 자동 설정
      if (category === "대분류1" && initialDate) {
        const category1Date = new Date(`${initialDate}T00:00:00`);
        
        // 대분류2: 대분류1 날짜에서 하루 뒤
        const category2Date = new Date(category1Date);
        category2Date.setDate(category2Date.getDate() + 1);
        const category2DateStr = getLocalDateString(category2Date);
        const category2State = initializeLodgingState("대분류2");
        if (!category2State.dates.first) {
          category2State.dates.first = category2DateStr;
          category2State.activeDay = "first";
          const category2SecondDate = new Date(category2Date);
          category2SecondDate.setDate(category2SecondDate.getDate() + 1);
          category2State.dates.second = getLocalDateString(category2SecondDate);
          const category2ThirdDate = new Date(category2SecondDate);
          category2ThirdDate.setDate(category2ThirdDate.getDate() + 1);
          category2State.dates.third = getLocalDateString(category2ThirdDate);
          
          // 대분류2의 날짜 입력 필드 업데이트
          const category2DateSelectEl = document.getElementById("lodging-date-select-대분류2");
          if (category2DateSelectEl) {
            category2DateSelectEl.value = category2DateStr;
          }
        }
        
        // 대분류3: 대분류1 날짜에서 이틀 뒤
        const category3Date = new Date(category1Date);
        category3Date.setDate(category3Date.getDate() + 2);
        const category3DateStr = getLocalDateString(category3Date);
        const category3State = initializeLodgingState("대분류3");
        if (!category3State.dates.first) {
          category3State.dates.first = category3DateStr;
          category3State.activeDay = "first";
          const category3SecondDate = new Date(category3Date);
          category3SecondDate.setDate(category3SecondDate.getDate() + 1);
          category3State.dates.second = getLocalDateString(category3SecondDate);
          const category3ThirdDate = new Date(category3SecondDate);
          category3ThirdDate.setDate(category3ThirdDate.getDate() + 1);
          category3State.dates.third = getLocalDateString(category3ThirdDate);
          
          // 대분류3의 날짜 입력 필드 업데이트
          const category3DateSelectEl = document.getElementById("lodging-date-select-대분류3");
          if (category3DateSelectEl) {
            category3DateSelectEl.value = category3DateStr;
          }
        }
      }
      
      // 날짜 입력 칸 변경 이벤트
      dateSelectEl.addEventListener("change", (e) => {
        // 대분류 변경
        currentLodgingCategory = category;
        const stateForCategory = getCurrentLodgingState();
        const selectedDate = e.target.value;
        if (!selectedDate) return;
        
        // 선택된 날짜를 첫째날로 설정
        stateForCategory.dates.first = selectedDate;
        stateForCategory.activeDay = "first";
        
        // 날짜 변경 시 해당 날짜의 리프트 인원만 고려하도록 리프트 옵션 다시 렌더링
        // 날짜별로 독립적으로 계산되므로 다른 날짜의 리프트 인원은 고려하지 않음
        renderLodgingLiftOptions();
        
        // 날짜 변경 후 리프트 인원 제한 재확인 (현재 활성화된 날짜의 리프트 인원만 고려)
        const currentActiveDayLiftGuests = getTotalLiftGuests();
        const currentGuests = stateForCategory.guests || 1;
        // 현재 활성화된 날짜의 리프트 인원이 총 숙박 인원보다 많으면 총 숙박 인원 자동 증가
        if (currentActiveDayLiftGuests > currentGuests) {
          setLodgingGuests(currentActiveDayLiftGuests);
        }
        
        // 둘째날, 셋째날 자동 계산
        const firstDate = new Date(`${selectedDate}T00:00:00`);
        const secondDate = new Date(firstDate);
        secondDate.setDate(secondDate.getDate() + 1);
        stateForCategory.dates.second = getLocalDateString(secondDate);
        
        const thirdDate = new Date(secondDate);
        thirdDate.setDate(thirdDate.getDate() + 1);
        stateForCategory.dates.third = getLocalDateString(thirdDate);
        
        // 대분류별 날짜 연동 설정
        const selectedDateObj = new Date(`${selectedDate}T00:00:00`);
        
        if (category === "대분류1") {
          // 대분류1의 날짜가 변경되면 대분류2, 대분류3의 날짜 자동 설정
          // 대분류2: 대분류1 날짜에서 하루 뒤
          const category2Date = new Date(selectedDateObj);
          category2Date.setDate(category2Date.getDate() + 1);
          const category2DateStr = getLocalDateString(category2Date);
          const category2State = initializeLodgingState("대분류2");
          category2State.dates.first = category2DateStr;
          category2State.activeDay = "first";
          const category2SecondDate = new Date(category2Date);
          category2SecondDate.setDate(category2SecondDate.getDate() + 1);
          category2State.dates.second = getLocalDateString(category2SecondDate);
          const category2ThirdDate = new Date(category2SecondDate);
          category2ThirdDate.setDate(category2ThirdDate.getDate() + 1);
          category2State.dates.third = getLocalDateString(category2ThirdDate);
          
          // 대분류2의 날짜 입력 필드 업데이트
          const category2DateSelectEl = document.getElementById("lodging-date-select-대분류2");
          if (category2DateSelectEl) {
            category2DateSelectEl.value = category2DateStr;
          }
          
          // 대분류3: 대분류1 날짜에서 이틀 뒤
          const category3Date = new Date(selectedDateObj);
          category3Date.setDate(category3Date.getDate() + 2);
          const category3DateStr = getLocalDateString(category3Date);
          const category3State = initializeLodgingState("대분류3");
          category3State.dates.first = category3DateStr;
          category3State.activeDay = "first";
          const category3SecondDate = new Date(category3Date);
          category3SecondDate.setDate(category3SecondDate.getDate() + 1);
          category3State.dates.second = getLocalDateString(category3SecondDate);
          const category3ThirdDate = new Date(category3SecondDate);
          category3ThirdDate.setDate(category3ThirdDate.getDate() + 1);
          category3State.dates.third = getLocalDateString(category3ThirdDate);
          
          // 대분류3의 날짜 입력 필드 업데이트
          const category3DateSelectEl = document.getElementById("lodging-date-select-대분류3");
          if (category3DateSelectEl) {
            category3DateSelectEl.value = category3DateStr;
          }
        } else if (category === "대분류2") {
          // 대분류2의 날짜가 변경되면 대분류1, 대분류3의 날짜 자동 설정
          // 대분류1: 대분류2 날짜에서 하루 전
          const category1Date = new Date(selectedDateObj);
          category1Date.setDate(category1Date.getDate() - 1);
          const category1DateStr = getLocalDateString(category1Date);
          const category1State = initializeLodgingState("대분류1");
          category1State.dates.first = category1DateStr;
          category1State.activeDay = "first";
          const category1SecondDate = new Date(category1Date);
          category1SecondDate.setDate(category1SecondDate.getDate() + 1);
          category1State.dates.second = getLocalDateString(category1SecondDate);
          const category1ThirdDate = new Date(category1SecondDate);
          category1ThirdDate.setDate(category1ThirdDate.getDate() + 1);
          category1State.dates.third = getLocalDateString(category1ThirdDate);
          
          // 대분류1의 날짜 입력 필드 업데이트
          const category1DateSelectEl = document.getElementById("lodging-date-select-대분류1");
          if (category1DateSelectEl) {
            category1DateSelectEl.value = category1DateStr;
          }
          
          // 대분류3: 대분류2 날짜에서 하루 뒤
          const category3Date = new Date(selectedDateObj);
          category3Date.setDate(category3Date.getDate() + 1);
          const category3DateStr = getLocalDateString(category3Date);
          const category3State = initializeLodgingState("대분류3");
          category3State.dates.first = category3DateStr;
          category3State.activeDay = "first";
          const category3SecondDate = new Date(category3Date);
          category3SecondDate.setDate(category3SecondDate.getDate() + 1);
          category3State.dates.second = getLocalDateString(category3SecondDate);
          const category3ThirdDate = new Date(category3SecondDate);
          category3ThirdDate.setDate(category3ThirdDate.getDate() + 1);
          category3State.dates.third = getLocalDateString(category3ThirdDate);
          
          // 대분류3의 날짜 입력 필드 업데이트
          const category3DateSelectEl = document.getElementById("lodging-date-select-대분류3");
          if (category3DateSelectEl) {
            category3DateSelectEl.value = category3DateStr;
          }
        } else if (category === "대분류3") {
          // 대분류3의 날짜가 변경되면 대분류1, 대분류2의 날짜 자동 설정
          // 대분류1: 대분류3 날짜에서 이틀 전
          const category1Date = new Date(selectedDateObj);
          category1Date.setDate(category1Date.getDate() - 2);
          const category1DateStr = getLocalDateString(category1Date);
          const category1State = initializeLodgingState("대분류1");
          category1State.dates.first = category1DateStr;
          category1State.activeDay = "first";
          const category1SecondDate = new Date(category1Date);
          category1SecondDate.setDate(category1SecondDate.getDate() + 1);
          category1State.dates.second = getLocalDateString(category1SecondDate);
          const category1ThirdDate = new Date(category1SecondDate);
          category1ThirdDate.setDate(category1ThirdDate.getDate() + 1);
          category1State.dates.third = getLocalDateString(category1ThirdDate);
          
          // 대분류1의 날짜 입력 필드 업데이트
          const category1DateSelectEl = document.getElementById("lodging-date-select-대분류1");
          if (category1DateSelectEl) {
            category1DateSelectEl.value = category1DateStr;
          }
          
          // 대분류2: 대분류3 날짜에서 하루 전
          const category2Date = new Date(selectedDateObj);
          category2Date.setDate(category2Date.getDate() - 1);
          const category2DateStr = getLocalDateString(category2Date);
          const category2State = initializeLodgingState("대분류2");
          category2State.dates.first = category2DateStr;
          category2State.activeDay = "first";
          const category2SecondDate = new Date(category2Date);
          category2SecondDate.setDate(category2SecondDate.getDate() + 1);
          category2State.dates.second = getLocalDateString(category2SecondDate);
          const category2ThirdDate = new Date(category2SecondDate);
          category2ThirdDate.setDate(category2ThirdDate.getDate() + 1);
          category2State.dates.third = getLocalDateString(category2ThirdDate);
          
          // 대분류2의 날짜 입력 필드 업데이트
          const category2DateSelectEl = document.getElementById("lodging-date-select-대분류2");
          if (category2DateSelectEl) {
            category2DateSelectEl.value = category2DateStr;
          }
        }
        
        // 선택된 날짜를 기준으로 주중/주말 판정
        const { period } = resolvePeriodAndHoliday(selectedDate);
        const resolvedSeason = resolveSeasonByDate(selectedDate);
        stateForCategory.resolvedPeriod = period;
        if (stateForCategory.autoSeason) {
          stateForCategory.resolvedSeason = resolvedSeason;
        }
        
        // 날짜 정보, 시즌, 리프트+렌탈권, 펜션 카테고리에 연동
        updateLodgingBadges();
        updateLodgingSeasonControls();
        renderLodgingLiftOptions();
        calculateLodgingQuote();
      });
    });
    
    // 현재 대분류의 초기 업데이트
    currentState = getCurrentLodgingState();
    if (currentState.dates.first) {
      const { period } = resolvePeriodAndHoliday(currentState.dates.first);
      const resolvedSeason = resolveSeasonByDate(currentState.dates.first);
      currentState.resolvedPeriod = period;
      if (currentState.autoSeason) {
        currentState.resolvedSeason = resolvedSeason;
      }
      updateLodgingBadges();
      updateLodgingSeasonControls();
      renderLodgingLiftOptions();
    }
    
    renderLodgingPanel();
    return;
  }

  let items = activeCategory.items;

  // 강습 카테고리인 경우 날짜 기준으로 주중/주말 판단
  const isLessonCategory = activeCategory.name === "강습";
  let groupsSource = activeCategory.groups || [];
  
  if (isLessonCategory && activeCategory.weekendGroups?.length) {
    // 날짜 가져오기 (phone.html에서는 manual-date, index.html에서는 현재 날짜)
    let dateString = null;
    if (manualDateInput) {
      dateString = manualDateInput.value;
    } else {
      // index.html에서는 현재 날짜 사용
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      dateString = `${year}-${month}-${day}`;
    }
    
    const { period } = resolvePeriodAndHoliday(dateString);
    groupsSource = period === "weekend" ? activeCategory.weekendGroups : activeCategory.groups;
  }

  if (groupsSource.length) {
    ensureActiveGroup({ ...activeCategory, groups: groupsSource });
    const activeGroupName = state.activeGroup[activeCategory.name];
    groupNavEl.hidden = false;
    
    // 기존 내용 모두 제거
    groupNavEl.innerHTML = "";
    
    // 강습패키지 카테고리인 경우 안내 문구 추가
    const isLessonPackageCategory = activeCategory.name === "강습 패키지";
    if (isLessonPackageCategory) {
      const notice = document.createElement("p");
      notice.className = "lesson-package-notice";
      notice.textContent = "소인 기준 금액이며, 대인으로 변경시 1인당 10,000원 추가로 변경 가능합니다.";
      groupNavEl.appendChild(notice);
    }
    
    // 버튼들을 담을 컨테이너 생성
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "group-nav-buttons";

    groupsSource.forEach((group) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `group-btn${group.name === activeGroupName ? " active" : ""}`;
      button.textContent = group.name;
      button.addEventListener("click", () => {
        state.activeGroup[activeCategory.name] = group.name;
        renderItemGrid(categories);
      });
      buttonsContainer.appendChild(button);
    });
    
    groupNavEl.appendChild(buttonsContainer);

    const activeGroup =
      groupsSource.find((group) => group.name === activeGroupName) || groupsSource[0];
    items = activeGroup?.items || [];
  } else {
    items = activeCategory.items || [];
  }

  items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "item-button";
    button.type = "button";
    button.dataset.itemId = item.id;
    // 강습 아이템인 경우 패찰비도 표시
    const equipmentFee = item.equipmentFee || 0;
    const itemPrice = item.price + equipmentFee;
    let priceText = formatCurrency(itemPrice);
    if (equipmentFee > 0) {
      priceText = `${formatCurrency(item.price)} + 패찰비 ${formatCurrency(equipmentFee)}`;
    }
    
    button.innerHTML = `
      <div>
        <p class="item-button__name">${item.name}</p>
        <p class="item-button__unit">${item.unit} · ${priceText}</p>
      </div>
      <p class="item-button__price">+1</p>
    `;
    button.addEventListener("click", () => adjustSelection(item.id, 1));
    itemGridEl.appendChild(button);
  });
}

function adjustSelection(itemId, delta) {
  // 숙박패키지 항목은 수정 불가
  if (itemId?.startsWith("lodging_")) {
    return;
  }

  const meta = pricingIndex[itemId];
  if (!meta) return;

  const currentQuantity = state.selections[itemId]?.quantity || 0;
  const newQuantity = currentQuantity + delta;

  if (newQuantity <= 0) {
    delete state.selections[itemId];
  } else {
    // 강습 아이템의 경우 패찰비도 포함하여 계산
    const equipmentFee = meta.equipmentFee || 0;
    const itemPrice = meta.price + equipmentFee;
    const subtotal = newQuantity * itemPrice;
    
    state.selections[itemId] = {
      ...meta,
      quantity: newQuantity,
      subtotal: subtotal,
      equipmentFee: equipmentFee,
      category: meta.category || ""
    };
    if (delta > 0) {
      updateLiftTimerDisplay(meta);
    }
  }

  updateSummary();
}

function getActiveCategories() {
  if (!pricingState) return [];
  const baseCategories = pricingState[state.season]?.categories || [];
  return baseCategories.map((category) => {
    const useWeekendGroups = state.period === "weekend" && category.weekendGroups;
    const useWeekendItems = state.period === "weekend" && category.weekendItems;
    return {
      ...category,
      groups: useWeekendGroups ? category.weekendGroups : category.groups,
      items: useWeekendItems ? category.weekendItems : category.items
    };
  });
}

function renderPosPanel() {
  if (!pricingState) {
    console.warn("pricingState가 없습니다.");
    return;
  }
  
  // 현장 상담 페이지는 항상 오늘 날짜로 업데이트
  if (!isPhoneMode) {
    const today = new Date();
    const todayIso = getLocalDateString(today);
    const currentState = getCurrentLodgingState();
    determinePeriod(today, todayIso);
    if (currentState.date !== todayIso) {
      currentState.date = todayIso;
      setLodgingDate(todayIso);
    }
  }
  
  const activePricing = pricingState[state.season];
  if (!activePricing) {
    console.warn(`pricingState에 ${state.season} 시즌 데이터가 없습니다.`);
    return;
  }
  
  const categories = getActiveCategories();
  if (!categories || categories.length === 0) {
    console.warn("카테고리가 없습니다.");
    if (categoryNavEl) {
      categoryNavEl.innerHTML = "<p style='color: #94a3b8; padding: 1rem;'>카테고리 데이터가 없습니다.</p>";
    }
    if (itemGridEl) {
      itemGridEl.innerHTML = "<p style='color: #94a3b8; padding: 1rem;'>표시할 상품이 없습니다.</p>";
    }
    return;
  }
  
  buildPricingIndex(categories);
  ensureActiveCategory(categories);
  const periodLabel = state.period === "weekend" ? "주말·공휴일 요금" : "주중 요금";
  if (seasonLabelEl) {
    seasonLabelEl.textContent = `현재: ${activePricing.label} · ${periodLabel}`;
  }
  updateDateLabel();
  renderCategoryNav(categories);
  renderItemGrid(categories);
}

function updateDateLabel() {
  if (!dateLabelEl) return;
  
  // 현장 상담 페이지는 항상 오늘 날짜 강제 사용
  if (!isPhoneMode) {
    const today = new Date();
    const todayIso = getLocalDateString(today);
    // 무조건 오늘 날짜로 업데이트
    determinePeriod(today, todayIso);
    // 현장 상담 페이지에서는 날짜 기준으로 시즌 자동 판정
    const resolvedSeason = resolveSeasonByDate(todayIso);
    state.season = resolvedSeason;
  }
  
  if (!state.dateInfo) return;
  
  const { iso, isHoliday, holidayLabel } = state.dateInfo;
  
  // 전화 상담 모드에서도 날짜 기준으로 시즌 자동 판정
  if (isPhoneMode) {
    const resolvedSeason = resolveSeasonByDate(iso);
    state.season = resolvedSeason;
  }
  
  const display = new Date(iso).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short"
  });
  const suffix = state.period === "weekend" ? "(주말·공휴일 요금 적용)" : "(주중 요금 적용)";
  const holidayText = isHoliday && holidayLabel ? ` · ${holidayLabel}` : "";
  dateLabelEl.textContent = `${display}${holidayText} ${suffix}`;
  if (periodPillEl) {
    // 날짜 기준으로 시즌 자동 판정
    const resolvedSeason = resolveSeasonByDate(iso);
    const seasonLabel = resolvedSeason === "peakSeason" ? "성수기" : "비수기";
    const periodLabel = state.period === "weekend" ? "주말/공휴일" : "주중";
    periodPillEl.textContent = `오늘은 ${seasonLabel} ${periodLabel} 요금이 적용됩니다`;
  }
  
  // 시간 정보 업데이트
  updateTimeLabel();
}

function updateTimeLabel() {
  if (!timeLabelEl) return;
  
  const now = new Date();
  const actualDate = getLocalDateString(now);
  const actualTime = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  
  // 표시되는 날짜 정보
  const displayedDate = state.dateInfo?.iso || actualDate;
  const isWrongDate = displayedDate !== actualDate;
  
  let timeText = ` [${actualTime}]`;
  if (isWrongDate) {
    const displayed = new Date(displayedDate + 'T00:00:00').toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric"
    });
    const actual = new Date(actualDate + 'T00:00:00').toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric"
    });
    timeText = ` [${actualTime}] (표시: ${displayed}, 실제: ${actual})`;
  }
  
  timeLabelEl.textContent = timeText;
}

function updateSummary() {
  summaryListEl.innerHTML = "";
  let grandTotal = 0;

  const orderedSelections = renderOrder
    .map((id) => state.selections[id])
    .filter(Boolean);

  if (!orderedSelections.length) {
    const emptyState = document.createElement("li");
    emptyState.textContent = "선택된 항목이 없습니다.";
    emptyState.style.color = isPhoneMode ? "#A67C5A" : "#94a3b8";
    summaryListEl.appendChild(emptyState);
    grandTotalEl.textContent = "₩0";
    updateSplitAmount(0);
    return;
  }

  orderedSelections.forEach((selection) => {
    grandTotal += selection.subtotal;

    const itemLabel = selection.groupName ? `${selection.groupName} ${selection.name}` : selection.name;
    const equipmentFee = selection.equipmentFee || 0;
    const basePrice = selection.price || 0;
    const itemPrice = basePrice + equipmentFee;
    // 카테고리 정보가 없으면 pricingIndex에서 가져오기
    const categoryName = selection.category || (pricingIndex[selection.id]?.category || "");
    
    // 숙박패키지 항목인지 확인
    const isLodgingItem = selection.id?.startsWith("lodging_");
    
    // 강습 아이템인 경우 패찰비 정보 표시
    let priceText = `단가 ${formatCurrency(itemPrice)}`;
    if (equipmentFee > 0) {
      priceText += ` (강습 ${formatCurrency(basePrice)} + 패찰비 ${formatCurrency(equipmentFee)})`;
    }
    
    // 숙박패키지 항목인 경우 단가 대신 수량과 합계 표시
    if (isLodgingItem) {
      if (selection.unit) {
        priceText = `${selection.unit} · ${formatCurrency(itemPrice)} × ${selection.quantity} = ${formatCurrency(selection.subtotal)}`;
      } else {
        priceText = `단가 ${formatCurrency(itemPrice)} · 수량 ${selection.quantity} · 합계 ${formatCurrency(selection.subtotal)}`;
      }
    } else {
      priceText += ` · 합계 ${formatCurrency(selection.subtotal)}`;
    }
    
    const item = document.createElement("li");
    
    // 숙박패키지 항목인 경우 수량 조절 버튼 없이 표시
    if (isLodgingItem) {
      item.innerHTML = `
        <div class="summary-item">
          <div class="summary-item__info">
            ${categoryName ? `<p class="summary-item__category">${categoryName}</p>` : ''}
            <p class="summary-item__name">${itemLabel}</p>
            <p class="summary-item__price">${priceText}</p>
          </div>
          <div class="quantity-display">
            <span>수량: ${selection.quantity}</span>
          </div>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div class="summary-item">
          <div class="summary-item__info">
            ${categoryName ? `<p class="summary-item__category">${categoryName}</p>` : ''}
            <p class="summary-item__name">${itemLabel}</p>
            <p class="summary-item__price">${priceText}</p>
          </div>
          <div class="quantity-control" role="group" aria-label="${selection.name} 수량 조절">
            <button type="button" data-action="decrease" data-item-id="${selection.id}">-</button>
            <span>${selection.quantity}</span>
            <button type="button" data-action="increase" data-item-id="${selection.id}">+</button>
          </div>
        </div>
      `;
    }
    summaryListEl.appendChild(item);
  });

  grandTotalEl.textContent = formatCurrency(grandTotal);
  updateSplitAmount(grandTotal);
}

function resetCalculator() {
  state.selections = {};
  updateSummary();
  resetLiftTimerDisplay();
  
  // 전화 상담 모드에서 숙박 패키지 상태 초기화
  if (isPhoneMode) {
    const today = getLocalDateString(new Date());
    const categories = ["대분류1", "대분류2", "대분류3"];
    categories.forEach((category, index) => {
      // 상태 초기화
      lodgingStates[category] = createLodgingState();
      
      // 첫째날(대분류1)은 오늘 날짜로 설정, 나머지는 빈 값
      const dateValue = index === 0 ? today : "";
      if (index === 0) {
        lodgingStates[category].date = today;
        lodgingStates[category].dates.first = today;
      }
      
      // UI 요소 초기화
      const dateInput = document.getElementById(`lodging-date-select-${category}`);
      if (dateInput) dateInput.value = dateValue;
      
      const typeSelect = document.getElementById(`lodging-type-${category}`);
      if (typeSelect) {
        typeSelect.value = "";
        typeSelect.disabled = false;
      }
      
      const guestsInput = document.querySelector(`.lodging-guests[data-category="${category}"]`);
      if (guestsInput) guestsInput.value = "4";
      
      const bbqInput = document.querySelector(`.bbq-guests[data-category="${category}"]`);
      if (bbqInput) bbqInput.value = "0";
      
      // 숙박 없음 체크박스 찾기 (각 대분류의 lodging-type-groups 내부)
      const typeGroupsEl = document.querySelector(`[data-category="${category}"].lodging-type-groups`);
      if (typeGroupsEl) {
        const noLodgingCheckbox = typeGroupsEl.querySelector('input[type="checkbox"][id*="no-lodging"]');
        if (noLodgingCheckbox) {
          noLodgingCheckbox.checked = true;
          // 체크박스 변경 이벤트 트리거
          noLodgingCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      
      // 리프트 선택은 상태 초기화 후 renderLodgingLiftOptions에서 자동으로 업데이트됨
    });
    
    // 각 대분류의 UI 및 계산 결과 업데이트
    categories.forEach((category, index) => {
      const originalCategory = currentLodgingCategory;
      currentLodgingCategory = category;
      renderLodgingGroupFilters();
      renderLodgingLiftOptions();
      // 첫째날의 경우 날짜 설정 함수 호출하여 관련 상태 업데이트
      if (index === 0 && today) {
        setLodgingDate(today);
      }
      updateLodgingBadges();
      calculateLodgingQuote();
      currentLodgingCategory = originalCategory;
    });
  }
}

function renderLodgingGroupFilters() {
  const currentState = getCurrentLodgingState();
  const lodgingTypeGroupsEl = document.querySelector(`[data-category="${currentLodgingCategory}"].lodging-type-groups`);
  if (!lodgingTypeGroupsEl) return;
  const groups = getLodgingGroups();
  const field = lodgingTypeGroupsEl.closest(".lodging-field");
  if (!groups.length) {
    lodgingTypeGroupsEl.innerHTML = "";
    if (field) field.hidden = true;
    currentState.selectedTypeGroup = null;
    return;
  }
  if (field) field.hidden = false;
  if (
    !currentState.selectedTypeGroup ||
    !groups.includes(currentState.selectedTypeGroup)
  ) {
    currentState.selectedTypeGroup = groups[0];
  }
  lodgingTypeGroupsEl.innerHTML = "";
  
  // '숙박 없음' 체크박스 추가
  const noLodgingContainer = document.createElement("div");
  noLodgingContainer.className = "lodging-no-lodging-container";
  const noLodgingCheckbox = document.createElement("input");
  noLodgingCheckbox.type = "checkbox";
  noLodgingCheckbox.id = "lodging-no-lodging";
  noLodgingCheckbox.checked = currentState.noLodging;
  
  // 초기 렌더링 시 숙박 없음이 체크되어 있으면 펜션 타입 선택 비활성화
  if (currentState.noLodging && lodgingTypeSelect) {
    lodgingTypeSelect.disabled = true;
    lodgingTypeSelect.value = "";
    currentState.selectedTypeId = null;
  }
  
  noLodgingCheckbox.addEventListener("change", (e) => {
    currentState.noLodging = e.target.checked;
    if (currentState.noLodging) {
      // 숙박 없음이 체크되면 펜션 타입 선택 비활성화
      if (lodgingTypeSelect) {
        lodgingTypeSelect.disabled = true;
        lodgingTypeSelect.value = "";
        currentState.selectedTypeId = null;
      }
    } else {
      // 숙박 없음이 해제되면 펜션 타입 선택 활성화
      if (lodgingTypeSelect) {
        lodgingTypeSelect.disabled = false;
        refreshLodgingTypeOptions();
      }
    }
    calculateLodgingQuote();
  });
  const noLodgingLabel = document.createElement("label");
  noLodgingLabel.htmlFor = "lodging-no-lodging";
  noLodgingLabel.textContent = "숙박 없음";
  noLodgingLabel.className = "lodging-no-lodging-label";
  noLodgingContainer.appendChild(noLodgingCheckbox);
  noLodgingContainer.appendChild(noLodgingLabel);
  lodgingTypeGroupsEl.appendChild(noLodgingContainer);
  
  groups.forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `lodging-type-group-btn${
      currentState.selectedTypeGroup === group ? " active" : ""
    }`;
    button.dataset.lodgingGroup = group;
    button.dataset.category = currentLodgingCategory;
    button.textContent = group;
    button.addEventListener("click", handleLodgingGroupClick);
    lodgingTypeGroupsEl.appendChild(button);
  });
}

function handleLodgingGroupClick(event) {
  const target = event.target.closest("button[data-lodging-group]");
  if (!target) return;
  
  // 대분류 확인 (버튼에 data-category가 있으면 사용, 없으면 현재 대분류 사용)
  const buttonCategory = target.dataset.category;
  if (buttonCategory) {
    currentLodgingCategory = buttonCategory;
  }
  
  const currentState = getCurrentLodgingState();
  const group = target.dataset.lodgingGroup;
  if (!group || currentState.selectedTypeGroup === group) return;
  
  currentState.selectedTypeGroup = group;
  const filtered = getLodgingTypes().filter(
    (type) => (type.group || DEFAULT_LODGING_GROUP) === group
  );
  if (filtered.length) {
    currentState.selectedTypeId = filtered[0].id;
  }
  renderLodgingGroupFilters();
  refreshLodgingTypeOptions();
  calculateLodgingQuote();
}

function updateSplitAmount(total) {
  const count = Math.max(1, state.splitCount || 1);
  if (splitCountInput) splitCountInput.value = count;
  const perPerson = total > 0 ? total / count : 0;
  if (splitAmountEl) {
    splitAmountEl.textContent = formatCurrency(perPerson);
  }
}

function changeSplitCount(delta) {
  const next = Math.max(1, state.splitCount + delta);
  state.splitCount = next;
  if (splitCountInput) splitCountInput.value = next;
  updateSummary();
}

function handleSplitInput(event) {
  const value = Math.max(1, Math.floor(Number(event.target.value) || 1));
  state.splitCount = value;
  event.target.value = value;
  updateSummary();
}

function handleSeasonChange(seasonKey) {
  if (state.season === seasonKey) return;

  state.season = seasonKey;
  state.activeCategory = null;
  state.activeGroup = {};
  seasonButtons.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.season === seasonKey)
  );
  renderPosPanel();
  resetCalculator();
}

function handleSummaryButtonClick(event) {
  const { action, itemId } = event.target.dataset;
  if (!action || !itemId) return;

  if (action === "increase") {
    adjustSelection(itemId, 1);
  } else if (action === "decrease") {
    adjustSelection(itemId, -1);
  }
}

function toggleCategoryView() {
  const collapsed = posPanelEl.classList.toggle("pos-panel--collapsed");
  toggleViewBtn.textContent = collapsed ? "카테고리 펼치기" : "카테고리 접기";
}

async function loadPricingData() {
  if (pricingState) return;
  try {
    const response = await fetch("/api/pricing");
    if (!response.ok) throw new Error("network error");
    const result = await response.json();
    if (!result.success) throw new Error("invalid payload");
    pricingState = result.data;
    window.pricingData = pricingState;
  } catch (error) {
    console.error("요금 데이터를 불러오지 못했습니다.", error);
    const fallback = document.createElement("p");
    fallback.textContent = "요금 데이터를 불러오지 못했습니다. 잠시 후 다시 시도하세요.";
    fallback.style.color = "#f87171";
    itemGridEl.innerHTML = "";
    itemGridEl.appendChild(fallback);
    throw error;
  }
}

async function loadHolidays() {
  // holidays.js에서 이미 로드된 데이터가 있으면 먼저 사용
  if (Array.isArray(window.holidaysData) && window.holidaysData.length) {
    holidays = window.holidaysData;
    return;
  }
  
  try {
    const response = await fetch("/api/holidays");
    if (!response.ok) throw new Error("network error");
    const result = await response.json();
    if (!result.success) throw new Error("invalid payload");
    holidays = result.holidays || [];
  } catch (error) {
    // 서버 API 실패 시 로컬 파일에서 직접 로드 시도
    if (Array.isArray(window.holidaysData) && window.holidaysData.length) {
      holidays = window.holidaysData;
      return;
    }
    
    try {
      const response = await fetch("holidays.json", { cache: "no-store" });
      if (!response.ok) throw new Error("network error");
      const data = await response.json();
      holidays = Array.isArray(data) ? data : (data.holidays || []);
    } catch (localError) {
      console.warn("공휴일 정보를 불러오지 못했습니다.", localError);
      holidays = [];
    }
  }
}

// 로컬 날짜를 YYYY-MM-DD 형식으로 변환 (UTC 문제 방지)
function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function determinePeriod(date = new Date(), isoOverride) {
  // 로컬 날짜 사용 (UTC 문제 방지)
  const iso = isoOverride || getLocalDateString(date);
  const day = date.getDay();
  const isWeekendDay = day === 0 || day === 6;
  const holidayMatch = holidays.find((holiday) => holiday.date === iso);
  const period = isWeekendDay || holidayMatch ? "weekend" : "weekday";
  state.period = period;
  state.activeGroup = {};
  state.dateInfo = {
    iso,
    isHoliday: Boolean(holidayMatch),
    holidayLabel: holidayMatch?.label || null
  };
}

function handleManualDateChange(event) {
  const value = event.target.value;
  if (!value) return;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return;
  determinePeriod(parsed, value);
  const resolvedSeason = resolveSeasonByDate(value) || "offSeason";
  const seasonChanged = resolvedSeason !== state.season;
  
  // 공휴일 확인 및 주말 요금 적용
  const { period, holidayLabel } = resolvePeriodAndHoliday(value);
  const currentState = getCurrentLodgingState();
  currentState.date = value;
  currentState.resolvedPeriod = period;
  currentState.holidayLabel = holidayLabel;
  currentState.resolvedSeason = resolvedSeason;
  
  if (!currentState.autoSeason) {
    currentState.manualSeason = resolvedSeason;
  }
  
  // 숙박 관련 업데이트
  if (isPhoneMode) {
    // 숙박 패키지가 활성화되어 있으면 날짜 업데이트
    // 주의: 각 대분류는 독립적인 날짜를 유지하므로, 상담 날짜 변경 시 날짜가 없는 대분류에만 초기값으로 설정
    if (state.activeCategory === "숙박 패키지") {
      // 모든 대분류의 lodging-date-select 확인 (날짜가 없는 경우에만 초기값 설정)
      const categories = ["대분류1", "대분류2", "대분류3"];
      categories.forEach((category) => {
        const lodgingDateSelectEl = document.getElementById(`lodging-date-select-${category}`);
        const categoryState = initializeLodgingState(category);
        
        // 해당 대분류에 날짜가 없고, 입력 필드도 비어있는 경우에만 상담 날짜로 초기화
        if (lodgingDateSelectEl && !lodgingDateSelectEl.value && !categoryState.dates.first) {
          lodgingDateSelectEl.value = value;
          categoryState.dates.first = value;
          categoryState.activeDay = "first";
          
          // 둘째날, 셋째날 자동 계산
          const firstDate = new Date(`${value}T00:00:00`);
          const secondDate = new Date(firstDate);
          secondDate.setDate(secondDate.getDate() + 1);
          categoryState.dates.second = getLocalDateString(secondDate);
          const thirdDate = new Date(secondDate);
          thirdDate.setDate(thirdDate.getDate() + 1);
          categoryState.dates.third = getLocalDateString(thirdDate);
          
          // 첫째날 날짜를 기준으로 모든 것 업데이트 (현재 대분류인 경우에만)
          if (category === currentLodgingCategory) {
            const { period } = resolvePeriodAndHoliday(value);
            const resolvedSeason = resolveSeasonByDate(value);
            categoryState.resolvedPeriod = period;
            if (categoryState.autoSeason) {
              categoryState.resolvedSeason = resolvedSeason;
            }
            updateLodgingBadges();
            updateLodgingSeasonControls();
            renderLodgingLiftOptions();
          }
        }
      });
    }
    calculateLodgingQuote();
  }
  
  // 강습 카테고리가 활성화되어 있으면 다시 렌더링
  if (state.activeCategory === "강습") {
    const categories = getActiveCategories();
    renderItemGrid(categories);
  }
  
  if (seasonChanged) {
    handleSeasonChange(resolvedSeason);
  } else {
    renderPosPanel();
    updateSummary();
  }
}

resetBtn.addEventListener("click", resetCalculator);
summaryListEl.addEventListener("click", handleSummaryButtonClick);
seasonButtons.forEach((button) => {
  button.addEventListener("click", () => handleSeasonChange(button.dataset.season));
});
toggleViewBtn.addEventListener("click", toggleCategoryView);
splitDecreaseBtn?.addEventListener("click", () => changeSplitCount(-1));
splitIncreaseBtn?.addEventListener("click", () => changeSplitCount(1));
splitCountInput?.addEventListener("input", handleSplitInput);

// 인원선택 접기/펼치기 기능
const splitToggleBtn = document.getElementById("split-toggle-btn");
const splitContent = document.getElementById("split-content");
if (splitToggleBtn && splitContent) {
  splitToggleBtn.addEventListener("click", () => {
    const isCurrentlyHidden = splitContent.hidden;
    splitContent.hidden = !isCurrentlyHidden;
    splitToggleBtn.setAttribute("aria-expanded", !isCurrentlyHidden ? "true" : "false");
  });
  // 기본적으로 접힌 상태로 시작
  splitToggleBtn.setAttribute("aria-expanded", "false");
}
lodgingDateInput?.addEventListener("change", (event) => {
  // 현장 상담 페이지는 날짜 변경 불가 (항상 오늘 날짜 사용)
  if (!isPhoneMode) {
    const today = new Date();
    const todayIso = getLocalDateString(today);
    event.target.value = todayIso;
    setLodgingDate(todayIso);
  } else {
    // 전화 상담 모드: lodging-date-select가 있으면 사용하지 않음
    // (lodging-date-select가 별도로 날짜를 관리)
    if (!lodgingDateSelectEl) {
      const selectedDate = event.target.value;
      setLodgingDate(selectedDate);
    }
  }
});

// 이벤트 위임을 사용하여 모든 대분류의 요소에 이벤트 리스너 추가
lodgingPanelEl?.addEventListener("change", (event) => {
  const target = event.target;
  const category = target.dataset.category;
  if (!category) return;
  
  // 대분류 변경
  currentLodgingCategory = category;
  
  if (target.classList.contains("lodging-season-auto")) {
    const currentState = getCurrentLodgingState();
    currentState.autoSeason = Boolean(target.checked);
    
    const activeDate = currentState.activeDay && currentState.dates[currentState.activeDay] 
      ? currentState.dates[currentState.activeDay] 
      : currentState.date;
    
    if (!currentState.autoSeason && activeDate) {
      const resolvedSeason = resolveSeasonByDate(activeDate);
      currentState.manualSeason = resolvedSeason;
    }
    
    if (activeDate) {
      updateLodgingBadges();
      updateLodgingSeasonControls();
      renderLodgingLiftOptions();
      calculateLodgingQuote();
    } else {
      setLodgingDate(currentState.date);
    }
  } else if (target.classList.contains("lodging-guests")) {
    setLodgingGuests(target.value);
  } else if (target.classList.contains("bbq-guests")) {
    setBbqGuests(target.value);
  } else if (target.id && target.id.startsWith("lodging-type-")) {
    // 대분류 추출 (lodging-type-대분류1, lodging-type-대분류2 등)
    const categoryMatch = target.id.match(/lodging-type-(대분류[123])/);
    if (categoryMatch) {
      currentLodgingCategory = categoryMatch[1];
    }
    
    const currentState = getCurrentLodgingState();
    currentState.selectedTypeId = target.value || null;
    const selected = getActiveLodgingType();
    if (selected) {
      currentState.selectedTypeGroup = selected.group || DEFAULT_LODGING_GROUP;
      renderLodgingGroupFilters();
    }
    clampGuestsToMax();
    rebalanceSkiDistribution();
    updateLodgingTypeMeta(selected);
    renderLodgingLiftOptions();
    calculateLodgingQuote();
  }
});

lodgingPanelEl?.addEventListener("click", (event) => {
  const target = event.target;
  const category = target.dataset.category;
  if (!category) return;
  
  // 대분류 변경
  currentLodgingCategory = category;
  
  if (target.classList.contains("lodging-guests-dec")) {
    handleLodgingGuestsDelta(-1);
  } else if (target.classList.contains("lodging-guests-inc")) {
    handleLodgingGuestsDelta(1);
  } else if (target.classList.contains("bbq-guests-dec")) {
    handleBbqGuestsDelta(-1);
  } else if (target.classList.contains("bbq-guests-inc")) {
    handleBbqGuestsDelta(1);
  } else if (target.dataset.lodgingSeason) {
    setLodgingManualSeason(target.dataset.lodgingSeason);
  } else if (target.dataset.lodgingGroup) {
    handleLodgingGroupClick(event);
  }
});

manualDateInput?.addEventListener("change", handleManualDateChange);
generateQuoteBtn?.addEventListener("click", generateQuoteImage);

// 초기 렌더
Promise.all([loadPricingData(), loadHolidays()])
  .then(() => {
    const today = new Date();
    const todayIso = getLocalDateString(today);
    
    if (isPhoneMode) {
      determinePeriod(today, todayIso);
      if (manualDateInput) {
        manualDateInput.value = todayIso;
      }
      const currentState = getCurrentLodgingState();
      currentState.date = todayIso;
    } else {
      // 현장 상담 페이지는 항상 오늘 날짜 사용
      determinePeriod(today, todayIso);
      const currentState = getCurrentLodgingState();
      currentState.date = todayIso;
      if (lodgingDateInput) {
        lodgingDateInput.value = todayIso;
      }
      // 날짜 레이블 즉시 업데이트
      updateDateLabel();
    }
    renderPosPanel();
    updateSummary();
    
    // 시간 정보 주기적으로 업데이트 (1초마다)
    setInterval(() => {
      updateTimeLabel();
    }, 1000);
  })
  .catch(() => {
    seasonLabelEl.textContent = "요금 데이터를 불러오는 중 오류 발생";
  });

