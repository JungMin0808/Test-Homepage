const state = {
  season: "offSeason",
  categoryIndex: 0,
  groupIndex: 0,
  periodSelections: {},
  data: null,
  holidays: [],
  isPricingDirty: false,
  isHolidayDirty: false
};

const seasonTabs = Array.from(document.querySelectorAll(".season-tab"));
const categoryListEl = document.getElementById("category-list");
const categoryTitleEl = document.getElementById("category-title");
const periodTabsEl = document.getElementById("period-tabs");
const groupTabsEl = document.getElementById("group-tabs");
const itemTableEl = document.getElementById("item-table");
const addItemBtn = document.getElementById("add-item-btn");
const newCategoryInput = document.getElementById("new-category-name");
const addCategoryBtn = document.getElementById("add-category-btn");
const groupActionsEl = document.getElementById("group-actions");
const newGroupInput = document.getElementById("new-group-name");
const addGroupBtn = document.getElementById("add-group-btn");
const exportBtn = document.getElementById("export-btn");
const copyBtn = document.getElementById("copy-json-btn");
const importInput = document.getElementById("import-file");
const saveBtn = document.getElementById("save-btn");
const saveStatusEl = document.getElementById("save-status");
const holidayListEl = document.getElementById("holiday-list");
const holidayDateInput = document.getElementById("holiday-date");
const holidayLabelInput = document.getElementById("holiday-label");
const addHolidayBtn = document.getElementById("add-holiday-btn");
const holidayPanelEl = document.querySelector(".holiday-panel");
const holidayToggleBtn = document.getElementById("holiday-toggle-btn");

function ensureLodgingPackages() {
  if (!state.data) return [];
  if (!state.data.lodgingPackages) {
    state.data.lodgingPackages = { types: [] };
  }
  if (!Array.isArray(state.data.lodgingPackages.types)) {
    state.data.lodgingPackages.types = [];
  }
  return state.data.lodgingPackages.types;
}

function getLodgingTypes() {
  return ensureLodgingPackages();
}

function getCurrentSeasonData() {
  return state.data ? state.data[state.season] : null;
}

function getCurrentCategory() {
  const season = getCurrentSeasonData();
  return season?.categories?.[state.categoryIndex] ?? null;
}

function getCategoryPeriod(category) {
  if (!category) return "weekday";
  if (!category.weekendGroups && !category.weekendItems) return "weekday";
  return state.periodSelections[category.name] || "weekday";
}

function getActiveGroupSource(category) {
  if (!category) return [];
  const period = getCategoryPeriod(category);
  const hasWeekendGroups = Array.isArray(category.weekendGroups);
  if (period === "weekend" && hasWeekendGroups) {
    return category.weekendGroups;
  }
  return category.groups || [];
}

function getActiveItemList() {
  const category = getCurrentCategory();
  if (!category) return null;

  const groupsSource = getActiveGroupSource(category);
  if (groupsSource.length) {
    const group = groupsSource[state.groupIndex] ?? groupsSource[0];
    if (!group) return [];
    state.groupIndex = groupsSource.indexOf(group);
    return group.items;
  }

  const period = getCategoryPeriod(category);
  if (period === "weekend" && category.weekendItems) {
    return category.weekendItems;
  }
  return category.items ?? [];
}

function ensureGroupIndex(category) {
  const groupsSource = getActiveGroupSource(category);
  if (!groupsSource.length) {
    state.groupIndex = 0;
    return;
  }
  if (state.groupIndex >= groupsSource.length) {
    state.groupIndex = 0;
  }
}

function renderCategories() {
  const season = getCurrentSeasonData();
  if (!season) {
    categoryListEl.innerHTML = "<p>데이터를 불러오고 있습니다...</p>";
    return;
  }

  categoryListEl.innerHTML = "";
  season.categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `category-item${index === state.categoryIndex ? " active" : ""}`;
    button.textContent = category.name;
    button.addEventListener("click", () => {
      state.categoryIndex = index;
      state.groupIndex = 0;
      renderCategories();
      renderItems();
    });
    categoryListEl.appendChild(button);
  });
}

