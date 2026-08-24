package com.school.management.attendance.exception;

import com.school.management.shared.exception.BusinessException;

public class InvalidAttendanceAcademicYearException extends BusinessException {

    public InvalidAttendanceAcademicYearException() {
        super("Enrollment and class schedule do not belong to the same academic year");
    }
}