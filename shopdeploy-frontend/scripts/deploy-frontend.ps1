# Deploy Frontend to S3 (PowerShell)
# This script builds and deploys the frontend to S3

$ErrorActionPreference = "Stop"

Write-Host "🚀 ShopDeploy Frontend - S3 Deployment" -ForegroundColor Blue

# Configuration
$AWS_REGION = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }
$S3_BUCKET = if ($env:S3_BUCKET) { $env:S3_BUCKET } else { "shopdeploy-prod-frontend" }
$BACKEND_API_URL = if ($env:BACKEND_API_URL) { $env:BACKEND_API_URL } else { "http://your-alb-dns-name.amazonaws.com" }

Write-Host "📋 Configuration:" -ForegroundColor Blue
Write-Host "  S3 Bucket: $S3_BUCKET"
Write-Host "  Backend API URL: $BACKEND_API_URL"
Write-Host ""

# Navigate to frontend directory
Set-Location $PSScriptRoot\..

# Create .env.production
Write-Host "📝 Creating production environment file..." -ForegroundColor Blue
@"
VITE_API_BASE_URL=$BACKEND_API_URL/api
VITE_ENVIRONMENT=production
"@ | Out-File -FilePath .env.production -Encoding utf8

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

# Build frontend
Write-Host "🏗️  Building frontend..." -ForegroundColor Blue
npm run build

# Upload to S3
Write-Host "📤 Uploading to S3..." -ForegroundColor Blue
aws s3 sync dist/ "s3://$S3_BUCKET" --delete --region $AWS_REGION

Write-Host "✅ Frontend deployed successfully!" -ForegroundColor Green
Write-Host "🌐 URL: http://$S3_BUCKET.s3-website-$AWS_REGION.amazonaws.com" -ForegroundColor Green
