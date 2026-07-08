package com.school.management.teacher.exception;

public class TeacherNotFoundException extends RuntimeException {
    public TeacherNotFoundException(Long id) {
        super("Teacher not found with ID " + id);
    }
    
}


