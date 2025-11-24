@echo off
chcp 65001 >nul
echo ========================================
echo Node.js 및 npm 설치 확인
echo ========================================
echo.

echo [1] Node.js 버전 확인:
node --version
if %errorlevel% == 0 (
    echo ✓ Node.js가 설치되어 있습니다.
) else (
    echo ✗ Node.js가 설치되지 않았습니다.
    echo   https://nodejs.org 에서 다운로드하세요.
)
echo.

echo [2] npm 버전 확인:
npm --version
if %errorlevel% == 0 (
    echo ✓ npm이 설치되어 있습니다.
) else (
    echo ✗ npm이 설치되지 않았습니다.
    echo   Node.js를 설치하면 npm도 함께 설치됩니다.
)
echo.

echo [3] Node.js 설치 경로 확인:
where.exe node 2>nul
if %errorlevel% == 0 (
    echo ✓ Node.js 경로를 찾았습니다.
) else (
    echo ✗ Node.js 경로를 찾을 수 없습니다.
    echo   PATH 환경 변수에 등록되지 않았을 수 있습니다.
)
echo.

echo [4] npm 설치 경로 확인:
where.exe npm 2>nul
if %errorlevel% == 0 (
    echo ✓ npm 경로를 찾았습니다.
) else (
    echo ✗ npm 경로를 찾을 수 없습니다.
    echo   PATH 환경 변수에 등록되지 않았을 수 있습니다.
)
echo.

echo ========================================
echo 확인 완료
echo ========================================
echo.
echo 문제가 있다면:
echo 1. https://nodejs.org 에서 Node.js LTS 버전 다운로드
echo 2. 설치 시 "Add to PATH" 옵션 체크 확인
echo 3. 컴퓨터 재시작
echo 4. 이 스크립트를 다시 실행하여 확인
echo.
pause

