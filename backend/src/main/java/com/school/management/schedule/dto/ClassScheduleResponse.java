package com.school.management.schedule.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class ClassScheduleResponse {

    private Long id;

    private Long teacherAssignmentId;

    private Long teacherId;
    private String teacherFullName;

    private Long subjectId;
    private String subjectName;

    private Long classroomId;
    private String classroomName;

    private Long academicYearId;
    private String academicYearName;

    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;

    public ClassScheduleResponse(
            Long id,
            Long teacherAssignmentId,
            Long teacherId,
            String teacherFullName,
            Long subjectId,
            String subjectName,
            Long classroomId,
            String classroomName,
            Long academicYearId,
            String academicYearName,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            LocalTime endTime) {
        this.id = id;
        this.teacherAssignmentId = teacherAssignmentId;
        this.teacherId = teacherId;
        this.teacherFullName = teacherFullName;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.classroomId = classroomId;
        this.classroomName = classroomName;
        this.academicYearId = academicYearId;
        this.academicYearName = academicYearName;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }

    public Long getTeacherAssignmentId() {
        return teacherAssignmentId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public String getTeacherFullName() {
        return teacherFullName;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public Long getClassroomId() {
        return classroomId;
    }

    public String getClassroomName() {
        return classroomName;
    }

    public Long getAcademicYearId() {
        return academicYearId;
    }

    public String getAcademicYearName() {
        return academicYearName;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }
}