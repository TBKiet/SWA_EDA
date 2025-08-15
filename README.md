# 📘 EDA-Demo – Event-Driven Architecture Microservices

[![CI Pipeline](https://github.com/TBKiet/SWA_EDA/workflows/CI%20Pipeline/badge.svg)](https://github.com/TBKiet/SWA_EDA/actions/workflows/ci.yml)
[![CD Pipeline](https://github.com/TBKiet/SWA_EDA/workflows/CD%20Pipeline/badge.svg)](https://github.com/TBKiet/SWA_EDA/actions/workflows/cd.yml)
[![Security & Quality](https://github.com/TBKiet/SWA_EDA/workflows/Security%20&%20Quality/badge.svg)](https://github.com/TBKiet/SWA_EDA/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Hệ thống EDA-Demo là một ví dụ áp dụng kiến trúc **Event-Driven Microservices** sử dụng **Kafka** làm message broker và **Fastify** làm framework backend. Các thành phần backend giao tiếp thông qua Kafka, frontend sử dụng **Next.js**.

## 🚀 CI/CD Pipeline

Dự án sử dụng GitHub Actions với 3 workflows chính:

### 🔄 CI Pipeline (`ci.yml`)
- **Trigger**: Push/PR to main/develop branches
- **Services Tested**: user-service, event-service, registration-service, notification-service, auditlog-service, gateway
- **Infrastructure**: PostgreSQL, Kafka, Zookeeper containers
- **Steps**: Test → Lint → Build Docker images
- **Matrix Strategy**: Parallel testing across all microservices

### 📦 CD Pipeline (`cd.yml`)
- **Trigger**: Push to main branch, manual workflow dispatch
- **Build & Push**: Docker images to DockerHub with SHA tags
- **Environments**: 
  - 🧪 **Staging**: Automatic deployment
  - 🎯 **Production**: Manual approval required
- **Zero-downtime**: Deployment strategy with health checks

### 🔒 Security & Quality (`security.yml`)
- **Vulnerability Scanning**: npm audit, Snyk, Trivy
- **Code Quality**: ESLint, Prettier, dependency checks
- **License Compliance**: Automated license verification
- **Schedule**: Weekly security scans

## 📊 Monitoring & Observability

| Service | Health Endpoint | Metrics | Logs |
|---------|---------------|---------|------|
| Gateway | `/health` | Prometheus | JSON structured |
| User Service | `/health` | Custom metrics | Kafka events |
| Event Service | `/health` | Event throughput | Audit logs |
| Registration Service | `/health` | Registration stats | Error tracking |

---

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
git clone <repo>
cd <repo>
```

Update **.env** in **notification-service** to receive email notification success
```
DEFAULT_NOTIFICATION_EMAIL=<your_email>
```

### 2. Khởi động bằng Docker Compose

```bash
docker-compose up --build
```

> 🔁 Hệ thống sẽ tự build và khởi động tất cả các service:
>
> - user-service
> - registration-service
> - event-service
> - notification-service
> - auditlog-service
> - gateway
> - kafka, postgres, mongo, kafka-ui
- Đợi thêm khoảng 10-20s để chắc chắn quá trình khởi động hoàn tất.



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

> 📌 Tài liệu chi tiết về kiến trúc, flow sự kiện và hướng dẫn thao tác UI nằm trong `demo.md` hoặc file riêng nếu cần trình bày.
