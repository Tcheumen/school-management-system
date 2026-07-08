package com.school.management.classroom;

public class ClassroomResponse {

    private Long id;
    private String name;
    private String level;

    private Long academicYearId;
    private String academicYearName;

    public ClassroomResponse(
            Long id,
            String name,
            String level,
            Long academicYearId,
            String academicYearName) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.academicYearId = academicYearId;
        this.academicYearName = academicYearName;
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

    public Long getAcademicYearId() {
        return academicYearId;
    }

    public String getAcademicYearName() {
        return academicYearName;
    }
}