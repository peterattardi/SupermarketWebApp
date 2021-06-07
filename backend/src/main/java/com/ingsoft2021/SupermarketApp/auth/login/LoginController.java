package com.ingsoft2021.SupermarketApp.auth.login;

import com.ingsoft2021.SupermarketApp.util.response.AuthResponse;
import com.ingsoft2021.SupermarketApp.util.request.LoginRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:4200/")
public class LoginController {

    private  final LoginService loginService;

    @PostMapping(path = "admin-user/login")
    public ResponseEntity login(@RequestBody LoginRequest loginRequest){
        try {
            AuthResponse authResponse = loginService.login(loginRequest);
            return ResponseEntity.status(200).body(authResponse);
        }catch (IllegalStateException | NoSuchFieldException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping(path = "guest/login")
    public ResponseEntity loginAsGuest(){
        try{
            AuthResponse authResponse = loginService.loginAsGuest();
            return ResponseEntity.status(200).body(authResponse);
        }catch (Exception e){
            return  ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping(path = "guest/login/existing")
    public ResponseEntity loginAsGuest(@RequestParam String token, @RequestBody LoginRequest loginRequest){
        try{
            AuthResponse authResponse = loginService.loginAsGuest(token, loginRequest);
            return ResponseEntity.status(200).body(authResponse);
        }catch (Exception e){
            return  ResponseEntity.status(401).body(e.getMessage());
        }
    }


    @GetMapping(path = "user/logout")
    public ResponseEntity logout(@RequestParam String token){
        try {
            loginService.logout(token);
            return ResponseEntity.status(200).body("SUCCESS");
        }catch (IllegalStateException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping(path = "any-user/info")
    public ResponseEntity infos(@RequestParam String token){
        try{
            return ResponseEntity.status(200).body(loginService.getInfos(token));
        }catch (IllegalStateException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
