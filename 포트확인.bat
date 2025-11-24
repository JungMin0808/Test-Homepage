@echo off
chcp 65001 >nul
echo ========================================
echo 포트 4000 사용 확인
echo ========================================
echo.

netstat -ano | findstr :4000

if %errorlevel% == 0 (
    echo.
    echo ⚠️ 포트 4000이 이미 사용 중입니다.
    echo 위 목록에서 PID를 확인하고 작업 관리자에서 종료하세요.
) else (
    echo.
    echo ✓ 포트 4000이 사용 가능합니다.
)

echo.
echo ========================================
pause

