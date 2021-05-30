package com.ingsoft2021.SupermarketApp.auth.login;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
public class AuthResponse {
    private String idToken;
    private String email;
    private LocalDateTime expiresAt;
}
