package com.school.management.schedule.exception;

import com.school.management.shared.exception.BusinessException;

public class InvalidScheduleTimeException extends BusinessException {

    public InvalidScheduleTimeException() {
        super("End time must be after start time");
    }
}