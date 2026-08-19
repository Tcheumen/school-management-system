package com.school.management.auth.controller;


import org.springframework.security.core.Authentication;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import com.school.management.auth.dto.AuthResponse;
import com.school.management.auth.dto.LoginRequest;
import com.school.management.auth.dto.RegisterRequest;
import com.school.management.auth.dto.UserResponse;
import com.school.management.auth.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
       return authService.getCurrentUser(authentication.getName());
    }
}