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
        LocalDateTime last24Hours = LocalDateTime.now().minusHours(24);

        // Query by NIK for more accurate counting across visits
        int recentVisits = visitRepository.countByNikAndCheckInTimeAfter(visitor.getNik(), last24Hours);

        // Kunjungan Ke-1 -> GREEN  (score: 10)
        // Kunjungan Ke-2 -> YELLOW (score: 60)
        // Kunjungan Ke-3+ -> RED  (score: 90)
        if (recentVisits >= 2) {
            return new RiskResult(RiskScore.RED, 90, "Potential spam visitor activity detected.");
        } else if (recentVisits == 1) {
            return new RiskResult(RiskScore.YELLOW, 60, "Repeated visit detected within 24 hours.");
        }

        return new RiskResult(RiskScore.GREEN, 10, "First visit detected. Normal visitor behavior.");
    }

    public record RiskResult(RiskScore score, int numericScore, String reason) {}
}
