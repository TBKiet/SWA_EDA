# 📊 UML Views - Event-Driven Architecture Demo

Tài liệu này tổng hợp tất cả các góc nhìn UML của hệ thống Event-Driven Architecture Demo, bao gồm 9 diagram chính thể hiện các khía cạnh khác nhau của kiến trúc.

## 📋 Tổng quan các View

| View | File | Mô tả | Mục đích |
|------|------|-------|----------|
| **System Process Flow** | `SYSTEM_PROCESS_FLOW.puml` | Sequence diagram chi tiết | Luồng tương tác giữa các service |
| **System Architecture** | `SYSTEM_ARCHITECTURE.puml` | Component diagram tổng thể | Kiến trúc hệ thống và kết nối |
| **Event Flow** | `EVENT_FLOW_DIAGRAM.puml` | Activity diagram | Luồng sự kiện và consumer groups |
| **Storage View** | `STORAGE_VIEW.puml` | Database diagram | Cấu trúc database và schema |
| **Data Flow & Storage** | `DATA_FLOW_STORAGE.puml` | Pattern diagram | Patterns lưu trữ và data flow |
| **Logical View** | `LOGICAL_VIEW.puml` | Logical architecture | Kiến trúc logic và domain |
| **Logical Interfaces** | `LOGICAL_INTERFACES.puml` | Interface diagram | Service contracts và interfaces |
| **Deployment View** | `DEPLOYMENT_VIEW.puml` | Deployment diagram | Container deployment hiện tại |
| **Deployment Topology** | `DEPLOYMENT_TOPOLOGY.puml` | Production topology | Kiến trúc production và scaling |

---

## 🔄 System Process Flow

**File**: `SYSTEM_PROCESS_FLOW.puml`

### Mô tả
Sequence diagram chi tiết thể hiện luồng tương tác giữa các service trong 3 kịch bản chính:
- **User Registration Flow**: Đăng ký user → user.created → audit
- **User Login Flow**: Đăng nhập → user.logged_in → audit  
- **Event Registration Flow**: Đăng ký sự kiện → registration.created → event update + email + audit

### Điểm nổi bật
- Thể hiện rõ Event-Driven pattern với Kafka
- Hiển thị Event Notification pattern (consumer tra cứu dữ liệu)
- Audit logging toàn diện cho mọi hành vi
- Error handling với audit.failed, notification.failed

---

## 🏗️ System Architecture

**File**: `SYSTEM_ARCHITECTURE.puml`

### Mô tả
Component diagram tổng thể thể hiện kiến trúc hệ thống với các layer:
- **Frontend Layer**: Next.js
- **API Gateway Layer**: Fastify
- **Microservices Layer**: 5 services (User, Event, Registration, Notification, Auditlog)
- **Message Broker**: Kafka + Zookeeper
- **External Services**: SMTP
- **Monitoring**: Kafka UI

### Điểm nổi bật
- Loose coupling giữa các service
- Event-driven communication qua Kafka
- Polyglot persistence (PostgreSQL + MongoDB)
- External service integration

---

## 🔄 Event Flow

**File**: `EVENT_FLOW_DIAGRAM.puml`

### Mô tả
Activity diagram thể hiện luồng sự kiện và consumer groups:
- **User Registration**: user.created → audit-user-created, notification-group
- **User Login**: user.logged_in → audit-user-logged
- **Event Registration**: registration.created → event-group, notification-group, audit-registration-created

### Consumer Groups
- `audit-user-created`, `audit-user-logged`, `audit-registration-created`
- `audit-event-updated`, `audit-email-sent`, `audit-audit-logged`
- `notification-group`, `event-group`

---

## 🗄️ Storage View

**File**: `STORAGE_VIEW.puml`

### Mô tả
Database diagram thể hiện cấu trúc lưu trữ:

#### PostgreSQL Databases
- **User Database (userdb)**: Bảng `users` (id, username, email, password hashed)
- **Event Database (eventdb)**: Bảng `events` (UUID, name, description, capacity, registered)
- **Registration Database (registrationdb)**: Bảng `registrations` (eventId, userId, userEmail)

#### MongoDB Database
- **Audit Database (auditdb)**: Collection `auditlogs` (eventType, data, createdAt)

#### Kafka Topics
- `user.created`, `user.logged_in`, `registration.created`
- `event.updated`, `notification.sent`, `audit.logged`, `audit.failed`

### Đặc điểm
- Database per service pattern
- No foreign key constraints (loose coupling)
- Flexible schema cho audit logs
- Event store với immutable events

---

## 📊 Data Flow & Storage Patterns

**File**: `DATA_FLOW_STORAGE.puml`

### Mô tả
Pattern diagram thể hiện các patterns lưu trữ và data flow:

#### Data Flow Patterns
- **Event Notification Pattern**: Consumer tra cứu dữ liệu từ service khác
- **CQRS-like Pattern**: Tách biệt read/write operations
- **Audit Pattern**: Self-audit với MongoDB

#### Storage Strategies
- **PostgreSQL**: ACID transactions, constraints, normalization
- **MongoDB**: Flexible schema, JSON documents
- **Kafka**: Immutable events, partitioning

#### Data Consistency Patterns
- **Eventual Consistency**: Services eventually sync
- **Saga Pattern**: Distributed transaction coordination

---

## 🧠 Logical View

**File**: `LOGICAL_VIEW.puml`

### Mô tả
Logical architecture diagram thể hiện các layer logic:

#### Presentation Layer
- Next.js Frontend (React components, API integration)

#### API Gateway Layer
- Fastify Gateway (request routing, event publishing)

