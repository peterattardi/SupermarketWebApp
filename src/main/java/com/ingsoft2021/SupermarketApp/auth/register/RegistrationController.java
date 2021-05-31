package com.ingsoft2021.SupermarketApp.auth.register;


import com.ingsoft2021.SupermarketApp.auth.login.AuthResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200/")
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping(path = "/registration")
    public ResponseEntity register(@RequestBody RegistrationRequest request) {
        try {
            AuthResponse authResponse = registrationService.register(request);
            return ResponseEntity.status(200).body(authResponse);
        }catch (IllegalStateException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/registration/confirm")
    public ResponseEntity confirm(@RequestParam("token") String token) {
        try {
            registrationService.confirmToken(token);
            return ResponseEntity.status(200).body(true);
        }catch (IllegalStateException e){
            return  ResponseEntity.status(400).body(e.getMessage());
        }
    }

}
