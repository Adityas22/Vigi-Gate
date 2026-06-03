package com.example.vigi_gate.repository;

import com.example.vigi_gate.model.DailyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;

public interface DailyReportRepository extends JpaRepository<DailyReport, LocalDate> {
}