function renderItems() {
  const category = getCurrentCategory();
  const isLodgingCategory = category?.name === "숙박 패키지";
  addItemBtn.textContent = isLodgingCategory ? "펜션 타입 추가" : "항목 추가";
  if (groupActionsEl) {
    groupActionsEl.hidden = true;
  }

  if (!category) {
    const season = getCurrentSeasonData();
    if (season?.categories?.length) {
      state.categoryIndex = 0;
      state.groupIndex = 0;
      return renderItems();
    }
  }
  ensureGroupIndex(category);
  if (!category) {
    categoryTitleEl.textContent = "카테고리를 선택하세요";
    periodTabsEl.hidden = true;
    periodTabsEl.innerHTML = "";
    groupTabsEl.hidden = true;
    groupTabsEl.innerHTML = "";
    itemTableEl.innerHTML = "";
    if (groupActionsEl) groupActionsEl.hidden = true;
    return;
  }

  if (isLodgingCategory) {
    periodTabsEl.hidden = true;
    periodTabsEl.innerHTML = "";
    groupTabsEl.hidden = true;
    groupTabsEl.innerHTML = "";
    if (groupActionsEl) groupActionsEl.hidden = true;
    renderLodgingTypeEditor();
    return;
  }

  renderPeriodTabs(category);

  const groupsSource = getActiveGroupSource(category);
  if (groupsSource.length) {
    renderGroupTabs(groupsSource);
  } else {
    groupTabsEl.hidden = true;
    groupTabsEl.innerHTML = "";
  }
  if (groupActionsEl) {
    groupActionsEl.hidden = false;
    if (newGroupInput) {
      const periodLabel =
        getCategoryPeriod(category) === "weekend"
          ? "주말/공휴일 하위 탭 이름"
          : "주중 하위 탭 이름";
      newGroupInput.placeholder = periodLabel;
    }
  }

  const itemList = getActiveItemList() || [];
  const periodLabel = category.weekendGroups || category.weekendItems ? ` · ${getCategoryPeriod(category) === "weekend" ? "주말" : "주중"}` : "";
  categoryTitleEl.textContent = `${category.name}${periodLabel} (${itemList.length}개)`;
  itemTableEl.innerHTML = "";

  // 강습 카테고리인 경우 시간대별 패찰비 입력 필드 추가
  const isLessonCategory = category?.name === "강습";
  if (isLessonCategory) {
    // equipmentFees 객체 초기화
    if (!category.equipmentFees) {
      category.equipmentFees = { "2시간": 0, "3시간": 0, "4시간": 0 };
    }
    
    const equipmentFeesSection = document.createElement("div");
    equipmentFeesSection.className = "equipment-fees-section";
    equipmentFeesSection.innerHTML = `
      <div class="equipment-fees-header">
        <label>패찰비 (시간대별)</label>
      </div>
      <div class="equipment-fees-grid">
        <div class="equipment-fee-item">
          <label>2시간</label>
          <div class="equipment-fee-input-wrapper">
            <input type="number" class="equipment-fee-input" data-duration="2시간" value="${category.equipmentFees["2시간"] || 0}" min="0" step="1000" placeholder="0" />
            <span class="equipment-fee-unit">원</span>
          </div>
        </div>
        <div class="equipment-fee-item">
          <label>3시간</label>
          <div class="equipment-fee-input-wrapper">
            <input type="number" class="equipment-fee-input" data-duration="3시간" value="${category.equipmentFees["3시간"] || 0}" min="0" step="1000" placeholder="0" />
            <span class="equipment-fee-unit">원</span>
          </div>
        </div>
        <div class="equipment-fee-item">
          <label>4시간</label>
          <div class="equipment-fee-input-wrapper">
            <input type="number" class="equipment-fee-input" data-duration="4시간" value="${category.equipmentFees["4시간"] || 0}" min="0" step="1000" placeholder="0" />
            <span class="equipment-fee-unit">원</span>
          </div>
        </div>
      </div>
    `;
    itemTableEl.appendChild(equipmentFeesSection);

    // 패찰비 입력 이벤트 핸들러
    const equipmentFeeInputs = equipmentFeesSection.querySelectorAll(".equipment-fee-input");
    equipmentFeeInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        const duration = e.target.dataset.duration;
        const value = Number(e.target.value) || 0;
        const category = getCurrentCategory();
        if (category) {
          if (!category.equipmentFees) {
            category.equipmentFees = { "2시간": 0, "3시간": 0, "4시간": 0 };
          }
          category.equipmentFees[duration] = value;
          
          // 주중/주말 groups의 해당 시간대 아이템 모두에 equipmentFee 적용
          const updateItemsEquipmentFee = (groups) => {
            if (!groups) return;
            groups.forEach((group) => {
              if (group.items) {
                group.items.forEach((item) => {
                  if (item.name === duration) {
                    item.equipmentFee = value;
                  }
                });
              }
            });
          };
          
          updateItemsEquipmentFee(category.groups);
          updateItemsEquipmentFee(category.weekendGroups);
          
          markPricingDirty();
        }
      });
    });
  }

  itemList.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "item-row";
    const isFirst = index === 0;
    const isLast = index === itemList.length - 1;
    row.innerHTML = `
      <div class="item-order-buttons">
        <button type="button" class="order-btn order-up${isFirst ? " disabled" : ""}" data-action="move-up" data-index="${index}" ${isFirst ? "disabled" : ""} title="위로 이동">▲</button>
        <button type="button" class="order-btn order-down${isLast ? " disabled" : ""}" data-action="move-down" data-index="${index}" ${isLast ? "disabled" : ""} title="아래로 이동">▼</button>
      </div>
      <input type="text" value="${item.name}" data-field="name" data-index="${index}" placeholder="항목명" />
      <input type="text" value="${item.unit}" data-field="unit" data-index="${index}" placeholder="단위" />
      <input type="number" value="${item.price}" data-field="price" data-index="${index}" min="0" step="1000" />
      <button type="button" data-action="remove" data-index="${index}">삭제</button>
    `;
    itemTableEl.appendChild(row);
  });
}

