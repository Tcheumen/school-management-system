package com.school.management.usermanagement.dto;

public record UpdateUserRequest(
        String fullName,
        String email
) {
}