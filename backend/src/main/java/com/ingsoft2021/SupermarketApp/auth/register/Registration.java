package com.ingsoft2021.SupermarketApp.auth.register;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;


@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "register")
public class Registration {

    @Id
    private String email;
    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime expiresAt;

    public Registration(String email, String token, LocalDateTime createdAt, LocalDateTime expiresAt) {
        this.email = email;
        this.token = token;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }
}
