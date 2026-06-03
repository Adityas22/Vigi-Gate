package com.example.vigi_gate.controller;

import com.example.vigi_gate.dto.RegisterRequest;
import com.example.vigi_gate.dto.VisitResponse;
import com.example.vigi_gate.service.VisitorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/visitors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VisitorController {

    private final VisitorService visitorService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public VisitResponse register(@Valid @RequestBody RegisterRequest request) {
        return visitorService.registerVisitor(request);
    }

    @GetMapping("/active")
    public List<VisitResponse> getActive() {
        return visitorService.getActiveVisitors();
    }

    @PutMapping("/{visitId}/checkout")
    public VisitResponse checkout(@PathVariable UUID visitId) {
        return visitorService.checkout(visitId);
    }

    @GetMapping("/history")
    public List<VisitResponse> getHistory() {
        return visitorService.getHistory();
    }
}
