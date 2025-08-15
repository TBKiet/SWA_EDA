#!/bin/bash

# 🧪 Local CI/CD Testing Script
# This script simulates the CI/CD pipeline locally for testing

set -e  # Exit on any error

echo "🚀 Starting Local CI/CD Pipeline Test..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Services to test
SERVICES=("user-service" "event-service" "registration-service" "notification-service" "auditlog-service" "gateway")

echo -e "${BLUE}📋 Services to test: ${SERVICES[*]}${NC}"
echo

# Function to check if service has required files
check_service() {
    local service=$1
    echo -e "${YELLOW}🔍 Checking $service...${NC}"

    if [ ! -d "$service" ]; then
        echo -e "${RED}❌ Service directory $service not found${NC}"
        return 1
    fi

    if [ ! -f "$service/package.json" ]; then
        echo -e "${RED}❌ package.json not found in $service${NC}"
        return 1
    fi

    if [ ! -f "$service/Dockerfile" ]; then
        echo -e "${YELLOW}⚠️  Dockerfile not found in $service${NC}"
    fi

    echo -e "${GREEN}✅ $service structure is valid${NC}"
    return 0
}

# Function to run tests for a service
test_service() {
    local service=$1
    echo -e "${BLUE}🧪 Testing $service...${NC}"

    cd "$service"

    # Install dependencies
    echo "📦 Installing dependencies..."
    npm ci --silent

    # Run linting if available
    if npm run lint --silent >/dev/null 2>&1; then
        echo "🔍 Running linting..."
        npm run lint
    fi

    # Run tests
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        echo "🎯 Running tests..."
        NODE_ENV=test npm test
    else
        echo -e "${YELLOW}⚠️  No tests defined for $service${NC}"
    fi

    cd ..
    echo -e "${GREEN}✅ $service tests completed${NC}"
    echo
}

# Function to build Docker image
build_docker() {
    local service=$1
    echo -e "${BLUE}🐳 Building Docker image for $service...${NC}"

    if [ -f "$service/Dockerfile" ]; then
        cd "$service"
        docker build -t "$service:test" . --quiet
        cd ..
        echo -e "${GREEN}✅ Docker image built for $service${NC}"
    else
        echo -e "${YELLOW}⚠️  No Dockerfile found for $service${NC}"
    fi
    echo
}

# Function to start infrastructure
start_infrastructure() {
    echo -e "${BLUE}🏗️  Starting infrastructure services...${NC}"

    # Check if docker-compose.yml exists
    if [ -f "docker-compose.yml" ]; then
        echo "📦 Starting PostgreSQL and Kafka..."
        docker-compose up -d postgres kafka zookeeper

        echo "⏳ Waiting for services to be ready..."
        sleep 30

        # Check if PostgreSQL is ready
        until docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; do
            echo "Waiting for PostgreSQL..."
            sleep 2
        done

        echo -e "${GREEN}✅ Infrastructure services are ready${NC}"
    else
        echo -e "${YELLOW}⚠️  docker-compose.yml not found${NC}"
    fi
    echo
}

# Function to stop infrastructure
stop_infrastructure() {
    echo -e "${BLUE}🛑 Stopping infrastructure services...${NC}"
    if [ -f "docker-compose.yml" ]; then
        docker-compose down
    fi
    echo
}

# Function to run security checks
security_checks() {
    echo -e "${BLUE}🔒 Running security checks...${NC}"

    for service in "${SERVICES[@]}"; do
        if [ -d "$service" ]; then
            echo "🔍 Security scan for $service..."
            cd "$service"

            # Run npm audit
            npm audit --audit-level moderate || echo "Security issues found in $service"

            cd ..
        fi
    done

    echo -e "${GREEN}✅ Security checks completed${NC}"
    echo
}

# Main execution
main() {
    echo -e "${BLUE}1. Checking service structure...${NC}"
    for service in "${SERVICES[@]}"; do
        check_service "$service" || exit 1
    done

    echo -e "${BLUE}2. Starting infrastructure...${NC}"
    start_infrastructure

    echo -e "${BLUE}3. Running tests for all services...${NC}"
    for service in "${SERVICES[@]}"; do
        if [ -d "$service" ]; then
            test_service "$service"
        fi
    done

    echo -e "${BLUE}4. Building Docker images...${NC}"
    for service in "${SERVICES[@]}"; do
        if [ -d "$service" ]; then
            build_docker "$service"
        fi
    done

    echo -e "${BLUE}5. Running security checks...${NC}"
    security_checks

    echo -e "${BLUE}6. Cleaning up...${NC}"
    stop_infrastructure

    echo -e "${GREEN}🎉 Local CI/CD pipeline test completed successfully!${NC}"
    echo
    echo -e "${BLUE}📊 Summary:${NC}"
    echo "- Services tested: ${#SERVICES[@]}"
    echo "- Infrastructure: PostgreSQL, Kafka, Zookeeper"
    echo "- Security scans: npm audit"
    echo "- Docker builds: Completed"
    echo
    echo -e "${GREEN}✅ Ready for GitHub Actions CI/CD!${NC}"
}

# Trap to ensure cleanup on exit
trap stop_infrastructure EXIT

# Run main function
main "$@"
