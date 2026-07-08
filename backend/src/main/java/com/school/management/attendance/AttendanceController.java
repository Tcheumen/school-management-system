package com.school.management.attendance;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public List<AttendanceResponse> getAllAttendances() {
        return attendanceService.getAllAttendances();
    }

    @GetMapping("/{id}")
    public AttendanceResponse getAttendanceById(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AttendanceResponse createAttendance(@Valid @RequestBody AttendanceRequest request) {
        return attendanceService.createAttendance(request);
    }

    @PutMapping("/{id}")
    public AttendanceResponse updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequest request) {
        return attendanceService.updateAttendance(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
    }
}