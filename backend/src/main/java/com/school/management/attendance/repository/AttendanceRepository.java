package com.school.management.attendance.repository;

import com.school.management.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    boolean existsByEnrollmentIdAndClassScheduleIdAndAttendanceDate(
            Long enrollmentId,
            Long classScheduleId,
            LocalDate attendanceDate);

    boolean existsByEnrollmentIdAndClassScheduleIdAndAttendanceDateAndIdNot(
            Long enrollmentId,
            Long classScheduleId,
            LocalDate attendanceDate,
            Long id);
}