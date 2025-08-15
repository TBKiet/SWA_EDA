# 🚀 Simple CI/CD Learning Guide

## 📖 Quy Trình CI/CD Đơn Giản

### 🔄 CI (Continuous Integration) - Tích hợp liên tục
**Trigger**: Khi push code lên branch `main`

**3 Jobs chạy song song:**

1. **📁 Code Check**
   - Kiểm tra cấu trúc project
   - Đảm bảo code được checkout đúng

2. **🧪 Test User Service**
   - Khởi động PostgreSQL database
   - Cài đặt dependencies
   - Chạy test cho user-service
   - Mục tiêu: Đảm bảo code hoạt động

3. **🐳 Build Check**
   - Kiểm tra Dockerfile có tồn tại không
   - Mô phỏng việc build Docker image
   - Test cho user-service và gateway

### 📦 CD (Continuous Deployment) - Triển khai liên tục
**Trigger**: Sau khi CI pass, tự động chạy

**3 Bước tuần tự:**

1. **🚀 Prepare Deploy**
   - Chuẩn bị deployment
   - Liệt kê services cần deploy

2. **🧪 Deploy to Staging**
   - Mô phỏng build Docker images
   - Deploy lên môi trường staging
   - URL: https://staging.your-app.com

3. **🎯 Deploy to Production** (Manual Approval)
   - Yêu cầu approval manual
   - Deploy lên production
   - URL: https://your-app.com

### 🛡️ Security Check
**Trigger**: Push code hoặc hàng tuần

- Scan dependencies cho lỗ hổng bảo mật
- Kiểm tra files nhạy cảm (.env, .key)
- Báo cáo tổng quan security

## 🎯 Cách Xem CI/CD Hoạt Động

### 1. Xem Workflows
```
GitHub Repository → Actions tab → Workflows
```

### 2. Theo Dõi Jobs
- **Simple CI**: 3 jobs (code-check, test-user-service, build-check)
- **Simple CD**: 3 jobs tuần tự (prepare → staging → production)
- **Simple Security**: 1 job (security scan)

### 3. Logs Chi Tiết
Click vào từng job → từng step để xem logs

## ✅ Expected Results

### ✅ CI Success
```
✅ code-check: Project structure OK
✅ test-user-service: Tests passed
✅ build-check: Build simulation OK
```

### ✅ CD Success
```
✅ prepare-deploy: Preparation complete
✅ deploy-staging: Deployed to staging
⏳ deploy-production: Waiting for approval
```

### ✅ Security Success
```
✅ security-scan: Dependencies scanned
✅ No sensitive files found
```

## 🔧 Setup Production Environment

Để enable production deployment:

1. **GitHub Settings** → **Environments**
2. **Create environment**: `production`
3. **Add protection rules**:
   - ✅ Required reviewers
   - ✅ Wait timer: 5 minutes

## 🚀 Test CI/CD

### Cách 1: Push Code
```bash
git add .
git commit -m "test ci/cd"
git push origin main
```

### Cách 2: Manual Trigger
1. GitHub → Actions
2. Select "Simple CD"
3. Click "Run workflow"

## 📊 Understanding the Flow

```
Code Push → CI (Test & Build) → CD (Deploy) → Production
     ↓           ↓                  ↓            ↓
  GitHub    GitHub Actions    Staging Env   Production Env
```

## 🎓 Key Learning Points

1. **CI đảm bảo code quality** trước khi deploy
2. **CD tự động deploy** code đã test
3. **Staging environment** để test trước production
4. **Manual approval** cho production deploy
5. **Security scans** để đảm bảo an toàn

## 🔍 Troubleshooting

### CI Fails?
- Check logs trong GitHub Actions
- Thường do test fail hoặc dependency issues

### CD Stuck?
- Production deploy cần manual approval
- Check environment protection rules

### Security Issues?
- Ignore dev dependencies vulnerabilities
- Focus on production security

## 📝 Next Steps

1. ✅ Observe workflows running
2. ✅ Test manual CD trigger
3. ✅ Setup production environment
4. ✅ Try making code changes
5. ✅ Watch the full CI/CD cycle

**🎉 Bây giờ bạn đã hiểu quy trình CI/CD cơ bản!**
