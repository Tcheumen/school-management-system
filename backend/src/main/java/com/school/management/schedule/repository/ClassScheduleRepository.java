package com.school.management.schedule.repository;

import com.school.management.schedule.entity.ClassSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {

    List<ClassSchedule> findByDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThan(
            DayOfWeek dayOfWeek,
            LocalTime endTime,
            LocalTime startTime);

    List<ClassSchedule> findByTeacherAssignmentClassroomIdAndTeacherAssignmentAcademicYearId(
            Long classroomId,
            Long academicYearId);
            
    List<ClassSchedule> findByTeacherAssignmentTeacherUserEmail(String email);
}