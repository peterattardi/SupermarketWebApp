package com.ingsoft2021.SupermarketApp.registration;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "registration")
@AllArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public String register(@RequestBody RegistrationRequest request) {
        return registrationService.register(request);
    }

    @GetMapping(path = "confirm")
    public ResponseEntity<Boolean> confirm(@RequestParam("token") String token) {
        try {
            registrationService.confirmToken(token);
            return ResponseEntity.status(200).body(true);
        }catch (IllegalStateException e){
            System.out.println(e.getMessage());
            return  ResponseEntity.status(400).body(false);
        }
    }

}
