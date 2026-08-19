package com.school.management.assignment.exception;

import com.school.management.shared.exception.BusinessException;

public class TeacherAssignmentAlreadyExistsException extends BusinessException {

    public TeacherAssignmentAlreadyExistsException(
            Long teacherId,
            Long subjectId,
            Long classroomId,
            Long academicYearId) {
        super(
                "Teacher with id " + teacherId +
                        " is already assigned to subject id " + subjectId +
                        " in classroom id " + classroomId +
                        " for academic year id " + academicYearId);
    }
}