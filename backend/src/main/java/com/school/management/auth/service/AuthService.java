package com.school.management.auth.service;

import com.school.management.auth.dto.AuthResponse;
import com.school.management.auth.dto.LoginRequest;
import com.school.management.auth.dto.RegisterRequest;
import com.school.management.auth.dto.UserResponse;

import com.school.management.shared.exception.BusinessException;
import com.school.management.shared.security.JwtService;
import com.school.management.shared.user.Role;
import com.school.management.shared.user.User;
import com.school.management.shared.user.UserRepository;

import com.school.management.student.entity.Student;
import com.school.management.student.exception.StudentNotFoundException;
import com.school.management.student.repository.StudentRepository;

import com.school.management.teacher.entity.Teacher;
import com.school.management.teacher.exception.TeacherNotFoundException;
import com.school.management.teacher.repository.TeacherRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            StudentRepository studentRepository,
            TeacherRepository teacherRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already exists");
        }

        validateRegistrationRequest(request);

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        linkUserToDomainProfile(savedUser, request);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getEmail(),
                savedUser.getRole());
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new BusinessException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole());
    }

    public UserResponse getCurrentUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("User not found"));

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole());
    }

    private void validateRegistrationRequest(RegisterRequest request) {

        if (request.getRole() == Role.STUDENT
                && request.getStudentId() == null) {
            throw new BusinessException(
                    "Student id is required for STUDENT role");
        }

        if (request.getRole() == Role.TEACHER
                && request.getTeacherId() == null) {
            throw new BusinessException(
                    "Teacher id is required for TEACHER role");
        }
    }

    private void linkUserToDomainProfile(
            User savedUser,
            RegisterRequest request) {

        switch (request.getRole()) {

            case STUDENT -> linkStudent(savedUser, request.getStudentId());

            case TEACHER -> linkTeacher(savedUser, request.getTeacherId());

            case ADMIN -> {
                // Admin does not require Student or Teacher profile.
            }
        }
    }

    private void linkStudent(User user, Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));

        if (student.getUser() != null) {
            throw new BusinessException(
                    "Student already has a user account");
        }

        student.setUser(user);
        studentRepository.save(student);
    }

    private void linkTeacher(User user, Long teacherId) {

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new TeacherNotFoundException(teacherId));

        if (teacher.getUser() != null) {
            throw new BusinessException(
                    "Teacher already has a user account");
        }

        teacher.setUser(user);
        teacherRepository.save(teacher);
    }
}