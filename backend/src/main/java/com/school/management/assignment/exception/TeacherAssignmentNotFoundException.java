package com.school.management.assignment.exception;

public class TeacherAssignmentNotFoundException extends RuntimeException {

    public TeacherAssignmentNotFoundException(Long id) {
        super("Teacher assignment not found with id: " + id);
    }
}