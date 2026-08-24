package com.school.management.schedule.service;

import com.school.management.assignment.entity.TeacherAssignment;
import com.school.management.assignment.exception.TeacherAssignmentNotFoundException;
import com.school.management.assignment.repository.TeacherAssignmentRepository;
import com.school.management.schedule.dto.ClassScheduleRequest;
import com.school.management.schedule.dto.ClassScheduleResponse;
import com.school.management.schedule.entity.ClassSchedule;
import com.school.management.schedule.exception.ClassScheduleNotFoundException;
import com.school.management.schedule.exception.ClassroomScheduleConflictException;
import com.school.management.schedule.exception.InvalidScheduleTimeException;
import com.school.management.schedule.exception.TeacherScheduleConflictException;
import com.school.management.schedule.repository.ClassScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassScheduleService {

    private final ClassScheduleRepository classScheduleRepository;
    private final TeacherAssignmentRepository teacherAssignmentRepository;

    public ClassScheduleService(
            ClassScheduleRepository classScheduleRepository,
            TeacherAssignmentRepository teacherAssignmentRepository) {
        this.classScheduleRepository = classScheduleRepository;
        this.teacherAssignmentRepository = teacherAssignmentRepository;
    }

    public List<ClassScheduleResponse> getAllSchedules() {
        return classScheduleRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ClassScheduleResponse getScheduleById(Long id) {
        ClassSchedule schedule = classScheduleRepository.findById(id)
                .orElseThrow(() -> new ClassScheduleNotFoundException(id));

        return mapToResponse(schedule);
    }

    public ClassScheduleResponse createSchedule(ClassScheduleRequest request) {

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new InvalidScheduleTimeException();
        }

        TeacherAssignment assignment = teacherAssignmentRepository
                .findById(request.getTeacherAssignmentId())
                .orElseThrow(() -> new TeacherAssignmentNotFoundException(
                        request.getTeacherAssignmentId()));

        List<ClassSchedule> overlappingSchedules = classScheduleRepository
                .findByDayOfWeekAndStartTimeLessThanAndEndTimeGreaterThan(
                        request.getDayOfWeek(),
                        request.getEndTime(),
                        request.getStartTime());

        boolean teacherConflict = overlappingSchedules.stream()
                .anyMatch(schedule -> schedule.getTeacherAssignment()
                        .getTeacher()
                        .getId()
                        .equals(
                                assignment.getTeacher()
                                        .getId()));

        if (teacherConflict) {
            throw new TeacherScheduleConflictException();
        }

        boolean classroomConflict = overlappingSchedules.stream()
                .anyMatch(schedule -> schedule.getTeacherAssignment()
                        .getClassroom()
                        .getId()
                        .equals(
                                assignment.getClassroom()
                                        .getId()));

        if (classroomConflict) {
            throw new ClassroomScheduleConflictException();
        }

        ClassSchedule schedule = new ClassSchedule();
        schedule.setTeacherAssignment(assignment);
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());

        ClassSchedule savedSchedule = classScheduleRepository.save(schedule);

        return mapToResponse(savedSchedule);
    }

    public void deleteSchedule(Long id) {
        ClassSchedule schedule = classScheduleRepository.findById(id)
                .orElseThrow(() -> new ClassScheduleNotFoundException(id));

        classScheduleRepository.delete(schedule);
    }

    private ClassScheduleResponse mapToResponse(ClassSchedule schedule) {

        TeacherAssignment assignment = schedule.getTeacherAssignment();

        return new ClassScheduleResponse(
                schedule.getId(),
                assignment.getId(),

                assignment.getTeacher().getId(),
                assignment.getTeacher().getFirstName()
                        + " "
                        + assignment.getTeacher().getLastName(),

                assignment.getSubject().getId(),
                assignment.getSubject().getName(),

                assignment.getClassroom().getId(),
                assignment.getClassroom().getName(),

                assignment.getAcademicYear().getId(),
                assignment.getAcademicYear().getName(),

                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime());
    }
}