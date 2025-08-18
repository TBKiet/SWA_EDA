# PlantUML Diagrams for Event-Driven Architecture

## 1. Event Storage Architecture Diagram

```plantuml
@startuml EventStorageArchitecture
!define RECTANGLE class

title Event Storage Architecture

package "Gateway Layer" {
    [Gateway API] as gateway
}

package "Services Layer" {
    [User Service\n(PostgreSQL)] as userService
    [Event Service\n(PostgreSQL)] as eventService
    [Registration Service\n(PostgreSQL)] as regService
    [Notification Service\n(SMTP)] as notService
    [Audit Service\n(MongoDB)] as auditService
}

package "Kafka Cluster" {
    component "Event Topics" as topics {
        [user.created]
        [user.logged_in]
        [registration.created]
        [notification.sent]
        [audit.logged]
    }

    component "Partitioning Strategy" as partitions {
        [Partition by userId/eventId]
        [Replication Factor: 3]
        [Retention: 7 days]
    }
}

package "Event Store (MongoDB)" {
    component "Audit Log Collection" as auditLog {
        [Event sourcing capability]
        [Complete event history]
        [Event replay functionality]
        [Immutable event records]
    }
}

package "State Snapshots" {
    database "Service Databases" as databases {
        [Users (PostgreSQL)]
        [Events (PostgreSQL)]
        [Registrations (PostgreSQL)]
    }
}

' Connections
gateway --> topics : publish events
userService --> topics : publish events
eventService --> topics : publish events
regService --> topics : publish events
notService --> topics : publish events
auditService --> topics : publish events

topics --> auditLog : store events
auditService --> auditLog : write logs

userService --> databases
eventService --> databases
regService --> databases

@enduml
```

## 2. Logical Architecture Diagram

```plantuml
@startuml LogicalArchitecture
!define RECTANGLE class

title Logical Architecture - 4-Layer Design

package "Presentation Layer" {
    [Next.js Frontend] as frontend
}

package "Application Layer" {
    [Gateway API] as gateway
}

package "Domain Layer" {
    package "User Domain" {
        [User Services] as userServices
        [User Entities] as userEntities
        [User Repositories] as userRepos
    }

    package "Event Domain" {
        [Event Services] as eventServices
        [Event Entities] as eventEntities
        [Event Repositories] as eventRepos
    }

    package "Registration Domain" {
        [Registration Services] as regServices
        [Registration Entities] as regEntities
        [Registration Repositories] as regRepos
    }

    package "Notification Domain" {
        [Notification Services] as notServices
        [Notification Entities] as notEntities
        [Notification Repositories] as notRepos
    }
}

package "Infrastructure Layer" {
    database "PostgreSQL\n(Users)" as userDB
    database "PostgreSQL\n(Events)" as eventDB
    database "PostgreSQL\n(Registrations)" as regDB
    database "MongoDB\n(Audit Logs)" as auditDB

    component "Apache Kafka" as kafka {
        [user.created]
        [user.logged_in]
        [registration.created]
        [notification.sent]
        [event.updated]
        [audit.logged]
    }
}

' Connections
frontend --> gateway : REST API\nHTTP/JSON
gateway --> kafka : Event Publishing

userServices --> kafka : publish/consume
eventServices --> kafka : publish/consume
regServices --> kafka : publish/consume
notServices --> kafka : publish/consume

userRepos --> userDB
eventRepos --> eventDB
regRepos --> regDB
notRepos --> auditDB

@enduml
```

## 3. Process View - Event Flow

```plantuml
@startuml ProcessView
!define LIFELINE participant

title Process View - User Creation Flow

LIFELINE "Client Process" as client
LIFELINE "Gateway Process" as gateway
LIFELINE "User Service Process" as userService
LIFELINE "Kafka Cluster" as kafka
LIFELINE "Audit Log Process" as auditLog
LIFELINE "Notification Process" as notification
LIFELINE "Event Service Process" as eventService

client -> gateway : 1. POST /users
gateway -> userService : 2. Forward request
userService -> userService : 3. Validate Data
userService -> userService : 4. Save to DB
userService -> kafka : 5. Publish Event\n(user.created)
userService -> gateway : 6. Response
gateway -> client : 7. 201 Created

kafka -> auditLog : 8. Consume user.created
auditLog -> auditLog : 9. Log to MongoDB

kafka -> notification : 10. Consume user.created
notification -> notification : 11. Send Email
notification -> kafka : 12. Publish notification.sent

@enduml
```

## 4. Deployment Architecture

