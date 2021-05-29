package com.ingsoft2021.SupermarketApp.security.login;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.function.EntityResponse;

import javax.swing.text.html.parser.Entity;
import javax.websocket.server.PathParam;

@AllArgsConstructor
@RestController
@RequestMapping(path = "/")
public class LoginController {

    private  final LoginService loginService;

    @PostMapping(path = "/login")
    String login(@RequestBody LoginRequest loginRequest){
        try {
            String token = loginService.login(loginRequest);
            return token;
        }catch (IllegalArgumentException e){
            return e.getMessage();
        }
    }

    @PostMapping(path = "/user-logout")
    ResponseEntity<Boolean> logout(@RequestParam String token){
        try {
            loginService.logout(token);
            return ResponseEntity.status(200).body(true);
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(401).body(false);
        }
    }
}
