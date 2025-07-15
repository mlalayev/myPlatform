while ($true) {
    $change = Get-ChildItem -Recurse -Include *.js,*.ts,*.json,*.css,*.tsx,*.md,*.yml,*.yaml,*.sh,*.ps1 -Path ./src,./prisma,./public,./scripts | 
        Where-Object { $_.LastWriteTime -gt (Get-Date).AddSeconds(-2) }
    if ($change) {
        Write-Host "Change detected! Rebuilding and restarting docker-compose..."
        docker-compose down
        docker-compose build
        docker-compose up -d
        Start-Sleep -Seconds 2
    }
    Start-Sleep -Seconds 1
} 