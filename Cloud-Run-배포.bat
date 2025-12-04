@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   월드스키 카운터 계산기 - Cloud Run 배포
echo ============================================
echo.

REM Google Cloud SDK 설치 확인
where gcloud >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Google Cloud SDK가 설치되어 있지 않습니다.
    echo.
    echo 다음 링크에서 설치해주세요:
    echo https://cloud.google.com/sdk/docs/install
    echo.
    pause
    exit /b 1
)

echo ✅ Google Cloud SDK가 설치되어 있습니다.
echo.

REM 현재 프로젝트 확인
echo 현재 설정된 프로젝트:
for /f "tokens=*" %%i in ('gcloud config get-value project 2^>nul') do set PROJECT_ID=%%i
echo %PROJECT_ID%
echo.

if "%PROJECT_ID%"=="" (
    echo ❌ 프로젝트가 설정되지 않았습니다.
    echo.
    set /p PROJECT_ID="프로젝트 ID를 입력하세요: "
    gcloud config set project %PROJECT_ID%
)

set /p CONFIRM="이 프로젝트로 배포하시겠습니까? (Y/N): "
if /i "%CONFIRM%" neq "Y" (
    echo.
    echo 프로젝트를 변경하려면 다음 명령어를 실행하세요:
    echo gcloud config set project 프로젝트ID
    echo.
    pause
    exit /b 0
)

echo.
echo 📦 Cloud Run 배포를 시작합니다...
echo.

REM 서비스 이름 설정
set SERVICE_NAME=worldski-counter
set REGION=asia-northeast3

echo 1단계: 컨테이너 이미지 빌드 및 푸시...
gcloud builds submit --tag gcr.io/%PROJECT_ID%/%SERVICE_NAME%

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ 이미지 빌드에 실패했습니다.
    pause
    exit /b 1
)

echo.
echo 2단계: Cloud Run에 배포...
gcloud run deploy %SERVICE_NAME% ^
    --image gcr.io/%PROJECT_ID%/%SERVICE_NAME% ^
    --platform managed ^
    --region %REGION% ^
    --allow-unauthenticated ^
    --memory 256Mi ^
    --cpu 1 ^
    --min-instances 0 ^
    --max-instances 2

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ 배포가 완료되었습니다!
    echo.
    echo 서비스 URL 확인:
    gcloud run services describe %SERVICE_NAME% --region %REGION% --format "value(status.url)"
) else (
    echo.
    echo ❌ 배포에 실패했습니다.
)

echo.
pause