function renderPeriodTabs(category) {
  // VAT 카테고리는 항상 주중/주말 탭을 표시 (items가 비어있더라도)
  const isVATCategory = category.name === "VAT";
  const hasWeekend = category.weekendGroups?.length || category.weekendItems?.length || 
                     (isVATCategory && (category.weekendGroups !== undefined || category.weekendItems !== undefined));
  
  if (!hasWeekend) {
    periodTabsEl.hidden = true;
    periodTabsEl.innerHTML = "";
    state.periodSelections[category.name] = "weekday";
    return;
  }

  periodTabsEl.hidden = false;
  const current = getCategoryPeriod(category);
  periodTabsEl.innerHTML = "";

  ["weekday", "weekend"].forEach((periodKey) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `period-tab${current === periodKey ? " active" : ""}`;
    button.textContent = periodKey === "weekday" ? "주중" : "주말/공휴일";
    button.addEventListener("click", () => {
      state.periodSelections[category.name] = periodKey;
      state.groupIndex = 0;
      renderItems();
      markPricingDirty();
    });
    periodTabsEl.appendChild(button);
  });
}

function renderGroupTabs(groups) {
  groupTabsEl.hidden = false;
  groupTabsEl.innerHTML = "";
  groups.forEach((group, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `group-tab${index === state.groupIndex ? " active" : ""}`;
    button.textContent = group.name;
    button.addEventListener("click", () => {
      state.groupIndex = index;
      renderItems();
    });
    groupTabsEl.appendChild(button);
  });
}

