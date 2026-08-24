package com.school.management.schedule.exception;

public class ClassScheduleNotFoundException extends RuntimeException {

    public ClassScheduleNotFoundException(Long id) {
        super("Class schedule not found with id: " + id);
    }
}