let faqState = {
  faqs: [],
  editMode: false,
  editingId: null,
  isDirty: false,
  searchQuery: "",
  selectedCategory: "all"
};

const faqListEl = document.getElementById("faq-list");
const faqEmptyEl = document.getElementById("faq-empty");
const faqActionsEl = document.getElementById("faq-actions");
const editModeBtn = document.getElementById("edit-mode-btn");
const addFaqBtn = document.getElementById("add-faq-btn");
const saveFaqBtn = document.getElementById("save-faq-btn");
const faqSaveStatus = document.getElementById("faq-save-status");
const exportFaqBtn = document.getElementById("export-faq-btn");
const importFaqFile = document.getElementById("import-faq-file");
const faqSearchInput = document.getElementById("faq-search-input");
const faqSearchClear = document.getElementById("faq-search-clear");

// FAQ 데이터 로드
async function loadFAQs() {
  // 1. 먼저 로컬 스토리지에서 확인
  const localData = loadFAQsFromLocal();
  if (localData && localData.length > 0) {
    // 기존 데이터에 category가 없으면 '미분류'로 설정
    faqState.faqs = localData.map(faq => ({
      ...faq,
      category: faq.category || "미분류"
    }));
    faqState.isDirty = false;
    updateSaveButtonState();
    renderFAQs();
    // 백그라운드에서 서버 데이터와 동기화 시도
    syncWithServer();
    return;
  }

  // 2. 로컬 파일에서 데이터 확인 (faq.js가 이미 로드된 경우)
  if (Array.isArray(window.faqData) && window.faqData.length) {
    // 기존 데이터에 category가 없으면 '미분류'로 설정
    faqState.faqs = window.faqData.map(faq => ({
      ...faq,
      category: faq.category || "미분류"
    }));
    faqState.isDirty = false;
    updateSaveButtonState();
    renderFAQs();
    // 로컬 스토리지에 저장
    saveFAQsToLocal();
    return;
  }
  
  // 3. 서버에서 로드 시도
  try {
    const response = await fetch("/api/faqs");
    if (!response.ok) throw new Error("network error");
    const result = await response.json();
    if (result.success && Array.isArray(result.faqs)) {
      // 기존 데이터에 category가 없으면 '미분류'로 설정
      faqState.faqs = (result.faqs || []).map(faq => ({
        ...faq,
        category: faq.category || "미분류"
      }));
      faqState.isDirty = false;
      // 로컬 스토리지에 저장
      saveFAQsToLocal();
    } else {
      throw new Error("invalid payload");
    }
  } catch (error) {
    // 서버 API 실패 시 로컬 파일에서 직접 로드
    if (Array.isArray(window.faqData) && window.faqData.length) {
      // 기존 데이터에 category가 없으면 '미분류'로 설정
      faqState.faqs = window.faqData.map(faq => ({
        ...faq,
        category: faq.category || "미분류"
      }));
      faqState.isDirty = false;
      updateSaveButtonState();
      renderFAQs();
      saveFAQsToLocal();
      return;
    }
    console.warn("FAQ 데이터를 불러올 수 없습니다:", error);
    faqState.faqs = [];
    faqState.isDirty = false;
  }
  updateSaveButtonState();
  renderFAQs();
}

// 서버와 동기화 (백그라운드)
async function syncWithServer() {
  try {
    const response = await fetch("/api/faqs");
    if (!response.ok) return;
    const result = await response.json();
    if (result.success && Array.isArray(result.faqs)) {
      // 서버 데이터가 더 최신이면 업데이트 (선택적)
      // 현재는 로컬 데이터를 우선시하므로 주석 처리
      // faqState.faqs = result.faqs;
      // saveFAQsToLocal();
      // renderFAQs();
    }
  } catch (error) {
    // 서버 동기화 실패는 무시
    console.log("서버 동기화 실패 (무시됨):", error);
  }
}

// 로컬 스토리지에 FAQ 저장
function saveFAQsToLocal() {
  try {
    localStorage.setItem("faqData", JSON.stringify(faqState.faqs));
    return true;
  } catch (error) {
    console.error("로컬 스토리지 저장 실패:", error);
    return false;
  }
}

