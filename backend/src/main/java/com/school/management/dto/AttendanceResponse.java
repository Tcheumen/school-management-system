package com.school.management.dto;

import com.school.management.entity.AttendanceStatus;

import java.time.LocalDate;

public class AttendanceResponse {

    private Long id;
    private LocalDate attendanceDate;
    private AttendanceStatus status;
    private String remarks;

    private Long studentId;
    private String studentFullName;

    private Long classroomId;
    private String classroomName;

    public AttendanceResponse(
            Long id,
            LocalDate attendanceDate,
            AttendanceStatus status,
            String remarks,
            Long studentId,
            String studentFullName,
            Long classroomId,
            String classroomName) {
        this.id = id;
        this.attendanceDate = attendanceDate;
        this.status = status;
        this.remarks = remarks;
        this.studentId = studentId;
        this.studentFullName = studentFullName;
        this.classroomId = classroomId;
        this.classroomName = classroomName;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public AttendanceStatus getStatus() {
        return status;
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

    public Long getClassroomId() {
        return classroomId;
    }

    public String getClassroomName() {
        return classroomName;
    }
}