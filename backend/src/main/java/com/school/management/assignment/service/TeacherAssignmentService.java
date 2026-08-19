package com.school.management.assignment.service;

import com.school.management.academicYear.entity.AcademicYear;
import com.school.management.academicYear.exception.AcademicYearNotFoundException;
import com.school.management.academicYear.repository.AcademicYearRepository;
import com.school.management.assignment.dto.TeacherAssignmentRequest;
import com.school.management.assignment.dto.TeacherAssignmentResponse;
import com.school.management.assignment.entity.TeacherAssignment;
import com.school.management.assignment.exception.InvalidTeacherAssignmentAcademicYearException;
import com.school.management.assignment.exception.TeacherAssignmentAlreadyExistsException;
import com.school.management.assignment.exception.TeacherAssignmentNotFoundException;
import com.school.management.assignment.repository.TeacherAssignmentRepository;
import com.school.management.classroom.entity.Classroom;
import com.school.management.classroom.exception.ClassroomNotFoundException;
import com.school.management.classroom.repository.ClassroomRepository;
import com.school.management.subject.entity.Subject;
import com.school.management.subject.exception.SubjectNotFoundException;
import com.school.management.subject.repository.SubjectRepository;
import com.school.management.teacher.entity.Teacher;
import com.school.management.teacher.exception.TeacherNotFoundException;
import com.school.management.teacher.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherAssignmentService {

    private final TeacherAssignmentRepository teacherAssignmentRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final ClassroomRepository classroomRepository;
    private final AcademicYearRepository academicYearRepository;

    public TeacherAssignmentService(
            TeacherAssignmentRepository teacherAssignmentRepository,
            TeacherRepository teacherRepository,
            SubjectRepository subjectRepository,
            ClassroomRepository classroomRepository,
            AcademicYearRepository academicYearRepository) {
        this.teacherAssignmentRepository = teacherAssignmentRepository;
        this.teacherRepository = teacherRepository;
        this.subjectRepository = subjectRepository;
        this.classroomRepository = classroomRepository;
        this.academicYearRepository = academicYearRepository;
    }

    public List<TeacherAssignmentResponse> getAllAssignments() {
        return teacherAssignmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TeacherAssignmentResponse getAssignmentById(Long id) {
        TeacherAssignment assignment = teacherAssignmentRepository.findById(id)
                .orElseThrow(() -> new TeacherAssignmentNotFoundException(id));

        return mapToResponse(assignment);
    }

    public TeacherAssignmentResponse createAssignment(TeacherAssignmentRequest request) {
        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new TeacherNotFoundException(request.getTeacherId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new SubjectNotFoundException(request.getSubjectId()));

        Classroom classroom = classroomRepository.findById(request.getClassroomId())
                .orElseThrow(() -> new ClassroomNotFoundException(request.getClassroomId()));

        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
                .orElseThrow(() -> new AcademicYearNotFoundException(request.getAcademicYearId()));

        if (!classroom.getAcademicYear().getId().equals(academicYear.getId())) {
            throw new InvalidTeacherAssignmentAcademicYearException();
        }

        boolean alreadyExists = teacherAssignmentRepository
                .existsByTeacherIdAndSubjectIdAndClassroomIdAndAcademicYearId(
                        teacher.getId(),
                        subject.getId(),
                        classroom.getId(),
                        academicYear.getId());

        if (alreadyExists) {
            throw new TeacherAssignmentAlreadyExistsException(
                    teacher.getId(),
                    subject.getId(),
                    classroom.getId(),
                    academicYear.getId());
        }

        TeacherAssignment assignment = new TeacherAssignment();
        assignment.setTeacher(teacher);
        assignment.setSubject(subject);
        assignment.setClassroom(classroom);
        assignment.setAcademicYear(academicYear);

        TeacherAssignment savedAssignment = teacherAssignmentRepository.save(assignment);

        return mapToResponse(savedAssignment);
    }

    public void deleteAssignment(Long id) {
        TeacherAssignment assignment = teacherAssignmentRepository.findById(id)
                .orElseThrow(() -> new TeacherAssignmentNotFoundException(id));

        teacherAssignmentRepository.delete(assignment);
    }

    private TeacherAssignmentResponse mapToResponse(TeacherAssignment assignment) {
        Teacher teacher = assignment.getTeacher();
        Subject subject = assignment.getSubject();
        Classroom classroom = assignment.getClassroom();
        AcademicYear academicYear = assignment.getAcademicYear();

        return new TeacherAssignmentResponse(
                assignment.getId(),
                teacher.getId(),
                teacher.getFirstName() + " " + teacher.getLastName(),
                subject.getId(),
                subject.getName(),
                classroom.getId(),
                classroom.getName(),
                academicYear.getId(),
                academicYear.getName());
    }
}