```plantuml
@startuml DeploymentArchitecture
!define NODE node
!define COMPONENT component

title Deployment Architecture

NODE "Production Cluster" {

    package "Load Balancer Tier" {
        NODE "Nginx Load Balancer" {
            COMPONENT [SSL Termination]
            COMPONENT [Health Checks]
        }

        NODE "API Gateway" {
            COMPONENT [Rate Limiting]
            COMPONENT [Authentication]
            COMPONENT [Routing]
        }

        NODE "Web Frontend" {
            COMPONENT [Next.js App]
            COMPONENT [Static Assets]
            COMPONENT [CDN]
        }
    }

    package "Microservices Tier" {
        NODE "User Service Cluster" {
            COMPONENT [Instance 1]
            COMPONENT [Instance 2]
        }

        NODE "Event Service Cluster" {
            COMPONENT [Instance 1]
            COMPONENT [Instance 2]
        }

        NODE "Registration Service Cluster" {
            COMPONENT [Instance 1]
            COMPONENT [Instance 2]
        }

        NODE "Notification Service Cluster" {
            COMPONENT [Instance 1]
            COMPONENT [Instance 2]
        }

        NODE "Audit Service Cluster" {
            COMPONENT [Instance 1]
        }

        NODE "Gateway Service Cluster" {
            COMPONENT [Instance 1]
        }
    }

    package "Message Broker Tier" {
        NODE "Kafka Broker 1" {
            COMPONENT [Partitions 1-3]
        }

        NODE "Kafka Broker 2" {
            COMPONENT [Partitions 1-3]
        }

        NODE "Kafka Broker 3" {
            COMPONENT [Partitions 1-3]
        }

        NODE "Zookeeper Cluster" {
            COMPONENT [Zookeeper 1]
            COMPONENT [Zookeeper 2]
            COMPONENT [Zookeeper 3]
        }
    }

    package "Data Tier" {
        NODE "PostgreSQL Cluster" {
            database "PostgreSQL Master" {
                COMPONENT [Users DB]
            }
            database "PostgreSQL Replica 1" {
                COMPONENT [Events DB]
            }
            database "PostgreSQL Replica 2" {
                COMPONENT [Registrations DB]
            }
        }

        NODE "MongoDB Cluster" {
            database "MongoDB Shard 1" {
                COMPONENT [Audit Logs]
            }
            database "MongoDB Shard 2" {
                COMPONENT [Event Store]
            }
            database "MongoDB Shard 3" {
                COMPONENT [Snapshots]
            }
        }
    }
}

@enduml
```

## 5. Event Sourcing Pattern

```plantuml
@startuml EventSourcingPattern
!define ENTITY class

title Event Sourcing Pattern

ENTITY "Command" as command {
    + commandId: String
    + aggregateId: String
    + commandType: String
    + payload: Object
    + timestamp: DateTime
}

ENTITY "Event Store" as eventStore {
    + aggregateId: String
    + eventType: String
    + eventData: Object
    + eventVersion: Number
    + timestamp: DateTime
    + metadata: Object
    --
    + append(event): void
    + getEvents(aggregateId): Event[]
    + getEvents(aggregateId, fromVersion): Event[]
}

ENTITY "Aggregate Root" as aggregate {
    + id: String
    + version: Number
    + uncommittedEvents: Event[]
    --
    + apply(event): void
    + getUncommittedEvents(): Event[]
    + markEventsAsCommitted(): void
    + fromHistory(events): Aggregate
}

ENTITY "Snapshot Store" as snapshotStore {
    + aggregateId: String
    + data: Object
    + version: Number
    + timestamp: DateTime
    --
    + save(snapshot): void
    + findLatest(aggregateId): Snapshot
}

ENTITY "Command Handler" as handler {
    --
    + handle(command): Result
    + validate(command): void
    + loadAggregate(id): Aggregate
    + saveAggregate(aggregate): void
}

ENTITY "Event Publisher" as publisher {
    --
    + publish(event): void
    + publishAll(events): void
}

' Relationships
command --> handler : processed by
handler --> aggregate : loads/saves
handler --> eventStore : reads/writes
aggregate --> eventStore : events stored
aggregate --> snapshotStore : snapshots saved
handler --> publisher : publishes events

@enduml
```

## 6. CQRS Pattern with Event Sourcing

```plantuml
@startuml CQRSPattern
!define COMPONENT component
!define DATABASE database

title CQRS Pattern with Event Sourcing

package "Command Side (Write)" {
    COMPONENT [Command Handler] as cmdHandler
    COMPONENT [Aggregate Root] as aggregate
    DATABASE "Event Store" as eventStore
    COMPONENT [Event Publisher] as publisher
}

package "Query Side (Read)" {
    COMPONENT [Query Handler] as queryHandler
    COMPONENT [Read Model] as readModel
    DATABASE "Read Database" as readDB
    COMPONENT [Projection Engine] as projection
}

package "Event Bus" {
    COMPONENT [Apache Kafka] as kafka
}

actor "Client" as client

' Command Flow
client --> cmdHandler : Commands
cmdHandler --> aggregate : Domain Logic
aggregate --> eventStore : Store Events
aggregate --> publisher : Publish Events
publisher --> kafka : Event Stream

' Query Flow
kafka --> projection : Event Stream
projection --> readModel : Update Projections
readModel --> readDB : Persist Views
client --> queryHandler : Queries
queryHandler --> readDB : Read Views

note right of eventStore : Source of Truth\nImmutable Events
note right of readDB : Optimized Views\nEventual Consistency

@enduml
```

