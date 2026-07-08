package com.school.management.AcademicYear;

public class AcademicYearNotFoundException extends RuntimeException {

    public AcademicYearNotFoundException(Long id) {
        super("Academic year not found with id: " + id);
    }
}