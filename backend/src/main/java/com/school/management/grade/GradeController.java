package com.school.management.grade;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @GetMapping
    public List<GradeResponse> getAllGrades() {
        return gradeService.getAllGrades();
    }

    @GetMapping("/{id}")
    public GradeResponse getGradeById(@PathVariable Long id) {
        return gradeService.getGradeById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GradeResponse createGrade(@Valid @RequestBody GradeRequest request) {
        return gradeService.createGrade(request);
    }

    @PutMapping("/{id}")
    public GradeResponse updateGrade(
            @PathVariable Long id,
            @Valid @RequestBody GradeRequest request) {
        return gradeService.updateGrade(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGrade(@PathVariable Long id) {
        gradeService.deleteGrade(id);
    }
}