// 로컬 스토리지에서 FAQ 로드
function loadFAQsFromLocal() {
  try {
    const saved = localStorage.getItem("faqData");
    if (saved) {
      const data = JSON.parse(saved);
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (error) {
    console.error("로컬 스토리지 로드 실패:", error);
  }
  return null;
}

// FAQ 저장 (로컬 스토리지에 즉시 저장, 서버 저장은 백그라운드에서 시도)
async function saveFAQs() {
  // 로컬 스토리지에 즉시 저장
  const localSaveSuccess = saveFAQsToLocal();
  
  if (!localSaveSuccess) {
    if (faqSaveStatus) {
      faqSaveStatus.textContent = "로컬 저장 실패";
      faqSaveStatus.className = "faq-save-status faq-save-status-error";
    }
    alert("로컬 저장에 실패했습니다.");
    return;
  }

  // 로컬 저장 성공 시 즉시 상태 업데이트
  faqState.isDirty = false;
  updateSaveButtonState();
  
  if (faqSaveStatus) {
    faqSaveStatus.textContent = "저장되었습니다.";
    faqSaveStatus.className = "faq-save-status faq-save-status-success";
    setTimeout(() => {
      faqSaveStatus.textContent = "";
      faqSaveStatus.className = "faq-save-status";
    }, 2000);
  }

  // 서버 저장은 백그라운드에서 시도 (실패해도 문제없음)
  if (saveFaqBtn) {
    saveFaqBtn.disabled = true;
    saveFaqBtn.textContent = "서버 동기화 중...";
  }

  try {
    const response = await fetch("/api/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ faqs: faqState.faqs })
    });
    if (!response.ok) throw new Error("network error");
    const result = await response.json();
    if (result.success) {
      if (faqSaveStatus) {
        faqSaveStatus.textContent = "저장 및 서버 동기화 완료";
        faqSaveStatus.className = "faq-save-status faq-save-status-success";
        setTimeout(() => {
          faqSaveStatus.textContent = "";
          faqSaveStatus.className = "faq-save-status";
        }, 2000);
      }
    } else {
      throw new Error("invalid payload");
    }
  } catch (error) {
    console.error("서버 동기화 실패 (로컬에는 저장됨):", error);
    // 서버 저장 실패는 무시 (로컬에는 이미 저장됨)
  } finally {
    if (saveFaqBtn) {
      saveFaqBtn.disabled = !faqState.isDirty;
      saveFaqBtn.textContent = "변경사항 저장";
    }
  }
}

// 저장 버튼 상태 업데이트
function updateSaveButtonState() {
  if (saveFaqBtn) {
    saveFaqBtn.disabled = !faqState.isDirty;
    // 변경 가능 여부와 관계없이 텍스트는 항상 동일하게 유지
    saveFaqBtn.textContent = "변경사항 저장";
  }
}

// 검색어와 대분류로 FAQ 필터링
function filterFAQs(faqs, query, category) {
  let filtered = faqs;
  
  // 대분류 필터링
  if (category && category !== "all") {
    filtered = filtered.filter((faq) => {
      const faqCategory = faq.category || "미분류";
      return faqCategory === category;
    });
  }
  
  // 검색어 필터링
  if (query && query.trim() !== "") {
    const lowerQuery = query.toLowerCase().trim();
    filtered = filtered.filter((faq) => {
      const question = (faq.question || "").toLowerCase();
      const answer = (faq.answer || "").toLowerCase();
      return question.includes(lowerQuery) || answer.includes(lowerQuery);
    });
  }
  
  return filtered;
}

// 텍스트에서 검색어 하이라이트
function highlightText(text, query) {
  if (!query || query.trim() === "") {
    return escapeHtml(text);
  }
  
  const escapedText = escapeHtml(text);
  const escapedQuery = escapeHtml(query);
  const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
  return escapedText.replace(regex, '<mark class="faq-highlight">$1</mark>');
}

// FAQ 렌더링
function renderFAQs() {
  faqListEl.innerHTML = "";
  
  // 검색어와 대분류로 필터링
  const filteredFAQs = filterFAQs(faqState.faqs, faqState.searchQuery, faqState.selectedCategory);
  
  if (filteredFAQs.length === 0) {
    faqEmptyEl.hidden = false;
    if (faqState.searchQuery.trim() !== "") {
      faqEmptyEl.innerHTML = `
        <p>검색 결과가 없습니다.</p>
        <p class="faq-empty-hint">"${escapeHtml(faqState.searchQuery)}"에 대한 검색 결과가 없습니다.</p>
      `;
    } else {
      faqEmptyEl.innerHTML = `
        <p>등록된 질문이 없습니다.</p>
        <p class="faq-empty-hint">편집 모드를 활성화하여 질문을 추가하세요.</p>
      `;
    }
    return;
  }
  
  faqEmptyEl.hidden = true;
  
  filteredFAQs.forEach((faq, index) => {
    const item = document.createElement("div");
    item.className = "faq-item";
    item.dataset.faqId = faq.id;
    
    if (faqState.editingId === faq.id) {
      // 편집 모드
      const currentCategory = faq.category || "미분류";
      item.innerHTML = `
        <div class="faq-form">
          <input type="text" class="faq-form-input faq-edit-question" value="${escapeHtml(faq.question)}" placeholder="질문을 입력하세요" />
          <textarea class="faq-form-input faq-form-textarea faq-edit-answer" placeholder="답변을 입력하세요">${escapeHtml(faq.answer)}</textarea>
          <div class="faq-form-category">
            <label for="faq-category-${faq.id}" class="faq-form-label">대분류</label>
            <select id="faq-category-${faq.id}" class="faq-form-input faq-edit-category" data-id="${faq.id}">
              <option value="영업문의" ${currentCategory === "영업문의" ? "selected" : ""}>영업문의</option>
              <option value="패키지문의" ${currentCategory === "패키지문의" ? "selected" : ""}>패키지문의</option>
              <option value="교통문의" ${currentCategory === "교통문의" ? "selected" : ""}>교통문의</option>
              <option value="펜션문의" ${currentCategory === "펜션문의" ? "selected" : ""}>펜션문의</option>
              <option value="강습문의" ${currentCategory === "강습문의" ? "selected" : ""}>강습문의</option>
              <option value="미분류" ${currentCategory === "미분류" ? "selected" : ""}>미분류</option>
            </select>
          </div>
          <div class="faq-form-actions">
            <button type="button" class="faq-save-btn" data-action="save-edit" data-id="${faq.id}">저장</button>
            <button type="button" class="faq-cancel-btn" data-action="cancel-edit">취소</button>
          </div>
        </div>
      `;
    } else {
      // 표시 모드
      const questionText = highlightText(faq.question, faqState.searchQuery);
      const answerText = highlightText(faq.answer, faqState.searchQuery);
      
      item.innerHTML = `
        <div class="faq-question" data-action="toggle">
          <span class="faq-question-text">${questionText}</span>
          <div class="faq-question-actions">
            ${faqState.editMode ? `<button type="button" class="faq-edit-btn-inline" data-action="edit" data-id="${faq.id}">수정</button>` : ""}
            ${faqState.editMode ? `<button type="button" class="faq-delete-btn-inline" data-action="delete" data-id="${faq.id}" title="삭제">🗑️</button>` : ""}
            <span class="faq-toggle-icon">▼</span>
          </div>
        </div>
        <div class="faq-answer">
          <div class="faq-answer-text">${answerText}</div>
        </div>
      `;
    }
    
    faqListEl.appendChild(item);
  });
  
  // 이벤트 리스너 추가
  attachEventListeners();
}

function attachEventListeners() {
  // 토글 클릭
  faqListEl.querySelectorAll("[data-action='toggle']").forEach((el) => {
    el.addEventListener("click", (e) => {
      // 삭제 버튼 클릭 시에는 토글하지 않음
      if (e.target.closest(".faq-delete-btn-inline")) return;
      if (faqState.editMode) return;
      const item = e.target.closest(".faq-item");
      item.classList.toggle("expanded");
    });
  });
  
  // 편집 버튼
  faqListEl.querySelectorAll("[data-action='edit']").forEach((el) => {
    el.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      faqState.editingId = id;
      renderFAQs();
    });
  });
  
  // 삭제 버튼
  faqListEl.querySelectorAll("[data-action='delete']").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (!confirm("이 질문을 삭제하시겠습니까?")) return;
      const id = e.target.dataset.id;
      faqState.faqs = faqState.faqs.filter((f) => f.id !== id);
      // 삭제 후에는 실제 저장 버튼을 눌렀을 때만 저장되도록 변경
      faqState.isDirty = true;
      updateSaveButtonState();
      renderFAQs();
    });
  });
  
  // 저장 버튼 (편집)
  faqListEl.querySelectorAll("[data-action='save-edit']").forEach((el) => {
    el.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const item = e.target.closest(".faq-item");
      const question = item.querySelector(".faq-edit-question").value.trim();
      const answer = item.querySelector(".faq-edit-answer").value.trim();
      const categorySelect = item.querySelector(".faq-edit-category");
      const category = categorySelect ? categorySelect.value : "미분류";
      
      if (!question || !answer) {
        alert("질문과 답변을 모두 입력해주세요.");
        return;
      }
      
      const faq = faqState.faqs.find((f) => f.id === id);
      if (faq) {
        faq.question = question;
        faq.answer = answer;
        faq.category = category;
      }
      
      faqState.editingId = null;
      faqState.isDirty = true;
      updateSaveButtonState();
      // 편집 결과는 "저장" 버튼을 눌렀을 때만 실제로 저장되도록 변경
      renderFAQs();
    });
  });
  
  // 취소 버튼 (편집)
  faqListEl.querySelectorAll("[data-action='cancel-edit']").forEach((el) => {
    el.addEventListener("click", () => {
      const item = el.closest(".faq-item");
      const id = item?.dataset.faqId;
      
      if (id) {
        const faq = faqState.faqs.find((f) => f.id === id);
        // 새로 추가된 항목이고 질문/답변이 비어있으면 배열에서 제거
        if (faq && (!faq.question || !faq.answer || (faq.question.trim() === "" && faq.answer.trim() === ""))) {
          faqState.faqs = faqState.faqs.filter((f) => f.id !== id);
        }
      }
      
      faqState.editingId = null;
      renderFAQs();
    });
  });
}

