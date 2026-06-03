package com.example.vigi_gate.service;

import com.example.vigi_gate.dto.RegisterRequest;
import com.example.vigi_gate.dto.VisitResponse;
import com.example.vigi_gate.model.Visit;
import com.example.vigi_gate.model.VisitStatus;
import com.example.vigi_gate.model.Visitor;
import com.example.vigi_gate.repository.VisitRepository;
import com.example.vigi_gate.repository.VisitorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitorService {

    private final VisitorRepository visitorRepository;
    private final VisitRepository visitRepository;
    private final RiskEngineService riskEngineService;

    @Transactional
    public VisitResponse registerVisitor(RegisterRequest request) {
        // Find existing or create new visitor
        Visitor visitor = visitorRepository.findByNik(request.getNik())
                .orElseGet(() -> {
                    Visitor newVisitor = new Visitor();
                    newVisitor.setNik(request.getNik());
                    return newVisitor;
                });
        
        visitor.setName(request.getName());
        if (request.getPhotoUrl() != null && !request.getPhotoUrl().isEmpty()) {
            visitor.setPhotoUrl(request.getPhotoUrl());
        }
        visitor = visitorRepository.save(visitor);

        // Calculate risk score
        RiskEngineService.RiskResult riskResult = riskEngineService.calculateRisk(visitor);

        // Create visit log
        Visit visit = new Visit();
        visit.setVisitor(visitor);
        visit.setPurpose(request.getPurpose());
        visit.setRiskScore(riskResult.score());
        visit.setRiskReason(riskResult.reason());
        visit.setStatus(VisitStatus.ACTIVE);
        
        visit = visitRepository.save(visit);

        return mapToResponse(visit);
    }

    public List<VisitResponse> getActiveVisitors() {
        return visitRepository.findByStatusOrderByCheckInTimeDesc(VisitStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VisitResponse checkout(UUID visitId) {
        Visit visit = visitRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit not found"));
        
        if (visit.getStatus() == VisitStatus.COMPLETED) {
            throw new RuntimeException("Visit is already completed");
        }

        visit.setCheckOutTime(LocalDateTime.now());
        visit.setStatus(VisitStatus.COMPLETED);
        visit = visitRepository.save(visit);

        return mapToResponse(visit);
    }

    public List<VisitResponse> getHistory() {
        return visitRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private VisitResponse mapToResponse(Visit visit) {
        VisitResponse response = new VisitResponse();
        response.setId(visit.getId());
        response.setNik(visit.getVisitor().getNik());
        response.setName(visit.getVisitor().getName());
        response.setPhotoUrl(visit.getVisitor().getPhotoUrl());
        response.setPurpose(visit.getPurpose());
        response.setCheckInTime(visit.getCheckInTime());
        response.setCheckOutTime(visit.getCheckOutTime());
        response.setRiskScore(visit.getRiskScore());
        response.setRiskReason(visit.getRiskReason());
        response.setStatus(visit.getStatus());
        return response;
    }
}
