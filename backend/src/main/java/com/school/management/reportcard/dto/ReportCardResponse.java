package com.school.management.reportcard.dto;

import java.util.List;

public class ReportCardResponse {

    private Long enrollmentId;

    private Long studentId;
    private String studentFullName;

    private Long classroomId;
    private String classroomName;

    private Long academicYearId;
    private String academicYearName;

    private String term;

    private Double average;

    private long totalAbsences;
    private long totalLate;

    private List<ReportCardSubjectResponse> subjects;

    public ReportCardResponse(
            Long enrollmentId,
            Long studentId,
            String studentFullName,
            Long classroomId,
            String classroomName,
            Long academicYearId,
            String academicYearName,
            String term,
            Double average,
            long totalAbsences,
            long totalLate,
            List<ReportCardSubjectResponse> subjects) {
        this.enrollmentId = enrollmentId;
        this.studentId = studentId;
        this.studentFullName = studentFullName;
        this.classroomId = classroomId;
        this.classroomName = classroomName;
        this.academicYearId = academicYearId;
        this.academicYearName = academicYearName;
        this.term = term;
        this.average = average;
        this.totalAbsences = totalAbsences;
        this.totalLate = totalLate;
        this.subjects = subjects;
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

    public String getTerm() {
        return term;
    }

    public Double getAverage() {
        return average;
    }

    public long getTotalAbsences() {
        return totalAbsences;
    }

    public long getTotalLate() {
        return totalLate;
    }

    public List<ReportCardSubjectResponse> getSubjects() {
        return subjects;
    }
}