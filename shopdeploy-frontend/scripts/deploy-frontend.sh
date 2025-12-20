#!/bin/bash

# Deploy Frontend to S3
# This script builds and deploys the frontend to S3

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 ShopDeploy Frontend - S3 Deployment${NC}"

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
S3_BUCKET="${S3_BUCKET:-shopdeploy-prod-frontend}"
BACKEND_API_URL="${BACKEND_API_URL:-http://your-alb-dns-name.amazonaws.com}"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  S3 Bucket: $S3_BUCKET"
echo "  Backend API URL: $BACKEND_API_URL"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")/.."

# Create .env.production
echo -e "${BLUE}📝 Creating production environment file...${NC}"
cat > .env.production << EOF
VITE_API_BASE_URL=$BACKEND_API_URL/api
VITE_ENVIRONMENT=production
EOF

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Build frontend
echo -e "${BLUE}🏗️  Building frontend...${NC}"
npm run build

# Upload to S3
echo -e "${BLUE}📤 Uploading to S3...${NC}"
aws s3 sync dist/ s3://$S3_BUCKET --delete --region $AWS_REGION

# Invalidate CloudFront cache (if using CloudFront)
# DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[?contains(@,'$S3_BUCKET')]].Id" --output text)
# if [ ! -z "$DISTRIBUTION_ID" ]; then
#     echo -e "${BLUE}🔄 Invalidating CloudFront cache...${NC}"
#     aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
# fi

echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
echo -e "${GREEN}🌐 URL: http://$S3_BUCKET.s3-website-$AWS_REGION.amazonaws.com${NC}"
