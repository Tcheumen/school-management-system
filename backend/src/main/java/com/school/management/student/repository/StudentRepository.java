package com.school.management.student.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.school.management.student.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByUserEmail(String email);
}