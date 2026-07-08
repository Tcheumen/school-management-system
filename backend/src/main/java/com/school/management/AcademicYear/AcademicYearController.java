package com.school.management.AcademicYear;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic-years")
public class AcademicYearController {

    private final AcademicYearService academicYearService;

    public AcademicYearController(AcademicYearService academicYearService) {
        this.academicYearService = academicYearService;
    }

    @GetMapping
    public List<AcademicYearResponse> getAllAcademicYears() {
        return academicYearService.getAllAcademicYears();
    }

    @GetMapping("/{id}")
    public AcademicYearResponse getAcademicYearById(@PathVariable Long id) {
        return academicYearService.getAcademicYearById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AcademicYearResponse createAcademicYear(@Valid @RequestBody AcademicYearRequest request) {
        return academicYearService.createAcademicYear(request);
    }

    @PutMapping("/{id}")
    public AcademicYearResponse updateAcademicYear(
            @PathVariable Long id,
            @Valid @RequestBody AcademicYearRequest request) {
        return academicYearService.updateAcademicYear(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAcademicYear(@PathVariable Long id) {
        academicYearService.deleteAcademicYear(id);
    }
}