const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;
const staticDir = __dirname;
const pricingPath = path.join(staticDir, "pricing.js");
const holidaysPath = path.join(staticDir, "holidays.json");
const faqPath = path.join(staticDir, "faq.js");

app.use(express.static(staticDir));
app.use(express.json());

function readPricingFile() {
  delete require.cache[require.resolve(pricingPath)];
  return require(pricingPath);
}

function writePricingFile(newData) {
  const content = `const pricingData = ${JSON.stringify(newData, null, 2)};\n\nif (typeof module !== "undefined") {\n  module.exports = pricingData;\n} else {\n  window.pricingData = pricingData;\n}\n`;
  fs.writeFileSync(pricingPath, content, "utf-8");
}

function readHolidayFile() {
  const buffer = fs.readFileSync(holidaysPath, "utf-8");
  return JSON.parse(buffer);
}

function writeHolidayFile(holidays) {
  // 기존 파일을 읽어서 객체 구조인 경우 holidays 필드만 업데이트
  let data;
  try {
    const existing = readHolidayFile();
    if (Array.isArray(existing)) {
      // 기존이 배열이면 그대로 저장
      data = holidays;
    } else {
      // 기존이 객체면 holidays 필드만 업데이트
      data = { ...existing, holidays };
    }
  } catch (error) {
    // 파일이 없거나 읽을 수 없으면 배열로 저장
    data = holidays;
  }
  fs.writeFileSync(holidaysPath, JSON.stringify(data, null, 2), "utf-8");
}

function readFAQFile() {
  delete require.cache[require.resolve(faqPath)];
  return require(faqPath);
}

function writeFAQFile(faqs) {
  const content = `// FAQ 데이터\nconst faqData = ${JSON.stringify(faqs, null, 2)};\n\nif (typeof module !== "undefined") {\n  module.exports = faqData;\n} else {\n  window.faqData = faqData;\n}\n`;
  fs.writeFileSync(faqPath, content, "utf-8");
}

app.get("/api/pricing", async (_req, res) => {
  try {
    const data = readPricingFile();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "요금 데이터를 읽을 수 없습니다." });
  }
});

app.post("/api/pricing", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload?.offSeason || !payload?.peakSeason) {
      return res.status(400).json({ success: false, error: "season 데이터가 필요합니다." });
    }
    writePricingFile(payload);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "요금 데이터를 저장할 수 없습니다." });
  }
});

app.get("/api/holidays", async (_req, res) => {
  try {
    const data = readHolidayFile();
    // 객체 구조인 경우 holidays 배열을 추출, 배열인 경우 그대로 사용
    const holidays = Array.isArray(data) ? data : (data.holidays || []);
    res.json({ success: true, holidays });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "공휴일 정보를 읽을 수 없습니다." });
  }
});

app.post("/api/holidays", async (req, res) => {
  try {
    const { holidays } = req.body;
    if (!Array.isArray(holidays)) {
      return res.status(400).json({ success: false, error: "holidays 배열이 필요합니다." });
    }
    writeHolidayFile(holidays);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "공휴일 정보를 저장할 수 없습니다." });
  }
});

app.get("/api/faqs", async (_req, res) => {
  try {
    const data = readFAQFile();
    res.json({ success: true, faqs: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "FAQ 데이터를 읽을 수 없습니다." });
  }
});

app.post("/api/faqs", async (req, res) => {
  try {
    const { faqs } = req.body;
    if (!Array.isArray(faqs)) {
      return res.status(400).json({ success: false, error: "faqs 배열이 필요합니다." });
    }
    writeFAQFile(faqs);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "FAQ 데이터를 저장할 수 없습니다." });
  }
});

app.get("/pricing-editor", (_req, res) => {
  res.sendFile(path.join(staticDir, "pricing.html"));
});

app.get("/phone", (_req, res) => {
  res.sendFile(path.join(staticDir, "phone.html"));
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`월드스키 카운터 계산기 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`또는 http://127.0.0.1:${PORT} 로도 접속할 수 있습니다.`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ 포트 ${PORT}가 이미 사용 중입니다.`);
    console.error(`해결 방법:`);
    console.error(`  1. 다른 프로그램이 포트 ${PORT}를 사용하고 있는지 확인하세요.`);
    console.error(`  2. 다른 포트를 사용하려면: set PORT=4001 && npm start`);
    console.error(`  3. 포트를 사용하는 프로세스를 종료하세요.`);
  } else {
    console.error(`❌ 서버 시작 실패:`, err.message);
  }
  process.exit(1);
});
