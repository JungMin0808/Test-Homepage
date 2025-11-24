# Cursor 캐시 삭제 스크립트

Write-Host "Cursor 캐시 삭제 중..." -ForegroundColor Yellow

# Cursor 완전 종료 확인
$cursorProcesses = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue
if ($cursorProcesses) {
    Write-Host "Cursor가 실행 중입니다. 먼저 Cursor를 종료해주세요." -ForegroundColor Red
    Write-Host "프로세스 종료 후 다시 실행하세요." -ForegroundColor Yellow
    exit
}

$cachePaths = @(
    "$env:APPDATA\Cursor\Cache",
    "$env:APPDATA\Cursor\CachedData",
    "$env:LOCALAPPDATA\Cursor\Cache",
    "$env:LOCALAPPDATA\Cursor\Code Cache"
)

$deletedCount = 0
foreach ($path in $cachePaths) {
    if (Test-Path $path) {
        try {
            Remove-Item -Path $path -Recurse -Force -ErrorAction Stop
            Write-Host "✓ 삭제됨: $path" -ForegroundColor Green
            $deletedCount++
        }
        catch {
            Write-Host "✗ 삭제 실패: $path - $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "- 없음: $path" -ForegroundColor Gray
    }
}

Write-Host "`n총 $deletedCount 개의 캐시 폴더를 삭제했습니다." -ForegroundColor Cyan
Write-Host "이제 Cursor를 다시 시작하세요." -ForegroundColor Yellow



