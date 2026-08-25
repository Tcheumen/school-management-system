package com.school.management.reportcard.dto;

public class ReportCardSubjectResponse {

    private Long subjectId;
    private String subjectName;
    private String teacherFullName;
    private Double grade;
    private String remarks;

    public ReportCardSubjectResponse(
            Long subjectId,
            String subjectName,
            String teacherFullName,
            Double grade,
            String remarks) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.teacherFullName = teacherFullName;
        this.grade = grade;
        this.remarks = remarks;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public String getTeacherFullName() {
        return teacherFullName;
    }

    public Double getGrade() {
        return grade;
    }

    public String getRemarks() {
        return remarks;
    }
}