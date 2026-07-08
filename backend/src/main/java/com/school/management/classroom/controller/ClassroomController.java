package com.school.management.classroom.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.school.management.classroom.dto.ClassroomRequest;
import com.school.management.classroom.dto.ClassroomResponse;
import com.school.management.classroom.service.ClassroomService;

import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {

    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @GetMapping
    public List<ClassroomResponse> getAllClassrooms() {
        return classroomService.getAllClassrooms();
    }

    @GetMapping("/{id}")
    public ClassroomResponse getClassroomById(@PathVariable Long id) {
        return classroomService.getClassroomById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClassroomResponse createClassroom(@Valid @RequestBody ClassroomRequest request) {
        return classroomService.createClassroom(request);
    }

    @PutMapping("/{id}")
    public ClassroomResponse updateClassroom(
            @PathVariable Long id,
            @Valid @RequestBody ClassroomRequest request) {
        return classroomService.updateClassroom(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClassroom(@PathVariable Long id) {
        classroomService.deleteClassroom(id);
    }
}