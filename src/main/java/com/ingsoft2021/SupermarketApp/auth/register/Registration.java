package com.ingsoft2021.SupermarketApp.auth.register;

import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import lombok.AllArgsConstructor;
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
    @Enumerated(EnumType.STRING)
    private AppUserRole appUserRole;
    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime expiresAt;

    public Registration(String email, AppUserRole appUserRole, String token, LocalDateTime createdAt, LocalDateTime expiresAt) {
        this.email = email;
        this.appUserRole = appUserRole;
        this.token = token;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }
}
