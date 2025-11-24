# Node.js 설치 및 npm 오류 해결 가이드

## 오류 원인
"'npm' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다."

이 오류는 **Node.js가 설치되지 않았거나** 시스템 PATH에 등록되지 않았을 때 발생합니다.

---

## 해결 방법

### 방법 1: Node.js 설치 (가장 일반적인 해결책)

#### 1단계: Node.js 다운로드
1. 웹 브라우저에서 다음 주소로 이동:
   ```
   https://nodejs.org
   ```

2. **LTS 버전** (장기 지원 버전) 다운로드
   - 예: "Recommended For Most Users" 버튼 클릭
   - 현재 LTS 버전: v20.x.x 또는 v18.x.x

#### 2단계: Node.js 설치
1. 다운로드한 `.msi` 파일 실행
2. 설치 마법사에서:
   - ✅ **"Add to PATH"** 옵션이 체크되어 있는지 확인 (기본적으로 체크됨)
   - ✅ **"Automatically install the necessary tools"** 체크 (선택 사항)
   - "Next" → "Install" 클릭
3. 설치 완료 후 **컴퓨터 재시작** (중요!)

#### 3단계: 설치 확인
1. **새로운** PowerShell 또는 명령 프롬프트 창 열기
   - 기존 창은 닫고 새로 열어야 합니다
   
2. 다음 명령어 실행:
   ```powershell
   node --version
   npm --version
   ```

3. 버전 번호가 표시되면 성공!
   ```
   v20.11.0
   10.2.4
   ```

---

### 방법 2: PATH 환경 변수 수동 설정 (이미 설치된 경우)

Node.js가 설치되어 있지만 PATH에 등록되지 않은 경우:

#### 1단계: Node.js 설치 경로 확인
일반적인 설치 경로:
- `C:\Program Files\nodejs\`
- `C:\Program Files (x86)\nodejs\`
- 또는 사용자 폴더: `C:\Users\[사용자명]\AppData\Roaming\npm`

#### 2단계: PATH 환경 변수에 추가
1. **Windows 키 + R** → `sysdm.cpl` 입력 → Enter
2. "고급" 탭 → "환경 변수" 클릭
3. "시스템 변수" 섹션에서 `Path` 선택 → "편집" 클릭
4. "새로 만들기" 클릭
5. Node.js 설치 경로 입력 (예: `C:\Program Files\nodejs`)
6. "확인" 클릭하여 모든 창 닫기
7. **컴퓨터 재시작** 또는 **모든 터미널 창 닫고 다시 열기**

#### 3단계: 확인
새로운 PowerShell 창에서:
```powershell
node --version
npm --version
```

---

### 방법 3: Chocolatey 사용 (고급 사용자용)

Chocolatey 패키지 매니저가 설치되어 있는 경우:

```powershell
choco install nodejs
```

---

## 설치 후 프로젝트 설정

### 1단계: 의존성 패키지 설치
프로젝트 폴더에서 PowerShell 열고:

```powershell
npm install
```

이 명령어는 `package.json`에 명시된 패키지들을 다운로드합니다.
처음 실행 시 몇 분 정도 걸릴 수 있습니다.

### 2단계: 서버 실행
```powershell
npm start
```

---

## 문제 해결 체크리스트

### ✅ Node.js 설치 확인
```powershell
node --version
```
- 버전 번호가 표시되면: 설치됨 ✅
- 오류가 나면: 설치 필요 ❌

### ✅ npm 설치 확인
```powershell
npm --version
```
- 버전 번호가 표시되면: 정상 ✅
- 오류가 나면: Node.js 재설치 필요 ❌

### ✅ 설치 경로 확인
```powershell
where.exe node
where.exe npm
```
- 경로가 표시되면: PATH 등록됨 ✅
- "정보를 찾을 수 없습니다"면: PATH 등록 필요 ❌

---

## 자주 묻는 질문 (FAQ)

### Q1: Node.js를 설치했는데도 여전히 오류가 나요
**A:** 다음을 시도하세요:
1. 컴퓨터 재시작
2. 모든 터미널/PowerShell 창 닫고 새로 열기
3. `where.exe node` 명령어로 설치 경로 확인
4. PATH 환경 변수에 경로가 있는지 확인

### Q2: 어떤 버전을 설치해야 하나요?
**A:** LTS (Long Term Support) 버전을 권장합니다.
- 안정적이고 장기 지원
- 대부분의 프로젝트와 호환

### Q3: 기존 Node.js 버전이 있는데 업데이트해야 하나요?
**A:** 
- v14 이상이면 대부분 작동합니다
- 업데이트하려면 새 버전 설치 (기존 버전 자동 교체)

### Q4: 설치 후에도 npm이 인식되지 않아요
**A:**
1. 설치 시 "Add to PATH" 옵션이 체크되었는지 확인
2. PATH 환경 변수에 `C:\Program Files\nodejs` 추가
3. 컴퓨터 재시작

---

## 빠른 해결 요약

1. **https://nodejs.org** 접속
2. **LTS 버전 다운로드**
3. **설치 시 "Add to PATH" 체크 확인**
4. **컴퓨터 재시작**
5. **새 PowerShell 창에서 `node --version` 확인**

---

## 추가 도움말

- Node.js 공식 문서: https://nodejs.org/docs
- npm 공식 문서: https://docs.npmjs.com
- 설치 문제 해결: https://github.com/nodejs/node/issues