// HTML 이스케이프
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 새 FAQ 추가
function addNewFAQ() {
  const newId = `faq_${Date.now()}`;
  const newFAQ = {
    id: newId,
    question: "",
    answer: "",
    category: "미분류"
  };
  faqState.faqs.push(newFAQ);
  faqState.editingId = newId;
  faqState.isDirty = true;
  updateSaveButtonState();
  // 새로 추가된 항목도 실제 "저장" 버튼을 누르기 전까지는 저장되지 않도록 함
  renderFAQs();
  
  // 질문 입력 필드로 포커스
  setTimeout(() => {
    const item = faqListEl.querySelector(`[data-faq-id="${newId}"]`);
    if (item) {
      const input = item.querySelector(".faq-edit-question");
      if (input) input.focus();
    }
  }, 100);
}

// 편집 모드 토글
function toggleEditMode() {
  faqState.editMode = !faqState.editMode;
  faqState.editingId = null;
  editModeBtn.textContent = faqState.editMode ? "편집 모드 종료" : "편집 모드";
  editModeBtn.classList.toggle("active", faqState.editMode);
  faqActionsEl.hidden = !faqState.editMode;
  renderFAQs();
}

// JSON 내보내기
function exportFAQs() {
  const dataStr = JSON.stringify(faqState.faqs, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `faq-${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// JSON 불러오기
function importFAQs(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) {
        throw new Error("올바른 FAQ 데이터 형식이 아닙니다.");
      }
      // 기존 데이터에 category가 없으면 '미분류'로 설정
      faqState.faqs = data.map(faq => ({
        ...faq,
        category: faq.category || "미분류"
      }));
      faqState.isDirty = true;
      saveFAQsToLocal(); // 즉시 로컬 저장
      updateSaveButtonState();
      renderFAQs();
      alert("FAQ가 불러와졌습니다. 로컬에 저장되었습니다.");
    } catch (error) {
      console.error("FAQ 불러오기 실패:", error);
      alert("FAQ 파일을 불러올 수 없습니다. 올바른 JSON 형식인지 확인하세요.");
    }
  };
  reader.readAsText(file);
}

// 검색 기능
function handleSearch(query) {
  faqState.searchQuery = query;
  if (faqSearchClear) {
    faqSearchClear.hidden = query.trim() === "";
  }
  renderFAQs();
}

// 이벤트 리스너
editModeBtn?.addEventListener("click", toggleEditMode);
addFaqBtn?.addEventListener("click", addNewFAQ);
saveFaqBtn?.addEventListener("click", saveFAQs);
exportFaqBtn?.addEventListener("click", exportFAQs);
importFaqFile?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    importFAQs(file);
    e.target.value = "";
  }
});

// 검색 이벤트 리스너
faqSearchInput?.addEventListener("input", (e) => {
  handleSearch(e.target.value);
});

faqSearchInput?.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    faqSearchInput.value = "";
    handleSearch("");
    faqSearchInput.blur();
  }
});

faqSearchClear?.addEventListener("click", () => {
  if (faqSearchInput) {
    faqSearchInput.value = "";
    handleSearch("");
    faqSearchInput.focus();
  }
});

// 대분류 필터 이벤트 리스너
const faqCategoryFilter = document.getElementById("faq-category-filter");
if (faqCategoryFilter) {
  faqCategoryFilter.addEventListener("click", (e) => {
    const btn = e.target.closest(".faq-category-btn");
    if (!btn) return;
    
    const category = btn.dataset.category;
    faqState.selectedCategory = category;
    
    // 모든 버튼에서 active 클래스 제거
    faqCategoryFilter.querySelectorAll(".faq-category-btn").forEach(b => {
      b.classList.remove("active");
    });
    // 클릭한 버튼에 active 클래스 추가
    btn.classList.add("active");
    
    renderFAQs();
  });
}

// 초기화 - 페이지 로드 완료 후 FAQ 로드
function initializeFAQs() {
  // faq.js가 로드되었는지 확인
  if (typeof window.faqData !== "undefined") {
    loadFAQs();
  } else {
    // faq.js가 아직 로드되지 않았으면 대기
    const checkInterval = setInterval(() => {
      if (typeof window.faqData !== "undefined") {
        clearInterval(checkInterval);
        loadFAQs();
      }
    }, 50);
    
    // 최대 2초 대기
    setTimeout(() => {
      clearInterval(checkInterval);
      loadFAQs(); // 타임아웃 후에도 시도
    }, 2000);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeFAQs);
} else {
  initializeFAQs();
}

