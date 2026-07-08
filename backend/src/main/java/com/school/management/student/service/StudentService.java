package com.school.management.student.service;

import org.springframework.stereotype.Service;

import com.school.management.student.dto.StudentRequest;
import com.school.management.student.dto.StudentResponse;
import com.school.management.student.entity.Student;
import com.school.management.student.exception.StudentNotFoundException;
import com.school.management.student.repository.StudentRepository;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));

        return mapToResponse(student);
    }

    public StudentResponse createStudent(StudentRequest request) {
        Student student = new Student();

        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());

        Student savedStudent = studentRepository.save(student);

        return mapToResponse(savedStudent);
    }

    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));

        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());

        Student updatedStudent = studentRepository.save(student);

        return mapToResponse(updatedStudent);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));

        studentRepository.delete(student);
    }

    private StudentResponse mapToResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getDateOfBirth(),
                student.getEmail(),
                student.getPhoneNumber());
    }
}