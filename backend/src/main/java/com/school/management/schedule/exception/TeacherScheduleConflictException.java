package com.school.management.schedule.exception;

import com.school.management.shared.exception.BusinessException;

public class TeacherScheduleConflictException extends BusinessException {

    public TeacherScheduleConflictException() {
        super("Teacher already has another class during this time slot");
    }
}