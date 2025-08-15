#!/bin/bash

# 🧪 CI Validation Script
# This script validates the CI setup to prevent common issues

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "🧪 CI Setup Validation"
echo "======================"
echo -e "${NC}"

SERVICES=("user-service" "event-service" "registration-service" "notification-service" "auditlog-service" "gateway")
ISSUES_FOUND=0

# Function to check service structure
check_service() {
    local service=$1
    echo -e "${BLUE}🔍 Checking $service...${NC}"

    local has_issues=0

    # Check if directory exists
    if [ ! -d "$service" ]; then
        echo -e "${RED}❌ Directory $service not found${NC}"
        return 1
    fi

    # Check package.json
    if [ ! -f "$service/package.json" ]; then
        echo -e "${RED}❌ package.json missing in $service${NC}"
        has_issues=1
    else
        echo -e "${GREEN}✅ package.json found${NC}"
    fi

    # Check package-lock.json
    if [ -f "$service/package-lock.json" ]; then
        echo -e "${GREEN}✅ package-lock.json found (CI caching enabled)${NC}"
    else
        echo -e "${YELLOW}⚠️  package-lock.json missing (CI will use npm install)${NC}"
    fi

    # Check Dockerfile
    if [ -f "$service/Dockerfile" ]; then
        echo -e "${GREEN}✅ Dockerfile found${NC}"
    else
        echo -e "${YELLOW}⚠️  Dockerfile missing (Docker build skipped)${NC}"
    fi

    # Check if dependencies can be installed
    if [ -f "$service/package.json" ]; then
        cd "$service"
        if npm ls >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Dependencies are valid${NC}"
        else
            echo -e "${YELLOW}⚠️  Dependencies may need installation${NC}"
        fi
        cd ..
    fi

    # Check test scripts
    if [ -f "$service/package.json" ]; then
        if grep -q '"test"' "$service/package.json"; then
            echo -e "${GREEN}✅ Test script defined${NC}"
        else
            echo -e "${YELLOW}⚠️  No test script defined${NC}"
        fi
    fi

    echo ""
    return $has_issues
}

# Function to check GitHub workflows
check_workflows() {
    echo -e "${BLUE}🔍 Checking GitHub workflows...${NC}"

    local workflows_dir=".github/workflows"

    if [ ! -d "$workflows_dir" ]; then
        echo -e "${RED}❌ .github/workflows directory not found${NC}"
        return 1
    fi

    # Check CI workflow
    if [ -f "$workflows_dir/ci.yml" ]; then
        echo -e "${GREEN}✅ CI workflow found${NC}"

        # Check for cache configuration
        if grep -q "cache:" "$workflows_dir/ci.yml"; then
            echo -e "${GREEN}✅ Node.js caching configured${NC}"
        else
            echo -e "${YELLOW}⚠️  Node.js caching not configured${NC}"
        fi
    else
        echo -e "${RED}❌ CI workflow missing${NC}"
        ((ISSUES_FOUND++))
    fi

    # Check CD workflow
    if [ -f "$workflows_dir/cd.yml" ]; then
        echo -e "${GREEN}✅ CD workflow found${NC}"
    else
        echo -e "${YELLOW}⚠️  CD workflow missing${NC}"
    fi

    # Check security workflow
    if [ -f "$workflows_dir/security.yml" ]; then
        echo -e "${GREEN}✅ Security workflow found${NC}"
    else
        echo -e "${YELLOW}⚠️  Security workflow missing${NC}"
    fi

    echo ""
}

# Function to check environment files
check_environment() {
    echo -e "${BLUE}🔍 Checking environment configuration...${NC}"

    # Check .npmrc
    if [ -f ".npmrc" ]; then
        echo -e "${GREEN}✅ .npmrc found (npm optimization enabled)${NC}"
    else
        echo -e "${YELLOW}⚠️  .npmrc missing (consider adding for better performance)${NC}"
    fi

    # Check .gitignore
    if [ -f ".gitignore" ]; then
        echo -e "${GREEN}✅ .gitignore found${NC}"

        if grep -q "node_modules" ".gitignore"; then
            echo -e "${GREEN}✅ node_modules ignored${NC}"
        else
            echo -e "${YELLOW}⚠️  node_modules not in .gitignore${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  .gitignore missing${NC}"
    fi

    echo ""
}

# Function to simulate CI cache behavior
test_cache_simulation() {
    echo -e "${BLUE}🧪 Testing CI cache simulation...${NC}"

    for service in "${SERVICES[@]}"; do
        if [ -d "$service" ]; then
            echo -e "${CYAN}Testing $service...${NC}"

            cd "$service"

            # Simulate CI behavior
            if [ -f "package-lock.json" ]; then
                echo "  ✅ Would use npm ci (faster, with cache)"
            else
                echo "  ⚠️  Would use npm install (slower, no cache)"
            fi

            # Check for potential issues
            if [ -f "package.json" ]; then
                # Check for problematic scripts
                if grep -q '"postinstall"' package.json; then
                    echo "  ⚠️  Has postinstall script (may cause CI issues)"
                fi

                # Check for peer dependency warnings
                if npm ls >/dev/null 2>&1; then
                    echo "  ✅ No dependency conflicts"
                else
                    echo "  ⚠️  May have dependency conflicts"
                fi
            fi

            cd ..
        fi
    done

    echo ""
}

# Function to show recommendations
show_recommendations() {
    echo -e "${BLUE}💡 Recommendations:${NC}"
    echo ""

    echo -e "${YELLOW}To optimize CI performance:${NC}"
    echo "1. Run 'npm install' in each service to generate package-lock.json"
    echo "2. Commit package-lock.json files to enable caching"
    echo "3. Add .npmrc with cache settings"
    echo ""

    echo -e "${YELLOW}To fix common CI issues:${NC}"
    echo "1. Ensure all services have package.json"
    echo "2. Add test scripts to package.json"
    echo "3. Use npm ci instead of npm install when package-lock.json exists"
    echo ""

    echo -e "${YELLOW}For security:${NC}"
    echo "1. Run 'npm audit' regularly"
    echo "2. Update dependencies with 'npm update'"
    echo "3. Use .nvmrc to specify Node.js version"
    echo ""
}

# Main execution
main() {
    echo "This script validates your CI setup to prevent common issues."
    echo ""

    # Check each service
    for service in "${SERVICES[@]}"; do
        if ! check_service "$service"; then
            ((ISSUES_FOUND++))
        fi
    done

    # Check workflows
    check_workflows

    # Check environment
    check_environment

    # Test cache simulation
    test_cache_simulation

    # Show summary
    echo -e "${BLUE}📊 Summary:${NC}"
    if [ $ISSUES_FOUND -eq 0 ]; then
        echo -e "${GREEN}✅ All checks passed! Your CI setup looks good.${NC}"
    else
        echo -e "${YELLOW}⚠️  Found $ISSUES_FOUND issues that may cause CI problems.${NC}"
    fi

    echo ""
    show_recommendations

    echo -e "${BLUE}🚀 Next steps:${NC}"
    echo "1. Fix any issues mentioned above"
    echo "2. Commit and push changes"
    echo "3. Check GitHub Actions for successful runs"
    echo "4. Monitor CI performance and adjust as needed"
}

# Run main function
main "$@"
