package com.school.management.schedule.exception;

import com.school.management.shared.exception.BusinessException;

public class ClassroomScheduleConflictException extends BusinessException {

    public ClassroomScheduleConflictException() {
        super("Classroom already has another class during this time slot");
    }
}