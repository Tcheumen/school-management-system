package com.school.management.assignment.controller;

import com.school.management.assignment.dto.TeacherAssignmentRequest;
import com.school.management.assignment.dto.TeacherAssignmentResponse;
import com.school.management.assignment.service.TeacherAssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-assignments")
public class TeacherAssignmentController {

    private final TeacherAssignmentService teacherAssignmentService;

    public TeacherAssignmentController(
            TeacherAssignmentService teacherAssignmentService) {
        this.teacherAssignmentService = teacherAssignmentService;
    }

    @GetMapping
    public List<TeacherAssignmentResponse> getAllAssignments() {
        return teacherAssignmentService.getAllAssignments();
    }

    @GetMapping("/{id}")
    public TeacherAssignmentResponse getAssignmentById(@PathVariable Long id) {
        return teacherAssignmentService.getAssignmentById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeacherAssignmentResponse createAssignment(
            @Valid @RequestBody TeacherAssignmentRequest request) {
        return teacherAssignmentService.createAssignment(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAssignment(@PathVariable Long id) {
        teacherAssignmentService.deleteAssignment(id);
    }
}