package com.school.management.enrollment.dto;

import jakarta.validation.constraints.NotNull;

public class EnrollmentRequest {

    @NotNull(message = "Student id is required")
    private Long studentId;

    @NotNull(message = "Classroom id is required")
    private Long classroomId;

    @NotNull(message = "Academic year id is required")
    private Long academicYearId;

    public Long getStudentId() {
        return studentId;
    }

    public Long getClassroomId() {
        return classroomId;
    }

    public Long getAcademicYearId() {
        return academicYearId;
    }
}