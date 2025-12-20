#!/bin/bash

# ShopDeploy Backend Docker Build and Push Script
# This script builds the Docker image and pushes it to AWS ECR

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 ShopDeploy Backend - Docker Build & Push${NC}"

# Check if required tools are installed
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker is not installed${NC}" >&2; exit 1; }
command -v aws >/dev/null 2>&1 || { echo -e "${RED}❌ AWS CLI is not installed${NC}" >&2; exit 1; }

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPOSITORY="${ECR_REPOSITORY:-shopdeploy-prod-backend}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
VERSION_TAG="${VERSION_TAG:-v$(date +%Y%m%d-%H%M%S)}"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  AWS Region: $AWS_REGION"
echo "  AWS Account: $AWS_ACCOUNT_ID"
echo "  ECR Repository: $ECR_REPOSITORY"
echo "  Image Tag: $IMAGE_TAG"
echo "  Version Tag: $VERSION_TAG"
echo ""

# ECR repository URL
ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

# Navigate to backend directory
cd "$(dirname "$0")/.."

# Login to ECR
echo -e "${BLUE}🔐 Logging in to Amazon ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL

# Build Docker image
echo -e "${BLUE}🏗️  Building Docker image...${NC}"
docker build -t $ECR_REPOSITORY:$IMAGE_TAG .
docker build -t $ECR_REPOSITORY:$VERSION_TAG .

# Tag images for ECR
echo -e "${BLUE}🏷️  Tagging images...${NC}"
docker tag $ECR_REPOSITORY:$IMAGE_TAG $ECR_URL:$IMAGE_TAG
docker tag $ECR_REPOSITORY:$VERSION_TAG $ECR_URL:$VERSION_TAG

# Push to ECR
echo -e "${BLUE}📤 Pushing images to ECR...${NC}"
docker push $ECR_URL:$IMAGE_TAG
docker push $ECR_URL:$VERSION_TAG

echo -e "${GREEN}✅ Successfully built and pushed images:${NC}"
echo "  $ECR_URL:$IMAGE_TAG"
echo "  $ECR_URL:$VERSION_TAG"
echo ""
echo -e "${GREEN}🎉 Deployment ready!${NC}"
