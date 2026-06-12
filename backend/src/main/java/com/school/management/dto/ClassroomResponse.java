package com.school.management.dto;

public class ClassroomResponse {

    private Long id;
    private String name;
    private String level;
    private String academicYear;

    public ClassroomResponse(Long id, String name, String level, String academicYear) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.academicYear = academicYear;
    }

    public Long getId() {
        return id;
    }

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