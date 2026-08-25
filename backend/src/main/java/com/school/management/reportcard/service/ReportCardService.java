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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportCardService {

    private final EnrollmentRepository enrollmentRepository;
    private final GradeRepository gradeRepository;
    private final AttendanceRepository attendanceRepository;

    public ReportCardService(
            EnrollmentRepository enrollmentRepository,
            GradeRepository gradeRepository,
            AttendanceRepository attendanceRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.gradeRepository = gradeRepository;
        this.attendanceRepository = attendanceRepository;
    }

    public ReportCardResponse getReportCard(
            Long enrollmentId,
            String term) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new EnrollmentNotFoundException(enrollmentId));

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
}