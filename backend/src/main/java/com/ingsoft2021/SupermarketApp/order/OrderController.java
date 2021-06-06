package com.ingsoft2021.SupermarketApp.order;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200/")
public class OrderController {
    private final OrderService orderService;

    @GetMapping(path = "user/orders")
    public ResponseEntity getOrders(@RequestParam String token){
        try{
            return ResponseEntity.status(200).body(orderService.getOrders(token));
        }catch (IllegalStateException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "user/order/add/{supermarketName}")
    public ResponseEntity order(@RequestParam String token, @PathVariable(name = "supermarketName") String supermarketName){
        try{
            orderService.order(token, supermarketName);
            return ResponseEntity.status(200).body("SUCCESS");
        }catch (IllegalStateException | NoSuchFieldException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping(path = "user/order/delete/{orderId}")
    public ResponseEntity getOrders(@RequestParam String token, @PathVariable(name = "orderId") Long orderId){
        try{
            orderService.delete(token, orderId);
            return ResponseEntity.status(200).body("SUCCESS");
        }catch (IllegalStateException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
