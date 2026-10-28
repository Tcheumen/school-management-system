package com.school.management.usermanagement.service;

import java.util.List;
import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.school.management.auth.dto.UserResponse;
import com.school.management.shared.exception.BusinessException;
import com.school.management.shared.user.Role;
import com.school.management.shared.user.User;
import com.school.management.shared.user.UserRepository;
import com.school.management.student.entity.Student;
import com.school.management.student.repository.StudentRepository;
import com.school.management.teacher.entity.Teacher;
import com.school.management.teacher.repository.TeacherRepository;
import com.school.management.usermanagement.dto.CreateUserRequest;
import com.school.management.usermanagement.dto.UpdateUserRequest;

@Service
public class UserManagementService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;

    public UserManagementService(
            UserRepository userRepository,
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {

        if (request == null
                || request.fullName() == null
                || request.fullName().isBlank()
                || request.email() == null
                || request.email().isBlank()
                || request.password() == null
                || request.role() == null) {

            throw new BusinessException(
                    "All fields are required");
        }

        String email = normalizeEmail(request.email());

        if (request.password().length() < 8) {
            throw new BusinessException(
                    "Password must contain at least 8 characters");
        }

        if (userRepository.existsByEmail(email)) {
            throw new BusinessException(
                    "Email already exists");
        }

        Student student = null;
        Teacher teacher = null;

        if (request.role() == Role.STUDENT) {

            student = studentRepository
                    .findByEmailIgnoreCase(email)
                    .orElseThrow(() ->
                            new BusinessException(
                                    "No student profile found with this email"));

            if (student.getUser() != null) {
                throw new BusinessException(
                        "Student already has a user account");
            }
        }

        if (request.role() == Role.TEACHER) {

            teacher = teacherRepository
                    .findByEmailIgnoreCase(email)
                    .orElseThrow(() ->
                            new BusinessException(
                                    "No teacher profile found with this email"));

            if (teacher.getUser() != null) {
                throw new BusinessException(
                        "Teacher already has a user account");
            }
        }

        User user = new User();

        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPassword(
                passwordEncoder.encode(request.password()));
        user.setRole(request.role());

        User savedUser = userRepository.save(user);

        if (student != null) {
            student.setUser(savedUser);
            studentRepository.save(student);
        }

        if (teacher != null) {
            teacher.setUser(savedUser);
            teacherRepository.save(teacher);
        }

        return mapToResponse(savedUser);
    }

    @Transactional
    public UserResponse updateUser(
            Long id,
            UpdateUserRequest request) {

        User user = findUser(id);

        if (request == null
                || request.fullName() == null
                || request.fullName().isBlank()
                || request.email() == null
                || request.email().isBlank()) {

            throw new BusinessException(
                    "Full name and email are required");
        }

        String fullName = request.fullName().trim();
        String email = normalizeEmail(request.email());

        boolean emailChanged =
                !user.getEmail().equalsIgnoreCase(email);

        if (emailChanged) {

            if (userRepository.existsByEmail(email)) {
                throw new BusinessException(
                        "Email already exists");
            }

            // The account email is also the JWT identity.
            // Changing a linked account email needs a
            // dedicated workflow that updates both profiles.
            if (user.getRole() != Role.ADMIN) {
                throw new BusinessException(
                        "Email changes for student and teacher accounts are not supported");
            }
        }

        user.setFullName(fullName);
        user.setEmail(email);

        if (user.getRole() == Role.STUDENT) {

            Student student = studentRepository
                    .findByUserId(id)
                    .orElseThrow(() ->
                            new BusinessException(
                                    "Student profile not found"));

            updateStudentName(student, fullName);
            studentRepository.save(student);
        }

        if (user.getRole() == Role.TEACHER) {

            Teacher teacher = teacherRepository
                    .findByUserId(id)
                    .orElseThrow(() ->
                            new BusinessException(
                                    "Teacher profile not found"));

            updateTeacherName(teacher, fullName);
            teacherRepository.save(teacher);
        }

        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id, String currentEmail) {

        User user = findUser(id);

        if (user.getEmail().equalsIgnoreCase(currentEmail)) {
            throw new BusinessException(
                    "You cannot delete your own account");
        }

        if (studentRepository.findByUserId(id).isPresent()
                || teacherRepository.findByUserId(id).isPresent()) {

            throw new BusinessException(
                    "This account is linked to a student or teacher profile and cannot be deleted");
        }

        userRepository.delete(user);
    }

    private User findUser(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new BusinessException("User not found"));
    }

    private String normalizeEmail(String email) {

        String normalized =
                email.trim().toLowerCase(Locale.ROOT);

        if (!normalized.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new BusinessException(
                    "Invalid email address");
        }

        return normalized;
    }

    private void updateStudentName(
            Student student,
            String fullName) {

        String[] names = fullName.split("\\s+", 2);

        student.setFirstName(names[0]);
        student.setLastName(
                names.length > 1 ? names[1] : "");
    }

    private void updateTeacherName(
            Teacher teacher,
            String fullName) {

        String[] names = fullName.split("\\s+", 2);

        teacher.setFirstName(names[0]);
        teacher.setLastName(
                names.length > 1 ? names[1] : "");
    }

    private UserResponse mapToResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole());
    }
}