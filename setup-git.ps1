$git = 'C:\Program Files\Git\mingw64\bin\git.exe'
$repo = 'C:\Users\RyanEinbender\enterprise-ai-assessment'

Set-Location $repo

& $git init
& $git config user.name "Ryan Einbender"
& $git config user.email "ryan@example.com"
& $git add .
& $git commit -m "Initial commit: Enterprise AI Readiness Assessment app"
Write-Host ""
& $git log --oneline
