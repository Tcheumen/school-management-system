package com.school.management.assignment.exception;

import com.school.management.shared.exception.BusinessException;

public class InvalidTeacherAssignmentAcademicYearException extends BusinessException {

    public InvalidTeacherAssignmentAcademicYearException() {
        super("Classroom does not belong to the selected academic year");
    }
}