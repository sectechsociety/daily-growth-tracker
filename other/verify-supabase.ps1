# Verify Supabase Configuration
# Run this script to test if your Supabase setup is working

Write-Host "🔍 Verifying Supabase Configuration..." -ForegroundColor Cyan

# Check if .env file exists and has Supabase variables
if (!(Test-Path .env)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please run setup-supabase.ps1 first" -ForegroundColor Yellow
    exit 1
}

$envContent = Get-Content .env -Raw

# Check for Supabase URL
if ($envContent -match "VITE_SUPABASE_URL=(.+)") {
    $url = $Matches[1]
    if ($url -ne "https://placeholder.supabase.co") {
        Write-Host "✅ VITE_SUPABASE_URL is set: $url" -ForegroundColor Green
    } else {
        Write-Host "❌ VITE_SUPABASE_URL is still placeholder" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ VITE_SUPABASE_URL not found in .env" -ForegroundColor Red
    exit 1
}

# Check for Supabase Key
if ($envContent -match "VITE_SUPABASE_ANON_KEY=(.+)") {
    $key = $Matches[1]
    if ($key -ne "placeholder-key" -and $key.Length -gt 20) {
        Write-Host "✅ VITE_SUPABASE_ANON_KEY is set (length: $($key.Length))" -ForegroundColor Green
    } else {
        Write-Host "❌ VITE_SUPABASE_ANON_KEY is invalid" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ VITE_SUPABASE_ANON_KEY not found in .env" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Configuration looks good!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Run the SQL schema from supabase-leaderboard-schema.sql" -ForegroundColor White
Write-Host "3. Restart your dev server: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The leaderboard should now work with real-time updates! 🚀" -ForegroundColor Green
