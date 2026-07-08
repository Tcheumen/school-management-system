package com.school.management.subject.dto;

import jakarta.validation.constraints.NotBlank;

public class SubjectRequest {

    @NotBlank(message = "Subject name is required")
    private String name;

    private String description;

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
}