function renderLodgingTypeEditor() {
  const types = getLodgingTypes();
  categoryTitleEl.textContent = `숙박 패키지 · 펜션 타입 (${types.length}개)`;
  itemTableEl.innerHTML = "";

  if (!types.length) {
    const empty = document.createElement("p");
    empty.className = "lodging-empty";
    empty.textContent = "등록된 펜션 타입이 없습니다. '펜션 타입 추가' 버튼으로 추가하세요.";
    itemTableEl.appendChild(empty);
    return;
  }

  types.forEach((type, index) => {
    const row = document.createElement("div");
    row.className = "lodging-type-row";

    row.innerHTML = `
      <div class="lodging-type-row__header">
        <input type="text" value="${type.name || ""}" data-lodging-field="name" data-index="${index}" placeholder="펜션 타입명" />
        <button type="button" data-lodging-action="remove" data-index="${index}">삭제</button>
      </div>
      <div class="lodging-type-row__grid">
        <label>
          구분
          <input type="text" value="${type.group || ""}" data-lodging-field="group" data-index="${index}" placeholder="예: 프랜드" />
        </label>
        <label>
          기준 인원
          <input type="number" min="1" value="${type.baseGuests ?? 4}" data-lodging-field="baseGuests" data-index="${index}" />
        </label>
        <label>
          최대 인원
          <input type="number" min="1" value="${type.maxGuests ?? ""}" data-lodging-field="maxGuests" data-index="${index}" placeholder="예: 6" />
        </label>
        <label>
          추가 1인 요금
          <input type="number" min="0" step="1000" value="${type.extraGuestFee ?? 0}" data-lodging-field="extraGuestFee" data-index="${index}" />
        </label>
        <label>
          무제한 바베큐 가격
          <select data-lodging-field="bbqPrice" data-index="${index}">
            <option value="0" ${(type.bbqPrice ?? 0) === 0 ? "selected" : ""}>없음</option>
            <option value="25000" ${(type.bbqPrice ?? 0) === 25000 ? "selected" : ""}>25,000원</option>
            <option value="35000" ${(type.bbqPrice ?? 0) === 35000 ? "selected" : ""}>35,000원</option>
          </select>
        </label>
      </div>
      <div class="lodging-rate-grid">
        ${renderLodgingRateInputs(type, index)}
      </div>
      <div class="lodging-meta-grid">
        <label>
          상세 설명 (한 줄)
          <input
            type="text"
            maxlength="120"
            value="${type.description || ""}"
            data-lodging-field="description"
            data-index="${index}"
            placeholder="예: 온돌형 4인 기준, 추가 2인 가능"
          />
        </label>
        <label>
          실시간 예약현황 링크
          <input
            type="url"
            value="${type.reservationUrl || ""}"
            data-lodging-field="reservationUrl"
            data-index="${index}"
            placeholder="https://your-pension.com/reservation"
          />
        </label>
      </div>
      <p class="lodging-note-row">ID: ${type.id || "(자동생성)"}</p>
    `;

    itemTableEl.appendChild(row);
  });
}

function renderLodgingRateInputs(type, index) {
  const entries = [
    { period: "weekday", label: "주중" },
    { period: "friday", label: "금요일" },
    { period: "weekend", label: "주말/공휴일" }
  ];
  return entries
    .map(({ period, label }) => {
      const value = type?.sharedRates?.[period] ?? 0;
      return `
        <label>
          ${label}
          <input
            type="number"
            min="0"
            step="1000"
            value="${value}"
            data-lodging-field="rate"
            data-period="${period}"
            data-index="${index}"
          />
        </label>
      `;
    })
    .join("");
}

function addNewLodgingType() {
  const types = getLodgingTypes();
  types.push({
    id: `lodging_${Date.now()}`,
    name: "새 펜션 타입",
    baseGuests: 4,
    maxGuests: null,
    extraGuestFee: 0,
    bbqPrice: 0,
    sharedRates: { weekday: 0, friday: 0, weekend: 0 },
    description: "",
    reservationUrl: ""
  });
  markPricingDirty();
  renderLodgingTypeEditor();
}

function handleLodgingInputChange(event) {
  const index = Number(event.target.dataset.index);
  if (Number.isNaN(index)) return;
  const types = getLodgingTypes();
  const type = types[index];
  if (!type) return;

  const field = event.target.dataset.lodgingField;
  if (field === "rate") {
    const period = event.target.dataset.period;
    type.sharedRates = type.sharedRates || {};
    type.sharedRates[period] = Number(event.target.value) || 0;
  } else if (field === "baseGuests" || field === "extraGuestFee") {
    type[field] = Number(event.target.value) || 0;
  } else if (field === "maxGuests") {
    const value = Number(event.target.value);
    type.maxGuests = Number.isFinite(value) && value > 0 ? value : null;
  } else if (field === "bbqPrice") {
    type.bbqPrice = Number(event.target.value) || 0;
  } else if (field === "name") {
    type.name = event.target.value;
  } else if (field === "group") {
    type.group = event.target.value;
  } else if (field === "description" || field === "reservationUrl") {
    type[field] = event.target.value;
  }
  markPricingDirty();
}

function removeLodgingType(index) {
  const types = getLodgingTypes();
  types.splice(index, 1);
  markPricingDirty();
  renderLodgingTypeEditor();
}

function handleSeasonChange(seasonKey) {
  if (seasonKey === state.season) return;
  state.season = seasonKey;
  state.categoryIndex = 0;
  state.groupIndex = 0;
  seasonTabs.forEach((tab) =>
    tab.classList.toggle("active", tab.dataset.season === seasonKey)
  );
  renderCategories();
  renderItems();
}

