package com.school.management.attendance.service;

import com.school.management.attendance.dto.AttendanceRequest;
import com.school.management.attendance.dto.AttendanceResponse;
import com.school.management.attendance.entity.Attendance;
import com.school.management.attendance.exception.AttendanceAlreadyExistsException;
import com.school.management.attendance.exception.AttendanceNotFoundException;
import com.school.management.attendance.exception.InvalidAttendanceAcademicYearException;
import com.school.management.attendance.exception.InvalidAttendanceClassroomException;
import com.school.management.attendance.exception.InvalidAttendanceDayException;
import com.school.management.attendance.repository.AttendanceRepository;
import com.school.management.assignment.entity.TeacherAssignment;
import com.school.management.enrollment.entity.Enrollment;
import com.school.management.enrollment.exception.EnrollmentNotFoundException;
import com.school.management.enrollment.repository.EnrollmentRepository;
import com.school.management.schedule.entity.ClassSchedule;
import com.school.management.schedule.exception.ClassScheduleNotFoundException;
import com.school.management.schedule.repository.ClassScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

        private final AttendanceRepository attendanceRepository;
        private final EnrollmentRepository enrollmentRepository;
        private final ClassScheduleRepository classScheduleRepository;

        public AttendanceService(
                        AttendanceRepository attendanceRepository,
                        EnrollmentRepository enrollmentRepository,
                        ClassScheduleRepository classScheduleRepository) {
                this.attendanceRepository = attendanceRepository;
                this.enrollmentRepository = enrollmentRepository;
                this.classScheduleRepository = classScheduleRepository;
        }

        public List<AttendanceResponse> getAllAttendances() {
                return attendanceRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        public AttendanceResponse getAttendanceById(Long id) {
                Attendance attendance = getAttendanceEntityById(id);

                return mapToResponse(attendance);
        }

        public AttendanceResponse createAttendance(AttendanceRequest request) {
                Enrollment enrollment = getEnrollmentById(request.getEnrollmentId());
                ClassSchedule classSchedule = getClassScheduleById(request.getClassScheduleId());

                validateAttendanceContext(
                                enrollment,
                                classSchedule,
                                request);

                validateAttendanceDoesNotAlreadyExist(
                                enrollment.getId(),
                                classSchedule.getId(),
                                request);

                Attendance attendance = new Attendance();

                attendance.setEnrollment(enrollment);
                attendance.setClassSchedule(classSchedule);
                attendance.setAttendanceDate(request.getAttendanceDate());
                attendance.setStatus(request.getStatus());
                attendance.setRemarks(request.getRemarks());

                Attendance savedAttendance = attendanceRepository.save(attendance);

                return mapToResponse(savedAttendance);
        }

        public AttendanceResponse updateAttendance(
                        Long id,
                        AttendanceRequest request) {
                Attendance attendance = getAttendanceEntityById(id);

                Enrollment enrollment = getEnrollmentById(request.getEnrollmentId());
                ClassSchedule classSchedule = getClassScheduleById(request.getClassScheduleId());

                validateAttendanceContext(
                                enrollment,
                                classSchedule,
                                request);

                validateAttendanceDoesNotAlreadyExistForUpdate(
                                enrollment.getId(),
                                classSchedule.getId(),
                                request,
                                id);

                attendance.setEnrollment(enrollment);
                attendance.setClassSchedule(classSchedule);
                attendance.setAttendanceDate(request.getAttendanceDate());
                attendance.setStatus(request.getStatus());
                attendance.setRemarks(request.getRemarks());

                Attendance updatedAttendance = attendanceRepository.save(attendance);

                return mapToResponse(updatedAttendance);
        }

        public void deleteAttendance(Long id) {
                Attendance attendance = getAttendanceEntityById(id);

                attendanceRepository.delete(attendance);
        }

        private Attendance getAttendanceEntityById(Long id) {
                return attendanceRepository.findById(id)
                                .orElseThrow(() -> new AttendanceNotFoundException(id));
        }

        private Enrollment getEnrollmentById(Long id) {
                return enrollmentRepository.findById(id)
                                .orElseThrow(() -> new EnrollmentNotFoundException(id));
        }

        private ClassSchedule getClassScheduleById(Long id) {
                return classScheduleRepository.findById(id)
                                .orElseThrow(() -> new ClassScheduleNotFoundException(id));
        }

        private void validateAttendanceContext(
                        Enrollment enrollment,
                        ClassSchedule classSchedule,
                        AttendanceRequest request) {
                TeacherAssignment assignment = classSchedule.getTeacherAssignment();

                validateClassroom(enrollment, assignment);

                validateAcademicYear(enrollment, assignment);

                validateAttendanceDay(classSchedule, request);
        }

        private void validateClassroom(
                        Enrollment enrollment,
                        TeacherAssignment assignment) {
                Long enrollmentClassroomId = enrollment.getClassroom().getId();

                Long scheduleClassroomId = assignment.getClassroom().getId();

                if (!enrollmentClassroomId.equals(scheduleClassroomId)) {
                        throw new InvalidAttendanceClassroomException();
                }
        }

        private void validateAcademicYear(
                        Enrollment enrollment,
                        TeacherAssignment assignment) {
                Long enrollmentAcademicYearId = enrollment.getAcademicYear().getId();

                Long scheduleAcademicYearId = assignment.getAcademicYear().getId();

                if (!enrollmentAcademicYearId.equals(scheduleAcademicYearId)) {
                        throw new InvalidAttendanceAcademicYearException();
                }
        }

        private void validateAttendanceDay(
                        ClassSchedule classSchedule,
                        AttendanceRequest request) {
                if (!request.getAttendanceDate()
                                .getDayOfWeek()
                                .equals(classSchedule.getDayOfWeek())) {

                        throw new InvalidAttendanceDayException();
                }
        }

        private void validateAttendanceDoesNotAlreadyExist(
                        Long enrollmentId,
                        Long classScheduleId,
                        AttendanceRequest request) {
                boolean alreadyExists = attendanceRepository
                                .existsByEnrollmentIdAndClassScheduleIdAndAttendanceDate(
                                                enrollmentId,
                                                classScheduleId,
                                                request.getAttendanceDate());

                if (alreadyExists) {
                        throw new AttendanceAlreadyExistsException(
                                        enrollmentId,
                                        classScheduleId);
                }
        }

        private void validateAttendanceDoesNotAlreadyExistForUpdate(
                        Long enrollmentId,
                        Long classScheduleId,
                        AttendanceRequest request,
                        Long attendanceId) {
                boolean alreadyExists = attendanceRepository
                                .existsByEnrollmentIdAndClassScheduleIdAndAttendanceDateAndIdNot(
                                                enrollmentId,
                                                classScheduleId,
                                                request.getAttendanceDate(),
                                                attendanceId);

                if (alreadyExists) {
                        throw new AttendanceAlreadyExistsException(
                                        enrollmentId,
                                        classScheduleId);
                }
        }

        private AttendanceResponse mapToResponse(Attendance attendance) {

                Enrollment enrollment = attendance.getEnrollment();

                ClassSchedule classSchedule = attendance.getClassSchedule();

                TeacherAssignment assignment = classSchedule.getTeacherAssignment();

                return new AttendanceResponse(
                                attendance.getId(),

                                enrollment.getId(),

                                enrollment.getStudent().getId(),
                                enrollment.getStudent().getFirstName()
                                                + " "
                                                + enrollment.getStudent().getLastName(),

                                enrollment.getClassroom().getId(),
                                enrollment.getClassroom().getName(),

                                classSchedule.getId(),

                                assignment.getSubject().getId(),
                                assignment.getSubject().getName(),

                                assignment.getTeacher().getId(),
                                assignment.getTeacher().getFirstName()
                                                + " "
                                                + assignment.getTeacher().getLastName(),

                                enrollment.getAcademicYear().getId(),
                                enrollment.getAcademicYear().getName(),

                                classSchedule.getDayOfWeek(),
                                classSchedule.getStartTime(),
                                classSchedule.getEndTime(),

                                attendance.getAttendanceDate(),
                                attendance.getStatus(),
                                attendance.getRemarks());
        }
}