package com.school.management.classroom;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ClassroomRequest {

    @NotBlank(message = "Classroom name is required")
    private String name;

    @NotBlank(message = "Level is required")
    private String level;

    @NotNull(message = "Academic year is required")
    private Long academicYearId;

    public String getName() {
        return name;
    }

    public String getLevel() {
        return level;
    }

    public Long getAcademicYearId() {
        return academicYearId;
    }
}