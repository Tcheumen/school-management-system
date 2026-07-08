package com.school.management.teacher.service;

import org.springframework.stereotype.Service;


import com.school.management.teacher.dto.TeacherRequest;
import com.school.management.teacher.dto.TeacherResponse;
import com.school.management.teacher.entity.Teacher;
import com.school.management.teacher.exception.TeacherNotFoundException;
import com.school.management.teacher.repository.TeacherRepository;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public List<TeacherResponse> getAllTeachers() {
        return teacherRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TeacherResponse getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new TeacherNotFoundException(id));

        return mapToResponse(teacher);
    }

    public TeacherResponse createTeacher(TeacherRequest request) {
        Teacher teacher = new Teacher();

        teacher.setFirstName(request.getFirstName());
        teacher.setLastName(request.getLastName());
        teacher.setEmail(request.getEmail());
        teacher.setPhoneNumber(request.getPhoneNumber());
        teacher.setSpecialty(request.getSpecialty());

        Teacher savedTeacher = teacherRepository.save(teacher);

        return mapToResponse(savedTeacher);
    }

    public TeacherResponse updateTeacher(Long id, TeacherRequest request) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new TeacherNotFoundException(id));

        teacher.setFirstName(request.getFirstName());
        teacher.setLastName(request.getLastName());
        teacher.setEmail(request.getEmail());
        teacher.setPhoneNumber(request.getPhoneNumber());
        teacher.setSpecialty(request.getSpecialty());

        Teacher updatedTeacher = teacherRepository.save(teacher);

        return mapToResponse(updatedTeacher);
    }

    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new TeacherNotFoundException(id));

        teacherRepository.delete(teacher);
    }

    private TeacherResponse mapToResponse(Teacher teacher) {
        return new TeacherResponse(
                teacher.getId(),
                teacher.getFirstName(),
                teacher.getLastName(),
                teacher.getEmail(),
                teacher.getPhoneNumber(),
                teacher.getSpecialty());
    }
}