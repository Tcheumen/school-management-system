package com.school.management.academicYear.service;

import org.springframework.stereotype.Service;

import com.school.management.academicYear.dto.AcademicYearRequest;
import com.school.management.academicYear.dto.AcademicYearResponse;
import com.school.management.academicYear.entity.AcademicYear;
import com.school.management.academicYear.exception.AcademicYearNotFoundException;
import com.school.management.academicYear.repository.AcademicYearRepository;

import java.util.List;

@Service
public class AcademicYearService {

    private final AcademicYearRepository academicYearRepository;

    public AcademicYearService(AcademicYearRepository academicYearRepository) {
        this.academicYearRepository = academicYearRepository;
    }

    public List<AcademicYearResponse> getAllAcademicYears() {
        return academicYearRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AcademicYearResponse getAcademicYearById(Long id) {
        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new AcademicYearNotFoundException(id));

        return mapToResponse(academicYear);
    }

    public AcademicYearResponse createAcademicYear(AcademicYearRequest request) {
        AcademicYear academicYear = new AcademicYear();

        academicYear.setName(request.getName());
        academicYear.setStartDate(request.getStartDate());
        academicYear.setEndDate(request.getEndDate());
        academicYear.setActive(request.isActive());

        if (request.isActive()) {
            academicYearRepository.findByActiveTrue()
                    .ifPresent(activeYear -> {
                        activeYear.setActive(false);
                        academicYearRepository.save(activeYear);
                    });
        }
        AcademicYear savedAcademicYear = academicYearRepository.save(academicYear);

        return mapToResponse(savedAcademicYear);
    }

    public AcademicYearResponse updateAcademicYear(Long id, AcademicYearRequest request) {
        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new AcademicYearNotFoundException(id));

        academicYear.setName(request.getName());
        academicYear.setStartDate(request.getStartDate());
        academicYear.setEndDate(request.getEndDate());
        academicYear.setActive(request.isActive());

        if (request.isActive()) {
            academicYearRepository.findByActiveTrue()
                    .ifPresent(activeYear -> {
                        activeYear.setActive(false);
                        academicYearRepository.save(activeYear);
                    });
        }

        AcademicYear updatedAcademicYear = academicYearRepository.save(academicYear);

        return mapToResponse(updatedAcademicYear);
    }

    public void deleteAcademicYear(Long id) {
        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new AcademicYearNotFoundException(id));

        academicYearRepository.delete(academicYear);
    }

    private AcademicYearResponse mapToResponse(AcademicYear academicYear) {
        return new AcademicYearResponse(
                academicYear.getId(),
                academicYear.getName(),
                academicYear.getStartDate(),
                academicYear.getEndDate(),
                academicYear.isActive());
    }
}