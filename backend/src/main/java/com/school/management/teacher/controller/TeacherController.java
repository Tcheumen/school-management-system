package com.school.management.teacher.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.school.management.teacher.dto.TeacherRequest;
import com.school.management.teacher.dto.TeacherResponse;
import com.school.management.teacher.service.TeacherService;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public List<TeacherResponse> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    @GetMapping("/{id}")
    public TeacherResponse getTeacherById(@PathVariable Long id) {
        return teacherService.getTeacherById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeacherResponse createTeacher(@Valid @RequestBody TeacherRequest request) {
        return teacherService.createTeacher(request);
    }

    @PutMapping("/{id}")
    public TeacherResponse updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody TeacherRequest request) {
        return teacherService.updateTeacher(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
    }
}