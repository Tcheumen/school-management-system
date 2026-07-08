package com.school.management.auth;

import com.school.management.shared.user.Role;

public class AuthResponse {

    private String token;
    private String email;
    private Role role;

    public AuthResponse(String token, String email, Role role) {
        this.token = token;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}