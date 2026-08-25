package com.school.management.reportcard.controller;

import com.school.management.reportcard.dto.ReportCardResponse;
import com.school.management.reportcard.service.ReportCardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report-cards")
public class ReportCardController {

    private final ReportCardService reportCardService;

    public ReportCardController(ReportCardService reportCardService) {
        this.reportCardService = reportCardService;
    }

    @GetMapping("/enrollments/{enrollmentId}")
    public ReportCardResponse getReportCard(
            @PathVariable Long enrollmentId,
            @RequestParam String term) {
        return reportCardService.getReportCard(enrollmentId, term);
    }
}