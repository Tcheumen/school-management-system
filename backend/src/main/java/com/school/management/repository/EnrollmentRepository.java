package com.school.management.repository;

import com.school.management.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    boolean existsByStudentIdAndAcademicYearId(Long studentId, Long academicYearId);
}