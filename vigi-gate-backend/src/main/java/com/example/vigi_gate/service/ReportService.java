package com.example.vigi_gate.service;

import com.example.vigi_gate.model.DailyReport;
import com.example.vigi_gate.model.RiskScore;
import com.example.vigi_gate.model.Visit;
import com.example.vigi_gate.repository.DailyReportRepository;
import com.example.vigi_gate.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final VisitRepository visitRepository;
    private final DailyReportRepository reportRepository;
    private final AIService aiService;

    @Scheduled(cron = "0 55 23 * * ?") // Run at 23:55 every day
    @Transactional
    public void generateDailyReportJob() {
        generateReportForDate(LocalDate.now());
    }

    public DailyReport generateReportForDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        
        // This is a simplified query. In reality we might want a custom query.
        List<Visit> todayVisits = visitRepository.findAll().stream()
                .filter(v -> v.getCheckInTime().isAfter(startOfDay) && v.getCheckInTime().isBefore(endOfDay))
                .collect(Collectors.toList());

        int total = todayVisits.size();
        int green = (int) todayVisits.stream().filter(v -> v.getRiskScore() == RiskScore.GREEN).count();
        int yellow = (int) todayVisits.stream().filter(v -> v.getRiskScore() == RiskScore.YELLOW).count();
        int red = (int) todayVisits.stream().filter(v -> v.getRiskScore() == RiskScore.RED).count();

        String insight = aiService.generateInsight(total, green, yellow, red);

        DailyReport report = new DailyReport();
        report.setReportDate(date);
        report.setTotalVisitors(total);
        report.setGreenCount(green);
        report.setYellowCount(yellow);
        report.setRedCount(red);
        report.setAiInsight(insight);

        return reportRepository.save(report);
    }

    public List<DailyReport> getAllReports() {
        return reportRepository.findAll();
    }
}
