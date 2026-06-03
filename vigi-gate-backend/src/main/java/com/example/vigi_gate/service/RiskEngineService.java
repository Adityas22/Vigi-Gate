package com.example.vigi_gate.service;

import com.example.vigi_gate.model.RiskScore;
import com.example.vigi_gate.model.Visitor;
import com.example.vigi_gate.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RiskEngineService {

    private final VisitRepository visitRepository;

    public RiskResult calculateRisk(Visitor visitor) {
        LocalDateTime now = LocalDateTime.now();
        int hour = now.getHour();

        // Rule 1: Outside business hours (before 7 AM or after 7 PM)
        if (hour < 7 || hour > 19) {
            return new RiskResult(RiskScore.YELLOW, "Visit outside normal business hours");
        }

        // Rule 2: High frequency (more than 3 visits in the last 24 hours)
        LocalDateTime last24Hours = now.minusHours(24);
        int recentVisits = visitRepository.countByVisitorIdAndCheckInTimeAfter(visitor.getId(), last24Hours);
        
        if (recentVisits > 5) {
            return new RiskResult(RiskScore.RED, "Extremely high visit frequency (>5 visits in 24h)");
        } else if (recentVisits > 3) {
            return new RiskResult(RiskScore.YELLOW, "High visit frequency (>3 visits in 24h)");
        }

        return new RiskResult(RiskScore.GREEN, "Normal visit pattern");
    }

    public record RiskResult(RiskScore score, String reason) {}
}
