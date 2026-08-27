package com.school.management.grade.service;

import com.school.management.assignment.entity.TeacherAssignment;
import com.school.management.assignment.exception.TeacherAssignmentNotFoundException;
import com.school.management.assignment.repository.TeacherAssignmentRepository;
import com.school.management.enrollment.entity.Enrollment;
import com.school.management.enrollment.exception.EnrollmentNotFoundException;
import com.school.management.enrollment.repository.EnrollmentRepository;
import com.school.management.grade.dto.GradeRequest;
import com.school.management.grade.dto.GradeResponse;
import com.school.management.grade.entity.Grade;
import com.school.management.grade.exception.GradeAlreadyExistsException;
import com.school.management.grade.exception.GradeNotFoundException;
import com.school.management.grade.exception.InvalidGradeAcademicYearException;
import com.school.management.grade.exception.InvalidGradeClassroomException;
import com.school.management.grade.repository.GradeRepository;
import com.school.management.shared.exception.ForbiddenOperationException;
import com.school.management.shared.security.CurrentUserService;
import com.school.management.teacher.entity.Teacher;
import com.school.management.teacher.repository.TeacherRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {

        private final GradeRepository gradeRepository;
        private final EnrollmentRepository enrollmentRepository;
        private final TeacherAssignmentRepository teacherAssignmentRepository;
        private final CurrentUserService currentUserService;
        private final TeacherRepository teacherRepository;

        public GradeService(
                        GradeRepository gradeRepository,
                        EnrollmentRepository enrollmentRepository,
                        TeacherAssignmentRepository teacherAssignmentRepository,
                        CurrentUserService currentUserService,
                        TeacherRepository teacherRepository) {
                this.gradeRepository = gradeRepository;
                this.enrollmentRepository = enrollmentRepository;
                this.teacherAssignmentRepository = teacherAssignmentRepository;
                this.currentUserService = currentUserService;
                this.teacherRepository = teacherRepository;
        }

        public List<GradeResponse> getAllGrades() {
                return gradeRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        public GradeResponse getGradeById(Long id) {
                Grade grade = gradeRepository.findById(id)
                                .orElseThrow(() -> new GradeNotFoundException(id));

                return mapToResponse(grade);
        }

        public GradeResponse createGrade(GradeRequest request) {

                Enrollment enrollment = enrollmentRepository
                                .findById(request.getEnrollmentId())
                                .orElseThrow(() -> new EnrollmentNotFoundException(request.getEnrollmentId()));

                TeacherAssignment assignment = teacherAssignmentRepository
                                .findById(request.getTeacherAssignmentId())
                                .orElseThrow(() -> new TeacherAssignmentNotFoundException(
                                                request.getTeacherAssignmentId()));
                                                
                validateTeacherAccess(assignment);
                validateGradeContext(enrollment, assignment);

                boolean alreadyExists = gradeRepository
                                .existsByEnrollmentIdAndTeacherAssignmentIdAndTerm(
                                                enrollment.getId(),
                                                assignment.getId(),
                                                request.getTerm());

                if (alreadyExists) {
                        throw new GradeAlreadyExistsException(
                                        enrollment.getId(),
                                        assignment.getId(),
                                        request.getTerm());
                }

                Grade grade = new Grade();
                grade.setEnrollment(enrollment);
                grade.setTeacherAssignment(assignment);
                grade.setValue(request.getValue());
                grade.setTerm(request.getTerm());
                grade.setRemarks(request.getRemarks());

                Grade savedGrade = gradeRepository.save(grade);

                return mapToResponse(savedGrade);
        }

        public GradeResponse updateGrade(
                        Long id,
                        GradeRequest request) {
                Grade grade = gradeRepository.findById(id)
                                .orElseThrow(() -> new GradeNotFoundException(id));

                Enrollment enrollment = enrollmentRepository
                                .findById(request.getEnrollmentId())
                                .orElseThrow(() -> new EnrollmentNotFoundException(request.getEnrollmentId()));

                TeacherAssignment assignment = teacherAssignmentRepository
                                .findById(request.getTeacherAssignmentId())
                                .orElseThrow(() -> new TeacherAssignmentNotFoundException(
                                                request.getTeacherAssignmentId()));

                validateTeacherAccess(assignment);                                
                validateGradeContext(enrollment, assignment);

                boolean alreadyExists = gradeRepository
                                .existsByEnrollmentIdAndTeacherAssignmentIdAndTermAndIdNot(
                                                enrollment.getId(),
                                                assignment.getId(),
                                                request.getTerm(),
                                                id);

                if (alreadyExists) {
                        throw new GradeAlreadyExistsException(
                                        enrollment.getId(),
                                        assignment.getId(),
                                        request.getTerm());
                }

                grade.setEnrollment(enrollment);
                grade.setTeacherAssignment(assignment);
                grade.setValue(request.getValue());
                grade.setTerm(request.getTerm());
                grade.setRemarks(request.getRemarks());

                Grade updatedGrade = gradeRepository.save(grade);

                return mapToResponse(updatedGrade);
        }

        public void deleteGrade(Long id) {
                Grade grade = gradeRepository.findById(id)
                                .orElseThrow(() -> new GradeNotFoundException(id));

                gradeRepository.delete(grade);
        }

        private void validateGradeContext(
                        Enrollment enrollment,
                        TeacherAssignment assignment) {
                if (!enrollment.getClassroom().getId()
                                .equals(assignment.getClassroom().getId())) {
                        throw new InvalidGradeClassroomException();
                }

                if (!enrollment.getAcademicYear().getId()
                                .equals(assignment.getAcademicYear().getId())) {
                        throw new InvalidGradeAcademicYearException();
                }
        }

      private void validateTeacherAccess(TeacherAssignment assignment) {

         Authentication authentication =
             SecurityContextHolder.getContext().getAuthentication();

         boolean isAdmin = authentication.getAuthorities()
            .stream()
            .anyMatch(authority ->
                    authority.getAuthority().equals("ROLE_ADMIN")
            );

        if (isAdmin) {
           return;
        }

        boolean isTeacher = authentication.getAuthorities()
             .stream()
            .anyMatch(authority ->
                    authority.getAuthority().equals("ROLE_TEACHER")
            );

        if (!isTeacher) {
           throw new ForbiddenOperationException("Access denied");
       }

        String email = currentUserService.getCurrentUserEmail();

        Teacher teacher = teacherRepository.findByUserEmail(email)
             .orElseThrow(() ->
                    new ForbiddenOperationException("Teacher profile not found")
            );

        if (!assignment.getTeacher().getId().equals(teacher.getId())) {
           throw new ForbiddenOperationException(
                "You are not allowed to manage grades for this teacher assignment"
         );
        }
     }           
        

        private GradeResponse mapToResponse(Grade grade) {

                Enrollment enrollment = grade.getEnrollment();
                TeacherAssignment assignment = grade.getTeacherAssignment();

                return new GradeResponse(
                                grade.getId(),

                                enrollment.getId(),

                                enrollment.getStudent().getId(),
                                enrollment.getStudent().getFirstName()
                                                + " "
                                                + enrollment.getStudent().getLastName(),

                                assignment.getId(),

                                assignment.getTeacher().getId(),
                                assignment.getTeacher().getFirstName()
                                                + " "
                                                + assignment.getTeacher().getLastName(),

                                assignment.getSubject().getId(),
                                assignment.getSubject().getName(),

                                enrollment.getClassroom().getId(),
                                enrollment.getClassroom().getName(),

                                enrollment.getAcademicYear().getId(),
                                enrollment.getAcademicYear().getName(),

                                grade.getValue(),
                                grade.getTerm(),
                                grade.getRemarks());
        }
}