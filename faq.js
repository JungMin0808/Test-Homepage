// FAQ 데이터
const faqData = [
  {
    "id": "faq_1",
    "question": "리프트권은 어떻게 구매하나요?",
    "answer": "리프트권은 현장 매표소에서 구매하실 수 있으며, 온라인 예약도 가능합니다. 시간권은 2시간부터 7시간까지 선택 가능합니다."
  },
  {
    "id": "faq_2",
    "question": "렌탈 장비는 무엇이 포함되나요?",
    "answer": "스키 또는 보드, 부츠, 폴이 포함됩니다. 헬멧, 보호장비, 의류는 별도로 렌탈 가능합니다."
  },
  {
    "id": "faq_3",
    "question": "강습은 어떻게 신청하나요?",
    "answer": "강습은 1:1, 1:2, 1:3 형태로 제공되며, 2시간, 3시간, 4시간 코스가 있습니다. 현장에서 또는 전화로 예약 가능합니다."
  }
];

if (typeof module !== "undefined") {
  module.exports = faqData;
} else {
  window.faqData = faqData;
}
