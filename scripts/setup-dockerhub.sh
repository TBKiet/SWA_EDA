#!/bin/bash

# 🐳 DockerHub Setup Helper Script
# This script helps you configure DockerHub credentials for the CD pipeline

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "🐳 DockerHub Setup Helper for CI/CD Pipeline"
echo "=============================================="
echo -e "${NC}"

# Function to check if gh CLI is installed
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        echo -e "${YELLOW}⚠️  GitHub CLI (gh) is not installed.${NC}"
        echo "Please install it first:"
        echo "  macOS: brew install gh"
        echo "  Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
        echo "  Windows: https://github.com/cli/cli/releases"
        echo ""
        echo "After installation, run: gh auth login"
        exit 1
    fi

    # Check if authenticated
    if ! gh auth status &> /dev/null; then
        echo -e "${YELLOW}⚠️  GitHub CLI is not authenticated.${NC}"
        echo "Please run: gh auth login"
        exit 1
    fi
}

# Function to get user input
get_input() {
    local prompt="$1"
    local var_name="$2"
    local is_secret="$3"
    
    echo -e "${CYAN}${prompt}${NC}"
    if [ "$is_secret" = "true" ]; then
        read -s input
        echo
    else
        read input
    fi
    
    if [ -z "$input" ]; then
        echo -e "${RED}❌ Input cannot be empty. Please try again.${NC}"
        get_input "$prompt" "$var_name" "$is_secret"
    else
        eval "$var_name='$input'"
    fi
}

# Function to create GitHub secrets
create_secrets() {
    local username="$1"
    local token="$2"
    
    echo -e "${BLUE}🔐 Creating GitHub repository secrets...${NC}"
    
    # Create DOCKERHUB_USERNAME secret
    echo "$username" | gh secret set DOCKERHUB_USERNAME
    echo -e "${GREEN}✅ DOCKERHUB_USERNAME secret created${NC}"
    
    # Create DOCKERHUB_TOKEN secret
    echo "$token" | gh secret set DOCKERHUB_TOKEN
    echo -e "${GREEN}✅ DOCKERHUB_TOKEN secret created${NC}"
}

# Function to test DockerHub login
test_dockerhub_login() {
    local username="$1"
    local token="$2"
    
    echo -e "${BLUE}🧪 Testing DockerHub login...${NC}"
    
    if echo "$token" | docker login --username "$username" --password-stdin >/dev/null 2>&1; then
        echo -e "${GREEN}✅ DockerHub login successful${NC}"
        docker logout >/dev/null 2>&1
        return 0
    else
        echo -e "${RED}❌ DockerHub login failed${NC}"
        echo "Please check your username and token."
        return 1
    fi
}

# Function to display next steps
show_next_steps() {
    echo -e "${GREEN}"
    echo "🎉 Setup Complete!"
    echo "=================="
    echo -e "${NC}"
    echo "Your DockerHub credentials have been configured for the CI/CD pipeline."
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "1. Go to your repository: https://github.com/TBKiet/SWA_EDA"
    echo "2. Navigate to Actions tab"
    echo "3. Find the latest workflow run and click 'Re-run all jobs'"
    echo "4. Watch the CD pipeline push Docker images to DockerHub"
    echo ""
    echo -e "${BLUE}🔍 What to expect:${NC}"
    echo "- CI pipeline: Tests and builds (should pass)"
    echo "- CD pipeline: Builds and pushes to DockerHub (should now work)"
    echo "- Security pipeline: Scans for vulnerabilities"
    echo ""
    echo -e "${BLUE}📦 Docker images will be available at:${NC}"
    echo "- docker pull $dockerhub_username/user-service:latest"
    echo "- docker pull $dockerhub_username/event-service:latest"
    echo "- docker pull $dockerhub_username/registration-service:latest"
    echo "- docker pull $dockerhub_username/notification-service:latest"
    echo "- docker pull $dockerhub_username/auditlog-service:latest"
    echo "- docker pull $dockerhub_username/gateway:latest"
    echo ""
    echo -e "${YELLOW}💡 Tip: You can also run the workflow manually by going to Actions → CD Pipeline → Run workflow${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}This script will help you set up DockerHub integration for your CI/CD pipeline.${NC}"
    echo ""
    
    # Check prerequisites
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    check_gh_cli
    echo -e "${GREEN}✅ GitHub CLI is ready${NC}"
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Docker is not running. Please start Docker Desktop.${NC}"
        echo "This is needed to test the login credentials."
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
    echo ""
    
    # Get DockerHub credentials
    echo -e "${BLUE}📝 DockerHub Credentials Setup${NC}"
    echo "You'll need:"
    echo "1. Your DockerHub username"
    echo "2. A DockerHub access token (NOT your password)"
    echo ""
    echo -e "${YELLOW}💡 How to create a DockerHub access token:${NC}"
    echo "1. Go to https://hub.docker.com/"
    echo "2. Sign in → Account Settings → Security"
    echo "3. Click 'New Access Token'"
    echo "4. Name: 'GitHub-Actions-SWA-EDA'"
    echo "5. Permissions: Read, Write, Delete"
    echo "6. Copy the generated token"
    echo ""
    
    get_input "🔤 Enter your DockerHub username:" "dockerhub_username" "false"
    get_input "🔑 Enter your DockerHub access token:" "dockerhub_token" "true"
    
    # Test credentials
    if ! test_dockerhub_login "$dockerhub_username" "$dockerhub_token"; then
        echo -e "${RED}❌ Setup failed. Please check your credentials and try again.${NC}"
        exit 1
    fi
    
    # Create GitHub secrets
    if ! create_secrets "$dockerhub_username" "$dockerhub_token"; then
        echo -e "${RED}❌ Failed to create GitHub secrets. Please check your GitHub CLI authentication.${NC}"
        exit 1
    fi
    
    # Show next steps
    show_next_steps
}

# Trap to handle interruption
trap 'echo -e "\n${YELLOW}Setup interrupted. You can run this script again anytime.${NC}"; exit 1' INT

# Run main function
main "$@"
