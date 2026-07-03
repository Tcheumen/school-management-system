package com.school.management.service;

import com.school.management.dto.EnrollmentRequest;
import com.school.management.dto.EnrollmentResponse;
import com.school.management.entity.AcademicYear;
import com.school.management.entity.Classroom;
import com.school.management.entity.Enrollment;
import com.school.management.entity.Student;
import com.school.management.exception.*;
import com.school.management.repository.*;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final ClassroomRepository classroomRepository;
    private final AcademicYearRepository academicYearRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            ClassroomRepository classroomRepository,
            AcademicYearRepository academicYearRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.classroomRepository = classroomRepository;
        this.academicYearRepository = academicYearRepository;
    }

    public List<EnrollmentResponse> getAllEnrollments() {
        return enrollmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public EnrollmentResponse getEnrollmentById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new EnrollmentNotFoundException(id));

        return mapToResponse(enrollment);
    }

    public EnrollmentResponse createEnrollment(EnrollmentRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new StudentNotFoundException(request.getStudentId()));

        Classroom classroom = classroomRepository.findById(request.getClassroomId())
                .orElseThrow(() -> new ClassroomNotFoundException(request.getClassroomId()));

        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
                .orElseThrow(() -> new AcademicYearNotFoundException(request.getAcademicYearId()));

        if (enrollmentRepository.existsByStudentIdAndAcademicYearId(
                request.getStudentId(),
                request.getAcademicYearId())) {
            throw new EnrollmentAlreadyExistsException(
                    request.getStudentId(),
                    request.getAcademicYearId());
        }

        if (!classroom.getAcademicYear().getId().equals(academicYear.getId())) {
            throw new RuntimeException("Classroom does not belong to the selected academic year");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setClassroom(classroom);
        enrollment.setAcademicYear(academicYear);

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        return mapToResponse(savedEnrollment);
    }

    public void deleteEnrollment(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new EnrollmentNotFoundException(id));

        enrollmentRepository.delete(enrollment);
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        Student student = enrollment.getStudent();
        Classroom classroom = enrollment.getClassroom();
        AcademicYear academicYear = enrollment.getAcademicYear();

        return new EnrollmentResponse(
                enrollment.getId(),
                student.getId(),
                student.getFirstName() + " " + student.getLastName(),
                classroom.getId(),
                classroom.getName(),
                academicYear.getId(),
                academicYear.getName());
    }
}