## 7. Microservices Communication Pattern

```plantuml
@startuml MicroservicesCommunication
!define SERVICE component

title Event-Driven Microservices Communication

SERVICE "User Service" as userSvc
SERVICE "Registration Service" as regSvc
SERVICE "Event Service" as eventSvc
SERVICE "Notification Service" as notSvc
SERVICE "Audit Service" as auditSvc

cloud "Apache Kafka" as kafka {
    queue "user.created" as userCreated
    queue "user.logged_in" as userLogged
    queue "registration.created" as regCreated
    queue "event.updated" as eventUpdated
    queue "notification.sent" as notSent
    queue "audit.logged" as auditLogged
}

' Event Publishing
userSvc --> userCreated : Publish
userSvc --> userLogged : Publish
regSvc --> regCreated : Publish
eventSvc --> eventUpdated : Publish
notSvc --> notSent : Publish
auditSvc --> auditLogged : Publish

' Event Consumption
userCreated --> auditSvc : Subscribe
userLogged --> auditSvc : Subscribe
regCreated --> eventSvc : Subscribe
regCreated --> notSvc : Subscribe
regCreated --> auditSvc : Subscribe
eventUpdated --> auditSvc : Subscribe
notSent --> auditSvc : Subscribe

note bottom of kafka : Asynchronous Communication\nLoose Coupling\nScalable Event Streaming

@enduml
```

## 8. Quality Attributes Testing Strategy

```plantuml
@startuml QualityAttributesTesting
!define TESTING component

title Quality Attributes Testing Strategy

package "Scalability Testing" {
    TESTING [K6 Load Testing] as k6
    TESTING [JMeter Performance] as jmeter
    TESTING [Artillery Stress] as artillery
}

package "Availability Testing" {
    TESTING [Chaos Engineering] as chaos
    TESTING [Health Checks] as health
    TESTING [Circuit Breaker] as circuit
}

package "Reliability Testing" {
    TESTING [Message Durability] as durability
    TESTING [Idempotency Testing] as idempotency
    TESTING [Dead Letter Queue] as dlq
}

package "Performance Testing" {
    TESTING [Prometheus Metrics] as prometheus
    TESTING [Grafana Dashboard] as grafana
    TESTING [Latency Monitoring] as latency
}

package "System Under Test" {
    TESTING [EDA Microservices] as system
}

' Testing Connections
k6 --> system : Load Generation
jmeter --> system : Performance Testing
artillery --> system : Stress Testing

chaos --> system : Fault Injection
health --> system : Endpoint Monitoring
circuit --> system : Failure Detection

durability --> system : Message Verification
idempotency --> system : Duplicate Detection
dlq --> system : Error Handling

prometheus --> system : Metrics Collection
grafana --> system : Visualization
latency --> system : Response Time

@enduml
```

## 9. CI/CD Pipeline

```plantuml
@startuml CICDPipeline
!define STAGE rectangle

title CI/CD Pipeline for EDA Microservices

STAGE "Source Code" as source {
    [GitHub Repository]
    [Feature Branch]
    [Pull Request]
}

STAGE "CI Pipeline" as ci {
    [Code Quality Check]
    [Unit Tests]
    [Integration Tests]
    [Security Scan]
    [Docker Build]
}

STAGE "Artifact Registry" as registry {
    [Docker Images]
    [Helm Charts]
    [Configuration]
}

STAGE "CD Pipeline" as cd {
    [Staging Deploy]
    [Smoke Tests]
    [Manual Approval]
    [Production Deploy]
}

STAGE "Monitoring" as monitoring {
    [Prometheus]
    [Grafana]
    [ELK Stack]
    [Jaeger Tracing]
}

' Pipeline Flow
source --> ci : Trigger Build
ci --> registry : Push Artifacts
registry --> cd : Deploy Artifacts
cd --> monitoring : Health Monitoring

note right of ci : • Parallel Testing\n• Quality Gates\n• Fast Feedback
note right of cd : • Blue-Green Deploy\n• Rollback Strategy\n• Zero Downtime

@enduml
```

## How to Use These Diagrams

1. **Copy the PlantUML code** from each section
2. **Paste into PlantUML editor**:
   - Online: [PlantUML Server](http://www.plantuml.com/plantuml/uml/)
   - VS Code Extension: PlantUML
   - IntelliJ Plugin: PlantUML integration

3. **Generate diagrams** in various formats:
   - PNG for documentation
   - SVG for scalable graphics
   - PDF for presentations

4. **Customize as needed**:
   - Modify colors with `!define` directives
   - Add more details to components
   - Adjust layout with positioning

## Example Usage in VS Code:
```markdown
1. Install "PlantUML" extension
2. Create .puml files with the code above
3. Press Alt+D to preview
4. Export to PNG/SVG for documentation
```
