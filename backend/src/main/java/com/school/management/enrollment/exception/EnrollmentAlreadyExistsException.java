package com.school.management.enrollment.exception;

import com.school.management.shared.exception.BusinessException;

public class EnrollmentAlreadyExistsException extends BusinessException {

    public EnrollmentAlreadyExistsException(Long studentId, Long academicYearId) {
        super("Student with id " + studentId + " is already enrolled for academic year id " + academicYearId);
    }
    
}
