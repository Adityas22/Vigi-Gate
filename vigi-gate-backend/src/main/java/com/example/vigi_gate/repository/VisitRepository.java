package com.example.vigi_gate.repository;

import com.example.vigi_gate.model.Visit;
import com.example.vigi_gate.model.VisitStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface VisitRepository extends JpaRepository<Visit, UUID> {
    List<Visit> findByStatusOrderByCheckInTimeDesc(VisitStatus status);
    List<Visit> findByVisitorIdAndCheckInTimeAfter(UUID visitorId, LocalDateTime since);
    int countByVisitorIdAndCheckInTimeAfter(UUID visitorId, LocalDateTime since);
}
