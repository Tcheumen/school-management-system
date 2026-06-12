package com.school.management.service;

import com.school.management.dto.SubjectRequest;
import com.school.management.dto.SubjectResponse;
import com.school.management.entity.Subject;
import com.school.management.repository.SubjectRepository;
import com.school.management.exception.SubjectNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new SubjectNotFoundException(id));

        return mapToResponse(subject);
    }

    public SubjectResponse createSubject(SubjectRequest request) {
        Subject subject = new Subject();

        subject.setName(request.getName());
        subject.setDescription(request.getDescription());

        Subject savedSubject = subjectRepository.save(subject);

        return mapToResponse(savedSubject);
    }

    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new SubjectNotFoundException(id));

        subject.setName(request.getName());
        subject.setDescription(request.getDescription());

        Subject updatedSubject = subjectRepository.save(subject);

        return mapToResponse(updatedSubject);
    }

    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new SubjectNotFoundException(id));

        subjectRepository.delete(subject);
    }

    private SubjectResponse mapToResponse(Subject subject) {
        return new SubjectResponse(
                subject.getId(),
                subject.getName(),
                subject.getDescription());
    }
}