package com.school.management.service;

import com.school.management.dto.AttendanceRequest;
import com.school.management.dto.AttendanceResponse;
import com.school.management.entity.Attendance;
import com.school.management.entity.Classroom;
import com.school.management.entity.Student;
import com.school.management.exception.AttendanceNotFoundException;
import com.school.management.exception.ClassroomNotFoundException;
import com.school.management.exception.StudentNotFoundException;
import com.school.management.repository.AttendanceRepository;
import com.school.management.repository.ClassroomRepository;
import com.school.management.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final ClassroomRepository classroomRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            StudentRepository studentRepository,
            ClassroomRepository classroomRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.classroomRepository = classroomRepository;
    }

    public List<AttendanceResponse> getAllAttendances() {
        return attendanceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AttendanceResponse getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new AttendanceNotFoundException(id));

        return mapToResponse(attendance);
    }

    public AttendanceResponse createAttendance(AttendanceRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new StudentNotFoundException(request.getStudentId()));

        Classroom classroom = classroomRepository.findById(request.getClassroomId())
                .orElseThrow(() -> new ClassroomNotFoundException(request.getClassroomId()));

        Attendance attendance = new Attendance();
        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setStatus(request.getStatus());
        attendance.setRemarks(request.getRemarks());
        attendance.setStudent(student);
        attendance.setClassroom(classroom);

        Attendance savedAttendance = attendanceRepository.save(attendance);

        return mapToResponse(savedAttendance);
    }

    public AttendanceResponse updateAttendance(Long id, AttendanceRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new AttendanceNotFoundException(id));

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new StudentNotFoundException(request.getStudentId()));

        Classroom classroom = classroomRepository.findById(request.getClassroomId())
                .orElseThrow(() -> new ClassroomNotFoundException(request.getClassroomId()));

        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setStatus(request.getStatus());
        attendance.setRemarks(request.getRemarks());
        attendance.setStudent(student);
        attendance.setClassroom(classroom);

        Attendance updatedAttendance = attendanceRepository.save(attendance);

        return mapToResponse(updatedAttendance);
    }

    public void deleteAttendance(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new AttendanceNotFoundException(id));

        attendanceRepository.delete(attendance);
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        Student student = attendance.getStudent();
        Classroom classroom = attendance.getClassroom();

        return new AttendanceResponse(
                attendance.getId(),
                attendance.getAttendanceDate(),
                attendance.getStatus(),
                attendance.getRemarks(),
                student.getId(),
                student.getFirstName() + " " + student.getLastName(),
                classroom.getId(),
                classroom.getName());
    }
}