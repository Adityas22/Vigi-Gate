package com.example.vigi_gate.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "daily_reports")
public class DailyReport {
    @Id
    private LocalDate reportDate;

    private int totalVisitors;
    private int greenCount;
    private int yellowCount;
    private int redCount;

    private String aiInsight;
}
