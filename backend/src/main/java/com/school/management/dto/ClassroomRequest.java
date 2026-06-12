package com.school.management.dto;

import jakarta.validation.constraints.NotBlank;

public class ClassroomRequest {

    @NotBlank(message = "Classroom name is required")
    private String name;

    @NotBlank(message = "Level is required")
    private String level;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    public String getName() {
        return name;
    }

    public String getLevel() {
        return level;
    }

    public String getAcademicYear() {
        return academicYear;
    }
}