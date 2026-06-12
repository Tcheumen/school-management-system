package com.school.management.repository;

import com.school.management.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
    
}
