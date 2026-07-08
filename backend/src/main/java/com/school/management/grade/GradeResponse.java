package com.school.management.grade;

public class GradeResponse {

    private Long id;
    private Double value;
    private String term;
    private String remarks;

    private Long studentId;
    private String studentFullName;

    private Long subjectId;
    private String subjectName;

    private Long classroomId;
    private String classroomName;

    public GradeResponse(
            Long id,
            Double value,
            String term,
            String remarks,
            Long studentId,
            String studentFullName,
            Long subjectId,
            String subjectName,
            Long classroomId,
            String classroomName) {
        this.id = id;
        this.value = value;
        this.term = term;
        this.remarks = remarks;
        this.studentId = studentId;
        this.studentFullName = studentFullName;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.classroomId = classroomId;
        this.classroomName = classroomName;
    }

    public Long getId() {
        return id;
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

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentFullName() {
        return studentFullName;
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
}