package com.ingsoft2021.SupermarketApp.auth.register;


import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.auth.AuthResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200/")
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping(path = "/registration")
    public ResponseEntity register(@RequestBody AppUser request) {
        try {
            AuthResponse authResponse = registrationService.register(request);
            return ResponseEntity.status(200).body(authResponse);
        }catch (IllegalStateException | NoSuchFieldException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping(path = "/guest/registration")
    public ResponseEntity register(@RequestBody AppUser request, @RequestParam String token) {
        try {
            AuthResponse authResponse = registrationService.registerAGuest(request,token);
            return ResponseEntity.status(200).body(authResponse);
        }catch (IllegalStateException | NoSuchFieldException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "/registration/confirm")
    public ResponseEntity confirm(@RequestParam("token") String token) {
        try {
            registrationService.confirmToken(token);
            return ResponseEntity.status(200).body("TOKEN_CONFIRMED");
        }catch (IllegalStateException e){
            return  ResponseEntity.status(400).body(e.getMessage());
        }
    }

}
