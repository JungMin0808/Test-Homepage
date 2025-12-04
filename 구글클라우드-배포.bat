@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   월드스키 카운터 계산기 - Google Cloud 배포
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
gcloud config get-value project
echo.

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
echo 📦 배포를 시작합니다...
echo.

gcloud app deploy --quiet

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ 배포가 완료되었습니다!
    echo.
    echo 웹사이트 열기:
    gcloud app browse
) else (
    echo.
    echo ❌ 배포에 실패했습니다.
    echo 오류 로그를 확인해주세요.
)

echo.
pause