function handleInputChange(event) {
  if (event.target.dataset.lodgingField) {
    handleLodgingInputChange(event);
    return;
  }

  const field = event.target.dataset.field;
  const index = Number(event.target.dataset.index);
  if (field == null || Number.isNaN(index)) return;

  const list = getActiveItemList();
  if (!list) return;

  if (field === "price") {
    list[index][field] = Number(event.target.value) || 0;
  } else {
    list[index][field] = event.target.value;
  }
  markPricingDirty();
}

function handleItemTableClick(event) {
  const lodgingAction = event.target.dataset.lodgingAction;
  if (lodgingAction === "remove") {
    const lodgingIndex = Number(event.target.dataset.index);
    if (!Number.isNaN(lodgingIndex)) {
      removeLodgingType(lodgingIndex);
    }
    return;
  }

  const action = event.target.dataset.action;
  const index = Number(event.target.dataset.index);
  if (Number.isNaN(index)) return;

  const list = getActiveItemList();
  if (!list) return;

  if (action === "remove") {
    list.splice(index, 1);
    markPricingDirty();
    renderItems();
  } else if (action === "move-up" && index > 0) {
    // 위로 이동
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    markPricingDirty();
    renderItems();
  } else if (action === "move-down" && index < list.length - 1) {
    // 아래로 이동
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    markPricingDirty();
    renderItems();
  }
}

function addNewCategory() {
  const season = getCurrentSeasonData();
  if (!season) return;
  const name = (newCategoryInput?.value || "").trim();
  if (!name) {
    alert("카테고리 이름을 입력하세요.");
    return;
  }
  season.categories = season.categories || [];
  season.categories.push({
    name,
    items: []
  });
  state.categoryIndex = season.categories.length - 1;
  state.groupIndex = 0;
  state.periodSelections[name] = "weekday";
  if (newCategoryInput) newCategoryInput.value = "";
  markPricingDirty();
  renderCategories();
  renderItems();
}

function addNewGroup() {
  const category = getCurrentCategory();
  if (!category) {
    alert("먼저 카테고리를 선택하세요.");
    return;
  }
  const name = (newGroupInput?.value || "").trim();
  if (!name) {
    alert("하위 탭 이름을 입력하세요.");
    return;
  }
  const period = getCategoryPeriod(category);
  const targetKey = period === "weekend" ? "weekendGroups" : "groups";
  category[targetKey] = category[targetKey] || [];
  category[targetKey].push({
    name,
    items: []
  });
  state.groupIndex = Math.max(0, (category[targetKey].length || 1) - 1);
  if (newGroupInput) newGroupInput.value = "";
  markPricingDirty();
  renderItems();
}

function addNewItem() {
  const category = getCurrentCategory();
  if (!category) return;

  if (category.name === "숙박 패키지") {
    addNewLodgingType();
    return;
  }

  const list = getActiveItemList();
  if (!list) return;

  const period = getCategoryPeriod(category);
  const idBase = category.groups?.length || category.weekendGroups?.length
    ? `${category.name}_${period}_${state.groupIndex}`
    : `${category.name}_${period}`;

  list.push({
    id: `${idBase}_${Date.now()}`,
    name: "새 항목",
    unit: "개",
    price: 0
  });
  markPricingDirty();
  renderItems();
}

function exportJson() {
  if (!state.data) return;
  const blob = new Blob([JSON.stringify(state.data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pricing-data.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

async function copyJson() {
  if (!state.data) return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(state.data, null, 2));
    copyBtn.textContent = "복사 완료!";
    setTimeout(() => (copyBtn.textContent = "클립보드에 JSON 복사"), 1500);
  } catch (error) {
    alert("클립보드 복사에 실패했습니다. JSON 내보내기를 이용하세요.");
  }
}

function handleImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ({ target }) => {
    try {
      const imported = JSON.parse(target.result);
      if (!imported.offSeason || !imported.peakSeason) {
        throw new Error("season data missing");
      }
      state.data = imported;
      state.categoryIndex = 0;
      state.groupIndex = 0;
      state.periodSelections = {};
      markPricingDirty();
      renderCategories();
      renderItems();
      alert("JSON 데이터를 불러왔습니다. 검토 후 저장하세요.");
    } catch (error) {
      alert("JSON 형식을 확인해주세요.");
    }
  };
  reader.readAsText(file, "utf-8");
  event.target.value = "";
}

function renderHolidays() {
  if (!holidayListEl) {
    console.warn("holidayListEl이 없습니다.");
    return;
  }
  console.log("renderHolidays 호출, 공휴일 개수:", state.holidays.length);
  const sorted = [...state.holidays].sort((a, b) => a.date.localeCompare(b.date));
  holidayListEl.innerHTML = "";

  if (!sorted.length) {
    console.log("공휴일이 없어서 빈 메시지 표시");
    const empty = document.createElement("li");
    empty.textContent = "등록된 공휴일이 없습니다.";
    empty.style.color = "#64748b";
    holidayListEl.appendChild(empty);
    return;
  }

  sorted.forEach((holiday) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = `${holiday.date} · ${holiday.label}`;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "삭제";
    button.addEventListener("click", () => removeHoliday(holiday.date));
    li.appendChild(span);
    li.appendChild(button);
    holidayListEl.appendChild(li);
  });
}

