package com.school.management.enrollment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.school.management.enrollment.entity.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    boolean existsByStudentIdAndAcademicYearId(Long studentId, Long academicYearId);

    Optional<Enrollment> findByStudentUserEmailAndAcademicYearActiveTrue(String email);
}