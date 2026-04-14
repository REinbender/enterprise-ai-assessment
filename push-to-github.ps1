$env:PATH = "C:\Program Files\GitHub CLI;" + "C:\Program Files\Git\mingw64\bin;" + $env:PATH
$git = 'C:\Program Files\Git\mingw64\bin\git.exe'
$gh = 'C:\Program Files\GitHub CLI\gh.exe'

Set-Location 'C:\Users\RyanEinbender\enterprise-ai-assessment'

Write-Host "Creating GitHub repository..."
& $gh repo create enterprise-ai-assessment --public --source=. --remote=origin --push --description "Enterprise AI Readiness Assessment web app"
Write-Host ""
Write-Host "Done! Repo URL:"
& $gh repo view --web
