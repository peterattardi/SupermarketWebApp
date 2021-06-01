package com.ingsoft2021.SupermarketApp.auth.login;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@AllArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:4200/")
@RequestMapping(path = "/")
public class LoginController {

    private  final LoginService loginService;

    @PostMapping(path = "/login")
    ResponseEntity login(@RequestBody LoginRequest loginRequest){
        try {
            AuthResponse authResponse = loginService.login(loginRequest);
            return ResponseEntity.status(200).body(authResponse);
        }catch (IllegalStateException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping(path = "/user-logout")
    ResponseEntity<Boolean> logout(@RequestParam String token){
        try {
            loginService.logout(token);
            return ResponseEntity.status(200).body(true);
        }catch (IllegalStateException e){
            return ResponseEntity.status(401).body(false);
        }
    }
}
