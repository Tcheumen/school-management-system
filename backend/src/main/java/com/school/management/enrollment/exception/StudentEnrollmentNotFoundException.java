package com.school.management.enrollment.exception;

public class StudentEnrollmentNotFoundException
        extends RuntimeException {

    public StudentEnrollmentNotFoundException() {

        super(
                "No active enrollment found for the current student");
    }
}