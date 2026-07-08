package com.school.management.enrollment.dto;

public class EnrollmentResponse {

    private Long id;

    private Long studentId;
    private String studentFullName;

    private Long classroomId;
    private String classroomName;

    private Long academicYearId;
    private String academicYearName;

    public EnrollmentResponse(
            Long id,
            Long studentId,
            String studentFullName,
            Long classroomId,
            String classroomName,
            Long academicYearId,
            String academicYearName) {
        this.id = id;
        this.studentId = studentId;
        this.studentFullName = studentFullName;
        this.classroomId = classroomId;
        this.classroomName = classroomName;
        this.academicYearId = academicYearId;
        this.academicYearName = academicYearName;
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentFullName() {
        return studentFullName;
    }

    public Long getClassroomId() {
        return classroomId;
    }

    public String getClassroomName() {
        return classroomName;
    }

    public Long getAcademicYearId() {
        return academicYearId;
    }

    public String getAcademicYearName() {
        return academicYearName;
    }
}