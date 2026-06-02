package com.school.management.controller;


import com.school.management.dto.AuthResponse;
import com.school.management.dto.LoginRequest;
import com.school.management.dto.RegisterRequest;
import com.school.management.dto.UserResponse;
import org.springframework.security.core.Authentication;
import com.school.management.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

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