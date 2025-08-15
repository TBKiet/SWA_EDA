# 🚀 CI/CD Setup Guide

## Quick Setup for GitHub Repository

### 1. Repository Secrets Setup

Go to your GitHub repository → Settings → Secrets and variables → Actions, then add:

```bash
# DockerHub Credentials (for CD pipeline)
DOCKERHUB_USERNAME=your_dockerhub_username
DOCKERHUB_TOKEN=your_dockerhub_access_token

# Snyk Token (for security scanning)
SNYK_TOKEN=your_snyk_api_token
```

### 2. Environment Protection Rules

1. Go to Settings → Environments
2. Create `staging` environment
3. Create `production` environment with protection rules:
   - ✅ Required reviewers (add team members)
   - ✅ Wait timer: 5 minutes
   - ✅ Deployment branches: only `main`

### 3. Branch Protection

Settings → Branches → Add rule for `main`:
- ✅ Require status checks: `test`, `security-scan`
- ✅ Require pull request reviews
- ✅ Dismiss stale reviews
- ✅ Require linear history

## 🔄 Workflow Triggers

### CI Pipeline (`ci.yml`)
```yaml
# Triggers on:
- Push to main/develop
- Pull requests to main/develop
- Manual dispatch

# Runs:
- Tests for all microservices
- Docker builds
- Code quality checks
```

### CD Pipeline (`cd.yml`)
```yaml
# Triggers on:
- Push to main (after CI passes)
- Manual dispatch

# Deploys:
- Staging: Automatic
- Production: Manual approval required
```

### Security Pipeline (`security.yml`)
```yaml
# Triggers on:
- Push to main/develop
- Weekly schedule (Mondays 2 AM)
- Manual dispatch

# Scans:
- Dependency vulnerabilities
- Container security
- License compliance
```

## 🧪 Local Testing

### Test CI/CD Pipeline Locally
```bash
# Run full pipeline simulation
./scripts/test-cicd.sh

# Test individual service
cd user-service
npm test

# Build Docker image
docker build -t user-service:local .
```

### Prerequisites for Local Testing
```bash
# Required tools
docker --version          # Docker 20.10+
docker-compose --version  # Docker Compose 2.0+
node --version            # Node.js 18+
npm --version             # npm 8+

# Start infrastructure
docker-compose up -d postgres kafka zookeeper

# Stop infrastructure
docker-compose down
```

## 📊 Monitoring CI/CD

### GitHub Actions Dashboard
- View workflow runs: `Actions` tab
- Check logs: Click on workflow run → Job → Step
- Download artifacts: Workflow run → Artifacts section

### Status Badges
Add to your README.md:
```markdown
[![CI](https://github.com/TBKiet/SWA_EDA/workflows/CI%20Pipeline/badge.svg)](...)
[![CD](https://github.com/TBKiet/SWA_EDA/workflows/CD%20Pipeline/badge.svg)](...)
[![Security](https://github.com/TBKiet/SWA_EDA/workflows/Security%20&%20Quality/badge.svg)](...)
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Tests Failing in CI but Pass Locally
```bash
# Check environment variables
# Ensure Docker services are healthy
# Verify database connections
```

#### 2. Docker Build Failures
```bash
# Test locally first
docker build -t service-name:test .

# Check Dockerfile syntax
# Verify base image availability
```

#### 3. Security Scan Failures
```bash
# Update dependencies
npm audit fix

# Check Snyk dashboard
# Review vulnerability reports
```

#### 4. Deployment Failures
```bash
# Check service health endpoints
# Verify environment configurations
# Review deployment logs
```

### Debug Commands
```bash
# View running containers
docker ps

# Check container logs
docker logs container_name

# Inspect Docker image
docker inspect image_name

# Test service health
curl http://localhost:3001/health
```

## 🔒 Security Best Practices

### 1. Secrets Management
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate tokens regularly
- ✅ Use environment-specific secrets

### 2. Container Security
- ✅ Use official base images
- ✅ Regular security scans
- ✅ Minimal image layers

### 3. Access Control
- ✅ Principle of least privilege
- ✅ Review access regularly
- ✅ Enable 2FA for all accounts

## 📈 Performance Optimization

### Workflow Performance
- ✅ Use caching for dependencies
- ✅ Parallel job execution
- ✅ Matrix strategy for multiple services

### Docker Optimization
- ✅ Multi-stage builds
- ✅ Layer caching
- ✅ .dockerignore files

## 🚀 Next Steps

1. **Monitoring**: Set up application monitoring (Prometheus, Grafana)
2. **Alerting**: Configure Slack/email notifications for failures
3. **Testing**: Add integration and end-to-end tests
4. **Documentation**: Auto-generate API documentation
5. **Performance**: Add load testing to CI pipeline

## 📞 Support

For CI/CD issues:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Test locally using provided scripts
4. Contact DevOps team if issues persist
