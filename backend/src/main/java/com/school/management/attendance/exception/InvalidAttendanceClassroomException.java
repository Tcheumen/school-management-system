package com.school.management.attendance.exception;

import com.school.management.shared.exception.BusinessException;

public class InvalidAttendanceClassroomException extends BusinessException {

    public InvalidAttendanceClassroomException() {
        super("Student enrollment does not belong to the classroom of this schedule");
    }
}