package com.school.management.usermanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.school.management.auth.dto.UserResponse;
import com.school.management.usermanagement.dto.CreateUserRequest;
import com.school.management.usermanagement.dto.UpdateUserRequest;
import com.school.management.usermanagement.service.UserManagementService;

@RestController
@RequestMapping("/api/users")
public class UserManagementController {

    private final UserManagementService userManagementService;

    public UserManagementController(
            UserManagementService userManagementService) {

        this.userManagementService = userManagementService;
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userManagementService.getAllUsers();
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @RequestBody CreateUserRequest request) {

        UserResponse user =
                userManagementService.createUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(user);
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {

        return userManagementService.updateUser(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            Authentication authentication) {

        userManagementService.deleteUser(
                id,
                authentication.getName());

        return ResponseEntity.noContent().build();
    }
}