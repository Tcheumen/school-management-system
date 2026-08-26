package com.school.management.teacher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.school.management.teacher.entity.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    Optional<Teacher> findByUserEmail(String email);
}