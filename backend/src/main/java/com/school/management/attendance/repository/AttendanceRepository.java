package com.school.management.attendance.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.school.management.attendance.entity.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
}