package com.school.management.exception;

public class EnrollmentAlreadyExistsException extends BusinessException {

    public EnrollmentAlreadyExistsException(Long studentId, Long academicYearId) {
        super("Student with id " + studentId + " is already enrolled for academic year id " + academicYearId);
    }
    
}
