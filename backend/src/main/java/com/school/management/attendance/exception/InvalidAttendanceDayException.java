package com.school.management.attendance.exception;

import com.school.management.shared.exception.BusinessException;

public class InvalidAttendanceDayException extends BusinessException {

    public InvalidAttendanceDayException() {
        super("Attendance date does not match the scheduled day");
    }
}