(function () {
  async function loadHolidaysFromJson() {
    try {
      const response = await fetch("holidays.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("network");
      }
      const data = await response.json();
      // 객체 구조인 경우 holidays 배열을 추출, 배열인 경우 그대로 사용
      window.holidaysData = Array.isArray(data) ? data : (data.holidays || []);
    } catch (error) {
      // CORS 에러인 경우 서버 실행 안내
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        const isFileProtocol = window.location.protocol === "file:";
        if (isFileProtocol) {
          console.warn("⚠️ 파일을 직접 열었습니다. 서버를 실행해야 합니다.");
          console.warn("📝 해결 방법:");
          console.warn("   1. 터미널에서 프로젝트 폴더로 이동");
          console.warn("   2. 'npm start' 명령어 실행");
          console.warn("   3. 브라우저에서 http://localhost:4000 접속");
        }
      }
      console.error("holidays.json을 불러오지 못했습니다.", error);
      window.holidaysData = window.holidaysData || [];
    }

    document.dispatchEvent(
      new CustomEvent("holidaysDataReady", { detail: window.holidaysData })
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadHolidaysFromJson);
  } else {
    loadHolidaysFromJson();
  }
})();



