// 장비 렌탈 계산기 전용 데이터 관리

const RENTAL_STORAGE_KEY = "rentalPricingData";

// 기본 데이터 (localStorage가 비어있을 때 사용)
const defaultRentalData = {
  categories: [
    {
      name: "장비렌탈",
      items: [
        { id: "rental_1", name: "일반의류 렌탈(2~3시간)", price: 10000, unit: "세트" },
        { id: "rental_2", name: "일반의류 렌탈(4~5시간)", price: 10000, unit: "세트" },
        { id: "rental_3", name: "일반의류 렌탈(6~8시간)", price: 15000, unit: "세트" },
        { id: "rental_4", name: "고급의류 렌탈(2~3시간)", price: 25000, unit: "세트" },
        { id: "rental_5", name: "고급의류 렌탈(4시간)", price: 30000, unit: "세트" },
        { id: "rental_6", name: "고급의류 렌탈(5~6시간)", price: 35000, unit: "세트" },
        { id: "rental_7", name: "고급의류 렌탈(7~8시간)", price: 40000, unit: "세트" },
        { id: "rental_8", name: "헬맷 렌탈", price: 5000, unit: "개" },
        { id: "rental_9", name: "바이저 헬맷 렌탈", price: 10000, unit: "개" },
        { id: "rental_10", name: "고글 렌탈", price: 5000, unit: "개" },
        { id: "rental_11", name: "보호대 렌탈", price: 5000, unit: "개" },
        { id: "rental_12", name: "거북이 보호대 렌탈", price: 15000, unit: "개" }
      ]
    },
    {
      name: "구매물품",
      items: [
        { id: "purchase_1", name: "장갑 구매", price: 18000, unit: "켤레" },
        { id: "purchase_2", name: "바라클라바 구매", price: 15000, unit: "개" },
        { id: "purchase_3", name: "양말 구매", price: 10000, unit: "켤레" },
        { id: "purchase_4", name: "워머 구매", price: 15000, unit: "개" },
        { id: "purchase_5", name: "레깅스 구매", price: 20000, unit: "벌" },
        { id: "purchase_6", name: "비니 모자 구매", price: 20000, unit: "개" },
        { id: "purchase_7", name: "털 모자 구매", price: 30000, unit: "개" }
      ]
    }
  ]
};

// localStorage에서 데이터 로드
function loadRentalData() {
  try {
    const stored = localStorage.getItem(RENTAL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("렌탈 데이터 로드 실패:", e);
  }
  return defaultRentalData;
}

// localStorage에 데이터 저장
function saveRentalData(data) {
  try {
    localStorage.setItem(RENTAL_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("렌탈 데이터 저장 실패:", e);
    return false;
  }
}

// 전역 변수로 렌탈 데이터 관리
let rentalPricingData = loadRentalData();

// 품목 추가
function addRentalItem(categoryName, item) {
  const category = rentalPricingData.categories.find(c => c.name === categoryName);
  if (category) {
    item.id = `rental_${Date.now()}`;
    category.items.push(item);
    saveRentalData(rentalPricingData);
    return true;
  }
  return false;
}

// 품목 수정
function updateRentalItem(categoryName, itemId, updates) {
  const category = rentalPricingData.categories.find(c => c.name === categoryName);
  if (category) {
    const item = category.items.find(i => i.id === itemId);
    if (item) {
      Object.assign(item, updates);
      saveRentalData(rentalPricingData);
      return true;
    }
  }
  return false;
}

// 품목 삭제
function deleteRentalItem(categoryName, itemId) {
  const category = rentalPricingData.categories.find(c => c.name === categoryName);
  if (category) {
    const index = category.items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      category.items.splice(index, 1);
      saveRentalData(rentalPricingData);
      return true;
    }
  }
  return false;
}

// 품목을 다른 카테고리로 이동
function moveRentalItem(fromCategory, toCategory, itemId) {
  const from = rentalPricingData.categories.find(c => c.name === fromCategory);
  const to = rentalPricingData.categories.find(c => c.name === toCategory);
  if (from && to) {
    const index = from.items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      const [item] = from.items.splice(index, 1);
      to.items.push(item);
      saveRentalData(rentalPricingData);
      return true;
    }
  }
  return false;
}

// 데이터 초기화
function resetRentalData() {
  rentalPricingData = JSON.parse(JSON.stringify(defaultRentalData));
  saveRentalData(rentalPricingData);
}

