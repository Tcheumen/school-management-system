package com.school.management.exception;

public class TeacherNotFoundException extends RuntimeException {
    public TeacherNotFoundException(Long id) {
        super("Teacher not found with ID " + id);
    }
    
}


