package com.school.management.academicYear.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.school.management.academicYear.entity.AcademicYear;

import java.util.Optional;

public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {

    Optional<AcademicYear> findByActiveTrue();

    boolean existsByName(String name);
}