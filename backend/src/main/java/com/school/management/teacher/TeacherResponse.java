package com.school.management.teacher;

public class TeacherResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String specialty;

    public TeacherResponse(Long id, String firstName, String lastName, String email, String phoneNumber,
            String specialty) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.specialty = specialty;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getSpecialty() {
        return specialty;
    }
}