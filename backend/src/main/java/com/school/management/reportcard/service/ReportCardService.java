package com.school.management.reportcard.service;

import com.school.management.attendance.entity.Attendance;
import com.school.management.attendance.entity.AttendanceStatus;
import com.school.management.attendance.repository.AttendanceRepository;
import com.school.management.enrollment.entity.Enrollment;
import com.school.management.enrollment.exception.EnrollmentNotFoundException;
import com.school.management.enrollment.repository.EnrollmentRepository;
import com.school.management.grade.entity.Grade;
import com.school.management.grade.repository.GradeRepository;
import com.school.management.reportcard.dto.ReportCardResponse;
import com.school.management.reportcard.dto.ReportCardSubjectResponse;
import com.school.management.assignment.repository.TeacherAssignmentRepository;
import com.school.management.shared.exception.BusinessException;
import com.school.management.shared.exception.ForbiddenOperationException;
import com.school.management.shared.security.CurrentUserService;
import com.school.management.student.entity.Student;
import com.school.management.student.repository.StudentRepository;
import com.school.management.teacher.entity.Teacher;
import com.school.management.teacher.repository.TeacherRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportCardService {

    private final EnrollmentRepository enrollmentRepository;
    private final GradeRepository gradeRepository;
    private final AttendanceRepository attendanceRepository;
    private final CurrentUserService currentUserService;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final TeacherAssignmentRepository teacherAssignmentRepository;

    public ReportCardService(
            EnrollmentRepository enrollmentRepository,
            GradeRepository gradeRepository,
            AttendanceRepository attendanceRepository,
            CurrentUserService currentUserService,
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            TeacherAssignmentRepository teacherAssignmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.gradeRepository = gradeRepository;
        this.attendanceRepository = attendanceRepository;
        this.currentUserService = currentUserService;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.teacherAssignmentRepository = teacherAssignmentRepository;
    }

    public ReportCardResponse getReportCard(
            Long enrollmentId,
                    String term) {
            Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                            .orElseThrow(() -> new EnrollmentNotFoundException(enrollmentId));

            validateReportCardAccess(enrollment);

            List<Grade> grades = gradeRepository.findByEnrollmentIdAndTerm(enrollmentId, term);

            List<ReportCardSubjectResponse> subjects = grades.stream()
                            .map(grade -> new ReportCardSubjectResponse(
                                            grade.getTeacherAssignment().getSubject().getId(),
                                            grade.getTeacherAssignment().getSubject().getName(),
                                            grade.getTeacherAssignment().getTeacher().getFirstName()
                                                            + " "
                                                            + grade.getTeacherAssignment().getTeacher().getLastName(),
                                            grade.getValue(),
                                            grade.getRemarks()))
                            .toList();

            double average = grades.stream()
                            .mapToDouble(Grade::getValue)
                            .average()
                            .orElse(0.0);

            List<Attendance> attendances = attendanceRepository.findByEnrollmentId(enrollmentId);

            long totalAbsences = attendances.stream()
                            .filter(attendance -> attendance.getStatus() == AttendanceStatus.ABSENT)
                            .count();

            long totalLate = attendances.stream()
                            .filter(attendance -> attendance.getStatus() == AttendanceStatus.LATE)
                            .count();

            return new ReportCardResponse(
                            enrollment.getId(),
                            enrollment.getStudent().getId(),
                            enrollment.getStudent().getFirstName()
                                            + " "
                                            + enrollment.getStudent().getLastName(),
                            enrollment.getClassroom().getId(),
                            enrollment.getClassroom().getName(),
                            enrollment.getAcademicYear().getId(),
                            enrollment.getAcademicYear().getName(),
                            term,
                            average,
                            totalAbsences,
                            totalLate,
                            subjects);
    }
    
    private void validateReportCardAccess(Enrollment enrollment) {

            String email = currentUserService.getCurrentUserEmail();

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            boolean isAdmin = authentication.getAuthorities()
                            .stream()
                            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

            if (isAdmin) {
                    return;
            }

            boolean isStudent = authentication.getAuthorities()
                            .stream()
                            .anyMatch(authority -> authority.getAuthority().equals("ROLE_STUDENT"));

            if (isStudent) {
                    Student student = studentRepository.findByUserEmail(email)
                                    .orElseThrow(() -> new BusinessException("Student profile not found"));

                    if (!enrollment.getStudent().getId().equals(student.getId())) {
                            throw new ForbiddenOperationException(
                                            "You are not allowed to access this report card");
                    }

                    return;
            }

            boolean isTeacher = authentication.getAuthorities()
                            .stream()
                            .anyMatch(authority -> authority.getAuthority().equals("ROLE_TEACHER"));

            if (isTeacher) {
                    Teacher teacher = teacherRepository.findByUserEmail(email)
                                    .orElseThrow(() -> new BusinessException("Teacher profile not found"));

                    boolean allowed = teacherAssignmentRepository
                                    .existsByTeacherIdAndClassroomIdAndAcademicYearId(
                                                    teacher.getId(),
                                                    enrollment.getClassroom().getId(),
                                                    enrollment.getAcademicYear().getId());

                    if (!allowed) {
                            throw new ForbiddenOperationException(
                                            "You are not allowed to access this report card");
                    }

                    return;
            }

            throw new ForbiddenOperationException("Access denied");
    }

    public ReportCardResponse getMyReportCard(String term) {

            String email = currentUserService.getCurrentUserEmail();

            Enrollment enrollment = enrollmentRepository
                            .findByStudentUserEmailAndAcademicYearActiveTrue(email)
                            .orElseThrow(() -> new BusinessException("No active enrollment found"));

            return getReportCard(enrollment.getId(), term);
    }
}