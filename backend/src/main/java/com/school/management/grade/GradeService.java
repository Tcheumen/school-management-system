package com.school.management.grade;

import com.school.management.classroom.Classroom;
import com.school.management.classroom.ClassroomNotFoundException;
import com.school.management.classroom.ClassroomRepository;
import com.school.management.student.Student;
import com.school.management.student.StudentNotFoundException;
import com.school.management.student.StudentRepository;
import com.school.management.subject.Subject;
import com.school.management.subject.SubjectNotFoundException;
import com.school.management.subject.SubjectRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {

    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final ClassroomRepository classroomRepository;

    public GradeService(
            GradeRepository gradeRepository,
            StudentRepository studentRepository,
            SubjectRepository subjectRepository,
            ClassroomRepository classroomRepository) {
        this.gradeRepository = gradeRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.classroomRepository = classroomRepository;
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
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new StudentNotFoundException(request.getStudentId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new SubjectNotFoundException(request.getSubjectId()));

        Classroom classroom = classroomRepository.findById(request.getClassroomId())
                .orElseThrow(() -> new ClassroomNotFoundException(request.getClassroomId()));

        Grade grade = new Grade();
        grade.setValue(request.getValue());
        grade.setTerm(request.getTerm());
        grade.setRemarks(request.getRemarks());
        grade.setStudent(student);
        grade.setSubject(subject);
        grade.setClassroom(classroom);

        Grade savedGrade = gradeRepository.save(grade);

        return mapToResponse(savedGrade);
    }

    public GradeResponse updateGrade(Long id, GradeRequest request) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new GradeNotFoundException(id));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new StudentNotFoundException(request.getStudentId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new SubjectNotFoundException(request.getSubjectId()));

        Classroom classroom = classroomRepository.findById(request.getClassroomId())
                .orElseThrow(() -> new ClassroomNotFoundException(request.getClassroomId()));

        grade.setValue(request.getValue());
        grade.setTerm(request.getTerm());
        grade.setRemarks(request.getRemarks());
        grade.setStudent(student);
        grade.setSubject(subject);
        grade.setClassroom(classroom);

        Grade updatedGrade = gradeRepository.save(grade);

        return mapToResponse(updatedGrade);
    }

    public void deleteGrade(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new GradeNotFoundException(id));

        gradeRepository.delete(grade);
    }

    private GradeResponse mapToResponse(Grade grade) {
        Student student = grade.getStudent();
        Subject subject = grade.getSubject();
        Classroom classroom = grade.getClassroom();

        return new GradeResponse(
                grade.getId(),
                grade.getValue(),
                grade.getTerm(),
                grade.getRemarks(),
                student.getId(),
                student.getFirstName() + " " + student.getLastName(),
                subject.getId(),
                subject.getName(),
                classroom.getId(),
                classroom.getName());
    }
}