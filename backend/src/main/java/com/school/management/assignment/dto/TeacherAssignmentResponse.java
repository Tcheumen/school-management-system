package com.school.management.assignment.dto;

public class TeacherAssignmentResponse {

    private Long id;

    private Long teacherId;
    private String teacherFullName;

    private Long subjectId;
    private String subjectName;

    private Long classroomId;
    private String classroomName;

    private Long academicYearId;
    private String academicYearName;

    public TeacherAssignmentResponse(
            Long id,
            Long teacherId,
            String teacherFullName,
            Long subjectId,
            String subjectName,
            Long classroomId,
            String classroomName,
            Long academicYearId,
            String academicYearName) {
        this.id = id;
        this.teacherId = teacherId;
        this.teacherFullName = teacherFullName;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.classroomId = classroomId;
        this.classroomName = classroomName;
        this.academicYearId = academicYearId;
        this.academicYearName = academicYearName;
    }

    public Long getId() {
        return id;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public String getTeacherFullName() {
        return teacherFullName;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getSubjectName() {
        return subjectName;
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