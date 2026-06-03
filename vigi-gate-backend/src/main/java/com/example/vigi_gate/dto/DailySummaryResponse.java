package com.example.vigi_gate.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class DailySummaryResponse {
    private LocalDate date;
    private int totalVisitors;
    private int uniqueVisitors;
    private int checkedOut;
    private int insideBuilding;
    private Map<String, Long> riskDistribution;
    private List<HighRiskVisitorDto> highRiskVisitors;
    private String aiInsight;
}
