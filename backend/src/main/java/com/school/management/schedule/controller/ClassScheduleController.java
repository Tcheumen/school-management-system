package com.school.management.schedule.controller;

import com.school.management.schedule.dto.ClassScheduleRequest;
import com.school.management.schedule.dto.ClassScheduleResponse;
import com.school.management.schedule.service.ClassScheduleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/class-schedules")
public class ClassScheduleController {

    private final ClassScheduleService classScheduleService;

    public ClassScheduleController(ClassScheduleService classScheduleService) {
        this.classScheduleService = classScheduleService;
    }

    @GetMapping
    public List<ClassScheduleResponse> getAllSchedules() {
        return classScheduleService.getAllSchedules();
    }

    @GetMapping("/{id}")
    public ClassScheduleResponse getScheduleById(@PathVariable Long id) {
        return classScheduleService.getScheduleById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClassScheduleResponse createSchedule(
            @Valid @RequestBody ClassScheduleRequest request) {
        return classScheduleService.createSchedule(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSchedule(@PathVariable Long id) {
        classScheduleService.deleteSchedule(id);
    }
}