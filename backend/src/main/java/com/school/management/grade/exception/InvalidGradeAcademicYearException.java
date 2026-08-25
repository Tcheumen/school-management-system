package com.school.management.grade.exception;

import com.school.management.shared.exception.BusinessException;

public class InvalidGradeAcademicYearException extends BusinessException {

    public InvalidGradeAcademicYearException() {
        super("Enrollment and teacher assignment do not belong to the same academic year");
    }
}