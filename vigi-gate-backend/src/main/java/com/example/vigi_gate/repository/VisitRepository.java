package com.example.vigi_gate.repository;

import com.example.vigi_gate.model.Visit;
import com.example.vigi_gate.model.VisitStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface VisitRepository extends JpaRepository<Visit, UUID> {
    List<Visit> findByStatusOrderByCheckInTimeDesc(VisitStatus status);
    List<Visit> findByVisitorIdAndCheckInTimeAfter(UUID visitorId, LocalDateTime since);
    int countByVisitorIdAndCheckInTimeAfter(UUID visitorId, LocalDateTime since);

    @Query("SELECT v FROM Visit v WHERE v.checkInTime >= :start AND v.checkInTime <= :end ORDER BY v.checkInTime DESC")
    List<Visit> findAllByCheckInTimeBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(v) FROM Visit v JOIN v.visitor vis WHERE vis.nik = :nik AND v.checkInTime >= :since")
    int countByNikAndCheckInTimeAfter(@Param("nik") String nik, @Param("since") LocalDateTime since);
}
