package com.school.management.grade.exception;

import com.school.management.shared.exception.BusinessException;

public class InvalidGradeClassroomException extends BusinessException {

    public InvalidGradeClassroomException() {
        super("Student enrollment does not belong to the classroom of this teacher assignment");
    }
}