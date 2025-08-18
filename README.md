# 📘 EDA-Demo – Event-Driven Architecture Microservices

[![Simple CI Pipeline](https://github.com/TBKiet/SWA_EDA/workflows/Simple%20CI%20Pipeline/badge.svg)](https://github.com/TBKiet/SWA_EDA/actions/workflows/ci.yml)
[![Simple CD Pipeline](https://github.com/TBKiet/SWA_EDA/workflows/Simple%20CD%20Pipeline/badge.svg)](https://github.com/TBKiet/SWA_EDA/actions/workflows/cd.yml)
[![Simple Security](https://github.com/TBKiet/SWA_EDA/workflows/Simple%20Security/badge.svg)](https://github.com/TBKiet/SWA_EDA/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?logo=docker)](https://hub.docker.com)
[![Kafka](https://img.shields.io/badge/Kafka-Event%20Streaming-orange?logo=apache-kafka)](https://kafka.apache.org)

🚀 **Hệ thống EDA-Demo** là một ví dụ thực tế về kiến trúc **Event-Driven Microservices** với **CI/CD pipeline hoàn chỉnh**.

**Tech Stack:**
- 🏗️ **Architecture**: Event-Driven Microservices
- 📡 **Message Broker**: Apache Kafka
- ⚡ **Backend**: Fastify (Node.js)
- 🎨 **Frontend**: Next.js + TypeScript
- 🐳 **Containerization**: Docker + Docker Compose
- 🔄 **CI/CD**: GitHub Actions + DockerHub
- 💾 **Databases**: PostgreSQL + MongoDB


## ⚙️ Yêu Cầu Hệ Thống

- Docker & Docker Compose
- Node.js 18+ (nếu phát triển frontend)
- Port mặc định:
  - `3000`: Gateway & Frontend
  - `8080`: Kafka UI

---

## 🚀 Cách Chạy Nhanh Toàn Bộ Hệ Thống

### 1. Clone và cấu hình

```bash
git clone https://github.com/TBKiet/SWA_EDA.git
cd SWA_EDA
```

Update **.env** in **notification-service** to receive email notification success:

```env
DEFAULT_NOTIFICATION_EMAIL=<your_email>
```

### 2. Khởi động bằng Docker Compose

```bash
docker-compose up --build
```

> 🔁 Hệ thống sẽ tự build và khởi động tất cả các service:
>
> - user-service, registration-service, event-service
> - notification-service, auditlog-service, gateway
> - kafka, postgres, mongo, kafka-ui
>
> - Đợi thêm khoảng 10-20s để chắc chắn quá trình khởi động hoàn tất.



### 3. Chạy Frontend (Next.js)

Nếu bạn chạy frontend độc lập để phát triển UI:

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

> Frontend sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

### 4. Truy cập hệ thống

- Frontend & API Gateway: [http://localhost:3000](http://localhost:3000)
- Kafka UI: [http://localhost:8080](http://localhost:8080)

---

## ✅ Các Service Chính

| Service                | Vai trò chính                              |
| ---------------------- | ------------------------------------------ |
| `gateway`              | Nhận request từ frontend, định tuyến API   |
| `user-service`         | Đăng ký, đăng nhập, phát event Kafka       |
| `registration-service` | Xử lý đăng ký tham gia sự kiện             |
| `event-service`        | Quản lý dữ liệu sự kiện, cập nhật số lượng |
| `notification-service` | Gửi email khi đăng ký thành công           |
| `auditlog-service`     | Lưu toàn bộ sự kiện vào MongoDB            |

---

## 🧪 Kiểm Tra Kafka UI

Truy cập [http://localhost:8080](http://localhost:8080) để theo dõi:

- Các topic đang được emit: `USER_CREATED`, `REGISTRATION_CREATED`, `EMAIL_SENT`...
- Nội dung message (JSON)
- Tình trạng các consumer groups

---

## 🧹 Dọn Dẹp

```bash
docker-compose down -v
```

---

## � Tài Liệu Chi Tiết

- 📖 **CI/CD Learning Guide**: [SIMPLE_CICD.md](./SIMPLE_CICD.md)
- 🐳 **DockerHub Setup**: [docs/DOCKERHUB_SETUP.md](./docs/DOCKERHUB_SETUP.md)
- 🏗️ **Architecture & Event Flow**: [demo.md](./demo.md)
- 📊 **API Documentation**: Coming soon...

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

---
## 🚀 CI/CD Pipeline

Dự án sử dụng GitHub Actions với 3 workflows đơn giản và hiệu quả:

### 🔄 CI Pipeline - Kiểm tra Code Quality

**Trigger**: Push code lên branch `main`

**3 Jobs chạy song song:**

- 📁 **Code Check**: Kiểm tra cấu trúc project
- 🧪 **Test User Service**: Chạy tests với PostgreSQL database
- 🐳 **Build Check**: Kiểm tra Dockerfile và mô phỏng build

### 📦 CD Pipeline - Deploy lên DockerHub & Production

**Smart Deployment Strategy:**

- 🔍 **Auto-detect DockerHub**: Tự động kiểm tra credentials
- 🐳 **Build & Push**: Docker images cho user-service và gateway
- 🧪 **Deploy Staging**: Tự động deploy lên staging environment
- 🎯 **Deploy Production**: Manual approval required

#### 🐳 DockerHub Integration

**✅ With DockerHub Setup** (Recommended):
```bash
✅ Images pushed to: your-username/user-service:latest
✅ Multi-platform builds (amd64 + arm64)
✅ Production deployment enabled
🌐 Registry: https://hub.docker.com/u/your-username
```

**⚠️ Without DockerHub Setup**:
```bash
⚠️ Images built locally only
⚠️ Production deployment disabled
📝 Setup guide: docs/DOCKERHUB_SETUP.md
```

> ⚡ **Quick Setup**: [5-Minute DockerHub Setup Guide](./docs/DOCKERHUB_SETUP.md)

### �️ Security Pipeline - Weekly Scans

- 🔍 **Dependency Vulnerabilities**: npm audit
- 📁 **Sensitive Files**: .env, .key detection
- 📊 **Security Summary**: Comprehensive reports

## 📊 Pipeline Status Matrix

| Stage | Without DockerHub | With DockerHub |
|-------|------------------|----------------|
| 🧪 CI Tests | ✅ Always runs | ✅ Always runs |
| 🐳 Docker Build | ✅ Local only | ✅ + Push to registry |
| 🧪 Staging Deploy | ✅ Local images | ✅ DockerHub images |
| 🎯 Production Deploy | ❌ Disabled | ✅ Manual approval |

## 📊 Monitoring & Observability

| Service | Health Endpoint | Metrics | Logs |
|---------|---------------|---------|------|
| Gateway | `/health` | Prometheus | JSON structured |
| User Service | `/health` | Custom metrics | Kafka events |
| Event Service | `/health` | Event throughput | Audit logs |
| Registration Service | `/health` | Registration stats | Error tracking |

---