package com.school.management.grade.repository;

import com.school.management.grade.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface GradeRepository extends JpaRepository<Grade, Long> {

    boolean existsByEnrollmentIdAndTeacherAssignmentIdAndTerm(
            Long enrollmentId,
            Long teacherAssignmentId,
            String term);

    boolean existsByEnrollmentIdAndTeacherAssignmentIdAndTermAndIdNot(
            Long enrollmentId,
            Long teacherAssignmentId,
            String term,
            Long id);

    List<Grade> findByEnrollmentIdAndTerm(
            Long enrollmentId,
            String term);
}