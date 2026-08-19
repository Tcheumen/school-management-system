package com.school.management.assignment.dto;

import jakarta.validation.constraints.NotNull;

public class TeacherAssignmentRequest {

    @NotNull(message = "Teacher id is required")
    private Long teacherId;

    @NotNull(message = "Subject id is required")
    private Long subjectId;

    @NotNull(message = "Classroom id is required")
    private Long classroomId;

    @NotNull(message = "Academic year id is required")
    private Long academicYearId;

    public Long getTeacherId() {
        return teacherId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public Long getClassroomId() {
        return classroomId;
    }

    public Long getAcademicYearId() {
        return academicYearId;
    }
}