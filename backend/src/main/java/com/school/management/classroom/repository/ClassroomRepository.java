package com.school.management.classroom.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.school.management.classroom.entity.Classroom;


public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
    
}
