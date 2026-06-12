package com.school.management.service;

import com.school.management.dto.ClassroomRequest;
import com.school.management.dto.ClassroomResponse;
import com.school.management.entity.Classroom;
import com.school.management.repository.ClassroomRepository;
import com.school.management.exception.ClassroomNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassroomService {

    private final ClassroomRepository classroomRepository;

    public ClassroomService(ClassroomRepository classroomRepository) {
        this.classroomRepository = classroomRepository;
    }

    public List<ClassroomResponse> getAllClassrooms() {
        return classroomRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ClassroomResponse getClassroomById(Long id) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new ClassroomNotFoundException(id));

        return mapToResponse(classroom);
    }

    public ClassroomResponse createClassroom(ClassroomRequest request) {
        Classroom classroom = new Classroom();

        classroom.setName(request.getName());
        classroom.setLevel(request.getLevel());
        classroom.setAcademicYear(request.getAcademicYear());

        Classroom savedClassroom = classroomRepository.save(classroom);

        return mapToResponse(savedClassroom);
    }

    public ClassroomResponse updateClassroom(Long id, ClassroomRequest request) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new ClassroomNotFoundException(id));

        classroom.setName(request.getName());
        classroom.setLevel(request.getLevel());
        classroom.setAcademicYear(request.getAcademicYear());

        Classroom updatedClassroom = classroomRepository.save(classroom);

        return mapToResponse(updatedClassroom);
    }

    public void deleteClassroom(Long id) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new ClassroomNotFoundException(id));

        classroomRepository.delete(classroom);
    }

    private ClassroomResponse mapToResponse(Classroom classroom) {
        return new ClassroomResponse(
                classroom.getId(),
                classroom.getName(),
                classroom.getLevel(),
                classroom.getAcademicYear());
    }
}