#### Business Logic Layer
- **User Management Domain**: Registration, authentication
- **Event Management Domain**: CRUD, capacity tracking
- **Registration Domain**: User-event linking
- **Notification Domain**: Email sending
- **Audit Domain**: Event logging

#### Message Broker Layer
- Kafka với event topics management

#### Data Access Layer
- Repositories cho PostgreSQL, MongoDB, Event Store

### Đặc điểm
- Domain-Driven Design với bounded contexts
- Interface segregation
- Event-driven communication
- Separation of concerns

---

## 🔌 Logical Interfaces

**File**: `LOGICAL_INTERFACES.puml`

### Mô tả
Interface diagram thể hiện service contracts và data models:

#### Service Interfaces
- **UserServiceInterface**: registerUser, loginUser, getUserById
- **EventServiceInterface**: getEvents, createEvent, updateEvent
- **RegistrationServiceInterface**: createRegistration, getRegistrations
- **NotificationServiceInterface**: sendEmail, sendNotification
- **AuditServiceInterface**: logEvent, getAuditLogs

#### Event Contracts
- **UserEvents**: user.created, user.logged_in, user.updated
- **EventEvents**: event.created, event.updated, event.deleted
- **RegistrationEvents**: registration.created, registration.cancelled
- **NotificationEvents**: notification.sent, notification.failed
- **AuditEvents**: audit.logged, audit.failed

#### Data Contracts
- **User**: id, username, email, password, phone, deviceToken
- **Event**: id, name, description, date, location, capacity, registered
- **Registration**: id, eventId, userId, userEmail
- **AuditLog**: _id, eventType, data, createdAt

---

## 🚀 Deployment View

**File**: `DEPLOYMENT_VIEW.puml`

### Mô tả
Deployment diagram thể hiện cấu trúc container hiện tại:

#### Container Structure
- **Frontend Container**: Next.js (port 3000)
- **API Gateway Container**: Fastify (port 3007)
- **Microservices Containers**: 5 services với ports riêng (3001-3006)
- **Database Containers**: PostgreSQL (5432), MongoDB (27017)
- **Message Broker Containers**: Zookeeper, Kafka (9092), Kafka UI (8080)

#### Infrastructure
- **Docker Network**: eventflow-network (bridge)
- **Docker Volumes**: postgres-data, mongo-data
- **Health Checks**: pg_isready, mongosh ping, kafka-topics
- **Dependencies**: Services wait for databases and Kafka

### Đặc điểm
- Containerization với Docker
- Service discovery qua container names
- Health monitoring
- Volume persistence
- Environment-based configuration

---

## 🌐 Deployment Topology

**File**: `DEPLOYMENT_TOPOLOGY.puml`

### Mô tả
Production topology diagram thể hiện kiến trúc production và scaling:

#### Development vs Production
- **Development**: Single host với Docker Compose
- **Production**: Distributed architecture với clustering

#### Production Architecture
- **Load Balancer**: Nginx/HAProxy với SSL termination
- **Application Tier**: Clusters cho frontend, gateway, microservices
- **Data Tier**: Database clusters với read replicas
- **Message Broker Tier**: Kafka cluster (3 brokers), Zookeeper ensemble
- **Monitoring & Observability**: Prometheus, Grafana, Jaeger, ELK

#### Scaling Strategies
- **Horizontal Scaling**: Multiple instances per service
- **Database Scaling**: Read replicas, connection pooling
- **Kafka Scaling**: Multi-broker cluster, topic partitioning
- **Auto-scaling**: Based on load and metrics

### Production Considerations
- High availability
- Disaster recovery
- Security (TLS, secrets management)
- Performance monitoring
- Cost optimization

---

## 📈 Tổng kết

### Kiến trúc chính
- **Event-Driven Architecture** với Kafka làm message broker
- **Microservices** với loose coupling
- **Domain-Driven Design** với bounded contexts
- **Polyglot Persistence** (PostgreSQL + MongoDB)

### Patterns áp dụng
- **Event Notification**: Consumer tra cứu dữ liệu khi cần
- **CQRS-like**: Tách biệt read/write operations
- **Saga Pattern**: Distributed transaction coordination
- **Database per Service**: Mỗi service có database riêng

### Deployment Strategy
- **Development**: Docker Compose trên single host
- **Production**: Distributed, scalable architecture
- **Containerization**: Docker cho tất cả services
- **Monitoring**: Comprehensive observability stack

### Công nghệ sử dụng
- **Backend**: Node.js, Fastify, Sequelize, Mongoose
- **Frontend**: Next.js, React
- **Message Broker**: Apache Kafka, Zookeeper
- **Databases**: PostgreSQL, MongoDB
- **Infrastructure**: Docker, Docker Compose
- **Monitoring**: Kafka UI, Prometheus, Grafana

---

## 🎯 Sử dụng

1. **Development**: Sử dụng `DEPLOYMENT_VIEW.puml` để hiểu cấu trúc hiện tại
2. **Architecture Review**: Sử dụng `LOGICAL_VIEW.puml` và `SYSTEM_ARCHITECTURE.puml`
3. **Process Understanding**: Sử dụng `SYSTEM_PROCESS_FLOW.puml` và `EVENT_FLOW_DIAGRAM.puml`
4. **Data Design**: Sử dụng `STORAGE_VIEW.puml` và `DATA_FLOW_STORAGE.puml`
5. **Production Planning**: Sử dụng `DEPLOYMENT_TOPOLOGY.puml`
6. **Interface Design**: Sử dụng `LOGICAL_INTERFACES.puml`

Tất cả diagram có thể được render bằng PlantUML để tạo hình ảnh hoặc sử dụng trong documentation.
