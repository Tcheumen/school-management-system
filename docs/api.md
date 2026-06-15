# School Management System API Documentation

## Base URL

```txt
http://localhost:8080
```

---

# Authentication

The API uses JWT (JSON Web Token) authentication.

After a successful login, the backend returns a JWT token.

Example:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

Protected endpoints require the following header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Roles

The application supports three roles:

| Role | Description |
|--------|------------|
| ADMIN | Full system access |
| TEACHER | Attendance and grade management |
| STUDENT | Future student portal access |

---

# Authentication API

## Register

```http
POST /api/auth/register
```

### Access

Public

### Request

```json
{
  "fullName": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "ADMIN"
}
```

---

## Login

```http
POST /api/auth/login
```

### Access

Public

### Request

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

---

## Current User

```http
GET /api/auth/me
```

### Access

Authenticated Users

---

# Students API

Base Endpoint:

```txt
/api/students
```

### Access

ADMIN only

### Available Operations

```http
GET    /api/students
GET    /api/students/{id}
POST   /api/students
PUT    /api/students/{id}
DELETE /api/students/{id}
```

---

# Teachers API

Base Endpoint:

```txt
/api/teachers
```

### Access

ADMIN only

### Available Operations

```http
GET    /api/teachers
GET    /api/teachers/{id}
POST   /api/teachers
PUT    /api/teachers/{id}
DELETE /api/teachers/{id}
```

---

# Subjects API

Base Endpoint:

```txt
/api/subjects
```

### Access

ADMIN only

### Available Operations

```http
GET    /api/subjects
GET    /api/subjects/{id}
POST   /api/subjects
PUT    /api/subjects/{id}
DELETE /api/subjects/{id}
```

---

# Classrooms API

Base Endpoint:

```txt
/api/classrooms
```

### Access

ADMIN only

### Available Operations

```http
GET    /api/classrooms
GET    /api/classrooms/{id}
POST   /api/classrooms
PUT    /api/classrooms/{id}
DELETE /api/classrooms/{id}
```

---

# Attendance API

Base Endpoint:

```txt
/api/attendances
```

### Access

ADMIN, TEACHER

### Available Operations

```http
GET    /api/attendances
GET    /api/attendances/{id}
POST   /api/attendances
PUT    /api/attendances/{id}
DELETE /api/attendances/{id}
```

### Attendance Status

```txt
PRESENT
ABSENT
LATE
```

---

# Grades API

Base Endpoint:

```txt
/api/grades
```

### Access

ADMIN, TEACHER

### Available Operations

```http
GET    /api/grades
GET    /api/grades/{id}
POST   /api/grades
PUT    /api/grades/{id}
DELETE /api/grades/{id}
```

---

# Validation

The API validates incoming requests using Jakarta Validation.

Examples:

```java
@NotBlank
@NotNull
@Email
@DecimalMin
@DecimalMax
```

Invalid requests return:

```http
400 Bad Request
```

---

# Error Handling

The API uses global exception handling.

Examples:

```txt
StudentNotFoundException
TeacherNotFoundException
SubjectNotFoundException
ClassroomNotFoundException
AttendanceNotFoundException
GradeNotFoundException
```

Example Response:

```json
{
  "timestamp": "2026-06-15T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Student not found with id: 999"
}
```

---

# Technology Stack

## Backend

- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate

## Database

- PostgreSQL

## Build Tool

- Maven

---

# Current Project Status

## Completed

- Authentication & Authorization
- Student Management
- Teacher Management
- Subject Management
- Classroom Management
- Attendance Management
- Grade Management

## Next Phase

- Angular Frontend
- Admin Dashboard
- Teacher Dashboard
- Student Dashboard
- Deployment