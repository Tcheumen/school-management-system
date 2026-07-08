package com.school.management.attendance.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

import com.school.management.attendance.entity.AttendanceStatus;

public class AttendanceRequest {

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    @NotNull(message = "Status is required")
    private AttendanceStatus status;

    private String remarks;

    @NotNull(message = "Student id is required")
    private Long studentId;

    @NotNull(message = "Classroom id is required")
    private Long classroomId;

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

    public Long getClassroomId() {
        return classroomId;
    }
}