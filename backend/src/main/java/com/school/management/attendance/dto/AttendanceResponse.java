package com.school.management.attendance.dto;

import com.school.management.attendance.entity.AttendanceStatus;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceResponse {

    private Long id;

    private Long enrollmentId;

    private Long studentId;
    private String studentFullName;

    private Long classroomId;
    private String classroomName;

    private Long classScheduleId;

    private Long subjectId;
    private String subjectName;

    private Long teacherId;
    private String teacherFullName;

    private Long academicYearId;
    private String academicYearName;

    private DayOfWeek scheduledDay;
    private LocalTime startTime;
    private LocalTime endTime;

    private LocalDate attendanceDate;
    private AttendanceStatus status;
    private String remarks;

    public AttendanceResponse(
            Long id,
            Long enrollmentId,
            Long studentId,
            String studentFullName,
            Long classroomId,
            String classroomName,
            Long classScheduleId,
            Long subjectId,
            String subjectName,
            Long teacherId,
            String teacherFullName,
            Long academicYearId,
            String academicYearName,
            DayOfWeek scheduledDay,
            LocalTime startTime,
            LocalTime endTime,
            LocalDate attendanceDate,
            AttendanceStatus status,
            String remarks) {
        this.id = id;
        this.enrollmentId = enrollmentId;
        this.studentId = studentId;
        this.studentFullName = studentFullName;
        this.classroomId = classroomId;
        this.classroomName = classroomName;
        this.classScheduleId = classScheduleId;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.teacherId = teacherId;
        this.teacherFullName = teacherFullName;
        this.academicYearId = academicYearId;
        this.academicYearName = academicYearName;
        this.scheduledDay = scheduledDay;
        this.startTime = startTime;
        this.endTime = endTime;
        this.attendanceDate = attendanceDate;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getId() {
        return id;
    }

    public Long getEnrollmentId() {
        return enrollmentId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentFullName() {
        return studentFullName;
    }

    public Long getClassroomId() {
        return classroomId;
    }

    public String getClassroomName() {
        return classroomName;
    }

    public Long getClassScheduleId() {
        return classScheduleId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public String getTeacherFullName() {
        return teacherFullName;
    }

    public Long getAcademicYearId() {
        return academicYearId;
    }

    public String getAcademicYearName() {
        return academicYearName;
    }

    public DayOfWeek getScheduledDay() {
        return scheduledDay;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public String getRemarks() {
        return remarks;
    }
}