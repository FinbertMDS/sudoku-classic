# ⚠️ Thay bằng tên repo của bạn
$repo = "FinbertMDS/sudoku-classic"

# Đọc file .env và lặp qua từng dòng
Get-Content ".env" | ForEach-Object {
    if ($_ -and ($_ -notmatch "^#") -and ($_ -match "=")) {
        $parts = $_ -split "=", 2
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()

        if ($key -ne "" -and $value -ne "") {
            Write-Host "Setting secret: $key"
            gh secret set $key --repo $repo --body $value
        }
    }
}
