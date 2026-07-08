package com.school.management.attendance.exception;

public class AttendanceNotFoundException extends RuntimeException {

    public AttendanceNotFoundException(Long id) {
        super("Attendance not found with id: " + id);
    }
}