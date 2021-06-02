package com.ingsoft2021.SupermarketApp.util.Request;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@EqualsAndHashCode
@AllArgsConstructor
@Getter
@Setter
public class AuthResponse {
    private String idToken;
    private String email;
    private LocalDateTime expiresAt;
}
