package com.school.management.repository;

import com.school.management.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {

    Optional<AcademicYear> findByActiveTrue();

    boolean existsByName(String name);
}