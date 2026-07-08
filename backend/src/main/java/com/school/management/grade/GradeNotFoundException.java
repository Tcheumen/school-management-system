package com.school.management.grade;

public class GradeNotFoundException extends RuntimeException {

    public GradeNotFoundException(Long id) {
        super("Grade not found with id: " + id);
    }
}