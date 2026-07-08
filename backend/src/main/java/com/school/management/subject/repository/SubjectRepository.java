package com.school.management.subject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.school.management.subject.entity.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
}