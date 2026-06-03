package com.example.vigi_gate.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class HighRiskVisitorDto {
    private String fullName;
    private String nik;
    private String riskLevel;
    private int riskScore;
    private String riskReason;
    private LocalDateTime checkInTime;
}
