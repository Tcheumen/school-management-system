package com.school.management.grade.exception;

import com.school.management.shared.exception.BusinessException;

public class GradeAlreadyExistsException extends BusinessException {

    public GradeAlreadyExistsException(
            Long enrollmentId,
            Long teacherAssignmentId,
            String term) {
        super(
                "Grade already exists for enrollment id "
                        + enrollmentId
                        + ", teacher assignment id "
                        + teacherAssignmentId
                        + " and term "
                        + term);
    }
}