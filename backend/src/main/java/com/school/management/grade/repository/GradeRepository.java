package com.school.management.grade.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.school.management.grade.entity.Grade;

public interface GradeRepository extends JpaRepository<Grade, Long> {
}