function addHoliday() {
  const date = holidayDateInput.value;
  const label = holidayLabelInput.value.trim() || "공휴일";
  if (!date) {
    alert("날짜를 선택해주세요.");
    return;
  }
  if (state.holidays.some((holiday) => holiday.date === date)) {
    alert("이미 등록된 날짜입니다.");
    return;
  }
  state.holidays.push({ date, label });
  holidayDateInput.value = "";
  holidayLabelInput.value = "";
  markHolidayDirty();
  renderHolidays();
}

function removeHoliday(date) {
  state.holidays = state.holidays.filter((holiday) => holiday.date !== date);
  markHolidayDirty();
  renderHolidays();
}

function markPricingDirty() {
  state.isPricingDirty = true;
  updateSaveStatus("요금표 수정 사항이 저장되지 않았습니다.", "#f97316");
}

function markHolidayDirty() {
  state.isHolidayDirty = true;
  updateSaveStatus("공휴일 수정 사항이 저장되지 않았습니다.", "#f97316");
}

function updateSaveStatus(message, color = "#64748b") {
  if (!saveStatusEl) return;
  saveStatusEl.textContent = message;
  saveStatusEl.style.color = color;
}

async function loadPricingFromServer() {
  // pricing.js가 이미 로드되어 있는지 먼저 확인
  if (window.pricingData && !state.data) {
    console.log("pricing.js에서 데이터 로드");
    state.data = window.pricingData;
    state.categoryIndex = 0;
    state.groupIndex = 0;
    state.periodSelections = {};
    state.isPricingDirty = false;
    return;
  }
  
  // 이미 state.data가 있으면 서버에서 다시 로드하지 않음
  if (state.data) {
    return;
  }
  
  try {
    const response = await fetch("/api/pricing");
    if (!response.ok) throw new Error("network");
    const result = await response.json();
    if (!result.success) throw new Error("payload");
    state.data = result.data;
    state.categoryIndex = 0;
    state.groupIndex = 0;
    state.periodSelections = {};
    state.isPricingDirty = false;
  } catch (error) {
    // 서버 API 호출 실패 시 로컬 파일에서 직접 로드
    console.log("서버 API 호출 실패, 로컬 파일에서 로드 시도...");
    
    // pricing.js가 이미 로드되어 있는지 확인
    if (window.pricingData) {
      state.data = window.pricingData;
      state.categoryIndex = 0;
      state.groupIndex = 0;
      state.periodSelections = {};
      state.isPricingDirty = false;
      return;
    }
    
    // pricing.js가 아직 로드되지 않은 경우 동적으로 로드
    try {
      await new Promise((resolve, reject) => {
        // 이미 head에 pricing.js가 있는지 확인
        const existingScript = document.querySelector('script[src="pricing.js"]');
        if (existingScript) {
          // 이미 로드 중이거나 로드된 경우, 약간의 지연 후 확인
          const checkInterval = setInterval(() => {
            if (window.pricingData) {
              clearInterval(checkInterval);
              state.data = window.pricingData;
              state.categoryIndex = 0;
              state.groupIndex = 0;
              state.periodSelections = {};
              state.isPricingDirty = false;
              resolve();
            }
          }, 100);
          
          // 5초 후 타임아웃
          setTimeout(() => {
            clearInterval(checkInterval);
            if (!window.pricingData) {
              reject(new Error("pricing.js 로드 타임아웃"));
            }
          }, 5000);
        } else {
          // pricing.js를 동적으로 로드
          const script = document.createElement("script");
          script.src = "pricing.js";
          script.onload = () => {
            if (window.pricingData) {
              state.data = window.pricingData;
              state.categoryIndex = 0;
              state.groupIndex = 0;
              state.periodSelections = {};
              state.isPricingDirty = false;
              resolve();
            } else {
              reject(new Error("pricingData를 찾을 수 없습니다."));
            }
          };
          script.onerror = () => reject(new Error("pricing.js 파일을 로드할 수 없습니다."));
          document.head.appendChild(script);
        }
      });
    } catch (localError) {
      console.error("로컬 파일 로드 실패:", localError);
      throw new Error("데이터를 불러올 수 없습니다. 서버가 실행 중인지 확인하거나 pricing.js 파일이 같은 폴더에 있는지 확인하세요.");
    }
  }
}

