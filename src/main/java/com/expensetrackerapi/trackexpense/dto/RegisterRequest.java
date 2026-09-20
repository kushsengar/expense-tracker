package com.expensetrackerapi.trackexpense.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    String email;

    @NotBlank
    String password;
    public RegisterRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
