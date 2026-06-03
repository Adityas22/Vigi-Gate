package com.example.vigi_gate.controller;

import com.example.vigi_gate.dto.DailySummaryResponse;
import com.example.vigi_gate.model.DailyReport;
import com.example.vigi_gate.service.DailySummaryService;
import com.example.vigi_gate.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;
    private final DailySummaryService dailySummaryService;

    @GetMapping("/daily")
    public List<DailyReport> getReports() {
        return reportService.getAllReports();
    }

    @PostMapping("/generate-today")
    public DailyReport generateToday() {
        return reportService.generateReportForDate(LocalDate.now());
    }

    @GetMapping("/daily-summary")
    public DailySummaryResponse getDailySummary() {
        return dailySummaryService.generateTodaySummary();
    }
}
