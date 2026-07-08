package com.school.management.classroom.exception;

public class ClassroomNotFoundException extends RuntimeException {

    public ClassroomNotFoundException(Long id) {
        super("Classroom not found with id: " + id);
    }
}