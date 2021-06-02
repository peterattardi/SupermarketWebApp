package com.ingsoft2021.SupermarketApp.auth.login;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "logged_user")
public class Login {


    @Id
    private String email;
    @Enumerated(EnumType.STRING)
    private AppUserRole appUserRole;
    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;


}
