# ShopDeploy Backend Docker Build and Push Script (PowerShell)
# This script builds the Docker image and pushes it to AWS ECR

$ErrorActionPreference = "Stop"

Write-Host "🚀 ShopDeploy Backend - Docker Build & Push" -ForegroundColor Blue

# Check if required tools are installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Host "❌ AWS CLI is not installed" -ForegroundColor Red
    exit 1
}

# Configuration
$AWS_REGION = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }
$AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)
$ECR_REPOSITORY = if ($env:ECR_REPOSITORY) { $env:ECR_REPOSITORY } else { "shopdeploy-prod-backend" }
$IMAGE_TAG = if ($env:IMAGE_TAG) { $env:IMAGE_TAG } else { "latest" }
$VERSION_TAG = if ($env:VERSION_TAG) { $env:VERSION_TAG } else { "v$(Get-Date -Format 'yyyyMMdd-HHmmss')" }

Write-Host "📋 Configuration:" -ForegroundColor Blue
Write-Host "  AWS Region: $AWS_REGION"
Write-Host "  AWS Account: $AWS_ACCOUNT_ID"
Write-Host "  ECR Repository: $ECR_REPOSITORY"
Write-Host "  Image Tag: $IMAGE_TAG"
Write-Host "  Version Tag: $VERSION_TAG"
Write-Host ""

# ECR repository URL
$ECR_URL = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY"

# Navigate to backend directory
Set-Location $PSScriptRoot\..

# Login to ECR
Write-Host "🔐 Logging in to Amazon ECR..." -ForegroundColor Blue
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL

# Build Docker image
Write-Host "🏗️  Building Docker image..." -ForegroundColor Blue
docker build -t "${ECR_REPOSITORY}:${IMAGE_TAG}" .
docker build -t "${ECR_REPOSITORY}:${VERSION_TAG}" .

# Tag images for ECR
Write-Host "🏷️  Tagging images..." -ForegroundColor Blue
docker tag "${ECR_REPOSITORY}:${IMAGE_TAG}" "${ECR_URL}:${IMAGE_TAG}"
docker tag "${ECR_REPOSITORY}:${VERSION_TAG}" "${ECR_URL}:${VERSION_TAG}"

# Push to ECR
Write-Host "📤 Pushing images to ECR..." -ForegroundColor Blue
docker push "${ECR_URL}:${IMAGE_TAG}"
docker push "${ECR_URL}:${VERSION_TAG}"

Write-Host "✅ Successfully built and pushed images:" -ForegroundColor Green
Write-Host "  ${ECR_URL}:${IMAGE_TAG}"
Write-Host "  ${ECR_URL}:${VERSION_TAG}"
Write-Host ""
Write-Host "🎉 Deployment ready!" -ForegroundColor Green
