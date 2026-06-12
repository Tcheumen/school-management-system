package com.school.management.exception;

public class SubjectNotFoundException extends RuntimeException {

    public SubjectNotFoundException(Long id) {
        super("Subject not found with id: " + id);
    }
}