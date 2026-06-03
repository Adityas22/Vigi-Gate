package com.example.vigi_gate.dto;

import com.example.vigi_gate.model.RiskScore;
import com.example.vigi_gate.model.VisitStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class VisitResponse {
    private UUID id;
    private String nik;
    private String name;
    private String photoUrl;
    private String purpose;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private RiskScore riskScore;
    private int riskScoreValue;
    private String riskReason;
    private VisitStatus status;
}
