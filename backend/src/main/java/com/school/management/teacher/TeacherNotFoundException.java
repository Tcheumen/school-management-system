package com.school.management.teacher;

public class TeacherNotFoundException extends RuntimeException {
    public TeacherNotFoundException(Long id) {
        super("Teacher not found with ID " + id);
    }
    
}


