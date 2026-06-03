package com.example.vigi_gate.repository;

import com.example.vigi_gate.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface VisitorRepository extends JpaRepository<Visitor, UUID> {
    Optional<Visitor> findByNik(String nik);
}
