package com.school.management.teacher.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.school.management.teacher.entity.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}