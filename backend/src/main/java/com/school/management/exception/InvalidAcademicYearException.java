package com.school.management.exception;

public class InvalidAcademicYearException extends BusinessException {

    public InvalidAcademicYearException() {
        super("Classroom does not belong to the selected academic year");
    }
    
}
