package com.school.management.grade.dto;

public class GradeResponse {

    private Long id;

    private Long enrollmentId;

    private Long studentId;
    private String studentFullName;

    private Long teacherAssignmentId;

    private Long teacherId;
    private String teacherFullName;

    private Long subjectId;
    private String subjectName;

    private Long classroomId;
    private String classroomName;

    private Long academicYearId;
    private String academicYearName;

    private Double value;
    private String term;
    private String remarks;

    public GradeResponse(
            Long id,
            Long enrollmentId,
            Long studentId,
            String studentFullName,
            Long teacherAssignmentId,
            Long teacherId,
            String teacherFullName,
            Long subjectId,
            String subjectName,
            Long classroomId,
            String classroomName,
            Long academicYearId,
            String academicYearName,
            Double value,
            String term,
            String remarks) {
        this.id = id;
        this.enrollmentId = enrollmentId;
        this.studentId = studentId;
        this.studentFullName = studentFullName;
        this.teacherAssignmentId = teacherAssignmentId;
        this.teacherId = teacherId;
        this.teacherFullName = teacherFullName;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.classroomId = classroomId;
        this.classroomName = classroomName;
        this.academicYearId = academicYearId;
        this.academicYearName = academicYearName;
        this.value = value;
        this.term = term;
        this.remarks = remarks;
    }

    public Long getId() {
        return id;
    }

    public Long getEnrollmentId() {
        return enrollmentId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentFullName() {
        return studentFullName;
    }

    public Long getTeacherAssignmentId() {
        return teacherAssignmentId;
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