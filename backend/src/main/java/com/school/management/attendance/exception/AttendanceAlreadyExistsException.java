package com.school.management.attendance.exception;

import com.school.management.shared.exception.BusinessException;

public class AttendanceAlreadyExistsException extends BusinessException {

    public AttendanceAlreadyExistsException(
            Long enrollmentId,
            Long classScheduleId) {
        super(
                "Attendance already exists for enrollment id "
                        + enrollmentId
                        + " and class schedule id "
                        + classScheduleId);
    }
}