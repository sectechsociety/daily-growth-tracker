# Supabase Setup Script for Windows PowerShell
# Run this script to set up your Supabase environment variables

Write-Host "🚀 Setting up Supabase for Leaderboard..." -ForegroundColor Green
Write-Host ""

# Prompt for Supabase credentials
$supabaseUrl = Read-Host "Enter your Supabase Project URL (e.g., https://your-project-id.supabase.co)"
$supabaseKey = Read-Host "Enter your Supabase anon/public key"

# Validate inputs
if ([string]::IsNullOrWhiteSpace($supabaseUrl) -or [string]::IsNullOrWhiteSpace($supabaseKey)) {
    Write-Host "❌ Both URL and key are required!" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
$envFile = ".env"
$envExists = Test-Path $envFile

if ($envExists) {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    New-Item -ItemType File -Path $envFile | Out-Null
}

# Read current .env content
$currentContent = Get-Content $envFile -Raw

# Update or add Supabase variables
$updatedContent = $currentContent

# Update VITE_SUPABASE_URL
if ($currentContent -match "VITE_SUPABASE_URL=") {
    $updatedContent = $currentContent -replace "VITE_SUPABASE_URL=.*", "VITE_SUPABASE_URL=$supabaseUrl"
    Write-Host "🔄 Updated VITE_SUPABASE_URL" -ForegroundColor Yellow
} else {
    $updatedContent = $currentContent + "`nVITE_SUPABASE_URL=$supabaseUrl"
    Write-Host "➕ Added VITE_SUPABASE_URL" -ForegroundColor Green
}

# Update VITE_SUPABASE_ANON_KEY
if ($currentContent -match "VITE_SUPABASE_ANON_KEY=") {
    $updatedContent = $updatedContent -replace "VITE_SUPABASE_ANON_KEY=.*", "VITE_SUPABASE_ANON_KEY=$supabaseKey"
    Write-Host "🔄 Updated VITE_SUPABASE_ANON_KEY" -ForegroundColor Yellow
} else {
    $updatedContent = $updatedContent + "`nVITE_SUPABASE_ANON_KEY=$supabaseKey"
    Write-Host "➕ Added VITE_SUPABASE_ANON_KEY" -ForegroundColor Green
}

# Write back to .env file
$updatedContent | Out-File -FilePath $envFile -Encoding UTF8

Write-Host ""
Write-Host "✅ Supabase configuration saved to .env file!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to your Supabase dashboard: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project" -ForegroundColor White
Write-Host "3. Go to SQL Editor" -ForegroundColor White
Write-Host "4. Copy and run the contents of 'supabase-leaderboard-schema.sql'" -ForegroundColor White
Write-Host "5. Restart your dev server: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🎯 The leaderboard should now work with real-time updates!" -ForegroundColor Green
