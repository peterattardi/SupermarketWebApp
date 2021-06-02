package com.ingsoft2021.SupermarketApp.util.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class LoginRequest {
    private String email;
    private String password;
    private String appUserRole;

}
