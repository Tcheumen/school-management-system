# Architecture

## Frontend

Technology:
- Angular

Responsibilities:
- User interface
- API communication
- Authentication handling
- Dashboards

---

## Backend

Technology:
- Spring Boot

Architecture:
- Controller Layer
- Service Layer
- Repository Layer
- Entity Layer

---

## Database

Technology:
- PostgreSQL

ORM:
- Hibernate / JPA

---

# Request Flow

Client Request
↓
Controller
↓
Service
↓
Repository
↓
PostgreSQL

---

# Backend Packages

```txt
controller/
service/
repository/
entity/
dto/
config/