async function loadHolidaysFromServer() {
  // holidays.js에서 window.holidaysData가 준비된 경우 즉시 사용
  if (Array.isArray(window.holidaysData) && !state.holidays.length) {
    console.log("window.holidaysData에서 공휴일 로드:", window.holidaysData.length, "개");
    state.holidays = window.holidaysData;
    state.isHolidayDirty = false;
    renderHolidays();
    return;
  }

  try {
    const response = await fetch("/api/holidays");
    if (!response.ok) throw new Error("network");
    const result = await response.json();
    if (!result.success) throw new Error("payload");
    state.holidays = result.holidays || [];
    console.log("서버 API에서 공휴일 로드:", state.holidays.length, "개");
    state.isHolidayDirty = false;
    window.holidaysData = state.holidays;
    renderHolidays();
  } catch (error) {
    // 서버 API 호출 실패 시 로컬 파일에서 직접 로드
    console.log("서버 API 호출 실패, 로컬 데이터 사용 시도...", error);

    if (Array.isArray(window.holidaysData)) {
      state.holidays = window.holidaysData;
      state.isHolidayDirty = false;
      renderHolidays();
      return;
    }

    try {
      const response = await fetch("holidays.json", { cache: "no-store" });
      if (!response.ok) throw new Error("network");
      const data = await response.json();
      // 객체 구조인 경우 holidays 배열을 추출, 배열인 경우 그대로 사용
      state.holidays = Array.isArray(data) ? data : (data.holidays || []);
      console.log("holidays.json에서 공휴일 로드:", state.holidays.length, "개", data);
      state.isHolidayDirty = false;
      window.holidaysData = state.holidays;
      renderHolidays();
    } catch (localError) {
      console.error("holidays.json 로드 실패:", localError);
      // CORS 에러인 경우 서버 실행 안내
      const isFileProtocol = window.location.protocol === "file:";
      if (isFileProtocol && (localError.message === "Failed to fetch" || localError.name === "TypeError")) {
        console.warn("⚠️ 파일을 직접 열었습니다. 서버를 실행해야 합니다.");
        console.warn("📝 해결 방법:");
        console.warn("   1. 터미널에서 프로젝트 폴더로 이동");
        console.warn("   2. 'npm start' 명령어 실행");
        console.warn("   3. 브라우저에서 http://localhost:4000 접속");
        // UI에 안내 메시지 표시
        if (holidayListEl) {
          holidayListEl.innerHTML = "";
          const errorMsg = document.createElement("li");
          errorMsg.style.color = "#f43f5e";
          errorMsg.style.padding = "20px";
          errorMsg.style.textAlign = "center";
          errorMsg.innerHTML = `
            <div style="margin-bottom: 10px;">⚠️ 서버를 실행해야 합니다</div>
            <div style="font-size: 14px; color: #64748b; margin-top: 10px;">
              터미널에서 'npm start' 실행 후<br>
              http://localhost:4000 으로 접속하세요
            </div>
          `;
          holidayListEl.appendChild(errorMsg);
        }
      }
      state.holidays = [];
      state.isHolidayDirty = false;
      if (!isFileProtocol) {
        renderHolidays();
      }
    }
  }
}

