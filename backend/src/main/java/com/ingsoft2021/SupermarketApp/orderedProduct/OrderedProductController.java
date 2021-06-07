package com.ingsoft2021.SupermarketApp.orderedProduct;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200/")
public class OrderedProductController {
    private final OrderedProductService orderedProductService;

    @GetMapping(path = "user/orders/{orderId}")
    public ResponseEntity getOrdersById(@RequestParam String token, @PathVariable(name = "orderId") Long orderId){
        try{
            return ResponseEntity.status(200).body(orderedProductService.getOrderedProducts(token, orderId));
        }catch (IllegalStateException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}

//TODO: Delivery
