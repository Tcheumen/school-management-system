package com.school.management.grade.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GradeRequest {

    @NotNull(message = "Enrollment id is required")
    private Long enrollmentId;

    @NotNull(message = "Teacher assignment id is required")
    private Long teacherAssignmentId;

    @NotNull(message = "Grade value is required")
    @DecimalMin(value = "0.0", message = "Grade must be at least 0")
    @DecimalMax(value = "20.0", message = "Grade must be at most 20")
    private Double value;

    @NotBlank(message = "Term is required")
    private String term;

    private String remarks;

    public Long getEnrollmentId() {
        return enrollmentId;
    }

    public Long getTeacherAssignmentId() {
        return teacherAssignmentId;
    }

    public Double getValue() {
        return value;
    }

    public String getTerm() {
        return term;
    }

    public String getRemarks() {
        return remarks;
    }
}