async function saveAllChanges() {
  if (!state.data) return;
  saveBtn.disabled = true;
  updateSaveStatus("저장 중...", "#2563eb");
  try {
    const [pricingRes, holidaysRes] = await Promise.all([
      fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.data)
      }),
      fetch("/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holidays: state.holidays })
      })
    ]);

    const pricingJson = await pricingRes.json();
    const holidaysJson = await holidaysRes.json();
    if (!pricingRes.ok || !pricingJson.success) {
      throw new Error(pricingJson.error || "요금 저장 실패");
    }
    if (!holidaysRes.ok || !holidaysJson.success) {
      throw new Error(holidaysJson.error || "공휴일 저장 실패");
    }

    state.isPricingDirty = false;
    state.isHolidayDirty = false;
    updateSaveStatus("저장 완료! 서버 재시작 후에도 유지됩니다.", "#16a34a");
    alert("저장이 완료되었습니다!");
  } catch (error) {
    console.error(error);
    updateSaveStatus("저장에 실패했습니다. 다시 시도하세요.", "#f43f5e");
  } finally {
    saveBtn.disabled = false;
  }
}

async function initializeEditor() {
  try {
    // pricing.js가 이미 로드되어 있는지 먼저 확인
    if (window.pricingData && !state.data) {
      state.data = window.pricingData;
      state.categoryIndex = 0;
      state.groupIndex = 0;
      state.periodSelections = {};
      state.isPricingDirty = false;
    }
    
    await Promise.all([loadPricingFromServer(), loadHolidaysFromServer()]);
    // 최초 진입 시 첫 번째 카테고리를 자동으로 선택해 바로 표시
    const season = getCurrentSeasonData();
    if (season?.categories?.length) {
      state.categoryIndex = 0;
      state.groupIndex = 0;
    }
    renderCategories();
    renderItems();
    renderHolidays();
    
    // 공휴일 관리 패널을 기본적으로 접힌 상태로 설정
    if (holidayPanelEl && holidayToggleBtn) {
      holidayPanelEl.classList.add("collapsed");
      holidayToggleBtn.textContent = "목록 펼치기";
    }
    
    updateSaveStatus("데이터를 불러왔습니다.");
  } catch (error) {
    console.error(error);
    updateSaveStatus("데이터를 불러오지 못했습니다.", "#f43f5e");
  }
}

seasonTabs.forEach((tab) => {
  tab.addEventListener("click", () => handleSeasonChange(tab.dataset.season));
});

itemTableEl.addEventListener("input", handleInputChange);
itemTableEl.addEventListener("click", handleItemTableClick);
addItemBtn.addEventListener("click", addNewItem);
addCategoryBtn?.addEventListener("click", addNewCategory);
newCategoryInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addNewCategory();
  }
});
addGroupBtn?.addEventListener("click", addNewGroup);
newGroupInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addNewGroup();
  }
});
exportBtn.addEventListener("click", exportJson);
copyBtn.addEventListener("click", copyJson);
importInput.addEventListener("change", handleImport);
saveBtn.addEventListener("click", saveAllChanges);
addHolidayBtn.addEventListener("click", addHoliday);

// 공휴일 관리 접기/펼치기 토글
if (holidayToggleBtn && holidayPanelEl) {
  holidayToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    holidayPanelEl.classList.toggle("collapsed");
    const isCollapsed = holidayPanelEl.classList.contains("collapsed");
    holidayToggleBtn.textContent = isCollapsed ? "목록 펼치기" : "목록 접기";
  });

  // 헤더 클릭으로도 토글 가능
  const holidayHeader = document.querySelector(".holiday-header");
  if (holidayHeader) {
    holidayHeader.addEventListener("click", (e) => {
      // 버튼 클릭이 아닐 때만 토글
      if (e.target !== holidayToggleBtn && !holidayToggleBtn.contains(e.target)) {
        holidayPanelEl.classList.toggle("collapsed");
        const isCollapsed = holidayPanelEl.classList.contains("collapsed");
        holidayToggleBtn.textContent = isCollapsed ? "목록 펼치기" : "목록 접기";
      }
    });
  }
}

// holidaysDataReady 이벤트를 듣고 공휴일 목록 업데이트
document.addEventListener("holidaysDataReady", (event) => {
  console.log("holidaysDataReady 이벤트 수신:", event.detail);
  if (Array.isArray(event.detail) && event.detail.length) {
    state.holidays = event.detail;
    state.isHolidayDirty = false;
    renderHolidays();
  }
});

// pricing.js가 완전히 로드된 후에 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // pricing.js가 로드될 때까지 약간의 지연
    setTimeout(initializeEditor, 100);
  });
} else {
  // 이미 DOM이 로드된 경우
  setTimeout(initializeEditor, 100);
}

