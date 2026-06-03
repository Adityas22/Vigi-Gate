package com.example.vigi_gate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "NIK is required")
    private String nik;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    private String photoUrl;
}
