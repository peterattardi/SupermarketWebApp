package com.ingsoft2021.SupermarketApp.security.login;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
public class LoginController {

    private  final LoginService loginService;

    @PostMapping(path = "/login")
    String login(@RequestBody LoginRequest loginRequest){
        try {
            String token = loginService.login(loginRequest);
            System.out.printf("token="+token);
            return token;
        }catch (IllegalArgumentException e){
            return e.getMessage();
        }
    }
}
