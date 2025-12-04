# 구글 클라우드 배포 가이드

## Cloud Run 배포 (권장)

### 빠른 배포 명령어

```bash
# 1. 프로젝트 폴더로 이동
cd "C:\Users\user\Desktop\월드스키 카운터 계산기"

# 2. 로그인 (처음 한 번만)
gcloud auth login

# 3. 프로젝트 설정
gcloud config set project 프로젝트ID

# 4. 이미지 빌드 및 푸시
gcloud builds submit --tag gcr.io/프로젝트ID/worldski-counter

# 5. Cloud Run에 배포
gcloud run deploy worldski-counter \
    --image gcr.io/프로젝트ID/worldski-counter \
    --platform managed \
    --region asia-northeast3 \
    --allow-unauthenticated \
    --memory 256Mi \
    --min-instances 0 \
    --max-instances 2
```

### 또는 배치 파일 실행
`Cloud-Run-배포.bat` 파일을 더블클릭하면 자동으로 배포됩니다.

---

## 1. 사전 준비

### 1-1. Google Cloud 계정 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인
3. 처음이라면 무료 크레딧 $300 제공됨

### 1-2. 프로젝트 생성
1. 콘솔 상단의 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 클릭
3. 프로젝트 이름 입력 (예: `worldski-counter`)
4. "만들기" 클릭

### 1-3. Google Cloud SDK 설치
1. [Google Cloud SDK 다운로드](https://cloud.google.com/sdk/docs/install) 페이지 접속
2. Windows용 설치 프로그램 다운로드 및 실행
3. 설치 완료 후 "Google Cloud SDK Shell" 실행

---

## 2. 배포 방법

### 2-1. Google Cloud SDK Shell 열기
시작 메뉴에서 "Google Cloud SDK Shell" 검색 후 실행

### 2-2. 로그인
```bash
gcloud auth login
```
브라우저가 열리면 Google 계정으로 로그인

### 2-3. 프로젝트 선택
```bash
gcloud config set project 프로젝트ID
```
예: `gcloud config set project worldski-counter`

### 2-4. App Engine 활성화
```bash
gcloud app create --region=asia-northeast3
```
- `asia-northeast3`는 서울 리전입니다

### 2-5. 프로젝트 폴더로 이동
```bash
cd "C:\Users\user\Desktop\월드스키 카운터 계산기"
```

### 2-6. 배포 실행
```bash
gcloud app deploy
```
- 확인 메시지가 나오면 `Y` 입력
- 배포에 2-5분 정도 소요됩니다

### 2-7. 웹사이트 열기
```bash
gcloud app browse
```
또는 `https://프로젝트ID.du.r.appspot.com` 으로 접속

---

## 3. 유용한 명령어

### 로그 확인
```bash
gcloud app logs tail -s default
```

### 현재 배포된 버전 확인
```bash
gcloud app versions list
```

### 이전 버전 삭제 (비용 절감)
```bash
gcloud app versions delete 버전ID
```

### 앱 중지 (비용 절감)
```bash
gcloud app versions stop 버전ID
```

---

## 4. 비용 안내

### 무료 등급 (매월)
- F1 인스턴스: 28시간/일 무료
- 아웃바운드 데이터: 1GB 무료
- Cloud Storage: 5GB 무료

### 예상 비용
- 소규모 사용 시: 무료 등급 내 운영 가능
- 트래픽이 많을 경우: 월 $5-20 예상

### 비용 모니터링
1. [결제 페이지](https://console.cloud.google.com/billing) 접속
2. 예산 알림 설정 권장

---

## 5. 문제 해결

### "Permission denied" 에러
```bash
gcloud auth login
gcloud config set project 프로젝트ID
```

### 배포 실패 시
1. `gcloud app logs tail` 로 로그 확인
2. package.json의 Node.js 버전 확인
3. app.yaml 설정 확인

### 앱이 작동하지 않을 때
- 콘솔에서 App Engine > 대시보드 확인
- 오류 로그 확인: App Engine > 로그

---

## 6. 커스텀 도메인 연결 (선택사항)

1. [App Engine 설정](https://console.cloud.google.com/appengine/settings/domains) 접속
2. "커스텀 도메인 추가" 클릭
3. 도메인 소유권 인증
4. DNS 레코드 설정

---

## 7. 주의사항

⚠️ **데이터 저장 관련**
- App Engine에서는 파일 시스템 쓰기가 제한됩니다
- 요금표 수정, 공휴일 추가 등의 기능은 서버 재시작 시 초기화될 수 있습니다
- 영구 저장이 필요하면 Cloud Firestore 연동이 필요합니다

⚠️ **비용 관리**
- 사용하지 않을 때는 인스턴스 중지 권장
- 예산 알림 설정 필수

