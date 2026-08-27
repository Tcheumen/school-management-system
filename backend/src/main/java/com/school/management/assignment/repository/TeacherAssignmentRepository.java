package com.school.management.assignment.repository;

import com.school.management.assignment.entity.TeacherAssignment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherAssignmentRepository extends JpaRepository<TeacherAssignment, Long> {

    boolean existsByTeacherIdAndSubjectIdAndClassroomIdAndAcademicYearId(
            Long teacherId,
            Long subjectId,
            Long classroomId,
            Long academicYearId);

    boolean existsByTeacherIdAndClassroomIdAndAcademicYearId(
            Long teacherId,
            Long classroomId,
                    Long academicYearId);
            
    List<TeacherAssignment> findByTeacherUserEmail(String email);
}