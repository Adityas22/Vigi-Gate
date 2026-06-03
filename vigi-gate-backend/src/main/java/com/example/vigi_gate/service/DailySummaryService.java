package com.example.vigi_gate.service;

import com.example.vigi_gate.dto.DailySummaryResponse;
import com.example.vigi_gate.dto.HighRiskVisitorDto;
import com.example.vigi_gate.model.RiskScore;
import com.example.vigi_gate.model.Visit;
import com.example.vigi_gate.model.VisitStatus;
import com.example.vigi_gate.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DailySummaryService {

    private final VisitRepository visitRepository;

    public DailySummaryResponse generateTodaySummary() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);

        List<Visit> todayVisits = visitRepository.findAllByCheckInTimeBetween(start, end);

        int totalVisitors = todayVisits.size();
        int uniqueVisitors = (int) todayVisits.stream()
                .map(v -> v.getVisitor().getNik())
                .distinct()
                .count();
        int checkedOut = (int) todayVisits.stream()
                .filter(v -> v.getStatus() == VisitStatus.COMPLETED)
                .count();
        int insideBuilding = (int) todayVisits.stream()
                .filter(v -> v.getStatus() == VisitStatus.ACTIVE)
                .count();

        // Risk Distribution
        Map<String, Long> riskDistribution = new LinkedHashMap<>();
        riskDistribution.put("GREEN", todayVisits.stream().filter(v -> v.getRiskScore() == RiskScore.GREEN).count());
        riskDistribution.put("YELLOW", todayVisits.stream().filter(v -> v.getRiskScore() == RiskScore.YELLOW).count());
        riskDistribution.put("RED", todayVisits.stream().filter(v -> v.getRiskScore() == RiskScore.RED).count());

        // High Risk Visitors (RED only)
        List<HighRiskVisitorDto> highRiskVisitors = todayVisits.stream()
                .filter(v -> v.getRiskScore() == RiskScore.RED)
                .map(v -> {
                    HighRiskVisitorDto dto = new HighRiskVisitorDto();
                    dto.setFullName(v.getVisitor().getName());
                    dto.setNik(v.getVisitor().getNik());
                    dto.setRiskLevel(v.getRiskScore().name());
                    dto.setRiskScore(v.getRiskScoreValue());
                    dto.setRiskReason(v.getRiskReason());
                    dto.setCheckInTime(v.getCheckInTime());
                    return dto;
                })
                .collect(Collectors.toList());

        // AI Insight
        String aiInsight = generateAiInsight(totalVisitors, riskDistribution);

        DailySummaryResponse response = new DailySummaryResponse();
        response.setDate(today);
        response.setTotalVisitors(totalVisitors);
        response.setUniqueVisitors(uniqueVisitors);
        response.setCheckedOut(checkedOut);
        response.setInsideBuilding(insideBuilding);
        response.setRiskDistribution(riskDistribution);
        response.setHighRiskVisitors(highRiskVisitors);
        response.setAiInsight(aiInsight);

        return response;
    }

    private String generateAiInsight(int total, Map<String, Long> dist) {
        if (total == 0) {
            return "Tidak ada kunjungan yang tercatat hari ini.";
        }

        long green = dist.getOrDefault("GREEN", 0L);
        long yellow = dist.getOrDefault("YELLOW", 0L);
        long red = dist.getOrDefault("RED", 0L);

        int greenPct = total > 0 ? (int) (green * 100 / total) : 0;

        StringBuilder insight = new StringBuilder();
        insight.append(String.format(
                "Sebanyak %d kunjungan tercatat hari ini dengan %d pengunjung unik. ",
                total, (long) (total > 0 ? total : 0)
        ));
        insight.append(String.format(
                "Mayoritas pengunjung memiliki status GREEN (%d%%). ",
                greenPct
        ));

        if (red > 0) {
            insight.append(String.format(
                    "Terdapat %d pengunjung dengan status RED yang menunjukkan pola kunjungan berulang dalam 24 jam dan perlu mendapatkan perhatian petugas keamanan. ",
                    red
            ));
        }
        if (yellow > 0) {
            insight.append(String.format(
                    "Sebanyak %d pengunjung berstatus YELLOW karena terdeteksi melakukan kunjungan ulang. ",
                    yellow
            ));
        }
        if (red == 0 && yellow == 0) {
            insight.append("Tidak ada anomali yang terdeteksi. Kondisi keamanan dalam keadaan NORMAL.");
        }

        return insight.toString().trim();
    }
}
