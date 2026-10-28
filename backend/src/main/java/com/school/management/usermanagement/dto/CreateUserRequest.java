package com.school.management.usermanagement.dto;

import com.school.management.shared.user.Role;

public record CreateUserRequest(
        String fullName,
        String email,
        String password,
        Role role
) {
}