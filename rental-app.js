// 장비 렌탈 계산기 전용 앱 로직

(function() {
  if (!document.body.classList.contains("rental-page")) return;

  const categoryNavEl = document.getElementById("category-nav");
  const itemGridEl = document.getElementById("item-grid");
  
  let currentRentalCategory = "장비렌탈";
  let isEditMode = false;

  // 렌탈 전용 카테고리 렌더링
  function renderRentalCategoryNav() {
    if (!categoryNavEl) return;
    
    const categories = ["장비렌탈", "구매물품", "금액표"];
    
    categoryNavEl.innerHTML = categories.map(catName => `
      <button 
        type="button" 
        class="category-btn ${catName === currentRentalCategory ? 'is-active' : ''}"
        data-rental-category="${catName}"
      >
        ${catName}
      </button>
    `).join("");
    
    // 카테고리 버튼 클릭 이벤트
    categoryNavEl.querySelectorAll("[data-rental-category]").forEach(btn => {
      btn.addEventListener("click", () => {
        currentRentalCategory = btn.dataset.rentalCategory;
        renderRentalCategoryNav();
        renderRentalItemGrid();
      });
    });
  }

  // 품목 그리드 렌더링
  function renderRentalItemGrid() {
    if (!itemGridEl) return;
    
    if (currentRentalCategory === "금액표") {
      renderPriceTableEditor();
      return;
    }
    
    const category = rentalPricingData.categories.find(c => c.name === currentRentalCategory);
    if (!category || !category.items?.length) {
      itemGridEl.innerHTML = '<p class="empty-state">표시할 상품이 없습니다.</p>';
      return;
    }
    
    // 현장 상담과 동일한 그리드 레이아웃 및 버튼 스타일 적용
    itemGridEl.className = "item-grid";
    itemGridEl.innerHTML = category.items.map(item => `
      <button 
        type="button" 
        class="item-button"
        data-rental-item-id="${item.id}"
        data-rental-category="${currentRentalCategory}"
      >
        <div class="item-button__content">
          <p class="item-button__name">${item.name}</p>
          <p class="item-button__price">₩${item.price.toLocaleString()}</p>
        </div>
      </button>
    `).join("");
    
    // 품목 버튼 클릭 이벤트
    itemGridEl.querySelectorAll(".item-button[data-rental-item-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const itemId = btn.dataset.rentalItemId;
        const catName = btn.dataset.rentalCategory;
        handleRentalItemClick(catName, itemId);
      });
    });
  }

  // 품목 클릭 처리 (선택 항목에 추가)
  function handleRentalItemClick(categoryName, itemId) {
    const category = rentalPricingData.categories.find(c => c.name === categoryName);
    if (!category) return;
    
    const item = category.items.find(i => i.id === itemId);
    if (!item) return;
    
    // app.js의 handleItemQuantityChange와 유사하게 처리
    const selectionId = `rental_${itemId}`;
    const currentSelection = state.selections[selectionId];
    const newQuantity = (currentSelection?.quantity || 0) + 1;
    
    state.selections[selectionId] = {
      id: selectionId,
      name: item.name,
      price: item.price,
      quantity: newQuantity,
      subtotal: newQuantity * item.price,
      category: categoryName,
      unit: item.unit || "개"
    };
    
    if (!renderOrder.includes(selectionId)) {
      renderOrder.push(selectionId);
    }
    
    updateSummary();
  }

  // 금액표 편집기 렌더링
  function renderPriceTableEditor() {
    if (!itemGridEl) return;
    
    const allItems = [];
    rentalPricingData.categories.forEach(cat => {
      cat.items.forEach(item => {
        allItems.push({ ...item, categoryName: cat.name });
      });
    });
    
    // 금액표 전용 스타일 적용
    itemGridEl.className = "item-grid price-table-container";
    itemGridEl.innerHTML = `
      <div class="price-table-editor">
        <div class="price-table-header">
          <h3>금액표 관리</h3>
          <div class="price-table-actions">
            <button type="button" class="price-table-btn" id="add-item-btn">+ 품목 추가</button>
            <button type="button" class="price-table-btn price-table-btn--reset" id="reset-data-btn">초기화</button>
          </div>
        </div>
        
        <div class="price-table-list">
          ${allItems.map(item => `
            <div class="price-table-item" data-item-id="${item.id}" data-category="${item.categoryName}">
              <div class="price-table-item__info">
                <span class="price-table-item__category">${item.categoryName === "장비렌탈" ? "렌탈" : "구매"}</span>
                <span class="price-table-item__name">${item.name}</span>
                <span class="price-table-item__price">${item.price.toLocaleString()}원</span>
              </div>
              <div class="price-table-item__actions">
                <button type="button" class="price-table-item-btn edit-btn" data-action="edit">수정</button>
                <button type="button" class="price-table-item-btn delete-btn" data-action="delete">삭제</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    
    // 품목 추가 버튼
    document.getElementById("add-item-btn")?.addEventListener("click", showAddItemModal);
    
    // 초기화 버튼
    document.getElementById("reset-data-btn")?.addEventListener("click", () => {
      if (confirm("모든 품목을 기본값으로 초기화하시겠습니까?")) {
        resetRentalData();
        renderRentalItemGrid();
        alert("초기화되었습니다.");
      }
    });
    
    // 수정/삭제 버튼
    itemGridEl.querySelectorAll(".price-table-item").forEach(itemEl => {
      const itemId = itemEl.dataset.itemId;
      const categoryName = itemEl.dataset.category;
      
      itemEl.querySelector(".edit-btn")?.addEventListener("click", () => {
        showEditItemModal(categoryName, itemId);
      });
      
      itemEl.querySelector(".delete-btn")?.addEventListener("click", () => {
        if (confirm("이 품목을 삭제하시겠습니까?")) {
          deleteRentalItem(categoryName, itemId);
          renderRentalItemGrid();
        }
      });
    });
  }

  // 품목 추가 모달
  function showAddItemModal() {
    const modalHtml = `
      <div class="rental-modal-overlay" id="rental-modal">
        <div class="rental-modal">
          <h3>품목 추가</h3>
          <div class="rental-modal-field">
            <label>카테고리</label>
            <select id="modal-category">
              <option value="장비렌탈">장비렌탈</option>
              <option value="구매물품">구매물품</option>
            </select>
          </div>
          <div class="rental-modal-field">
            <label>품목 이름</label>
            <input type="text" id="modal-name" placeholder="품목 이름 입력">
          </div>
          <div class="rental-modal-field">
            <label>금액 (원)</label>
            <input type="number" id="modal-price" placeholder="금액 입력" min="0">
          </div>
          <div class="rental-modal-field">
            <label>단위</label>
            <input type="text" id="modal-unit" placeholder="개, 세트, 켤레 등" value="개">
          </div>
          <div class="rental-modal-buttons">
            <button type="button" class="rental-modal-btn cancel" id="modal-cancel">취소</button>
            <button type="button" class="rental-modal-btn confirm" id="modal-confirm">추가</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    
    document.getElementById("modal-cancel").addEventListener("click", closeModal);
    document.getElementById("modal-confirm").addEventListener("click", () => {
      const category = document.getElementById("modal-category").value;
      const name = document.getElementById("modal-name").value.trim();
      const price = parseInt(document.getElementById("modal-price").value) || 0;
      const unit = document.getElementById("modal-unit").value.trim() || "개";
      
      if (!name) {
        alert("품목 이름을 입력해주세요.");
        return;
      }
      if (price <= 0) {
        alert("금액을 입력해주세요.");
        return;
      }
      
      addRentalItem(category, { name, price, unit });
      closeModal();
      renderRentalItemGrid();
    });
  }

  // 품목 수정 모달
  function showEditItemModal(categoryName, itemId) {
    const category = rentalPricingData.categories.find(c => c.name === categoryName);
    const item = category?.items.find(i => i.id === itemId);
    if (!item) return;
    
    const modalHtml = `
      <div class="rental-modal-overlay" id="rental-modal">
        <div class="rental-modal">
          <h3>품목 수정</h3>
          <div class="rental-modal-field">
            <label>카테고리</label>
            <select id="modal-category">
              <option value="장비렌탈" ${categoryName === "장비렌탈" ? "selected" : ""}>장비렌탈</option>
              <option value="구매물품" ${categoryName === "구매물품" ? "selected" : ""}>구매물품</option>
            </select>
          </div>
          <div class="rental-modal-field">
            <label>품목 이름</label>
            <input type="text" id="modal-name" value="${item.name}">
          </div>
          <div class="rental-modal-field">
            <label>금액 (원)</label>
            <input type="number" id="modal-price" value="${item.price}" min="0">
          </div>
          <div class="rental-modal-field">
            <label>단위</label>
            <input type="text" id="modal-unit" value="${item.unit || '개'}">
          </div>
          <div class="rental-modal-buttons">
            <button type="button" class="rental-modal-btn cancel" id="modal-cancel">취소</button>
            <button type="button" class="rental-modal-btn confirm" id="modal-confirm">저장</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    
    document.getElementById("modal-cancel").addEventListener("click", closeModal);
    document.getElementById("modal-confirm").addEventListener("click", () => {
      const newCategory = document.getElementById("modal-category").value;
      const name = document.getElementById("modal-name").value.trim();
      const price = parseInt(document.getElementById("modal-price").value) || 0;
      const unit = document.getElementById("modal-unit").value.trim() || "개";
      
      if (!name) {
        alert("품목 이름을 입력해주세요.");
        return;
      }
      if (price <= 0) {
        alert("금액을 입력해주세요.");
        return;
      }
      
      // 카테고리가 변경된 경우
      if (newCategory !== categoryName) {
        moveRentalItem(categoryName, newCategory, itemId);
        updateRentalItem(newCategory, itemId, { name, price, unit });
      } else {
        updateRentalItem(categoryName, itemId, { name, price, unit });
      }
      
      closeModal();
      renderRentalItemGrid();
    });
  }

  // 모달 닫기
  function closeModal() {
    document.getElementById("rental-modal")?.remove();
  }

  // 초기화
  function initRentalApp() {
    // 기존 카테고리 네비게이션 대체
    renderRentalCategoryNav();
    renderRentalItemGrid();
  }

  // DOM 로드 후 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRentalApp);
  } else {
    // app.js가 먼저 실행되도록 약간 지연
    setTimeout(initRentalApp, 100);
  }
})();

