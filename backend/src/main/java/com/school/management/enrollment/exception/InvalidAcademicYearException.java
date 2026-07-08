package com.school.management.enrollment.exception;

import com.school.management.shared.exception.BusinessException;

public class InvalidAcademicYearException extends BusinessException {

    public InvalidAcademicYearException() {
        super("Classroom does not belong to the selected academic year");
    }
    
}
