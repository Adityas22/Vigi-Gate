package com.example.vigi_gate.service;

import org.springframework.stereotype.Service;

@Service
public class AIService {
    
    public String generateInsight(int total, int green, int yellow, int red) {
        // In a real application, this would call OpenAI or another LLM API.
        // For now, we return a mock generated insight.
        
        StringBuilder insight = new StringBuilder();
        insight.append("AI Security Insight: ");
        
        if (red > 0) {
            insight.append(String.format("CRITICAL - %d high-risk visitors detected. Immediate review of security footage recommended. ", red));
        }
        if (yellow > (total * 0.3)) {
            insight.append("WARNING - Unusually high volume of out-of-hours or frequent visitors. Consider tightening access control. ");
        }
        if (red == 0 && yellow == 0) {
            insight.append("NORMAL - All visits followed standard patterns. No anomalies detected.");
        } else if (green > (total * 0.8)) {
            insight.append("Overall traffic remains largely normal despite minor anomalies.");
        }
        
        return insight.toString();
    }
}
