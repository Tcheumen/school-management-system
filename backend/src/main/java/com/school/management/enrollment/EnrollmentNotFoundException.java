package com.school.management.enrollment;

public class EnrollmentNotFoundException extends RuntimeException {

    public EnrollmentNotFoundException(Long id) {
        super("Enrollment not found with id: " + id);
    }
}