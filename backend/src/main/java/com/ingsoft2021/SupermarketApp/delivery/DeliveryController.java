package com.ingsoft2021.SupermarketApp.delivery;

import com.ingsoft2021.SupermarketApp.auth.login.Login;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200/")
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping(path = "user/delivery/schedule")
    public ResponseEntity scheduleADelivery(@RequestBody Delivery delivery){
        try{
            deliveryService.schedule(delivery);
            return ResponseEntity.status(200).body("SUCCESS");
        }catch (IllegalStateException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }

    }

    @GetMapping(path = "user/delivery/schedule/{orderId}/now")
    public ResponseEntity scheduleADeliveryNow(@PathVariable(name = "orderId") Long orderId){
        try{
            deliveryService.scheduleNow(orderId);
            return ResponseEntity.status(200).body("SUCCESS");
        }catch (IllegalStateException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }

    }

}
